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
Run on 11/28/2026, 18:04:54 (Manila Time, UTC+8) · AMD EPYC 9V74 80-Core Processor (4 threads, 16 GB) · Linux 7.0.0-1020-azure (x64) · Node v22.23.5

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | uws | 20.71.0 | 158,384 | 163,322 | 132,865 | 150,911 | 280% |
| 2 | **kidlat** | 2.6.0 | 140,721 | 142,064 | 149,565 | 144,065 | 268% |
| 3 | hyper-express | 7.0.2 | 151,936 | 142,799 | 75,430 | 117,845 | 219% |
| 4 | node-http | 22.23.5 | 68,552 | 68,112 | 33,377 | 53,814 | 100% |
| 5 | fastify | 5.12.7 | 67,641 | 66,912 | 30,964 | 51,943 | 97% |
| 6 | polka | 0.5.2 | 68,932 | 66,821 | 28,449 | 50,793 | 94% |
| 7 | h3 | 2.0.2 | 67,543 | 63,701 | 30,237 | 50,671 | 94% |
| 8 | hono | 4.13.13 | 66,336 | 64,628 | 28,746 | 49,764 | 92% |
| 9 | 0http | 5.2.0 | 59,751 | 57,923 | 31,741 | 47,893 | 89% |
| 10 | restify | 12.0.0 | 50,210 | 49,542 | 22,259 | 38,115 | 71% |
| 11 | koa | 3.2.1 | 50,148 | 49,090 | 18,908 | 35,972 | 67% |
| 12 | hapi | 21.4.10 | 45,590 | 43,758 | 14,902 | 30,979 | 58% |
| 13 | tinyhttp | 3.0.11 | 35,617 | 36,249 | 20,109 | 29,611 | 55% |
| 14 | express | 5.3.0 | 15,852 | 15,958 | 8,649 | 12,982 | 24% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 158,384 | 6.07 | 9.00 | 23.72 | 6.1 | 58 | 0 | 231% |
| 2 | hyper-express | 151,936 | 6.10 | 10.00 | 20.29 | 6.7 | 71 | 0 | 222% |
| 3 | **kidlat** | 140,721 | 6.57 | 9.00 | 26.44 | 6.9 | 63 | 0 | 205% |
| 4 | polka | 68,932 | 14.05 | 28.00 | 12.29 | 14.6 | 101 | 0 | 101% |
| 5 | node-http | 68,552 | 14.08 | 26.00 | 13.47 | 14.7 | 103 | 0 | 100% |
| 6 | fastify | 67,641 | 14.32 | 27.00 | 12.13 | 14.9 | 108 | 0 | 99% |
| 7 | h3 | 67,543 | 14.32 | 29.00 | 11.85 | 14.9 | 107 | 0 | 99% |
| 8 | hono | 66,336 | 14.57 | 29.00 | 10.88 | 15.2 | 108 | 0 | 97% |
| 9 | 0http | 59,751 | 16.23 | 35.00 | 10.66 | 21.9 | 158 | 0 | 87% |
| 10 | restify | 50,210 | 19.43 | 42.00 | 9.05 | 20.1 | 114 | 0 | 73% |
| 11 | koa | 50,148 | 19.42 | 40.00 | 8.94 | 20.1 | 120 | 0 | 73% |
| 12 | hapi | 45,590 | 21.43 | 44.00 | 10.17 | 22.3 | 120 | 0 | 67% |
| 13 | tinyhttp | 35,617 | 27.57 | 57.00 | 6.01 | 40.8 | 183 | 0 | 52% |
| 14 | express | 15,852 | 62.55 | 85.00 | 2.83 | 74.8 | 140 | 0 | 23% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 163,322 | 5.60 | 9.00 | 23.51 | 5.9 | 60 | 0 | 240% |
| 2 | hyper-express | 142,799 | 6.42 | 11.00 | 18.25 | 7.2 | 79 | 0 | 210% |
| 3 | **kidlat** | 142,064 | 6.41 | 9.00 | 25.87 | 6.8 | 64 | 0 | 209% |
| 4 | node-http | 68,112 | 14.17 | 27.00 | 12.93 | 14.7 | 108 | 0 | 100% |
| 5 | fastify | 66,912 | 14.47 | 28.00 | 11.61 | 15.0 | 113 | 0 | 98% |
| 6 | polka | 66,821 | 14.45 | 27.00 | 11.53 | 15.0 | 107 | 0 | 98% |
| 7 | hono | 64,628 | 14.96 | 30.00 | 10.23 | 15.5 | 113 | 0 | 95% |
| 8 | h3 | 63,701 | 15.18 | 31.00 | 10.81 | 15.8 | 112 | 0 | 94% |
| 9 | 0http | 57,923 | 16.77 | 36.00 | 10.00 | 22.6 | 158 | 0 | 85% |
| 10 | restify | 49,542 | 19.67 | 41.00 | 8.65 | 20.3 | 125 | 0 | 73% |
| 11 | koa | 49,090 | 19.87 | 41.00 | 8.47 | 20.5 | 129 | 0 | 72% |
| 12 | hapi | 43,758 | 22.35 | 46.00 | 9.51 | 23.2 | 136 | 0 | 64% |
| 13 | tinyhttp | 36,249 | 27.09 | 55.00 | 5.91 | 40.1 | 183 | 0 | 53% |
| 14 | express | 15,958 | 62.12 | 85.00 | 2.75 | 73.7 | 162 | 0 | 23% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 149,565 | 6.19 | 10.00 | 74.46 | 6.6 | 69 | 0 | 448% |
| 2 | uws | 132,865 | 7.17 | 12.00 | 61.07 | 7.7 | 68 | 0 | 398% |
| 3 | hyper-express | 75,430 | 12.80 | 21.00 | 33.45 | 13.7 | 100 | 0 | 226% |
| 4 | node-http | 33,377 | 29.47 | 61.00 | 16.90 | 30.4 | 109 | 0 | 100% |
| 5 | 0http | 31,741 | 31.01 | 71.00 | 15.50 | 42.0 | 168 | 0 | 95% |
| 6 | fastify | 30,964 | 31.77 | 67.00 | 15.15 | 32.8 | 113 | 0 | 93% |
| 7 | h3 | 30,237 | 32.55 | 66.00 | 14.68 | 33.5 | 115 | 0 | 91% |
| 8 | hono | 28,746 | 34.28 | 71.00 | 13.63 | 35.3 | 109 | 0 | 86% |
| 9 | polka | 28,449 | 34.64 | 72.00 | 13.89 | 35.8 | 100 | 0 | 85% |
| 10 | restify | 22,259 | 44.41 | 78.00 | 10.91 | 45.7 | 124 | 0 | 67% |
| 11 | tinyhttp | 20,109 | 49.20 | 85.00 | 11.22 | 66.2 | 187 | 0 | 60% |
| 12 | koa | 18,908 | 52.36 | 85.00 | 9.23 | 53.8 | 125 | 0 | 57% |
| 13 | hapi | 14,902 | 66.53 | 100.00 | 7.63 | 68.0 | 137 | 0 | 45% |
| 14 | express | 8,649 | 115.00 | 149.00 | 4.22 | 132.3 | 168 | 0 | 26% |

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
