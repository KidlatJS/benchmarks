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
| **kidlat** | latest | Native C++ HTTP layer; focus of this benchmark |
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
Run on 11/10/2026, 16:11:19 (Manila Time, UTC+8) · AMD EPYC 7763 64-Core Processor (4 threads, 16 GB) · Linux 7.0.0-1019-azure (x64) · Node v22.23.4

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 2.6.0 | 104,066 | 105,402 | 109,466 | 106,286 | 319% |
| 2 | uws | 20.71.0 | 102,395 | 109,394 | 90,853 | 100,586 | 302% |
| 3 | hyper-express | 7.0.2 | 107,515 | 101,708 | 45,014 | 78,957 | 237% |
| 4 | 0http | 5.2.0 | 44,047 | 43,709 | 19,248 | 33,339 | 100% |
| 5 | node-http | 22.23.4 | 44,217 | 45,368 | 18,421 | 33,308 | 100% |
| 6 | fastify | 5.12.7 | 44,126 | 43,398 | 17,359 | 32,153 | 97% |
| 7 | polka | 0.5.2 | 45,640 | 43,594 | 15,319 | 31,237 | 94% |
| 8 | h3 | 2.0.2 | 42,726 | 40,342 | 16,918 | 30,780 | 92% |
| 9 | hono | 4.13.13 | 42,267 | 41,229 | 16,676 | 30,744 | 92% |
| 10 | restify | 12.0.0 | 31,609 | 30,496 | 11,933 | 22,574 | 68% |
| 11 | koa | 3.2.1 | 30,934 | 29,780 | 10,477 | 21,291 | 64% |
| 12 | hapi | 21.4.10 | 30,066 | 29,241 | 9,141 | 20,030 | 60% |
| 13 | tinyhttp | 3.0.11 | 23,850 | 23,168 | 12,083 | 18,830 | 57% |
| 14 | express | 5.3.0 | 11,687 | 11,376 | 6,108 | 9,330 | 28% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 107,515 | 8.77 | 17.00 | 14.35 | 9.5 | 70 | 0 | 243% |
| 2 | **kidlat** | 104,066 | 9.29 | 17.00 | 19.55 | 9.3 | 64 | 0 | 235% |
| 3 | uws | 102,395 | 9.28 | 14.00 | 15.33 | 8.8 | 58 | 0 | 232% |
| 4 | polka | 45,640 | 21.39 | 45.00 | 8.14 | 22.0 | 99 | 0 | 103% |
| 5 | node-http | 44,217 | 22.13 | 46.00 | 8.69 | 22.7 | 106 | 0 | 100% |
| 6 | fastify | 44,126 | 22.17 | 40.00 | 7.91 | 22.8 | 104 | 0 | 100% |
| 7 | 0http | 44,047 | 22.20 | 51.00 | 7.86 | 28.7 | 147 | 0 | 100% |
| 8 | h3 | 42,726 | 22.89 | 42.00 | 7.50 | 23.5 | 104 | 0 | 97% |
| 9 | hono | 42,267 | 23.15 | 49.00 | 6.93 | 23.8 | 104 | 0 | 96% |
| 10 | restify | 31,609 | 31.13 | 59.00 | 5.70 | 31.9 | 113 | 0 | 71% |
| 11 | koa | 30,934 | 31.82 | 61.00 | 5.52 | 32.5 | 117 | 0 | 70% |
| 12 | hapi | 30,066 | 32.75 | 63.00 | 6.71 | 33.7 | 124 | 0 | 68% |
| 13 | tinyhttp | 23,850 | 41.43 | 84.00 | 4.03 | 56.4 | 181 | 0 | 54% |
| 14 | express | 11,687 | 84.95 | 121.00 | 2.08 | 96.3 | 161 | 0 | 26% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 109,394 | 8.63 | 15.00 | 15.76 | 8.6 | 58 | 0 | 241% |
| 2 | **kidlat** | 105,402 | 9.11 | 12.00 | 19.20 | 9.3 | 64 | 0 | 232% |
| 3 | hyper-express | 101,708 | 9.37 | 20.00 | 13.00 | 10.0 | 79 | 0 | 224% |
| 4 | node-http | 45,368 | 21.56 | 34.00 | 8.61 | 22.1 | 110 | 0 | 100% |
| 5 | 0http | 43,709 | 22.38 | 55.00 | 7.54 | 28.8 | 146 | 0 | 96% |
| 6 | polka | 43,594 | 22.44 | 38.00 | 7.53 | 23.0 | 104 | 0 | 96% |
| 7 | fastify | 43,398 | 22.53 | 48.00 | 7.53 | 23.1 | 109 | 0 | 96% |
| 8 | hono | 41,229 | 23.77 | 47.00 | 6.53 | 24.4 | 109 | 0 | 91% |
| 9 | h3 | 40,342 | 24.28 | 44.00 | 6.85 | 24.9 | 109 | 0 | 89% |
| 10 | restify | 30,496 | 32.28 | 64.00 | 5.32 | 33.0 | 124 | 0 | 67% |
| 11 | koa | 29,780 | 33.07 | 67.00 | 5.14 | 33.7 | 126 | 0 | 66% |
| 12 | hapi | 29,241 | 33.69 | 68.00 | 6.36 | 34.5 | 134 | 0 | 64% |
| 13 | tinyhttp | 23,168 | 42.65 | 83.00 | 3.78 | 58.0 | 181 | 0 | 51% |
| 14 | express | 11,376 | 87.32 | 121.00 | 1.96 | 98.8 | 161 | 0 | 25% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 109,466 | 8.57 | 14.00 | 54.49 | 9.0 | 68 | 0 | 594% |
| 2 | uws | 90,853 | 10.41 | 19.00 | 41.76 | 11.3 | 68 | 0 | 493% |
| 3 | hyper-express | 45,014 | 21.69 | 35.00 | 19.96 | 22.7 | 99 | 0 | 244% |
| 4 | 0http | 19,248 | 51.43 | 106.00 | 9.40 | 63.1 | 163 | 0 | 104% |
| 5 | node-http | 18,421 | 53.76 | 77.00 | 9.33 | 54.8 | 108 | 0 | 100% |
| 6 | fastify | 17,359 | 57.06 | 79.00 | 8.49 | 58.2 | 116 | 0 | 94% |
| 7 | h3 | 16,918 | 58.58 | 90.00 | 8.21 | 59.8 | 108 | 0 | 92% |
| 8 | hono | 16,676 | 59.44 | 90.00 | 7.90 | 60.8 | 109 | 0 | 91% |
| 9 | polka | 15,319 | 64.74 | 96.00 | 7.48 | 66.5 | 103 | 0 | 83% |
| 10 | tinyhttp | 12,083 | 82.21 | 116.00 | 6.74 | 101.3 | 184 | 0 | 66% |
| 11 | restify | 11,933 | 83.24 | 117.00 | 5.85 | 85.1 | 112 | 0 | 65% |
| 12 | koa | 10,477 | 94.86 | 129.00 | 5.12 | 97.0 | 115 | 0 | 57% |
| 13 | hapi | 9,141 | 108.78 | 140.00 | 4.68 | 110.7 | 153 | 0 | 50% |
| 14 | express | 6,108 | 162.91 | 203.00 | 2.98 | 180.5 | 162 | 0 | 33% |

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
