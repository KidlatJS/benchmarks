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
Run on 10/14/2026, 23:46:36 (Manila Time, UTC+8) · AMD EPYC 9V45 96-Core Processor (4 threads, 16 GB) · Linux 6.17.0-1022-azure (x64) · Node v22.23.3

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 2.1.0 | 181,014 | 183,389 | 160,867 | 174,790 | 265% |
| 2 | uws | 20.71.0 | 178,406 | 170,330 | 156,163 | 168,045 | 255% |
| 3 | hyper-express | 7.0.2 | 179,878 | 171,642 | 100,014 | 145,620 | 221% |
| 4 | fastify | 5.12.7 | 83,787 | 82,939 | 51,433 | 70,967 | 107% |
| 5 | h3 | 2.0.2 | 80,379 | 78,490 | 47,547 | 66,941 | 101% |
| 6 | node-http | 22.23.3 | 76,117 | 75,131 | 50,336 | 66,028 | 100% |
| 7 | polka | 0.5.2 | 77,550 | 77,682 | 44,806 | 64,627 | 98% |
| 8 | hono | 4.13.13 | 75,779 | 74,765 | 43,850 | 62,864 | 95% |
| 9 | 0http | 5.2.0 | 74,880 | 69,462 | 42,265 | 60,353 | 91% |
| 10 | restify | 12.0.0 | 61,659 | 62,421 | 36,419 | 51,946 | 79% |
| 11 | koa | 3.2.1 | 58,956 | 60,070 | 34,558 | 49,649 | 75% |
| 12 | hapi | 21.4.10 | 59,861 | 59,709 | 29,861 | 47,435 | 72% |
| 13 | tinyhttp | 3.0.11 | 45,415 | 45,478 | 31,418 | 40,185 | 61% |
| 14 | express | 5.3.0 | 21,218 | 21,715 | 14,799 | 18,963 | 29% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 181,014 | 5.12 | 8.00 | 34.01 | 5.3 | 63 | 0 | 238% |
| 2 | hyper-express | 179,878 | 5.13 | 8.00 | 24.01 | 5.7 | 78 | 0 | 236% |
| 3 | uws | 178,406 | 5.13 | 8.00 | 26.71 | 5.4 | 58 | 0 | 234% |
| 4 | fastify | 83,787 | 11.44 | 21.00 | 15.02 | 12.0 | 108 | 0 | 110% |
| 5 | h3 | 80,379 | 11.93 | 23.00 | 14.10 | 12.5 | 107 | 0 | 106% |
| 6 | polka | 77,550 | 12.39 | 23.00 | 13.83 | 13.0 | 101 | 0 | 102% |
| 7 | node-http | 76,117 | 12.64 | 23.00 | 14.95 | 13.2 | 100 | 0 | 100% |
| 8 | hono | 75,779 | 12.70 | 24.00 | 12.43 | 13.3 | 102 | 0 | 100% |
| 9 | 0http | 74,880 | 12.86 | 24.00 | 13.35 | 13.7 | 100 | 0 | 98% |
| 10 | restify | 61,659 | 15.73 | 29.00 | 11.11 | 16.4 | 115 | 0 | 81% |
| 11 | hapi | 59,861 | 16.21 | 31.00 | 13.36 | 17.0 | 126 | 0 | 79% |
| 12 | koa | 58,956 | 16.46 | 31.00 | 10.51 | 17.1 | 118 | 0 | 77% |
| 13 | tinyhttp | 45,415 | 21.53 | 46.00 | 7.67 | 34.5 | 189 | 0 | 60% |
| 14 | express | 21,218 | 46.62 | 84.00 | 3.78 | 56.8 | 189 | 0 | 28% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 183,389 | 5.08 | 7.00 | 33.40 | 5.3 | 66 | 0 | 244% |
| 2 | hyper-express | 171,642 | 5.21 | 8.00 | 21.93 | 6.0 | 78 | 0 | 228% |
| 3 | uws | 170,330 | 5.32 | 8.00 | 24.53 | 5.6 | 60 | 0 | 227% |
| 4 | fastify | 82,939 | 11.56 | 22.00 | 14.39 | 12.1 | 112 | 0 | 110% |
| 5 | h3 | 78,490 | 12.25 | 23.00 | 13.32 | 12.8 | 112 | 0 | 104% |
| 6 | polka | 77,682 | 12.37 | 24.00 | 13.41 | 12.9 | 108 | 0 | 103% |
| 7 | node-http | 75,131 | 12.81 | 24.00 | 14.26 | 13.4 | 105 | 0 | 100% |
| 8 | hono | 74,765 | 12.88 | 24.00 | 11.84 | 13.5 | 106 | 0 | 100% |
| 9 | 0http | 69,462 | 13.90 | 26.00 | 11.99 | 14.7 | 104 | 0 | 92% |
| 10 | restify | 62,421 | 15.53 | 28.00 | 10.89 | 16.1 | 126 | 0 | 83% |
| 11 | koa | 60,070 | 16.15 | 30.00 | 10.37 | 16.8 | 127 | 0 | 80% |
| 12 | hapi | 59,709 | 16.25 | 32.00 | 12.98 | 17.2 | 153 | 0 | 79% |
| 13 | tinyhttp | 45,478 | 21.49 | 44.00 | 7.42 | 34.4 | 195 | 0 | 61% |
| 14 | express | 21,715 | 45.53 | 83.00 | 3.75 | 54.6 | 189 | 0 | 29% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 160,867 | 5.70 | 10.00 | 80.08 | 6.6 | 117 | 0 | 320% |
| 2 | uws | 156,163 | 5.96 | 9.00 | 71.78 | 6.6 | 67 | 0 | 310% |
| 3 | hyper-express | 100,014 | 9.56 | 13.00 | 44.35 | 10.4 | 100 | 0 | 199% |
| 4 | fastify | 51,433 | 18.93 | 41.00 | 25.16 | 19.7 | 114 | 0 | 102% |
| 5 | node-http | 50,336 | 19.36 | 41.00 | 25.49 | 20.5 | 112 | 0 | 100% |
| 6 | h3 | 47,547 | 20.53 | 44.00 | 23.08 | 21.5 | 117 | 0 | 94% |
| 7 | polka | 44,806 | 21.82 | 48.00 | 21.88 | 23.1 | 106 | 0 | 89% |
| 8 | hono | 43,850 | 22.30 | 48.00 | 20.78 | 23.4 | 105 | 0 | 87% |
| 9 | 0http | 42,265 | 23.17 | 48.00 | 20.64 | 25.0 | 112 | 0 | 84% |
| 10 | restify | 36,419 | 26.96 | 57.00 | 17.85 | 28.3 | 116 | 0 | 72% |
| 11 | koa | 34,558 | 28.43 | 62.00 | 16.87 | 29.8 | 124 | 0 | 69% |
| 12 | tinyhttp | 31,418 | 31.32 | 66.00 | 17.53 | 47.3 | 200 | 0 | 62% |
| 13 | hapi | 29,861 | 32.97 | 69.00 | 15.29 | 34.0 | 153 | 0 | 59% |
| 14 | express | 14,799 | 67.01 | 101.00 | 7.23 | 80.4 | 194 | 0 | 29% |

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
