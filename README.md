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
Run on 11/20/2026, 19:16:55 (Manila Time, UTC+8) · AMD EPYC 9V74 80-Core Processor (4 threads, 16 GB) · Linux 7.0.0-1019-azure (x64) · Node v22.23.4

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | uws | 20.71.0 | 149,296 | 154,042 | 134,278 | 145,623 | 283% |
| 2 | **kidlat** | 2.6.0 | 138,403 | 135,566 | 147,610 | 140,434 | 273% |
| 3 | hyper-express | 7.0.2 | 149,302 | 142,089 | 73,118 | 115,758 | 225% |
| 4 | fastify | 5.12.7 | 66,652 | 65,946 | 31,208 | 51,573 | 100% |
| 5 | node-http | 22.23.4 | 64,091 | 64,935 | 32,814 | 51,497 | 100% |
| 6 | polka | 0.5.2 | 66,993 | 63,406 | 27,956 | 49,152 | 95% |
| 7 | h3 | 2.0.2 | 63,089 | 61,381 | 30,198 | 48,901 | 95% |
| 8 | hono | 4.13.13 | 65,283 | 62,698 | 28,318 | 48,757 | 95% |
| 9 | 0http | 5.2.0 | 57,613 | 56,368 | 31,869 | 46,951 | 91% |
| 10 | restify | 12.0.0 | 51,118 | 49,059 | 22,480 | 38,344 | 74% |
| 11 | koa | 3.2.1 | 50,476 | 49,158 | 19,946 | 36,715 | 71% |
| 12 | hapi | 21.4.10 | 45,606 | 43,862 | 15,582 | 31,471 | 61% |
| 13 | tinyhttp | 3.0.11 | 35,408 | 34,511 | 20,245 | 29,138 | 57% |
| 14 | express | 5.3.0 | 15,818 | 15,338 | 8,722 | 12,838 | 25% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 149,302 | 6.18 | 11.00 | 19.93 | 6.9 | 71 | 0 | 233% |
| 2 | uws | 149,296 | 6.17 | 10.00 | 22.35 | 6.3 | 58 | 0 | 233% |
| 3 | **kidlat** | 138,403 | 6.88 | 10.00 | 26.01 | 7.0 | 63 | 0 | 216% |
| 4 | polka | 66,993 | 14.44 | 27.00 | 11.95 | 15.0 | 101 | 0 | 105% |
| 5 | fastify | 66,652 | 14.51 | 28.00 | 11.95 | 15.1 | 108 | 0 | 104% |
| 6 | hono | 65,283 | 14.82 | 29.00 | 10.71 | 15.4 | 103 | 0 | 102% |
| 7 | node-http | 64,091 | 15.10 | 31.00 | 12.59 | 15.7 | 106 | 0 | 100% |
| 8 | h3 | 63,089 | 15.34 | 31.00 | 11.07 | 16.0 | 103 | 0 | 98% |
| 9 | 0http | 57,613 | 16.86 | 37.00 | 10.27 | 22.7 | 149 | 0 | 90% |
| 10 | restify | 51,118 | 19.09 | 38.00 | 9.21 | 19.7 | 114 | 0 | 80% |
| 11 | koa | 50,476 | 19.32 | 37.00 | 9.00 | 19.9 | 115 | 0 | 79% |
| 12 | hapi | 45,606 | 21.42 | 44.00 | 10.18 | 22.3 | 124 | 0 | 71% |
| 13 | tinyhttp | 35,408 | 27.75 | 59.00 | 5.98 | 42.5 | 185 | 0 | 55% |
| 14 | express | 15,818 | 62.68 | 89.00 | 2.82 | 76.0 | 175 | 0 | 25% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 154,042 | 6.09 | 9.00 | 22.18 | 6.2 | 60 | 0 | 237% |
| 2 | hyper-express | 142,089 | 6.49 | 12.00 | 18.16 | 7.2 | 79 | 0 | 219% |
| 3 | **kidlat** | 135,566 | 7.00 | 11.00 | 24.69 | 7.1 | 64 | 0 | 209% |
| 4 | fastify | 65,946 | 14.66 | 28.00 | 11.45 | 15.2 | 113 | 0 | 102% |
| 5 | node-http | 64,935 | 14.89 | 26.00 | 12.32 | 15.5 | 110 | 0 | 100% |
| 6 | polka | 63,406 | 15.26 | 28.00 | 10.94 | 15.8 | 107 | 0 | 98% |
| 7 | hono | 62,698 | 15.46 | 29.00 | 9.93 | 16.0 | 108 | 0 | 97% |
| 8 | h3 | 61,381 | 15.80 | 30.00 | 10.42 | 16.4 | 108 | 0 | 95% |
| 9 | 0http | 56,368 | 17.25 | 39.00 | 9.73 | 23.1 | 150 | 0 | 87% |
| 10 | koa | 49,158 | 19.87 | 41.00 | 8.48 | 20.4 | 125 | 0 | 76% |
| 11 | restify | 49,059 | 19.88 | 42.00 | 8.56 | 20.5 | 124 | 0 | 76% |
| 12 | hapi | 43,862 | 22.30 | 46.00 | 9.54 | 23.1 | 142 | 0 | 68% |
| 13 | tinyhttp | 34,511 | 28.48 | 58.00 | 5.63 | 43.7 | 185 | 0 | 53% |
| 14 | express | 15,338 | 64.67 | 91.00 | 2.65 | 77.4 | 175 | 0 | 24% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 147,610 | 6.26 | 10.00 | 73.48 | 6.6 | 68 | 0 | 450% |
| 2 | uws | 134,278 | 7.11 | 12.00 | 61.72 | 7.7 | 67 | 0 | 409% |
| 3 | hyper-express | 73,118 | 13.18 | 22.00 | 32.42 | 14.2 | 100 | 0 | 223% |
| 4 | node-http | 32,814 | 29.97 | 62.00 | 16.62 | 31.1 | 114 | 0 | 100% |
| 5 | 0http | 31,869 | 30.88 | 67.00 | 15.56 | 42.0 | 168 | 0 | 97% |
| 6 | fastify | 31,208 | 31.54 | 66.00 | 15.27 | 32.6 | 113 | 0 | 95% |
| 7 | h3 | 30,198 | 32.62 | 66.00 | 14.66 | 33.7 | 116 | 0 | 92% |
| 8 | hono | 28,318 | 34.81 | 69.00 | 13.42 | 35.9 | 104 | 0 | 86% |
| 9 | polka | 27,956 | 35.25 | 71.00 | 13.65 | 36.7 | 100 | 0 | 85% |
| 10 | restify | 22,480 | 43.97 | 79.00 | 11.02 | 45.1 | 115 | 0 | 69% |
| 11 | tinyhttp | 20,245 | 48.87 | 82.00 | 11.29 | 67.3 | 189 | 0 | 62% |
| 12 | koa | 19,946 | 49.63 | 84.00 | 9.74 | 50.9 | 116 | 0 | 61% |
| 13 | hapi | 15,582 | 63.62 | 95.00 | 7.98 | 64.9 | 143 | 0 | 47% |
| 14 | express | 8,722 | 113.99 | 150.00 | 4.26 | 132.9 | 176 | 0 | 27% |

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
