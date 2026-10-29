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
Run on 10/29/2026, 08:44:04 (Manila Time, UTC+8) · AMD EPYC 7763 64-Core Processor (4 threads, 16 GB) · Linux 7.0.0-1017-azure (x64) · Node v22.23.4

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 2.4.0 | 101,874 | 101,456 | 104,858 | 102,718 | 309% |
| 2 | uws | 20.71.0 | 100,187 | 97,626 | 91,302 | 96,298 | 289% |
| 3 | hyper-express | 7.0.2 | 109,610 | 101,134 | 46,252 | 80,037 | 240% |
| 4 | node-http | 22.23.4 | 44,564 | 44,402 | 18,645 | 33,290 | 100% |
| 5 | 0http | 5.2.0 | 44,687 | 42,653 | 18,981 | 33,074 | 99% |
| 6 | fastify | 5.12.7 | 44,265 | 43,628 | 16,795 | 31,891 | 96% |
| 7 | h3 | 2.0.2 | 44,011 | 41,098 | 17,759 | 31,788 | 95% |
| 8 | polka | 0.5.2 | 43,546 | 41,708 | 15,255 | 30,259 | 91% |
| 9 | hono | 4.13.13 | 41,642 | 40,417 | 16,066 | 30,015 | 90% |
| 10 | restify | 12.0.0 | 33,012 | 31,976 | 12,552 | 23,663 | 71% |
| 11 | koa | 3.2.1 | 31,390 | 30,663 | 10,769 | 21,803 | 65% |
| 12 | hapi | 21.4.10 | 31,297 | 30,130 | 9,265 | 20,596 | 62% |
| 13 | tinyhttp | 3.0.11 | 24,367 | 23,958 | 12,420 | 19,355 | 58% |
| 14 | express | 5.3.0 | 11,067 | 10,779 | 6,083 | 8,986 | 27% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 109,610 | 8.52 | 16.00 | 14.63 | 9.3 | 71 | 0 | 246% |
| 2 | **kidlat** | 101,874 | 9.38 | 16.00 | 19.14 | 9.5 | 61 | 0 | 229% |
| 3 | uws | 100,187 | 9.41 | 15.00 | 15.00 | 9.2 | 58 | 0 | 225% |
| 4 | 0http | 44,687 | 21.88 | 47.00 | 7.97 | 28.1 | 146 | 0 | 100% |
| 5 | node-http | 44,564 | 21.94 | 36.00 | 8.75 | 22.6 | 100 | 0 | 100% |
| 6 | fastify | 44,265 | 22.09 | 36.00 | 7.94 | 22.7 | 107 | 0 | 99% |
| 7 | h3 | 44,011 | 22.21 | 36.00 | 7.72 | 22.9 | 107 | 0 | 99% |
| 8 | polka | 43,546 | 22.46 | 38.00 | 7.77 | 23.1 | 100 | 0 | 98% |
| 9 | hono | 41,642 | 23.51 | 42.00 | 6.83 | 24.2 | 106 | 0 | 93% |
| 10 | restify | 33,012 | 29.78 | 56.00 | 5.95 | 30.5 | 113 | 0 | 74% |
| 11 | koa | 31,390 | 31.37 | 60.00 | 5.60 | 32.1 | 120 | 0 | 70% |
| 12 | hapi | 31,297 | 31.45 | 59.00 | 6.98 | 32.4 | 119 | 0 | 70% |
| 13 | tinyhttp | 24,367 | 40.53 | 85.00 | 4.11 | 56.2 | 174 | 0 | 55% |
| 14 | express | 11,067 | 89.77 | 123.00 | 1.97 | 100.8 | 162 | 0 | 25% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 101,456 | 9.35 | 13.00 | 18.48 | 9.5 | 61 | 0 | 228% |
| 2 | hyper-express | 101,134 | 9.46 | 18.00 | 12.92 | 10.0 | 79 | 0 | 228% |
| 3 | uws | 97,626 | 9.85 | 15.00 | 14.06 | 9.2 | 58 | 0 | 220% |
| 4 | node-http | 44,402 | 22.02 | 35.00 | 8.43 | 22.6 | 105 | 0 | 100% |
| 5 | fastify | 43,628 | 22.41 | 36.00 | 7.57 | 23.0 | 113 | 0 | 98% |
| 6 | 0http | 42,653 | 22.95 | 52.00 | 7.36 | 29.5 | 146 | 0 | 96% |
| 7 | polka | 41,708 | 23.48 | 36.00 | 7.20 | 24.1 | 107 | 0 | 94% |
| 8 | h3 | 41,098 | 23.81 | 42.00 | 6.98 | 24.4 | 112 | 0 | 93% |
| 9 | hono | 40,417 | 24.23 | 41.00 | 6.40 | 24.8 | 111 | 0 | 91% |
| 10 | restify | 31,976 | 30.77 | 62.00 | 5.58 | 31.4 | 124 | 0 | 72% |
| 11 | koa | 30,663 | 32.10 | 59.00 | 5.29 | 32.8 | 129 | 0 | 69% |
| 12 | hapi | 30,130 | 32.68 | 59.00 | 6.55 | 33.5 | 133 | 0 | 68% |
| 13 | tinyhttp | 23,958 | 41.24 | 83.00 | 3.91 | 56.6 | 174 | 0 | 54% |
| 14 | express | 10,779 | 92.18 | 125.00 | 1.86 | 102.8 | 161 | 0 | 24% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 104,858 | 9.14 | 15.00 | 52.20 | 9.3 | 63 | 0 | 562% |
| 2 | uws | 91,302 | 10.43 | 21.00 | 41.97 | 11.1 | 67 | 0 | 490% |
| 3 | hyper-express | 46,252 | 21.10 | 35.00 | 20.51 | 22.0 | 99 | 0 | 248% |
| 4 | 0http | 18,981 | 52.17 | 107.00 | 9.27 | 64.1 | 161 | 0 | 102% |
| 5 | node-http | 18,645 | 53.09 | 73.00 | 9.44 | 54.0 | 114 | 0 | 100% |
| 6 | h3 | 17,759 | 55.78 | 85.00 | 8.62 | 56.9 | 110 | 0 | 95% |
| 7 | fastify | 16,795 | 59.00 | 85.00 | 8.22 | 60.4 | 109 | 0 | 90% |
| 8 | hono | 16,066 | 61.71 | 90.00 | 7.61 | 63.1 | 108 | 0 | 86% |
| 9 | polka | 15,255 | 65.01 | 95.00 | 7.45 | 66.7 | 104 | 0 | 82% |
| 10 | restify | 12,552 | 79.08 | 115.00 | 6.15 | 80.9 | 118 | 0 | 67% |
| 11 | tinyhttp | 12,420 | 79.95 | 114.00 | 6.93 | 98.3 | 178 | 0 | 67% |
| 12 | koa | 10,769 | 92.27 | 132.00 | 5.26 | 94.3 | 114 | 0 | 58% |
| 13 | hapi | 9,265 | 107.30 | 146.00 | 4.74 | 109.0 | 145 | 0 | 50% |
| 14 | express | 6,083 | 163.61 | 202.00 | 2.97 | 179.2 | 162 | 0 | 33% |

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
