# kidlat benchmarks

Unbiased HTTP framework benchmarks by [kidlat](https://github.com/KidlatJS/kidlat).
Results are generated automatically every hour on a dedicated GitHub Actions runner and committed back to this repository, so the tables below always reflect the current state of every framework version pinned in `package.json`.

## Method

Each framework is started in a child process with `NODE_ENV=production` and
`logger: false` (where applicable). Requests are fired by
[autocannon](https://github.com/mcollina/autocannon) from the same machine:

| Setting | Value |
| :-- | --: |
| Connections | 100 |
| Pipelining | 10 |
| Warm-up | 5 s |
| Measured duration | 40 s |
| Rounds | 1 (median of all rounds reported) |

Three scenarios are measured for every framework:

| Scenario | Route | Purpose |
| :-- | :-- | :-- |
| **json** | `GET /` | Minimal JSON response — measures routing + serialization overhead |
| **params** | `GET /user/:id` | Dynamic route parameter extraction |
| **post** | `POST /echo` | JSON body parse → echo — measures body ingestion throughput |

Every framework must return a **byte-for-byte correct** JSON response that
passes a deep-equality check before it is admitted to the benchmark.
Frameworks that fail verification or crash are marked `failed`.

The baseline for the `vs node:http` column is the plain `node:http` module
with hand-written routing and no third-party dependencies.

## Frameworks

| Framework | Version | Notes |
| :-- | :-- | :-- |
| **kidlat** | 2.1.0 | Native C++ HTTP layer; focus of this benchmark |
| node:http | — | Node built-in baseline |
| fastify | latest | Schema-validated, plugin ecosystem |
| express | latest | |
| koa | latest | |
| hapi | latest | |
| hono | latest | Multi-runtime (Node / Deno / Bun / Workers) |
| h3 | latest | Used by Nitro / Nuxt |
| polka | latest | Minimal express-compatible |
| restify | latest | REST-specific |
| 0http | latest | |
| tinyhttp | latest | |
| hyper-express | latest | uWebSockets.js wrapper |
| uWebSockets.js | latest | Raw uWS (baseline for native tier) |

## Results

<!-- results:start -->
Run on 10/15/2026, 04:06:25 (Manila Time, UTC+8) · AMD EPYC 7763 64-Core Processor (4 threads, 16 GB) · Linux 6.17.0-1022-azure (x64) · Node v22.23.3

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | uws | 20.71.0 | 104,696 | 104,859 | 90,342 | 99,726 | 306% |
| 2 | **kidlat** | 2.2.0 | 97,491 | 99,115 | 90,800 | 95,733 | 293% |
| 3 | hyper-express | 7.0.2 | 107,768 | 102,355 | 47,634 | 80,693 | 247% |
| 4 | 0http | 5.2.0 | 44,737 | 43,671 | 20,488 | 34,208 | 105% |
| 5 | node-http | 22.23.3 | 45,026 | 44,855 | 17,206 | 32,632 | 100% |
| 6 | fastify | 5.12.7 | 44,642 | 43,550 | 17,527 | 32,420 | 99% |
| 7 | polka | 0.5.2 | 45,432 | 42,464 | 15,398 | 30,971 | 95% |
| 8 | h3 | 2.0.2 | 43,178 | 39,957 | 16,812 | 30,725 | 94% |
| 9 | hono | 4.13.13 | 42,319 | 40,732 | 16,067 | 30,255 | 93% |
| 10 | restify | 12.0.0 | 33,112 | 32,492 | 12,525 | 23,797 | 73% |
| 11 | koa | 3.2.1 | 30,041 | 29,650 | 10,936 | 21,356 | 65% |
| 12 | hapi | 21.4.10 | 31,871 | 30,928 | 9,353 | 20,969 | 64% |
| 13 | tinyhttp | 3.0.11 | 23,345 | 22,884 | 11,935 | 18,543 | 57% |
| 14 | express | 5.3.0 | 11,219 | 11,075 | 6,079 | 9,107 | 28% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 107,768 | 8.75 | 16.00 | 14.39 | 9.4 | 71 | 0 | 239% |
| 2 | uws | 104,696 | 9.10 | 15.00 | 15.68 | 8.5 | 58 | 0 | 233% |
| 3 | **kidlat** | 97,491 | 9.79 | 16.00 | 18.32 | 9.3 | 60 | 0 | 217% |
| 4 | polka | 45,432 | 21.51 | 35.00 | 8.10 | 22.1 | 98 | 0 | 101% |
| 5 | node-http | 45,026 | 21.71 | 35.00 | 8.85 | 22.3 | 104 | 0 | 100% |
| 6 | 0http | 44,737 | 21.86 | 47.00 | 7.98 | 28.5 | 145 | 0 | 99% |
| 7 | fastify | 44,642 | 21.91 | 36.00 | 8.00 | 22.5 | 106 | 0 | 99% |
| 8 | h3 | 43,178 | 22.66 | 36.00 | 7.58 | 23.3 | 104 | 0 | 96% |
| 9 | hono | 42,319 | 23.13 | 38.00 | 6.94 | 23.8 | 104 | 0 | 94% |
| 10 | restify | 33,112 | 29.69 | 51.00 | 5.97 | 30.4 | 116 | 0 | 74% |
| 11 | hapi | 31,871 | 30.87 | 55.00 | 7.11 | 31.8 | 119 | 0 | 71% |
| 12 | koa | 30,041 | 32.78 | 55.00 | 5.36 | 33.5 | 118 | 0 | 67% |
| 13 | tinyhttp | 23,345 | 42.34 | 87.00 | 3.94 | 59.7 | 174 | 0 | 52% |
| 14 | express | 11,219 | 88.56 | 119.00 | 2.00 | 101.0 | 162 | 0 | 25% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 104,859 | 9.09 | 15.00 | 15.10 | 8.5 | 58 | 0 | 234% |
| 2 | hyper-express | 102,355 | 9.31 | 17.00 | 13.08 | 9.9 | 78 | 0 | 228% |
| 3 | **kidlat** | 99,115 | 9.55 | 16.00 | 18.05 | 9.3 | 61 | 0 | 221% |
| 4 | node-http | 44,855 | 21.80 | 36.00 | 8.51 | 22.4 | 109 | 0 | 100% |
| 5 | 0http | 43,671 | 22.40 | 48.00 | 7.54 | 29.1 | 145 | 0 | 97% |
| 6 | fastify | 43,550 | 22.45 | 37.00 | 7.56 | 23.1 | 112 | 0 | 97% |
| 7 | polka | 42,464 | 23.04 | 38.00 | 7.33 | 23.6 | 103 | 0 | 95% |
| 8 | hono | 40,732 | 24.04 | 40.00 | 6.45 | 24.7 | 109 | 0 | 91% |
| 9 | h3 | 39,957 | 24.52 | 39.00 | 6.78 | 25.1 | 109 | 0 | 89% |
| 10 | restify | 32,492 | 30.27 | 51.00 | 5.67 | 30.9 | 127 | 0 | 72% |
| 11 | hapi | 30,928 | 31.83 | 57.00 | 6.72 | 32.9 | 152 | 0 | 69% |
| 12 | koa | 29,650 | 33.21 | 56.00 | 5.12 | 33.9 | 128 | 0 | 66% |
| 13 | tinyhttp | 22,884 | 43.18 | 83.00 | 3.73 | 60.6 | 175 | 0 | 51% |
| 14 | express | 11,075 | 89.69 | 118.00 | 1.91 | 102.3 | 162 | 0 | 25% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 90,800 | 10.57 | 19.00 | 45.20 | 11.5 | 114 | 0 | 528% |
| 2 | uws | 90,342 | 10.52 | 19.00 | 41.52 | 11.3 | 67 | 0 | 525% |
| 3 | hyper-express | 47,634 | 20.47 | 30.00 | 21.12 | 21.6 | 99 | 0 | 277% |
| 4 | 0http | 20,488 | 48.29 | 102.00 | 10.00 | 60.1 | 166 | 0 | 119% |
| 5 | fastify | 17,527 | 56.53 | 79.00 | 8.58 | 57.8 | 110 | 0 | 102% |
| 6 | node-http | 17,206 | 57.57 | 96.00 | 8.71 | 58.8 | 106 | 0 | 100% |
| 7 | h3 | 16,812 | 58.94 | 84.00 | 8.16 | 60.3 | 104 | 0 | 98% |
| 8 | hono | 16,067 | 61.70 | 92.00 | 7.62 | 63.2 | 110 | 0 | 93% |
| 9 | polka | 15,398 | 64.40 | 94.00 | 7.52 | 65.6 | 110 | 0 | 89% |
| 10 | restify | 12,525 | 79.28 | 112.00 | 6.14 | 81.0 | 115 | 0 | 73% |
| 11 | tinyhttp | 11,935 | 83.22 | 115.00 | 6.66 | 104.1 | 178 | 0 | 69% |
| 12 | koa | 10,936 | 90.86 | 123.00 | 5.34 | 93.0 | 117 | 0 | 64% |
| 13 | hapi | 9,353 | 106.31 | 136.00 | 4.79 | 107.8 | 153 | 0 | 54% |
| 14 | express | 6,079 | 163.72 | 195.00 | 2.97 | 181.7 | 163 | 0 | 35% |

<!-- results:end -->

## Running locally

```sh
# full run (~20 min)
npm run bench

# quick smoke test (10 s per framework, 3 rounds)
node benchmarks.js -d 10 -r 3

# single framework or scenario
node benchmarks.js --only kidlat,fastify
node benchmarks.js --scenarios json,post

# re-render tables from the last saved result without re-running
npm run compare
```

Results are written to `results/<timestamp>.json`, `results/latest.json`, and
`RESULTS.md`. The README tables above are also updated in place between the
`<!-- results:start -->` and `<!-- results:end -->` markers.

## Reproducing on your hardware

Clone the repo, install dependencies, and run:

```sh
git clone https://github.com/KidlatJS/benchmarks
cd benchmarks
npm install
npm run bench
```

Numbers will differ by machine. The GitHub Actions runner used for the
automated results is documented in the workflow file at
`.github/workflows/benchmark.yml`.

## License

MIT
