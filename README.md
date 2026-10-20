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
Run on 10/20/2026, 19:18:34 (Manila Time, UTC+8) · AMD EPYC 7763 64-Core Processor (4 threads, 16 GB) · Linux 7.0.0-1017-azure (x64) · Node v22.23.3

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 2.4.0 | 101,573 | 102,814 | 107,384 | 103,894 | 310% |
| 2 | uws | 20.71.0 | 98,390 | 100,176 | 89,258 | 95,819 | 286% |
| 3 | hyper-express | 7.0.2 | 104,336 | 98,579 | 43,538 | 76,506 | 228% |
| 4 | 0http | 5.2.0 | 44,683 | 43,868 | 20,146 | 34,054 | 102% |
| 5 | node-http | 22.23.3 | 45,390 | 45,568 | 18,254 | 33,547 | 100% |
| 6 | fastify | 5.12.7 | 44,991 | 44,065 | 17,167 | 32,407 | 97% |
| 7 | hono | 4.13.13 | 43,560 | 42,451 | 16,979 | 31,547 | 94% |
| 8 | polka | 0.5.2 | 45,602 | 43,415 | 15,615 | 31,385 | 94% |
| 9 | h3 | 2.0.2 | 43,229 | 41,203 | 16,787 | 31,038 | 93% |
| 10 | restify | 12.0.0 | 33,314 | 32,575 | 12,383 | 23,775 | 71% |
| 11 | koa | 3.2.1 | 31,936 | 31,013 | 10,802 | 22,035 | 66% |
| 12 | hapi | 21.4.10 | 31,340 | 30,260 | 9,255 | 20,628 | 61% |
| 13 | tinyhttp | 3.0.11 | 23,698 | 23,341 | 12,054 | 18,822 | 56% |
| 14 | express | 5.3.0 | 11,550 | 11,267 | 6,068 | 9,243 | 28% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 104,336 | 9.23 | 18.00 | 13.93 | 9.7 | 70 | 0 | 230% |
| 2 | **kidlat** | 101,573 | 9.35 | 16.00 | 19.08 | 9.5 | 61 | 0 | 224% |
| 3 | uws | 98,390 | 9.68 | 15.00 | 14.73 | 9.3 | 58 | 0 | 217% |
| 4 | polka | 45,602 | 21.46 | 34.00 | 8.13 | 22.0 | 101 | 0 | 100% |
| 5 | node-http | 45,390 | 21.54 | 37.00 | 8.92 | 22.1 | 104 | 0 | 100% |
| 6 | fastify | 44,991 | 21.75 | 35.00 | 8.07 | 22.3 | 105 | 0 | 99% |
| 7 | 0http | 44,683 | 21.88 | 49.00 | 7.97 | 28.3 | 145 | 0 | 98% |
| 8 | hono | 43,560 | 22.46 | 41.00 | 7.15 | 23.1 | 106 | 0 | 96% |
| 9 | h3 | 43,229 | 22.63 | 42.00 | 7.59 | 23.3 | 102 | 0 | 95% |
| 10 | restify | 33,314 | 29.50 | 55.00 | 6.00 | 30.2 | 113 | 0 | 73% |
| 11 | koa | 31,936 | 30.80 | 55.00 | 5.70 | 31.5 | 114 | 0 | 70% |
| 12 | hapi | 31,340 | 31.41 | 58.00 | 6.99 | 32.3 | 127 | 0 | 69% |
| 13 | tinyhttp | 23,698 | 41.70 | 84.00 | 4.00 | 56.5 | 171 | 0 | 52% |
| 14 | express | 11,550 | 86.01 | 124.00 | 2.06 | 97.2 | 147 | 0 | 25% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 102,814 | 9.26 | 14.00 | 18.73 | 9.5 | 61 | 0 | 226% |
| 2 | uws | 100,176 | 9.39 | 13.00 | 14.42 | 9.1 | 58 | 0 | 220% |
| 3 | hyper-express | 98,579 | 9.53 | 20.00 | 12.60 | 10.3 | 78 | 0 | 216% |
| 4 | node-http | 45,568 | 21.45 | 34.00 | 8.65 | 22.0 | 109 | 0 | 100% |
| 5 | fastify | 44,065 | 22.18 | 40.00 | 7.65 | 22.8 | 110 | 0 | 97% |
| 6 | 0http | 43,868 | 22.30 | 51.00 | 7.57 | 28.7 | 146 | 0 | 96% |
| 7 | polka | 43,415 | 22.51 | 35.00 | 7.49 | 23.1 | 107 | 0 | 95% |
| 8 | hono | 42,451 | 23.07 | 38.00 | 6.72 | 23.6 | 111 | 0 | 93% |
| 9 | h3 | 41,203 | 23.75 | 40.00 | 6.99 | 24.3 | 107 | 0 | 90% |
| 10 | restify | 32,575 | 30.20 | 58.00 | 5.69 | 30.8 | 124 | 0 | 71% |
| 11 | koa | 31,013 | 31.73 | 59.00 | 5.35 | 32.4 | 124 | 0 | 68% |
| 12 | hapi | 30,260 | 32.53 | 60.00 | 6.58 | 33.3 | 134 | 0 | 66% |
| 13 | tinyhttp | 23,341 | 42.33 | 82.00 | 3.81 | 57.1 | 172 | 0 | 51% |
| 14 | express | 11,267 | 88.17 | 120.00 | 1.94 | 98.9 | 160 | 0 | 25% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 107,384 | 9.04 | 14.00 | 53.46 | 9.1 | 62 | 0 | 588% |
| 2 | uws | 89,258 | 10.65 | 19.00 | 41.03 | 11.4 | 67 | 0 | 489% |
| 3 | hyper-express | 43,538 | 22.51 | 36.00 | 19.31 | 23.3 | 97 | 0 | 239% |
| 4 | 0http | 20,146 | 49.12 | 102.00 | 9.84 | 60.6 | 166 | 0 | 110% |
| 5 | node-http | 18,254 | 54.25 | 80.00 | 9.24 | 55.4 | 107 | 0 | 100% |
| 6 | fastify | 17,167 | 57.72 | 83.00 | 8.40 | 58.9 | 110 | 0 | 94% |
| 7 | hono | 16,979 | 58.35 | 92.00 | 8.05 | 59.7 | 108 | 0 | 93% |
| 8 | h3 | 16,787 | 59.04 | 88.00 | 8.15 | 60.3 | 107 | 0 | 92% |
| 9 | polka | 15,615 | 63.51 | 90.00 | 7.62 | 65.0 | 103 | 0 | 86% |
| 10 | restify | 12,383 | 80.19 | 116.00 | 6.07 | 81.8 | 112 | 0 | 68% |
| 11 | tinyhttp | 12,054 | 82.39 | 112.00 | 6.72 | 101.2 | 175 | 0 | 66% |
| 12 | koa | 10,802 | 91.99 | 125.00 | 5.27 | 93.4 | 135 | 0 | 59% |
| 13 | hapi | 9,255 | 107.41 | 146.00 | 4.74 | 109.2 | 149 | 0 | 51% |
| 14 | express | 6,068 | 163.94 | 210.00 | 2.96 | 179.8 | 160 | 0 | 33% |

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
