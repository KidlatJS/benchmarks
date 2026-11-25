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
Run on 11/25/2026, 20:29:16 (Manila Time, UTC+8) · AMD EPYC 7763 64-Core Processor (4 threads, 16 GB) · Linux 7.0.0-1020-azure (x64) · Node v22.23.5

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 2.6.0 | 105,044 | 104,088 | 113,125 | 107,344 | 326% |
| 2 | uws | 20.71.0 | 105,062 | 109,075 | 89,877 | 100,989 | 307% |
| 3 | hyper-express | 7.0.2 | 107,472 | 104,948 | 46,398 | 80,585 | 245% |
| 4 | 0http | 5.2.0 | 46,034 | 44,076 | 19,845 | 34,275 | 104% |
| 5 | node-http | 22.23.5 | 44,270 | 44,334 | 18,118 | 32,884 | 100% |
| 6 | fastify | 5.12.7 | 43,664 | 43,307 | 17,819 | 32,299 | 98% |
| 7 | hono | 4.13.13 | 43,887 | 42,327 | 16,596 | 31,356 | 95% |
| 8 | h3 | 2.0.2 | 43,899 | 40,979 | 17,032 | 31,292 | 95% |
| 9 | polka | 0.5.2 | 44,309 | 41,892 | 15,397 | 30,574 | 93% |
| 10 | restify | 12.0.0 | 32,712 | 32,458 | 12,539 | 23,701 | 72% |
| 11 | koa | 3.2.1 | 30,798 | 30,398 | 11,029 | 21,776 | 66% |
| 12 | hapi | 21.4.10 | 30,787 | 30,323 | 9,274 | 20,534 | 62% |
| 13 | tinyhttp | 3.0.11 | 24,327 | 23,686 | 12,170 | 19,141 | 58% |
| 14 | express | 5.3.0 | 11,467 | 11,247 | 6,127 | 9,245 | 28% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 107,472 | 8.72 | 18.00 | 14.35 | 9.5 | 70 | 0 | 243% |
| 2 | uws | 105,062 | 9.12 | 16.00 | 15.73 | 8.6 | 58 | 0 | 237% |
| 3 | **kidlat** | 105,044 | 9.21 | 16.00 | 19.74 | 9.2 | 63 | 0 | 237% |
| 4 | 0http | 46,034 | 21.23 | 49.00 | 8.21 | 27.5 | 145 | 0 | 104% |
| 5 | polka | 44,309 | 22.07 | 39.00 | 7.90 | 22.7 | 101 | 0 | 100% |
| 6 | node-http | 44,270 | 22.10 | 44.00 | 8.70 | 22.7 | 106 | 0 | 100% |
| 7 | h3 | 43,899 | 22.28 | 38.00 | 7.70 | 22.9 | 103 | 0 | 99% |
| 8 | hono | 43,887 | 22.29 | 39.00 | 7.20 | 22.9 | 103 | 0 | 99% |
| 9 | fastify | 43,664 | 22.40 | 47.00 | 7.83 | 23.0 | 107 | 0 | 99% |
| 10 | restify | 32,712 | 30.06 | 64.00 | 5.90 | 30.8 | 114 | 0 | 74% |
| 11 | koa | 30,798 | 31.96 | 64.00 | 5.49 | 32.7 | 116 | 0 | 70% |
| 12 | hapi | 30,787 | 31.97 | 64.00 | 6.87 | 32.9 | 124 | 0 | 70% |
| 13 | tinyhttp | 24,327 | 40.59 | 83.00 | 4.11 | 55.2 | 172 | 0 | 55% |
| 14 | express | 11,467 | 86.61 | 122.00 | 2.05 | 98.1 | 161 | 0 | 26% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 109,075 | 8.69 | 15.00 | 15.71 | 8.5 | 58 | 0 | 246% |
| 2 | hyper-express | 104,948 | 9.11 | 20.00 | 13.41 | 9.7 | 79 | 0 | 237% |
| 3 | **kidlat** | 104,088 | 9.19 | 14.00 | 18.96 | 9.2 | 64 | 0 | 235% |
| 4 | node-http | 44,334 | 22.07 | 47.00 | 8.41 | 22.6 | 110 | 0 | 100% |
| 5 | 0http | 44,076 | 22.19 | 55.00 | 7.61 | 28.7 | 148 | 0 | 99% |
| 6 | fastify | 43,307 | 22.58 | 42.00 | 7.52 | 23.2 | 112 | 0 | 98% |
| 7 | hono | 42,327 | 23.11 | 42.00 | 6.70 | 23.7 | 108 | 0 | 95% |
| 8 | polka | 41,892 | 23.37 | 43.00 | 7.23 | 23.9 | 107 | 0 | 94% |
| 9 | h3 | 40,979 | 23.90 | 43.00 | 6.96 | 24.5 | 109 | 0 | 92% |
| 10 | restify | 32,458 | 30.30 | 60.00 | 5.66 | 31.0 | 125 | 0 | 73% |
| 11 | koa | 30,398 | 32.39 | 65.00 | 5.25 | 33.0 | 125 | 0 | 69% |
| 12 | hapi | 30,323 | 32.47 | 60.00 | 6.59 | 33.3 | 147 | 0 | 68% |
| 13 | tinyhttp | 23,686 | 41.71 | 82.00 | 3.86 | 56.6 | 173 | 0 | 53% |
| 14 | express | 11,247 | 88.30 | 116.00 | 1.94 | 99.4 | 162 | 0 | 25% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 113,125 | 8.33 | 13.00 | 56.31 | 8.7 | 65 | 0 | 624% |
| 2 | uws | 89,877 | 10.57 | 19.00 | 41.31 | 11.4 | 68 | 0 | 496% |
| 3 | hyper-express | 46,398 | 21.06 | 34.00 | 20.57 | 22.0 | 99 | 0 | 256% |
| 4 | 0http | 19,845 | 49.85 | 104.00 | 9.69 | 61.3 | 167 | 0 | 110% |
| 5 | node-http | 18,118 | 54.66 | 80.00 | 9.17 | 55.8 | 102 | 0 | 100% |
| 6 | fastify | 17,819 | 55.57 | 80.00 | 8.72 | 56.9 | 110 | 0 | 98% |
| 7 | h3 | 17,032 | 58.19 | 90.00 | 8.27 | 59.5 | 111 | 0 | 94% |
| 8 | hono | 16,596 | 59.72 | 89.00 | 7.87 | 61.1 | 110 | 0 | 92% |
| 9 | polka | 15,397 | 64.40 | 95.00 | 7.52 | 66.1 | 104 | 0 | 85% |
| 10 | restify | 12,539 | 79.18 | 117.00 | 6.15 | 80.9 | 119 | 0 | 69% |
| 11 | tinyhttp | 12,170 | 81.57 | 115.00 | 6.79 | 100.6 | 177 | 0 | 67% |
| 12 | koa | 11,029 | 90.08 | 121.00 | 5.39 | 92.1 | 115 | 0 | 61% |
| 13 | hapi | 9,274 | 107.21 | 145.00 | 4.75 | 109.0 | 159 | 0 | 51% |
| 14 | express | 6,127 | 162.39 | 192.00 | 2.99 | 179.1 | 162 | 0 | 34% |

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
