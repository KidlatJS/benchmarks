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
Run on 10/15/2026, 17:43:25 (Manila Time, UTC+8) · AMD EPYC 7763 64-Core Processor (4 threads, 16 GB) · Linux 6.17.0-1022-azure (x64) · Node v22.23.3

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | uws | 20.71.0 | 103,778 | 105,149 | 90,118 | 99,443 | 298% |
| 2 | **kidlat** | 2.2.0 | 102,650 | 96,861 | 95,630 | 98,333 | 295% |
| 3 | hyper-express | 7.0.2 | 109,283 | 100,582 | 49,163 | 81,453 | 244% |
| 4 | 0http | 5.2.0 | 51,085 | 49,651 | 21,963 | 38,192 | 115% |
| 5 | node-http | 22.23.3 | 45,561 | 45,957 | 17,685 | 33,331 | 100% |
| 6 | fastify | 5.12.7 | 45,478 | 44,285 | 17,506 | 32,791 | 98% |
| 7 | hono | 4.13.13 | 44,340 | 42,773 | 16,854 | 31,736 | 95% |
| 8 | polka | 0.5.2 | 45,538 | 42,960 | 15,972 | 31,497 | 94% |
| 9 | h3 | 2.0.2 | 43,344 | 40,833 | 17,111 | 31,170 | 94% |
| 10 | restify | 12.0.0 | 33,332 | 32,926 | 12,659 | 24,040 | 72% |
| 11 | koa | 3.2.1 | 31,625 | 31,148 | 10,984 | 22,118 | 66% |
| 12 | hapi | 21.4.10 | 31,555 | 30,932 | 9,479 | 20,993 | 63% |
| 13 | tinyhttp | 3.0.11 | 24,137 | 23,565 | 11,755 | 18,839 | 57% |
| 14 | express | 5.3.0 | 11,098 | 10,869 | 5,992 | 8,974 | 27% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 109,283 | 8.68 | 13.00 | 14.59 | 9.3 | 70 | 0 | 240% |
| 2 | uws | 103,778 | 9.25 | 15.00 | 15.54 | 8.7 | 58 | 0 | 228% |
| 3 | **kidlat** | 102,650 | 9.25 | 11.00 | 19.29 | 9.4 | 61 | 0 | 225% |
| 4 | 0http | 51,085 | 19.07 | 34.00 | 9.11 | 20.2 | 119 | 0 | 112% |
| 5 | node-http | 45,561 | 21.45 | 35.00 | 8.95 | 22.1 | 104 | 0 | 100% |
| 6 | polka | 45,538 | 21.47 | 35.00 | 8.12 | 22.1 | 101 | 0 | 100% |
| 7 | fastify | 45,478 | 21.51 | 35.00 | 8.15 | 22.1 | 106 | 0 | 100% |
| 8 | hono | 44,340 | 22.04 | 32.00 | 7.27 | 22.7 | 102 | 0 | 97% |
| 9 | h3 | 43,344 | 22.55 | 37.00 | 7.61 | 23.2 | 104 | 0 | 95% |
| 10 | restify | 33,332 | 29.50 | 50.00 | 6.01 | 30.2 | 115 | 0 | 73% |
| 11 | koa | 31,625 | 31.11 | 54.00 | 5.64 | 31.9 | 117 | 0 | 69% |
| 12 | hapi | 31,555 | 31.18 | 54.00 | 7.04 | 32.1 | 124 | 0 | 69% |
| 13 | tinyhttp | 24,137 | 40.92 | 82.00 | 4.07 | 57.4 | 169 | 0 | 53% |
| 14 | express | 11,098 | 89.53 | 119.00 | 1.98 | 102.0 | 137 | 0 | 24% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 105,149 | 9.18 | 15.00 | 15.14 | 8.5 | 58 | 0 | 229% |
| 2 | hyper-express | 100,582 | 9.36 | 18.00 | 12.85 | 10.1 | 78 | 0 | 219% |
| 3 | **kidlat** | 96,861 | 9.93 | 16.00 | 17.64 | 9.3 | 61 | 0 | 211% |
| 4 | 0http | 49,651 | 19.63 | 36.00 | 8.57 | 20.7 | 120 | 0 | 108% |
| 5 | node-http | 45,957 | 21.26 | 33.00 | 8.72 | 21.8 | 109 | 0 | 100% |
| 6 | fastify | 44,285 | 22.07 | 34.00 | 7.69 | 22.7 | 112 | 0 | 96% |
| 7 | polka | 42,960 | 22.75 | 36.00 | 7.42 | 23.3 | 106 | 0 | 93% |
| 8 | hono | 42,773 | 22.85 | 36.00 | 6.77 | 23.5 | 107 | 0 | 93% |
| 9 | h3 | 40,833 | 23.99 | 38.00 | 6.93 | 24.6 | 108 | 0 | 89% |
| 10 | restify | 32,926 | 29.87 | 51.00 | 5.75 | 30.6 | 126 | 0 | 72% |
| 11 | koa | 31,148 | 31.59 | 53.00 | 5.38 | 32.3 | 127 | 0 | 68% |
| 12 | hapi | 30,932 | 31.82 | 53.00 | 6.73 | 32.7 | 149 | 0 | 67% |
| 13 | tinyhttp | 23,565 | 41.93 | 78.00 | 3.84 | 58.5 | 169 | 0 | 51% |
| 14 | express | 10,869 | 91.39 | 121.00 | 1.88 | 103.5 | 162 | 0 | 24% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 95,630 | 9.91 | 18.00 | 47.61 | 10.8 | 114 | 0 | 541% |
| 2 | uws | 90,118 | 10.54 | 19.00 | 41.42 | 11.3 | 67 | 0 | 510% |
| 3 | hyper-express | 49,163 | 19.80 | 30.00 | 21.80 | 20.7 | 100 | 0 | 278% |
| 4 | 0http | 21,963 | 45.02 | 94.00 | 10.72 | 47.0 | 122 | 0 | 124% |
| 5 | node-http | 17,685 | 56.02 | 92.00 | 8.96 | 57.2 | 107 | 0 | 100% |
| 6 | fastify | 17,506 | 56.59 | 79.00 | 8.56 | 57.8 | 109 | 0 | 99% |
| 7 | h3 | 17,111 | 57.91 | 83.00 | 8.31 | 59.1 | 103 | 0 | 97% |
| 8 | hono | 16,854 | 58.81 | 85.00 | 7.99 | 60.1 | 108 | 0 | 95% |
| 9 | polka | 15,972 | 62.08 | 87.00 | 7.80 | 63.6 | 108 | 0 | 90% |
| 10 | restify | 12,659 | 78.43 | 107.00 | 6.20 | 80.0 | 118 | 0 | 72% |
| 11 | tinyhttp | 11,755 | 84.49 | 116.00 | 6.56 | 104.5 | 172 | 0 | 66% |
| 12 | koa | 10,984 | 90.43 | 123.00 | 5.36 | 92.4 | 114 | 0 | 62% |
| 13 | hapi | 9,479 | 104.89 | 139.00 | 4.85 | 106.4 | 151 | 0 | 54% |
| 14 | express | 5,992 | 166.03 | 199.00 | 2.93 | 183.4 | 161 | 0 | 34% |

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
