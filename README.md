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
Run on 10/17/2026, 01:21:21 (Manila Time, UTC+8) · AMD EPYC 7763 64-Core Processor (4 threads, 16 GB) · Linux 6.17.0-1022-azure (x64) · Node v22.23.3

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 2.4.0 | 106,070 | 103,523 | 112,349 | 107,251 | 320% |
| 2 | uws | 20.71.0 | 109,421 | 113,290 | 92,526 | 104,677 | 312% |
| 3 | hyper-express | 7.0.2 | 110,333 | 103,280 | 47,105 | 81,270 | 242% |
| 4 | 0http | 5.2.0 | 46,306 | 44,940 | 20,630 | 35,016 | 104% |
| 5 | node-http | 22.23.3 | 45,894 | 45,957 | 17,873 | 33,530 | 100% |
| 6 | fastify | 5.12.7 | 45,691 | 44,590 | 17,589 | 32,969 | 98% |
| 7 | h3 | 2.0.2 | 43,776 | 42,014 | 17,589 | 31,864 | 95% |
| 8 | polka | 0.5.2 | 46,234 | 43,437 | 16,035 | 31,815 | 95% |
| 9 | hono | 4.13.13 | 43,740 | 42,915 | 16,670 | 31,512 | 94% |
| 10 | restify | 12.0.0 | 32,599 | 32,481 | 12,734 | 23,801 | 71% |
| 11 | koa | 3.2.1 | 31,035 | 30,568 | 11,034 | 21,875 | 65% |
| 12 | hapi | 21.4.10 | 32,729 | 31,716 | 9,770 | 21,645 | 65% |
| 13 | tinyhttp | 3.0.11 | 24,980 | 24,309 | 12,258 | 19,525 | 58% |
| 14 | express | 5.3.0 | 11,067 | 11,154 | 6,249 | 9,171 | 27% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 110,333 | 8.45 | 15.00 | 14.73 | 9.2 | 71 | 0 | 240% |
| 2 | uws | 109,421 | 8.62 | 14.00 | 16.39 | 8.2 | 58 | 0 | 238% |
| 3 | **kidlat** | 106,070 | 9.13 | 15.00 | 19.93 | 9.2 | 61 | 0 | 231% |
| 4 | 0http | 46,306 | 21.09 | 45.00 | 8.26 | 27.3 | 158 | 0 | 101% |
| 5 | polka | 46,234 | 21.12 | 34.00 | 8.24 | 21.7 | 101 | 0 | 101% |
| 6 | node-http | 45,894 | 21.30 | 34.00 | 9.02 | 21.9 | 104 | 0 | 100% |
| 7 | fastify | 45,691 | 21.42 | 33.00 | 8.19 | 22.0 | 104 | 0 | 100% |
| 8 | h3 | 43,776 | 22.34 | 36.00 | 7.68 | 23.0 | 104 | 0 | 95% |
| 9 | hono | 43,740 | 22.34 | 37.00 | 7.17 | 23.0 | 107 | 0 | 95% |
| 10 | hapi | 32,729 | 30.05 | 51.00 | 7.30 | 30.9 | 118 | 0 | 71% |
| 11 | restify | 32,599 | 30.17 | 51.00 | 5.88 | 30.9 | 113 | 0 | 71% |
| 12 | koa | 31,035 | 31.71 | 54.00 | 5.53 | 32.5 | 118 | 0 | 68% |
| 13 | tinyhttp | 24,980 | 39.52 | 80.00 | 4.22 | 55.3 | 167 | 0 | 54% |
| 14 | express | 11,067 | 89.76 | 119.00 | 1.97 | 100.1 | 160 | 0 | 24% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 113,290 | 8.29 | 13.00 | 16.31 | 8.2 | 59 | 0 | 247% |
| 2 | **kidlat** | 103,523 | 9.20 | 15.00 | 18.86 | 9.3 | 61 | 0 | 225% |
| 3 | hyper-express | 103,280 | 9.33 | 18.00 | 13.20 | 9.8 | 79 | 0 | 225% |
| 4 | node-http | 45,957 | 21.28 | 35.00 | 8.72 | 21.8 | 109 | 0 | 100% |
| 5 | 0http | 44,940 | 21.75 | 46.00 | 7.76 | 28.0 | 157 | 0 | 98% |
| 6 | fastify | 44,590 | 21.92 | 35.00 | 7.74 | 22.5 | 110 | 0 | 97% |
| 7 | polka | 43,437 | 22.51 | 36.00 | 7.50 | 23.1 | 107 | 0 | 95% |
| 8 | hono | 42,915 | 22.78 | 36.00 | 6.79 | 23.4 | 112 | 0 | 93% |
| 9 | h3 | 42,014 | 23.31 | 38.00 | 7.13 | 23.9 | 109 | 0 | 91% |
| 10 | restify | 32,481 | 30.29 | 51.00 | 5.67 | 30.9 | 124 | 0 | 71% |
| 11 | hapi | 31,716 | 31.02 | 53.00 | 6.90 | 31.9 | 133 | 0 | 69% |
| 12 | koa | 30,568 | 32.20 | 54.00 | 5.28 | 32.9 | 129 | 0 | 67% |
| 13 | tinyhttp | 24,309 | 40.62 | 73.00 | 3.96 | 56.3 | 167 | 0 | 53% |
| 14 | express | 11,154 | 89.06 | 115.00 | 1.93 | 99.7 | 159 | 0 | 24% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 112,349 | 8.35 | 13.00 | 55.93 | 8.8 | 62 | 0 | 629% |
| 2 | uws | 92,526 | 10.31 | 18.00 | 42.53 | 11.0 | 67 | 0 | 518% |
| 3 | hyper-express | 47,105 | 20.70 | 32.00 | 20.89 | 21.6 | 101 | 0 | 264% |
| 4 | 0http | 20,630 | 47.95 | 100.00 | 10.07 | 59.4 | 166 | 0 | 115% |
| 5 | node-http | 17,873 | 55.42 | 90.00 | 9.05 | 56.6 | 107 | 0 | 100% |
| 6 | h3 | 17,589 | 56.32 | 84.00 | 8.54 | 57.5 | 105 | 0 | 98% |
| 7 | fastify | 17,589 | 56.33 | 83.00 | 8.60 | 57.5 | 104 | 0 | 98% |
| 8 | hono | 16,670 | 59.45 | 88.00 | 7.90 | 60.7 | 109 | 0 | 93% |
| 9 | polka | 16,035 | 61.84 | 90.00 | 7.83 | 63.5 | 103 | 0 | 90% |
| 10 | restify | 12,734 | 77.97 | 106.00 | 6.24 | 79.6 | 112 | 0 | 71% |
| 11 | tinyhttp | 12,258 | 81.00 | 115.00 | 6.84 | 100.3 | 174 | 0 | 69% |
| 12 | koa | 11,034 | 90.05 | 121.00 | 5.39 | 92.1 | 119 | 0 | 62% |
| 13 | hapi | 9,770 | 101.72 | 130.00 | 5.00 | 103.3 | 138 | 0 | 55% |
| 14 | express | 6,249 | 159.25 | 185.00 | 3.05 | 174.9 | 161 | 0 | 35% |

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
