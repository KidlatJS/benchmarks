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
Run on 11/11/2026, 06:15:47 (Manila Time, UTC+8) · AMD EPYC 9V74 80-Core Processor (4 threads, 16 GB) · Linux 7.0.0-1019-azure (x64) · Node v22.23.4

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | uws | 20.71.0 | 163,786 | 166,080 | 135,077 | 154,309 | 288% |
| 2 | **kidlat** | 2.6.0 | 142,253 | 141,401 | 156,240 | 146,477 | 274% |
| 3 | hyper-express | 7.0.2 | 149,948 | 144,858 | 74,500 | 117,403 | 219% |
| 4 | node-http | 22.23.4 | 67,532 | 68,338 | 33,241 | 53,532 | 100% |
| 5 | fastify | 5.12.7 | 69,232 | 68,284 | 31,174 | 52,821 | 99% |
| 6 | 0http | 5.2.0 | 62,860 | 61,261 | 34,037 | 50,797 | 95% |
| 7 | polka | 0.5.2 | 69,313 | 66,844 | 27,763 | 50,479 | 94% |
| 8 | h3 | 2.0.2 | 65,566 | 64,320 | 30,002 | 50,202 | 94% |
| 9 | hono | 4.13.13 | 66,312 | 64,832 | 28,538 | 49,690 | 93% |
| 10 | restify | 12.0.0 | 51,408 | 50,074 | 22,454 | 38,665 | 72% |
| 11 | koa | 3.2.1 | 50,191 | 48,864 | 19,062 | 36,024 | 67% |
| 12 | tinyhttp | 3.0.11 | 35,950 | 36,755 | 20,534 | 30,049 | 56% |
| 13 | hapi | 21.4.10 | 38,939 | 37,982 | 13,339 | 27,020 | 50% |
| 14 | express | 5.3.0 | 16,668 | 16,345 | 9,119 | 13,544 | 25% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 163,786 | 5.51 | 10.00 | 24.53 | 5.9 | 58 | 0 | 243% |
| 2 | hyper-express | 149,948 | 6.16 | 11.00 | 20.02 | 6.8 | 70 | 0 | 222% |
| 3 | **kidlat** | 142,253 | 6.38 | 10.00 | 26.73 | 6.7 | 64 | 0 | 211% |
| 4 | polka | 69,313 | 13.95 | 27.00 | 12.36 | 14.5 | 99 | 0 | 103% |
| 5 | fastify | 69,232 | 13.97 | 26.00 | 12.41 | 14.5 | 108 | 0 | 103% |
| 6 | node-http | 67,532 | 14.28 | 29.00 | 13.27 | 14.9 | 102 | 0 | 100% |
| 7 | hono | 66,312 | 14.57 | 30.00 | 10.88 | 15.2 | 107 | 0 | 98% |
| 8 | h3 | 65,566 | 14.73 | 31.00 | 11.50 | 15.3 | 103 | 0 | 97% |
| 9 | 0http | 62,860 | 15.42 | 33.00 | 11.21 | 20.5 | 145 | 0 | 93% |
| 10 | restify | 51,408 | 18.97 | 39.00 | 9.27 | 19.6 | 115 | 0 | 76% |
| 11 | koa | 50,191 | 19.41 | 41.00 | 8.95 | 20.1 | 119 | 0 | 74% |
| 12 | hapi | 38,939 | 25.17 | 52.00 | 8.69 | 26.0 | 116 | 0 | 58% |
| 13 | tinyhttp | 35,950 | 27.32 | 59.00 | 6.07 | 41.4 | 186 | 0 | 53% |
| 14 | express | 16,668 | 59.45 | 82.00 | 2.97 | 70.0 | 180 | 0 | 25% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 166,080 | 5.41 | 9.00 | 23.92 | 5.9 | 59 | 0 | 243% |
| 2 | hyper-express | 144,858 | 6.26 | 11.00 | 18.51 | 7.0 | 79 | 0 | 212% |
| 3 | **kidlat** | 141,401 | 6.45 | 10.00 | 25.76 | 6.6 | 64 | 0 | 207% |
| 4 | node-http | 68,338 | 14.11 | 25.00 | 12.97 | 14.7 | 107 | 0 | 100% |
| 5 | fastify | 68,284 | 14.15 | 27.00 | 11.85 | 14.7 | 113 | 0 | 100% |
| 6 | polka | 66,844 | 14.44 | 27.00 | 11.54 | 15.0 | 105 | 0 | 98% |
| 7 | hono | 64,832 | 14.94 | 30.00 | 10.26 | 15.5 | 112 | 0 | 95% |
| 8 | h3 | 64,320 | 15.05 | 28.00 | 10.92 | 15.6 | 109 | 0 | 94% |
| 9 | 0http | 61,261 | 15.82 | 35.00 | 10.57 | 20.9 | 148 | 0 | 90% |
| 10 | restify | 50,074 | 19.48 | 41.00 | 8.74 | 20.1 | 126 | 0 | 73% |
| 11 | koa | 48,864 | 19.98 | 43.00 | 8.44 | 20.6 | 128 | 0 | 72% |
| 12 | hapi | 37,982 | 25.82 | 52.00 | 8.26 | 26.6 | 151 | 0 | 56% |
| 13 | tinyhttp | 36,755 | 26.71 | 54.00 | 5.99 | 40.8 | 186 | 0 | 54% |
| 14 | express | 16,345 | 60.64 | 83.00 | 2.82 | 70.6 | 180 | 0 | 24% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 156,240 | 6.07 | 9.00 | 77.78 | 6.3 | 68 | 0 | 470% |
| 2 | uws | 135,077 | 7.08 | 11.00 | 62.10 | 7.6 | 68 | 0 | 406% |
| 3 | hyper-express | 74,500 | 12.99 | 21.00 | 33.04 | 13.8 | 99 | 0 | 224% |
| 4 | 0http | 34,037 | 28.88 | 61.00 | 16.62 | 38.3 | 168 | 0 | 102% |
| 5 | node-http | 33,241 | 29.57 | 62.00 | 16.83 | 30.5 | 112 | 0 | 100% |
| 6 | fastify | 31,174 | 31.57 | 68.00 | 15.25 | 32.5 | 116 | 0 | 94% |
| 7 | h3 | 30,002 | 32.83 | 68.00 | 14.56 | 33.8 | 114 | 0 | 90% |
| 8 | hono | 28,538 | 34.53 | 73.00 | 13.53 | 35.5 | 106 | 0 | 86% |
| 9 | polka | 27,763 | 35.51 | 73.00 | 13.56 | 36.7 | 100 | 0 | 84% |
| 10 | restify | 22,454 | 44.02 | 78.00 | 11.01 | 45.2 | 124 | 0 | 68% |
| 11 | tinyhttp | 20,534 | 48.19 | 85.00 | 11.46 | 65.9 | 191 | 0 | 62% |
| 12 | koa | 19,062 | 51.93 | 85.00 | 9.31 | 53.3 | 113 | 0 | 57% |
| 13 | hapi | 13,339 | 74.42 | 108.00 | 6.83 | 75.7 | 156 | 0 | 40% |
| 14 | express | 9,119 | 109.02 | 143.00 | 4.45 | 124.7 | 180 | 0 | 27% |

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
