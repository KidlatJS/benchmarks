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
Run on 11/08/2026, 04:45:19 (Manila Time, UTC+8) · AMD EPYC 7763 64-Core Processor (4 threads, 16 GB) · Linux 7.0.0-1019-azure (x64) · Node v22.23.4

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 2.6.0 | 98,016 | 95,637 | 103,730 | 99,070 | 305% |
| 2 | uws | 20.71.0 | 96,659 | 105,259 | 87,908 | 96,348 | 297% |
| 3 | hyper-express | 7.0.2 | 105,602 | 99,282 | 43,786 | 77,142 | 238% |
| 4 | 0http | 5.2.0 | 42,636 | 43,105 | 19,718 | 33,092 | 102% |
| 5 | node-http | 22.23.4 | 43,512 | 43,375 | 18,072 | 32,431 | 100% |
| 6 | fastify | 5.12.7 | 43,442 | 42,405 | 17,511 | 31,833 | 98% |
| 7 | polka | 0.5.2 | 44,980 | 41,637 | 15,510 | 30,740 | 95% |
| 8 | hono | 4.13.13 | 41,768 | 40,902 | 16,069 | 30,166 | 93% |
| 9 | h3 | 2.0.2 | 41,980 | 38,727 | 16,808 | 30,120 | 93% |
| 10 | restify | 12.0.0 | 32,144 | 31,621 | 12,105 | 23,086 | 71% |
| 11 | koa | 3.2.1 | 31,249 | 30,370 | 10,740 | 21,682 | 67% |
| 12 | hapi | 21.4.10 | 30,321 | 28,694 | 9,122 | 19,947 | 62% |
| 13 | tinyhttp | 3.0.11 | 23,543 | 23,140 | 12,029 | 18,713 | 58% |
| 14 | express | 5.3.0 | 11,351 | 10,965 | 5,886 | 9,015 | 28% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 105,602 | 9.05 | 17.00 | 14.10 | 9.7 | 71 | 0 | 243% |
| 2 | **kidlat** | 98,016 | 9.70 | 15.00 | 18.42 | 9.7 | 64 | 0 | 225% |
| 3 | uws | 96,659 | 9.94 | 17.00 | 14.47 | 9.3 | 58 | 0 | 222% |
| 4 | polka | 44,980 | 21.74 | 35.00 | 8.02 | 22.4 | 101 | 0 | 103% |
| 5 | node-http | 43,512 | 22.48 | 43.00 | 8.55 | 23.1 | 103 | 0 | 100% |
| 6 | fastify | 43,442 | 22.51 | 43.00 | 7.79 | 23.2 | 104 | 0 | 100% |
| 7 | 0http | 42,636 | 22.96 | 53.00 | 7.60 | 29.7 | 150 | 0 | 98% |
| 8 | h3 | 41,980 | 23.32 | 39.00 | 7.37 | 24.0 | 108 | 0 | 96% |
| 9 | hono | 41,768 | 23.44 | 47.00 | 6.85 | 24.1 | 108 | 0 | 96% |
| 10 | restify | 32,144 | 30.60 | 61.00 | 5.79 | 31.4 | 113 | 0 | 74% |
| 11 | koa | 31,249 | 31.49 | 59.00 | 5.57 | 32.2 | 115 | 0 | 72% |
| 12 | hapi | 30,321 | 32.46 | 60.00 | 6.77 | 33.4 | 126 | 0 | 70% |
| 13 | tinyhttp | 23,543 | 41.97 | 86.00 | 3.97 | 58.4 | 168 | 0 | 54% |
| 14 | express | 11,351 | 87.52 | 127.00 | 2.02 | 100.1 | 165 | 0 | 26% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 105,259 | 9.05 | 16.00 | 15.16 | 8.8 | 58 | 0 | 243% |
| 2 | hyper-express | 99,282 | 9.51 | 16.00 | 12.69 | 10.2 | 78 | 0 | 229% |
| 3 | **kidlat** | 95,637 | 10.01 | 15.00 | 17.42 | 9.8 | 64 | 0 | 220% |
| 4 | node-http | 43,375 | 22.54 | 47.00 | 8.23 | 23.1 | 108 | 0 | 100% |
| 5 | 0http | 43,105 | 22.71 | 52.00 | 7.44 | 29.1 | 150 | 0 | 99% |
| 6 | fastify | 42,405 | 23.08 | 42.00 | 7.36 | 23.7 | 109 | 0 | 98% |
| 7 | polka | 41,637 | 23.52 | 49.00 | 7.19 | 24.1 | 107 | 0 | 96% |
| 8 | hono | 40,902 | 23.94 | 41.00 | 6.48 | 24.5 | 113 | 0 | 94% |
| 9 | h3 | 38,727 | 25.31 | 50.00 | 6.57 | 25.9 | 112 | 0 | 89% |
| 10 | restify | 31,621 | 31.12 | 63.00 | 5.52 | 31.8 | 124 | 0 | 73% |
| 11 | koa | 30,370 | 32.42 | 65.00 | 5.24 | 33.1 | 125 | 0 | 70% |
| 12 | hapi | 28,694 | 34.34 | 63.00 | 6.24 | 35.3 | 125 | 0 | 66% |
| 13 | tinyhttp | 23,140 | 42.71 | 82.00 | 3.77 | 59.1 | 173 | 0 | 53% |
| 14 | express | 10,965 | 90.62 | 121.00 | 1.89 | 102.8 | 165 | 0 | 25% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 103,730 | 9.28 | 15.00 | 51.64 | 9.5 | 69 | 0 | 574% |
| 2 | uws | 87,908 | 10.82 | 21.00 | 40.41 | 11.6 | 68 | 0 | 486% |
| 3 | hyper-express | 43,786 | 22.37 | 36.00 | 19.42 | 23.4 | 99 | 0 | 242% |
| 4 | 0http | 19,718 | 50.20 | 102.00 | 9.63 | 61.2 | 167 | 0 | 109% |
| 5 | node-http | 18,072 | 54.80 | 78.00 | 9.15 | 56.1 | 107 | 0 | 100% |
| 6 | fastify | 17,511 | 56.57 | 81.00 | 8.57 | 57.9 | 104 | 0 | 97% |
| 7 | h3 | 16,808 | 58.96 | 86.00 | 8.16 | 60.4 | 111 | 0 | 93% |
| 8 | hono | 16,069 | 61.70 | 88.00 | 7.62 | 63.1 | 104 | 0 | 89% |
| 9 | polka | 15,510 | 63.94 | 92.00 | 7.57 | 65.6 | 98 | 0 | 86% |
| 10 | restify | 12,105 | 82.04 | 123.00 | 5.93 | 84.0 | 112 | 0 | 67% |
| 11 | tinyhttp | 12,029 | 82.58 | 115.00 | 6.71 | 102.3 | 177 | 0 | 67% |
| 12 | koa | 10,740 | 92.52 | 130.00 | 5.24 | 94.7 | 113 | 0 | 59% |
| 13 | hapi | 9,122 | 108.96 | 140.00 | 4.67 | 110.8 | 125 | 0 | 50% |
| 14 | express | 5,886 | 169.07 | 210.00 | 2.87 | 187.4 | 165 | 0 | 33% |

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
