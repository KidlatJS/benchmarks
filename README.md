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
Run on 10/21/2026, 17:58:25 (Manila Time, UTC+8) · AMD EPYC 7763 64-Core Processor (4 threads, 16 GB) · Linux 6.17.0-1022-azure (x64) · Node v22.23.3

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 2.4.0 | 106,470 | 102,856 | 111,934 | 107,022 | 321% |
| 2 | uws | 20.71.0 | 111,246 | 115,973 | 92,442 | 106,048 | 318% |
| 3 | hyper-express | 7.0.2 | 111,458 | 106,414 | 48,457 | 83,142 | 249% |
| 4 | 0http | 5.2.0 | 46,159 | 45,388 | 20,781 | 35,179 | 106% |
| 5 | node-http | 22.23.3 | 46,286 | 45,857 | 17,451 | 33,334 | 100% |
| 6 | fastify | 5.12.7 | 45,016 | 44,502 | 17,505 | 32,732 | 98% |
| 7 | polka | 0.5.2 | 46,453 | 43,838 | 15,635 | 31,695 | 95% |
| 8 | h3 | 2.0.2 | 43,634 | 41,046 | 16,863 | 31,142 | 93% |
| 9 | hono | 4.13.13 | 42,306 | 41,178 | 16,285 | 30,499 | 91% |
| 10 | restify | 12.0.0 | 33,244 | 32,999 | 12,556 | 23,971 | 72% |
| 11 | koa | 3.2.1 | 32,528 | 31,711 | 10,943 | 22,432 | 67% |
| 12 | hapi | 21.4.10 | 31,507 | 31,151 | 9,360 | 20,944 | 63% |
| 13 | tinyhttp | 3.0.11 | 24,810 | 23,896 | 12,016 | 19,241 | 58% |
| 14 | express | 5.3.0 | 11,335 | 11,278 | 6,172 | 9,241 | 28% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 111,458 | 8.32 | 15.00 | 14.88 | 9.1 | 70 | 0 | 241% |
| 2 | uws | 111,246 | 8.48 | 13.00 | 16.66 | 8.1 | 58 | 0 | 240% |
| 3 | **kidlat** | 106,470 | 9.11 | 13.00 | 20.00 | 9.1 | 61 | 0 | 230% |
| 4 | polka | 46,453 | 21.03 | 33.00 | 8.28 | 21.6 | 98 | 0 | 100% |
| 5 | node-http | 46,286 | 21.12 | 34.00 | 9.09 | 21.7 | 101 | 0 | 100% |
| 6 | 0http | 46,159 | 21.17 | 45.00 | 8.23 | 27.8 | 145 | 0 | 100% |
| 7 | fastify | 45,016 | 21.72 | 35.00 | 8.07 | 22.3 | 106 | 0 | 97% |
| 8 | h3 | 43,634 | 22.41 | 36.00 | 7.66 | 23.0 | 105 | 0 | 94% |
| 9 | hono | 42,306 | 23.14 | 38.00 | 6.94 | 23.8 | 104 | 0 | 91% |
| 10 | restify | 33,244 | 29.58 | 50.00 | 5.99 | 30.3 | 113 | 0 | 72% |
| 11 | koa | 32,528 | 30.23 | 51.00 | 5.80 | 31.0 | 117 | 0 | 70% |
| 12 | hapi | 31,507 | 31.22 | 53.00 | 7.03 | 32.2 | 122 | 0 | 68% |
| 13 | tinyhttp | 24,810 | 39.79 | 76.00 | 4.19 | 55.5 | 170 | 0 | 54% |
| 14 | express | 11,335 | 87.65 | 115.00 | 2.02 | 100.3 | 156 | 0 | 24% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 115,973 | 8.18 | 14.00 | 16.70 | 8.1 | 59 | 0 | 253% |
| 2 | hyper-express | 106,414 | 9.03 | 15.00 | 13.60 | 9.5 | 78 | 0 | 232% |
| 3 | **kidlat** | 102,856 | 9.29 | 15.00 | 18.73 | 9.1 | 61 | 0 | 224% |
| 4 | node-http | 45,857 | 21.32 | 35.00 | 8.70 | 21.9 | 106 | 0 | 100% |
| 5 | 0http | 45,388 | 21.54 | 46.00 | 7.83 | 27.9 | 145 | 0 | 99% |
| 6 | fastify | 44,502 | 21.98 | 36.00 | 7.72 | 22.6 | 111 | 0 | 97% |
| 7 | polka | 43,838 | 22.29 | 37.00 | 7.57 | 22.9 | 103 | 0 | 96% |
| 8 | hono | 41,178 | 23.78 | 38.00 | 6.52 | 24.4 | 109 | 0 | 90% |
| 9 | h3 | 41,046 | 23.86 | 39.00 | 6.97 | 24.4 | 111 | 0 | 90% |
| 10 | restify | 32,999 | 29.80 | 50.00 | 5.76 | 30.4 | 124 | 0 | 72% |
| 11 | koa | 31,711 | 31.04 | 53.00 | 5.47 | 31.7 | 127 | 0 | 69% |
| 12 | hapi | 31,151 | 31.59 | 54.00 | 6.77 | 32.4 | 135 | 0 | 68% |
| 13 | tinyhttp | 23,896 | 41.34 | 79.00 | 3.90 | 57.1 | 170 | 0 | 52% |
| 14 | express | 11,278 | 88.06 | 121.00 | 1.95 | 100.3 | 163 | 0 | 25% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 111,934 | 8.38 | 14.00 | 55.72 | 8.7 | 62 | 0 | 641% |
| 2 | uws | 92,442 | 10.27 | 17.00 | 42.49 | 11.0 | 67 | 0 | 530% |
| 3 | hyper-express | 48,457 | 20.19 | 32.00 | 21.49 | 21.0 | 101 | 0 | 278% |
| 4 | 0http | 20,781 | 47.61 | 101.00 | 10.15 | 58.9 | 165 | 0 | 119% |
| 5 | fastify | 17,505 | 56.60 | 82.00 | 8.56 | 57.8 | 109 | 0 | 100% |
| 6 | node-http | 17,451 | 56.77 | 92.00 | 8.84 | 58.0 | 106 | 0 | 100% |
| 7 | h3 | 16,863 | 58.77 | 87.00 | 8.19 | 60.0 | 106 | 0 | 97% |
| 8 | hono | 16,285 | 60.88 | 88.00 | 7.72 | 62.2 | 103 | 0 | 93% |
| 9 | polka | 15,635 | 63.42 | 93.00 | 7.63 | 64.5 | 112 | 0 | 90% |
| 10 | restify | 12,556 | 79.08 | 112.00 | 6.15 | 80.7 | 112 | 0 | 72% |
| 11 | tinyhttp | 12,016 | 82.67 | 114.00 | 6.70 | 102.2 | 174 | 0 | 69% |
| 12 | koa | 10,943 | 90.80 | 125.00 | 5.34 | 92.7 | 116 | 0 | 63% |
| 13 | hapi | 9,360 | 106.21 | 137.00 | 4.79 | 107.8 | 138 | 0 | 54% |
| 14 | express | 6,172 | 161.17 | 196.00 | 3.01 | 178.3 | 161 | 0 | 35% |

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
