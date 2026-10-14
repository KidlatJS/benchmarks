#!/usr/bin/env node
/**
* Runs every server in frameworks/ through the same load test and renders the
* results as Markdown tables.
*
*   node benchmarks.js                      full run (40 s per test, like fastify/benchmarks)
*   node benchmarks.js -d 10 -r 3           10 s per test, 3 rounds, median reported
*   node benchmarks.js --only kidlat,fastify
*   node benchmarks.js --scenarios json
*   node benchmarks.js --compare            re-render tables from results/latest.json
*/

import { spawn } from 'node:child_process';
import { once } from 'node:events';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { isDeepStrictEqual, parseArgs } from 'node:util';
import { fileURLToPath } from 'node:url';
import autocannon from 'autocannon';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const FRAMEWORKS_DIR = path.join(ROOT, 'frameworks');
const RESULTS_DIR = path.join(ROOT, 'results');
const README = path.join(ROOT, 'README.md');
const FRAMEWORKS = {
    'node-http': null,
    kidlat: 'kidlat',
    fastify: 'fastify',
    express: 'express',
    koa: 'koa',
    hapi: '@hapi/hapi',
    hono: 'hono',
    h3: 'h3',
    polka: 'polka',
    restify: 'restify',
    '0http': '0http',
    tinyhttp: '@tinyhttp/app',
    'hyper-express': 'hyper-express',
    uws: 'uWebSockets.js',
};

const ECHO_BODY = {
    id: 12345,
    name: 'benchmark',
    active: true,
    tags: ['http', 'json', 'node', 'framework'],
    owner: { login: 'bench', score: 98.6, roles: ['read', 'write'] },
    text: 'The quick brown fox jumps over the lazy dog. '.repeat(4),
};

const SCENARIOS = {
    json: {
        title: 'GET / → JSON',
        method: 'GET',
        path: '/',
        expect: { hello: 'world' },
    },
    params: {
        title: 'GET /user/:id → route parameter',
        method: 'GET',
        path: '/user/42',
        expect: { id: '42' },
    },
    post: {
        title: 'POST /echo → parse and echo JSON body',
        method: 'POST',
        path: '/echo',
        body: JSON.stringify(ECHO_BODY),
        headers: { 'content-type': 'application/json' },
        expect: ECHO_BODY,
    },
};

const { values: opts } = parseArgs({
    options: {
        duration: { type: 'string', short: 'd', default: '40' },
        connections: { type: 'string', short: 'c', default: '100' },
        pipelining: { type: 'string', short: 'p', default: '10' },
        warmup: { type: 'string', short: 'w', default: '5' },
        rounds: { type: 'string', short: 'r', default: '1' },
        port: { type: 'string', default: '3000' },
        only: { type: 'string' },
        scenarios: { type: 'string' },
        compare: { type: 'boolean', default: false },
        help: { type: 'boolean', short: 'h', default: false },
    },
});

if (opts.help) {
    console.log(fs.readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').slice(1, 10).join('\n'));
    process.exit(0);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const median = (xs) => {
    const s = [...xs].sort((a, b) => a - b);
    const m = s.length >> 1;
    return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

function shuffle(xs) {
    const a = [...xs];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function versionOf(pkg) {
    if (!pkg) return process.versions.node;
    try {
        return JSON.parse(fs.readFileSync(path.join(ROOT, 'node_modules', pkg, 'package.json'), 'utf8')).version;
    } catch {
        return '?';
    }
}

function environment() {
    const cpus = os.cpus();
    return {
        date: new Date().toISOString(),
        node: process.version,
        os: `${os.type()} ${os.release()} (${os.arch()})`,
        cpu: cpus[0]?.model.trim() ?? 'unknown',
        threads: cpus.length,
        memoryGB: Math.round(os.totalmem() / 1024 ** 3),
    };
}

// Server lifecycle
function startServer(name, port) {
    const child = spawn(process.execPath, [path.join(FRAMEWORKS_DIR, `${name}.js`)], {
        cwd: ROOT,
        env: { ...process.env, PORT: String(port), NODE_ENV: 'production' },
        stdio: ['ignore', 'ignore', 'pipe', 'ipc'],
    });
    child.stderrText = '';
    child.stderr.on('data', (d) => { child.stderrText += d; });
    return child;
}

async function waitForServer(child, base, timeoutMs = 15000) {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
        if (child.exitCode !== null) throw new Error(`exited with code ${child.exitCode}\n${child.stderrText}`);
        try {
            await fetch(base + '/');
            return;
        } catch {
            await sleep(100);
        }
    }
    throw new Error('did not start listening within 15 s');
}

async function stopServer(child) {
    if (child.exitCode !== null || child.signalCode !== null) return;
    const exited = once(child, 'exit');
    child.kill('SIGKILL');
    await exited;
}

async function usage(child) {
    const reply = once(child, 'message');
    child.send('usage');
    const [msg] = await reply;
    return msg;
}

// Every framework must return the same, correct response before it is measured.
async function verify(base, scenario) {
    const res = await fetch(base + scenario.path, {
        method: scenario.method,
        body: scenario.body,
        headers: scenario.headers,
    });
    const type = res.headers.get('content-type') || '';
    const text = await res.text();
    if (res.status !== 200) throw new Error(`status ${res.status}`);
    if (!type.includes('application/json')) throw new Error(`content-type "${type}"`);
    if (!isDeepStrictEqual(JSON.parse(text), scenario.expect)) throw new Error(`unexpected body ${text.slice(0, 200)}`);
}

function load(base, scenario, duration) {
    return autocannon({
        url: base + scenario.path,
        method: scenario.method,
        body: scenario.body,
        headers: scenario.headers,
        connections: Number(opts.connections),
        pipelining: Number(opts.pipelining),
        duration,
    });
}

async function benchFramework(name, scenarioKeys, port) {
    const base = `http://127.0.0.1:${port}`;
    const child = startServer(name, port);
    const out = {};
    try {
        await waitForServer(child, base);
        for (const key of scenarioKeys) {
            try {
                await verify(base, SCENARIOS[key]);
            } catch (err) {
                out[key] = { error: `failed verification: ${err.message}` };
            }
        }
        for (const key of scenarioKeys) {
            if (out[key]) continue;
            const scenario = SCENARIOS[key];
            if (Number(opts.warmup) > 0) await load(base, scenario, Number(opts.warmup));
            const before = await usage(child);
            const r = await load(base, scenario, Number(opts.duration));
            const after = await usage(child);
            const cpuMicros = after.cpu.user - before.cpu.user + after.cpu.system - before.cpu.system;
            out[key] = {
                reqPerSec: r.requests.average,
                latencyAvg: r.latency.average,
                latencyP99: r.latency.p99,
                throughputMBs: r.throughput.average / 1024 / 1024,
                totalRequests: r.requests.total,
                cpuPerReqMicros: r.requests.total ? cpuMicros / r.requests.total : null,
                rssMB: after.rss / 1024 / 1024,
                errors: r.errors + r.timeouts + r.non2xx,
            };
            const o = out[key];
            console.log(`    ${key.padEnd(7)} ${Math.round(o.reqPerSec).toLocaleString('en-US').padStart(9)} req/s  ` +
                `${o.latencyAvg.toFixed(2)} ms avg  ${o.errors} errors`);
        }
    } catch (err) {
        for (const key of scenarioKeys) out[key] ??= { error: err.message.split('\n')[0] };
    } finally {
        await stopServer(child);
    }
    for (const [key, o] of Object.entries(out)) if (o.error) console.log(`    ${key.padEnd(7)} ✗ ${o.error}`);
    return out;
}

// Reporting
const fmtInt = (n) => Math.round(n).toLocaleString('en-US');
const fmt = (n, d = 2) => (n == null ? '–' : n.toFixed(d));

function table(headers, rows, align) {
    const lines = [
        `| ${headers.join(' | ')} |`,
        `| ${align.map((a) => (a === 'r' ? '--:' : ':--')).join(' | ')} |`,
        ...rows.map((r) => `| ${r.join(' | ')} |`),
    ];
    return lines.join('\n');
}

function render(data) {
    const { env, settings, versions, results } = data;
    const scenarioKeys = settings.scenarios;
    const names = Object.keys(results);
    const out = [];

    const manilaDate = new Date(env.date).toLocaleString('en-PH', {
        timeZone: 'Asia/Manila',
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false,
    });
    out.push(`Run on ${manilaDate} (Manila Time, UTC+8) · ${env.cpu} (${env.threads} threads, ${env.memoryGB} GB) · ${env.os} · Node ${env.node}`);
    out.push('');
    out.push(`autocannon: ${settings.connections} connections, pipelining ${settings.pipelining}, ` +
        `${settings.duration} s per test after a ${settings.warmup} s warm-up, ` +
        `${settings.rounds} round(s) in random order (median reported).`);
    out.push('');

    const baseline = results['node-http'];
    const rel = (name, key) => {
        const b = baseline?.[key]?.reqPerSec;
        const v = results[name][key]?.reqPerSec;
        return b && v ? v / b : null;
    };
    const score = (name) => {
        const xs = scenarioKeys.map((k) => results[name][k]?.reqPerSec ?? 0);
        return xs.some((x) => x === 0) ? 0 : Math.exp(xs.reduce((s, x) => s + Math.log(x), 0) / xs.length);
    };
    const ranked = [...names].sort((a, b) => score(b) - score(a));

    out.push('### Summary (requests/second, higher is better)');
    out.push('');
    out.push(table(
        ['#', 'Framework', 'Version', ...scenarioKeys.map((k) => SCENARIOS[k].title), 'Geo. mean', 'vs node:http'],
        ranked.map((name, i) => {
            const g = score(name);
            const b = baseline ? score('node-http') : 0;
            return [
                i + 1,
                name === 'kidlat' ? '**kidlat**' : name,
                versions[name],
                ...scenarioKeys.map((k) => (results[name][k]?.reqPerSec ? fmtInt(results[name][k].reqPerSec) : 'failed')),
                g ? fmtInt(g) : '–',
                g && b ? `${((g / b) * 100).toFixed(0)}%` : '–',
            ];
        }),
        ['r', 'l', 'l', ...scenarioKeys.map(() => 'r'), 'r', 'r'],
    ));
    out.push('');

    for (const key of scenarioKeys) {
        const rows = names
            .filter((n) => results[n][key])
            .sort((a, b) => (results[b][key].reqPerSec ?? -1) - (results[a][key].reqPerSec ?? -1));
        out.push(`### ${SCENARIOS[key].title}`);
        out.push('');
        out.push(table(
            ['#', 'Framework', 'Req/s', 'Latency avg (ms)', 'Latency p99 (ms)', 'Throughput (MB/s)', 'CPU / req (µs)', 'RSS (MB)', 'Errors', 'vs node:http'],
            rows.map((name, i) => {
                const r = results[name][key];
                if (r.error) return [i + 1, name, 'failed', '–', '–', '–', '–', '–', r.error, '–'];
                const x = rel(name, key);
                return [
                    i + 1,
                    name === 'kidlat' ? '**kidlat**' : name,
                    fmtInt(r.reqPerSec),
                    fmt(r.latencyAvg),
                    fmt(r.latencyP99),
                    fmt(r.throughputMBs),
                    fmt(r.cpuPerReqMicros, 1),
                    fmt(r.rssMB, 0),
                    r.errors,
                    x ? `${(x * 100).toFixed(0)}%` : '–',
                ];
            }),
            ['r', 'l', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r'],
        ));
        out.push('');
    }
    return out.join('\n');
}

function writeReports(data) {
    const md = render(data);
    fs.writeFileSync(path.join(ROOT, 'RESULTS.md'), `# Results\n\n${md}`);
    if (fs.existsSync(README)) {
        const readme = fs.readFileSync(README, 'utf8');
        const start = '<!-- results:start -->';
        const end = '<!-- results:end -->';
        const i = readme.indexOf(start);
        const j = readme.indexOf(end);
        if (i !== -1 && j > i) {
            fs.writeFileSync(README, `${readme.slice(0, i + start.length)}\n${md}\n${readme.slice(j)}`);
        }
    }
    console.log('\n' + md);
}

//Main
async function main() {
    if (opts.compare) {
        writeReports(JSON.parse(fs.readFileSync(path.join(RESULTS_DIR, 'latest.json'), 'utf8')));
        return;
    }

    const names = opts.only ? opts.only.split(',').map((s) => s.trim()) : Object.keys(FRAMEWORKS);
    for (const n of names) if (!(n in FRAMEWORKS)) throw new Error(`unknown framework "${n}"`);
    const scenarioKeys = opts.scenarios ? opts.scenarios.split(',').map((s) => s.trim()) : Object.keys(SCENARIOS);
    for (const k of scenarioKeys) if (!(k in SCENARIOS)) throw new Error(`unknown scenario "${k}"`);

    const settings = {
        connections: Number(opts.connections),
        pipelining: Number(opts.pipelining),
        duration: Number(opts.duration),
        warmup: Number(opts.warmup),
        rounds: Number(opts.rounds),
        scenarios: scenarioKeys,
    };
    const env = environment();
    const versions = Object.fromEntries(names.map((n) => [n, versionOf(FRAMEWORKS[n])]));
    const runs = Object.fromEntries(names.map((n) => [n, Object.fromEntries(scenarioKeys.map((k) => [k, []]))]));

    console.log(`${env.cpu} · ${env.threads} threads · Node ${env.node}`);
    for (let round = 1; round <= settings.rounds; round++) {
        const order = shuffle(names);
        console.log(`\nRound ${round}/${settings.rounds}: ${order.join(', ')}`);
        for (const name of order) {
            console.log(`  ${name}@${versions[name]}`);
            const res = await benchFramework(name, scenarioKeys, Number(opts.port));
            for (const k of scenarioKeys) runs[name][k].push(res[k]);
            await sleep(1000); // let sockets in TIME_WAIT settle between servers
        }
    }

    const results = {};
    for (const name of names) {
        results[name] = {};
        for (const k of scenarioKeys) {
            const ok = runs[name][k].filter((r) => !r.error);
            if (ok.length === 0) {
                results[name][k] = runs[name][k][0];
                continue;
            }
            const m = median(ok.map((r) => r.reqPerSec));
            results[name][k] = ok.reduce((best, r) =>
                Math.abs(r.reqPerSec - m) < Math.abs(best.reqPerSec - m) ? r : best);
            results[name][k].reqPerSec = m;
        }
    }

    const data = { env, settings, versions, results, runs };
    fs.mkdirSync(RESULTS_DIR, { recursive: true });
    const file = path.join(RESULTS_DIR, `${env.date.replace(/[:.]/g, '-')}.json`);
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
    fs.writeFileSync(path.join(RESULTS_DIR, 'latest.json'), JSON.stringify(data, null, 2));
    writeReports(data);
    console.log(`\nSaved ${path.relative(ROOT, file)}, RESULTS.md`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
