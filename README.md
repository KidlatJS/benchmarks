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
Run on 11/13/2026, 15:44:09 (Manila Time, UTC+8) · AMD EPYC 9V45 96-Core Processor (4 threads, 16 GB) · Linux 7.0.0-1019-azure (x64) · Node v22.23.4

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 2.6.0 | 188,529 | 204,112 | 204,438 | 198,885 | 299% |
| 2 | uws | 20.71.0 | 214,656 | 207,226 | 171,139 | 196,719 | 296% |
| 3 | hyper-express | 7.0.2 | 180,970 | 173,462 | 100,448 | 146,639 | 221% |
| 4 | fastify | 5.12.7 | 85,490 | 84,632 | 49,059 | 70,804 | 107% |
| 5 | h3 | 2.0.2 | 81,885 | 78,445 | 45,830 | 66,523 | 100% |
| 6 | node-http | 22.23.4 | 81,666 | 76,565 | 46,860 | 66,419 | 100% |
| 7 | polka | 0.5.2 | 81,037 | 80,267 | 45,040 | 66,416 | 100% |
| 8 | hono | 4.13.13 | 79,411 | 77,442 | 43,555 | 64,461 | 97% |
| 9 | restify | 12.0.0 | 67,564 | 66,121 | 38,123 | 55,430 | 83% |
| 10 | koa | 3.2.1 | 66,075 | 66,338 | 35,640 | 53,858 | 81% |
| 11 | 0http | 5.2.0 | 59,363 | 57,762 | 37,359 | 50,410 | 76% |
| 12 | hapi | 21.4.10 | 51,030 | 49,161 | 30,021 | 42,230 | 64% |
| 13 | tinyhttp | 3.0.11 | 46,782 | 47,272 | 31,915 | 41,326 | 62% |
| 14 | express | 5.3.0 | 20,752 | 20,857 | 14,764 | 18,557 | 28% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 214,656 | 4.13 | 6.00 | 32.14 | 4.6 | 58 | 0 | 263% |
| 2 | **kidlat** | 188,529 | 4.79 | 12.00 | 35.43 | 5.0 | 63 | 0 | 231% |
| 3 | hyper-express | 180,970 | 5.08 | 7.00 | 24.16 | 5.7 | 79 | 0 | 222% |
| 4 | fastify | 85,490 | 11.23 | 20.00 | 15.33 | 11.8 | 105 | 0 | 105% |
| 5 | h3 | 81,885 | 11.73 | 22.00 | 14.37 | 12.3 | 104 | 0 | 100% |
| 6 | node-http | 81,666 | 11.75 | 22.00 | 16.04 | 12.3 | 103 | 0 | 100% |
| 7 | polka | 81,037 | 11.83 | 23.00 | 14.45 | 12.4 | 102 | 0 | 99% |
| 8 | hono | 79,411 | 12.10 | 25.00 | 13.03 | 12.7 | 105 | 0 | 97% |
| 9 | restify | 67,564 | 14.30 | 28.00 | 12.18 | 14.9 | 116 | 0 | 83% |
| 10 | koa | 66,075 | 14.64 | 29.00 | 11.78 | 15.2 | 118 | 0 | 81% |
| 11 | 0http | 59,363 | 16.35 | 34.00 | 10.59 | 22.0 | 157 | 0 | 73% |
| 12 | hapi | 51,030 | 19.12 | 41.00 | 11.39 | 19.9 | 119 | 0 | 62% |
| 13 | tinyhttp | 46,782 | 20.87 | 42.00 | 7.90 | 32.5 | 190 | 0 | 57% |
| 14 | express | 20,752 | 47.66 | 68.00 | 3.70 | 58.2 | 189 | 0 | 25% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 207,226 | 4.15 | 6.00 | 29.84 | 4.7 | 59 | 0 | 271% |
| 2 | **kidlat** | 204,112 | 4.21 | 7.00 | 37.19 | 4.8 | 64 | 0 | 267% |
| 3 | hyper-express | 173,462 | 5.14 | 7.00 | 22.17 | 5.9 | 79 | 0 | 227% |
| 4 | fastify | 84,632 | 11.31 | 23.00 | 14.69 | 11.9 | 110 | 0 | 111% |
| 5 | polka | 80,267 | 11.97 | 24.00 | 13.86 | 12.5 | 107 | 0 | 105% |
| 6 | h3 | 78,445 | 12.24 | 24.00 | 13.32 | 12.8 | 109 | 0 | 102% |
| 7 | hono | 77,442 | 12.41 | 24.00 | 12.26 | 13.0 | 110 | 0 | 101% |
| 8 | node-http | 76,565 | 12.56 | 24.00 | 14.53 | 13.1 | 108 | 0 | 100% |
| 9 | koa | 66,338 | 14.58 | 28.00 | 11.45 | 15.1 | 127 | 0 | 87% |
| 10 | restify | 66,121 | 14.61 | 29.00 | 11.54 | 15.2 | 126 | 0 | 86% |
| 11 | 0http | 57,762 | 16.82 | 36.00 | 9.97 | 22.6 | 158 | 0 | 75% |
| 12 | hapi | 49,161 | 19.82 | 45.00 | 10.69 | 20.6 | 158 | 0 | 64% |
| 13 | tinyhttp | 47,272 | 20.66 | 42.00 | 7.71 | 32.6 | 192 | 0 | 62% |
| 14 | express | 20,857 | 47.43 | 69.00 | 3.60 | 57.5 | 190 | 0 | 27% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 204,438 | 4.21 | 6.00 | 101.77 | 4.8 | 69 | 0 | 436% |
| 2 | uws | 171,139 | 5.20 | 8.00 | 78.67 | 6.0 | 67 | 0 | 365% |
| 3 | hyper-express | 100,448 | 9.58 | 13.00 | 44.55 | 10.3 | 98 | 0 | 214% |
| 4 | fastify | 49,059 | 19.88 | 47.00 | 24.00 | 20.8 | 112 | 0 | 105% |
| 5 | node-http | 46,860 | 20.84 | 45.00 | 23.73 | 21.9 | 109 | 0 | 100% |
| 6 | h3 | 45,830 | 21.32 | 48.00 | 22.25 | 22.3 | 112 | 0 | 98% |
| 7 | polka | 45,040 | 21.70 | 49.00 | 21.99 | 23.0 | 108 | 0 | 96% |
| 8 | hono | 43,555 | 22.45 | 51.00 | 20.64 | 23.4 | 116 | 0 | 93% |
| 9 | restify | 38,123 | 25.72 | 59.00 | 18.69 | 26.6 | 125 | 0 | 81% |
| 10 | 0http | 37,359 | 26.27 | 55.00 | 18.24 | 36.2 | 175 | 0 | 80% |
| 11 | koa | 35,640 | 27.55 | 62.00 | 17.40 | 28.7 | 117 | 0 | 76% |
| 12 | tinyhttp | 31,915 | 30.82 | 67.00 | 17.80 | 45.7 | 196 | 0 | 68% |
| 13 | hapi | 30,021 | 32.81 | 63.00 | 15.37 | 33.8 | 159 | 0 | 64% |
| 14 | express | 14,764 | 67.19 | 107.00 | 7.21 | 81.7 | 190 | 0 | 32% |

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
