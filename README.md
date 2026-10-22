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
Run on 10/23/2026, 03:54:55 (Manila Time, UTC+8) · AMD EPYC 9V74 80-Core Processor (4 threads, 16 GB) · Linux 6.17.0-1022-azure (x64) · Node v22.23.3

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | uws | 20.71.0 | 114,643 | 114,245 | 104,470 | 111,018 | 267% |
| 2 | **kidlat** | 2.4.0 | 108,733 | 107,842 | 109,611 | 108,726 | 261% |
| 3 | hyper-express | 7.0.2 | 117,035 | 108,530 | 57,442 | 90,026 | 216% |
| 4 | 0http | 5.2.0 | 54,312 | 56,154 | 31,088 | 45,599 | 110% |
| 5 | node-http | 22.23.3 | 52,111 | 52,973 | 26,087 | 41,604 | 100% |
| 6 | fastify | 5.12.7 | 52,817 | 50,111 | 25,176 | 40,542 | 97% |
| 7 | h3 | 2.0.2 | 53,191 | 50,036 | 24,281 | 40,129 | 96% |
| 8 | polka | 0.5.2 | 53,936 | 51,872 | 22,194 | 39,599 | 95% |
| 9 | hono | 4.13.13 | 50,487 | 49,363 | 23,264 | 38,704 | 93% |
| 10 | restify | 12.0.0 | 39,234 | 38,958 | 18,371 | 30,394 | 73% |
| 11 | koa | 3.2.1 | 37,778 | 37,746 | 14,820 | 27,647 | 66% |
| 12 | hapi | 21.4.10 | 35,875 | 34,199 | 11,879 | 24,426 | 59% |
| 13 | tinyhttp | 3.0.11 | 28,582 | 28,087 | 16,383 | 23,605 | 57% |
| 14 | express | 5.3.0 | 13,117 | 12,766 | 7,206 | 10,646 | 26% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 117,035 | 8.12 | 13.00 | 15.63 | 8.7 | 70 | 0 | 225% |
| 2 | uws | 114,643 | 8.21 | 11.00 | 17.16 | 8.1 | 58 | 0 | 220% |
| 3 | **kidlat** | 108,733 | 8.72 | 12.00 | 20.43 | 9.0 | 61 | 0 | 209% |
| 4 | 0http | 54,312 | 17.91 | 31.00 | 9.69 | 18.8 | 100 | 0 | 104% |
| 5 | polka | 53,936 | 18.05 | 30.00 | 9.62 | 18.7 | 102 | 0 | 104% |
| 6 | h3 | 53,191 | 18.31 | 31.00 | 9.33 | 18.9 | 106 | 0 | 102% |
| 7 | fastify | 52,817 | 18.44 | 32.00 | 9.47 | 19.1 | 107 | 0 | 101% |
| 8 | node-http | 52,111 | 18.69 | 33.00 | 10.24 | 19.3 | 104 | 0 | 100% |
| 9 | hono | 50,487 | 19.31 | 32.00 | 8.28 | 20.0 | 106 | 0 | 97% |
| 10 | restify | 39,234 | 24.99 | 49.00 | 7.07 | 25.7 | 113 | 0 | 75% |
| 11 | koa | 37,778 | 25.96 | 51.00 | 6.74 | 26.7 | 120 | 0 | 72% |
| 12 | hapi | 35,875 | 27.37 | 50.00 | 8.01 | 28.4 | 124 | 0 | 69% |
| 13 | tinyhttp | 28,582 | 34.49 | 76.00 | 4.82 | 52.8 | 169 | 0 | 55% |
| 14 | express | 13,117 | 75.68 | 104.00 | 2.34 | 88.1 | 166 | 0 | 25% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 114,245 | 8.24 | 12.00 | 16.45 | 8.2 | 59 | 0 | 216% |
| 2 | hyper-express | 108,530 | 8.66 | 14.00 | 13.87 | 9.4 | 78 | 0 | 205% |
| 3 | **kidlat** | 107,842 | 8.89 | 13.00 | 19.65 | 9.1 | 61 | 0 | 204% |
| 4 | 0http | 56,154 | 17.31 | 31.00 | 9.69 | 18.1 | 106 | 0 | 106% |
| 5 | node-http | 52,973 | 18.38 | 29.00 | 10.05 | 18.9 | 109 | 0 | 100% |
| 6 | polka | 51,872 | 18.78 | 32.00 | 8.95 | 19.4 | 107 | 0 | 98% |
| 7 | fastify | 50,111 | 19.46 | 34.00 | 8.70 | 20.1 | 111 | 0 | 95% |
| 8 | h3 | 50,036 | 19.49 | 33.00 | 8.49 | 20.1 | 111 | 0 | 94% |
| 9 | hono | 49,363 | 19.76 | 35.00 | 7.81 | 20.4 | 111 | 0 | 93% |
| 10 | restify | 38,958 | 25.17 | 46.00 | 6.80 | 25.8 | 124 | 0 | 74% |
| 11 | koa | 37,746 | 25.99 | 48.00 | 6.52 | 26.7 | 129 | 0 | 71% |
| 12 | hapi | 34,199 | 28.74 | 55.00 | 7.44 | 29.8 | 139 | 0 | 65% |
| 13 | tinyhttp | 28,087 | 35.11 | 69.00 | 4.58 | 53.8 | 170 | 0 | 53% |
| 14 | express | 12,766 | 77.78 | 103.00 | 2.20 | 89.1 | 165 | 0 | 24% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 109,611 | 8.57 | 12.00 | 54.56 | 8.9 | 62 | 0 | 420% |
| 2 | uws | 104,470 | 9.17 | 15.00 | 48.02 | 9.8 | 67 | 0 | 400% |
| 3 | hyper-express | 57,442 | 16.90 | 26.00 | 25.47 | 18.2 | 98 | 0 | 220% |
| 4 | 0http | 31,088 | 31.66 | 66.00 | 15.18 | 33.2 | 113 | 0 | 119% |
| 5 | node-http | 26,087 | 37.83 | 76.00 | 13.21 | 38.8 | 112 | 0 | 100% |
| 6 | fastify | 25,176 | 39.20 | 78.00 | 12.32 | 40.5 | 116 | 0 | 97% |
| 7 | h3 | 24,281 | 40.67 | 80.00 | 11.79 | 41.8 | 113 | 0 | 93% |
| 8 | hono | 23,264 | 42.48 | 82.00 | 11.03 | 43.8 | 110 | 0 | 89% |
| 9 | polka | 22,194 | 44.53 | 85.00 | 10.84 | 46.0 | 107 | 0 | 85% |
| 10 | restify | 18,371 | 53.91 | 85.00 | 9.00 | 55.4 | 113 | 0 | 70% |
| 11 | tinyhttp | 16,383 | 60.49 | 91.00 | 9.14 | 82.5 | 175 | 0 | 63% |
| 12 | koa | 14,820 | 66.94 | 108.00 | 7.24 | 68.6 | 114 | 0 | 57% |
| 13 | hapi | 11,879 | 83.62 | 117.00 | 6.08 | 85.4 | 140 | 0 | 46% |
| 14 | express | 7,206 | 138.08 | 178.00 | 3.52 | 156.1 | 166 | 0 | 28% |

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
