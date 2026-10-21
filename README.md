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
Run on 10/22/2026, 04:00:45 (Manila Time, UTC+8) · AMD EPYC 9V45 96-Core Processor (4 threads, 16 GB) · Linux 7.0.0-1017-azure (x64) · Node v22.23.3

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | uws | 20.71.0 | 215,725 | 210,688 | 177,664 | 200,623 | 289% |
| 2 | **kidlat** | 2.4.0 | 162,419 | 158,490 | 173,005 | 164,525 | 237% |
| 3 | hyper-express | 7.0.2 | 177,770 | 171,984 | 92,693 | 141,513 | 204% |
| 4 | node-http | 22.23.3 | 81,640 | 80,838 | 50,513 | 69,338 | 100% |
| 5 | hono | 4.13.13 | 85,158 | 82,251 | 46,704 | 68,903 | 99% |
| 6 | fastify | 5.12.7 | 83,194 | 72,470 | 50,901 | 67,452 | 97% |
| 7 | h3 | 2.0.2 | 77,171 | 74,966 | 46,698 | 64,646 | 93% |
| 8 | polka | 0.5.2 | 79,490 | 76,277 | 43,698 | 64,228 | 93% |
| 9 | restify | 12.0.0 | 70,691 | 69,203 | 37,950 | 57,047 | 82% |
| 10 | 0http | 5.2.0 | 59,286 | 69,462 | 43,368 | 56,315 | 81% |
| 11 | koa | 3.2.1 | 65,464 | 64,394 | 35,687 | 53,185 | 77% |
| 12 | hapi | 21.4.10 | 63,184 | 62,010 | 31,439 | 49,756 | 72% |
| 13 | tinyhttp | 3.0.11 | 49,247 | 48,598 | 32,352 | 42,622 | 61% |
| 14 | express | 5.3.0 | 20,712 | 20,852 | 15,036 | 18,657 | 27% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 215,725 | 4.10 | 6.00 | 32.30 | 4.5 | 58 | 0 | 264% |
| 2 | hyper-express | 177,770 | 5.13 | 8.00 | 23.74 | 5.8 | 70 | 0 | 218% |
| 3 | **kidlat** | 162,419 | 5.69 | 8.00 | 30.51 | 5.6 | 61 | 0 | 199% |
| 4 | hono | 85,158 | 11.25 | 23.00 | 13.97 | 11.8 | 107 | 0 | 104% |
| 5 | fastify | 83,194 | 11.53 | 22.00 | 14.92 | 12.1 | 108 | 0 | 102% |
| 6 | node-http | 81,640 | 11.75 | 22.00 | 16.04 | 12.3 | 101 | 0 | 100% |
| 7 | polka | 79,490 | 12.07 | 24.00 | 14.18 | 12.7 | 96 | 0 | 97% |
| 8 | h3 | 77,171 | 12.48 | 25.00 | 13.54 | 13.0 | 108 | 0 | 95% |
| 9 | restify | 70,691 | 13.64 | 27.00 | 12.74 | 14.2 | 116 | 0 | 87% |
| 10 | koa | 65,464 | 14.78 | 30.00 | 11.67 | 15.4 | 118 | 0 | 80% |
| 11 | hapi | 63,184 | 15.34 | 31.00 | 14.10 | 16.1 | 137 | 0 | 77% |
| 12 | 0http | 59,286 | 16.37 | 34.00 | 10.57 | 22.7 | 150 | 0 | 73% |
| 13 | tinyhttp | 49,247 | 19.81 | 41.00 | 8.31 | 31.5 | 189 | 0 | 60% |
| 14 | express | 20,712 | 47.77 | 77.00 | 3.69 | 57.9 | 183 | 0 | 25% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 210,688 | 4.15 | 6.00 | 30.34 | 4.6 | 60 | 0 | 261% |
| 2 | hyper-express | 171,984 | 5.27 | 8.00 | 21.98 | 6.0 | 78 | 0 | 213% |
| 3 | **kidlat** | 158,490 | 5.89 | 8.00 | 28.87 | 5.8 | 62 | 0 | 196% |
| 4 | hono | 82,251 | 11.64 | 24.00 | 13.02 | 12.2 | 112 | 0 | 102% |
| 5 | node-http | 80,838 | 11.87 | 23.00 | 15.34 | 12.4 | 105 | 0 | 100% |
| 6 | polka | 76,277 | 12.63 | 26.00 | 13.17 | 13.2 | 102 | 0 | 94% |
| 7 | h3 | 74,966 | 12.84 | 26.00 | 12.73 | 13.4 | 112 | 0 | 93% |
| 8 | fastify | 72,470 | 13.30 | 25.00 | 12.58 | 13.9 | 113 | 0 | 90% |
| 9 | 0http | 69,462 | 13.90 | 31.00 | 11.99 | 18.7 | 156 | 0 | 86% |
| 10 | restify | 69,203 | 13.93 | 28.00 | 12.08 | 14.5 | 127 | 0 | 86% |
| 11 | koa | 64,394 | 15.03 | 30.00 | 11.12 | 15.7 | 126 | 0 | 80% |
| 12 | hapi | 62,010 | 15.64 | 31.00 | 13.48 | 16.4 | 140 | 0 | 77% |
| 13 | tinyhttp | 48,598 | 20.09 | 42.00 | 7.93 | 32.1 | 189 | 0 | 60% |
| 14 | express | 20,852 | 47.44 | 80.00 | 3.60 | 57.4 | 185 | 0 | 26% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 177,664 | 5.14 | 8.00 | 81.66 | 5.7 | 67 | 0 | 352% |
| 2 | **kidlat** | 173,005 | 5.25 | 8.00 | 86.13 | 5.6 | 62 | 0 | 342% |
| 3 | hyper-express | 92,693 | 10.29 | 14.00 | 41.11 | 11.6 | 100 | 0 | 184% |
| 4 | fastify | 50,901 | 19.14 | 46.00 | 24.90 | 20.1 | 113 | 0 | 101% |
| 5 | node-http | 50,513 | 19.30 | 42.00 | 25.58 | 20.2 | 112 | 0 | 100% |
| 6 | hono | 46,704 | 20.90 | 49.00 | 22.14 | 21.7 | 117 | 0 | 92% |
| 7 | h3 | 46,698 | 20.92 | 47.00 | 22.67 | 21.8 | 116 | 0 | 92% |
| 8 | polka | 43,698 | 22.38 | 50.00 | 21.34 | 23.6 | 111 | 0 | 87% |
| 9 | 0http | 43,368 | 22.57 | 49.00 | 21.18 | 31.0 | 175 | 0 | 86% |
| 10 | restify | 37,950 | 25.85 | 60.00 | 18.60 | 26.7 | 123 | 0 | 75% |
| 11 | koa | 35,687 | 27.52 | 61.00 | 17.43 | 28.7 | 118 | 0 | 71% |
| 12 | tinyhttp | 32,352 | 30.40 | 65.00 | 18.05 | 45.3 | 194 | 0 | 64% |
| 13 | hapi | 31,439 | 31.30 | 66.00 | 16.10 | 32.3 | 141 | 0 | 62% |
| 14 | express | 15,036 | 65.97 | 94.00 | 7.34 | 79.7 | 187 | 0 | 30% |

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
