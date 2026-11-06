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
Run on 11/07/2026, 06:56:47 (Manila Time, UTC+8) · AMD EPYC 7763 64-Core Processor (4 threads, 16 GB) · Linux 7.0.0-1019-azure (x64) · Node v22.23.4

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 2.6.0 | 98,163 | 98,184 | 108,526 | 101,510 | 315% |
| 2 | uws | 20.71.0 | 103,613 | 109,026 | 86,075 | 99,069 | 307% |
| 3 | hyper-express | 7.0.2 | 103,259 | 95,941 | 43,214 | 75,368 | 234% |
| 4 | 0http | 5.2.0 | 43,393 | 42,296 | 19,393 | 32,894 | 102% |
| 5 | node-http | 22.23.4 | 42,957 | 43,628 | 17,878 | 32,238 | 100% |
| 6 | fastify | 5.12.7 | 44,081 | 42,994 | 16,629 | 31,587 | 98% |
| 7 | polka | 0.5.2 | 44,903 | 43,035 | 15,294 | 30,918 | 96% |
| 8 | hono | 4.13.13 | 41,302 | 40,433 | 16,063 | 29,935 | 93% |
| 9 | h3 | 2.0.2 | 41,608 | 39,047 | 16,387 | 29,860 | 93% |
| 10 | restify | 12.0.0 | 32,128 | 31,211 | 12,209 | 23,047 | 71% |
| 11 | koa | 3.2.1 | 30,345 | 29,804 | 10,489 | 21,169 | 66% |
| 12 | hapi | 21.4.10 | 29,944 | 28,410 | 8,946 | 19,670 | 61% |
| 13 | tinyhttp | 3.0.11 | 23,200 | 23,126 | 11,731 | 18,463 | 57% |
| 14 | express | 5.3.0 | 11,402 | 11,142 | 5,905 | 9,086 | 28% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 103,613 | 9.22 | 15.00 | 15.51 | 8.7 | 58 | 0 | 241% |
| 2 | hyper-express | 103,259 | 9.26 | 16.00 | 13.79 | 9.9 | 71 | 0 | 240% |
| 3 | **kidlat** | 98,163 | 9.71 | 16.00 | 18.45 | 9.7 | 63 | 0 | 229% |
| 4 | polka | 44,903 | 21.78 | 40.00 | 8.01 | 22.4 | 97 | 0 | 105% |
| 5 | fastify | 44,081 | 22.19 | 41.00 | 7.90 | 22.8 | 107 | 0 | 103% |
| 6 | 0http | 43,393 | 22.54 | 52.00 | 7.74 | 29.4 | 145 | 0 | 101% |
| 7 | node-http | 42,957 | 22.77 | 39.00 | 8.44 | 23.4 | 106 | 0 | 100% |
| 8 | h3 | 41,608 | 23.54 | 43.00 | 7.30 | 24.2 | 107 | 0 | 97% |
| 9 | hono | 41,302 | 23.72 | 45.00 | 6.77 | 24.4 | 103 | 0 | 96% |
| 10 | restify | 32,128 | 30.62 | 61.00 | 5.79 | 31.4 | 113 | 0 | 75% |
| 11 | koa | 30,345 | 32.45 | 65.00 | 5.41 | 33.2 | 118 | 0 | 71% |
| 12 | hapi | 29,944 | 32.89 | 61.00 | 6.68 | 33.9 | 120 | 0 | 70% |
| 13 | tinyhttp | 23,200 | 42.60 | 84.00 | 3.92 | 58.5 | 173 | 0 | 54% |
| 14 | express | 11,402 | 87.14 | 121.00 | 2.03 | 100.3 | 160 | 0 | 27% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 109,026 | 8.67 | 14.00 | 15.70 | 8.6 | 58 | 0 | 250% |
| 2 | **kidlat** | 98,184 | 9.68 | 16.00 | 17.89 | 9.7 | 64 | 0 | 225% |
| 3 | hyper-express | 95,941 | 9.90 | 19.00 | 12.26 | 10.6 | 78 | 0 | 220% |
| 4 | node-http | 43,628 | 22.42 | 37.00 | 8.28 | 23.0 | 110 | 0 | 100% |
| 5 | polka | 43,035 | 22.72 | 40.00 | 7.43 | 23.3 | 103 | 0 | 99% |
| 6 | fastify | 42,994 | 22.75 | 41.00 | 7.46 | 23.4 | 112 | 0 | 99% |
| 7 | 0http | 42,296 | 23.14 | 57.00 | 7.30 | 30.0 | 146 | 0 | 97% |
| 8 | hono | 40,433 | 24.23 | 41.00 | 6.40 | 24.8 | 108 | 0 | 93% |
| 9 | h3 | 39,047 | 25.11 | 48.00 | 6.63 | 25.7 | 112 | 0 | 89% |
| 10 | restify | 31,211 | 31.53 | 61.00 | 5.45 | 32.3 | 124 | 0 | 72% |
| 11 | koa | 29,804 | 33.03 | 63.00 | 5.14 | 33.8 | 127 | 0 | 68% |
| 12 | hapi | 28,410 | 34.69 | 66.00 | 6.18 | 35.9 | 138 | 0 | 65% |
| 13 | tinyhttp | 23,126 | 42.73 | 83.00 | 3.77 | 59.0 | 178 | 0 | 53% |
| 14 | express | 11,142 | 89.16 | 122.00 | 1.92 | 102.6 | 161 | 0 | 26% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 108,526 | 8.65 | 15.00 | 54.03 | 9.0 | 66 | 0 | 607% |
| 2 | uws | 86,075 | 11.03 | 22.00 | 39.57 | 11.9 | 68 | 0 | 481% |
| 3 | hyper-express | 43,214 | 22.63 | 36.00 | 19.16 | 23.7 | 100 | 0 | 242% |
| 4 | 0http | 19,393 | 51.04 | 106.00 | 9.47 | 62.7 | 165 | 0 | 108% |
| 5 | node-http | 17,878 | 55.41 | 79.00 | 9.05 | 56.7 | 114 | 0 | 100% |
| 6 | fastify | 16,629 | 59.60 | 93.00 | 8.13 | 61.0 | 110 | 0 | 93% |
| 7 | h3 | 16,387 | 60.48 | 86.00 | 7.95 | 61.9 | 109 | 0 | 92% |
| 8 | hono | 16,063 | 61.71 | 85.00 | 7.61 | 63.2 | 109 | 0 | 90% |
| 9 | polka | 15,294 | 64.85 | 92.00 | 7.47 | 66.1 | 111 | 0 | 86% |
| 10 | restify | 12,209 | 81.32 | 119.00 | 5.98 | 83.3 | 112 | 0 | 68% |
| 11 | tinyhttp | 11,731 | 84.67 | 114.00 | 6.54 | 105.8 | 182 | 0 | 66% |
| 12 | koa | 10,489 | 94.75 | 131.00 | 5.12 | 97.1 | 117 | 0 | 59% |
| 13 | hapi | 8,946 | 111.16 | 147.00 | 4.58 | 112.9 | 137 | 0 | 50% |
| 14 | express | 5,905 | 168.52 | 210.00 | 2.88 | 188.9 | 161 | 0 | 33% |

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
