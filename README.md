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
Run on 11/22/2026, 06:58:56 (Manila Time, UTC+8) · AMD EPYC 9V74 80-Core Processor (4 threads, 16 GB) · Linux 7.0.0-1020-azure (x64) · Node v22.23.5

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | uws | 20.71.0 | 146,774 | 149,658 | 133,618 | 143,177 | 267% |
| 2 | **kidlat** | 2.6.0 | 135,686 | 134,011 | 142,514 | 137,355 | 256% |
| 3 | hyper-express | 7.0.2 | 149,715 | 141,711 | 75,184 | 116,842 | 218% |
| 4 | node-http | 22.23.5 | 67,865 | 68,578 | 33,017 | 53,562 | 100% |
| 5 | fastify | 5.12.7 | 68,559 | 67,361 | 32,322 | 53,047 | 99% |
| 6 | hono | 4.13.13 | 67,525 | 66,026 | 29,565 | 50,892 | 95% |
| 7 | polka | 0.5.2 | 69,511 | 66,641 | 28,270 | 50,782 | 95% |
| 8 | h3 | 2.0.2 | 67,774 | 63,529 | 30,188 | 50,655 | 95% |
| 9 | 0http | 5.2.0 | 62,150 | 60,510 | 33,909 | 50,334 | 94% |
| 10 | restify | 12.0.0 | 50,789 | 50,129 | 23,180 | 38,933 | 73% |
| 11 | koa | 3.2.1 | 49,796 | 48,813 | 19,722 | 36,326 | 68% |
| 12 | hapi | 21.4.10 | 46,228 | 45,083 | 14,895 | 31,429 | 59% |
| 13 | tinyhttp | 3.0.11 | 37,162 | 36,354 | 20,413 | 30,212 | 56% |
| 14 | express | 5.3.0 | 15,906 | 15,707 | 8,904 | 13,054 | 24% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 149,715 | 6.21 | 11.00 | 19.99 | 6.8 | 70 | 0 | 221% |
| 2 | uws | 146,774 | 6.26 | 10.00 | 21.98 | 6.4 | 58 | 0 | 216% |
| 3 | **kidlat** | 135,686 | 7.05 | 10.00 | 25.49 | 7.2 | 63 | 0 | 200% |
| 4 | polka | 69,511 | 13.92 | 27.00 | 12.40 | 14.5 | 101 | 0 | 102% |
| 5 | fastify | 68,559 | 14.09 | 27.00 | 12.29 | 14.7 | 108 | 0 | 101% |
| 6 | node-http | 67,865 | 14.23 | 27.00 | 13.33 | 14.8 | 102 | 0 | 100% |
| 7 | h3 | 67,774 | 14.24 | 25.00 | 11.89 | 14.8 | 109 | 0 | 100% |
| 8 | hono | 67,525 | 14.29 | 28.00 | 11.08 | 14.9 | 104 | 0 | 99% |
| 9 | 0http | 62,150 | 15.59 | 35.00 | 11.08 | 20.9 | 147 | 0 | 92% |
| 10 | restify | 50,789 | 19.21 | 41.00 | 9.15 | 19.8 | 114 | 0 | 75% |
| 11 | koa | 49,796 | 19.56 | 41.00 | 8.88 | 20.2 | 119 | 0 | 73% |
| 12 | hapi | 46,228 | 21.15 | 46.00 | 10.32 | 22.0 | 118 | 0 | 68% |
| 13 | tinyhttp | 37,162 | 26.40 | 55.00 | 6.27 | 39.2 | 181 | 0 | 55% |
| 14 | express | 15,906 | 62.34 | 85.00 | 2.84 | 74.2 | 168 | 0 | 23% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 149,658 | 6.16 | 10.00 | 21.55 | 6.3 | 60 | 0 | 218% |
| 2 | hyper-express | 141,711 | 6.45 | 12.00 | 18.11 | 7.2 | 79 | 0 | 207% |
| 3 | **kidlat** | 134,011 | 7.12 | 10.00 | 24.41 | 7.2 | 64 | 0 | 195% |
| 4 | node-http | 68,578 | 14.10 | 27.00 | 13.01 | 14.6 | 107 | 0 | 100% |
| 5 | fastify | 67,361 | 14.33 | 29.00 | 11.69 | 14.9 | 112 | 0 | 98% |
| 6 | polka | 66,641 | 14.49 | 29.00 | 11.50 | 15.1 | 107 | 0 | 97% |
| 7 | hono | 66,026 | 14.62 | 29.00 | 10.45 | 15.2 | 109 | 0 | 96% |
| 8 | h3 | 63,529 | 15.24 | 31.00 | 10.78 | 15.8 | 113 | 0 | 93% |
| 9 | 0http | 60,510 | 16.04 | 35.00 | 10.44 | 21.4 | 153 | 0 | 88% |
| 10 | restify | 50,129 | 19.45 | 39.00 | 8.75 | 20.1 | 124 | 0 | 73% |
| 11 | koa | 48,813 | 19.97 | 42.00 | 8.43 | 20.6 | 128 | 0 | 71% |
| 12 | hapi | 45,083 | 21.66 | 46.00 | 9.80 | 22.5 | 120 | 0 | 66% |
| 13 | tinyhttp | 36,354 | 27.01 | 55.00 | 5.93 | 40.0 | 181 | 0 | 53% |
| 14 | express | 15,707 | 63.13 | 84.00 | 2.71 | 74.4 | 168 | 0 | 23% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 142,514 | 6.41 | 11.00 | 70.95 | 6.8 | 65 | 0 | 432% |
| 2 | uws | 133,618 | 7.11 | 12.00 | 61.42 | 7.7 | 68 | 0 | 405% |
| 3 | hyper-express | 75,184 | 12.88 | 21.00 | 33.34 | 13.7 | 100 | 0 | 228% |
| 4 | 0http | 33,909 | 28.98 | 65.00 | 16.56 | 38.8 | 168 | 0 | 103% |
| 5 | node-http | 33,017 | 29.78 | 63.00 | 16.72 | 30.7 | 112 | 0 | 100% |
| 6 | fastify | 32,322 | 30.43 | 64.00 | 15.81 | 31.4 | 117 | 0 | 98% |
| 7 | h3 | 30,188 | 32.63 | 66.00 | 14.65 | 33.6 | 113 | 0 | 91% |
| 8 | hono | 29,565 | 33.31 | 68.00 | 14.01 | 34.3 | 109 | 0 | 90% |
| 9 | polka | 28,270 | 34.85 | 70.00 | 13.80 | 36.1 | 107 | 0 | 86% |
| 10 | restify | 23,180 | 42.62 | 78.00 | 11.36 | 43.8 | 113 | 0 | 70% |
| 11 | tinyhttp | 20,413 | 48.48 | 79.00 | 11.39 | 65.2 | 186 | 0 | 62% |
| 12 | koa | 19,722 | 50.18 | 84.00 | 9.63 | 51.5 | 120 | 0 | 60% |
| 13 | hapi | 14,895 | 66.58 | 99.00 | 7.63 | 67.9 | 121 | 0 | 45% |
| 14 | express | 8,904 | 111.68 | 149.00 | 4.35 | 127.9 | 169 | 0 | 27% |

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
