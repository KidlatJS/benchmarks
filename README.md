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
Run on 11/20/2026, 10:56:07 (Manila Time, UTC+8) · AMD EPYC 9V74 80-Core Processor (4 threads, 16 GB) · Linux 7.0.0-1019-azure (x64) · Node v22.23.4

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | uws | 20.71.0 | 163,363 | 164,986 | 134,216 | 153,509 | 281% |
| 2 | **kidlat** | 2.6.0 | 144,477 | 143,168 | 155,123 | 147,494 | 270% |
| 3 | hyper-express | 7.0.2 | 148,986 | 142,643 | 73,513 | 116,034 | 212% |
| 4 | node-http | 22.23.4 | 69,976 | 69,409 | 33,640 | 54,669 | 100% |
| 5 | fastify | 5.12.7 | 69,076 | 68,312 | 32,771 | 53,675 | 98% |
| 6 | 0http | 5.2.0 | 65,412 | 63,862 | 35,665 | 53,013 | 97% |
| 7 | polka | 0.5.2 | 70,773 | 68,406 | 28,833 | 51,874 | 95% |
| 8 | h3 | 2.0.2 | 67,893 | 65,040 | 31,268 | 51,685 | 95% |
| 9 | hono | 4.13.13 | 67,513 | 65,922 | 29,690 | 50,934 | 93% |
| 10 | restify | 12.0.0 | 51,892 | 51,268 | 23,488 | 39,682 | 73% |
| 11 | koa | 3.2.1 | 50,908 | 50,644 | 19,728 | 37,051 | 68% |
| 12 | hapi | 21.4.10 | 47,875 | 45,777 | 15,363 | 32,290 | 59% |
| 13 | tinyhttp | 3.0.11 | 37,738 | 37,008 | 20,625 | 30,654 | 56% |
| 14 | express | 5.3.0 | 16,070 | 16,172 | 8,900 | 13,225 | 24% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 163,363 | 5.58 | 9.00 | 24.46 | 5.9 | 58 | 0 | 233% |
| 2 | hyper-express | 148,986 | 6.23 | 11.00 | 19.89 | 6.8 | 70 | 0 | 213% |
| 3 | **kidlat** | 144,477 | 6.33 | 10.00 | 27.14 | 6.7 | 64 | 0 | 206% |
| 4 | polka | 70,773 | 13.68 | 28.00 | 12.62 | 14.2 | 99 | 0 | 101% |
| 5 | node-http | 69,976 | 13.80 | 26.00 | 13.75 | 14.4 | 102 | 0 | 100% |
| 6 | fastify | 69,076 | 13.99 | 29.00 | 12.38 | 14.6 | 108 | 0 | 99% |
| 7 | h3 | 67,893 | 14.24 | 28.00 | 11.91 | 14.8 | 108 | 0 | 97% |
| 8 | hono | 67,513 | 14.29 | 29.00 | 11.07 | 14.9 | 109 | 0 | 96% |
| 9 | 0http | 65,412 | 14.79 | 32.00 | 11.67 | 19.7 | 145 | 0 | 93% |
| 10 | restify | 51,892 | 18.75 | 43.00 | 9.35 | 19.4 | 113 | 0 | 74% |
| 11 | koa | 50,908 | 19.18 | 40.00 | 9.08 | 19.8 | 120 | 0 | 73% |
| 12 | hapi | 47,875 | 20.43 | 40.00 | 10.68 | 21.2 | 126 | 0 | 68% |
| 13 | tinyhttp | 37,738 | 25.99 | 54.00 | 6.37 | 38.6 | 182 | 0 | 54% |
| 14 | express | 16,070 | 61.70 | 83.00 | 2.87 | 72.2 | 163 | 0 | 23% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 164,986 | 5.39 | 10.00 | 23.76 | 5.9 | 60 | 0 | 238% |
| 2 | **kidlat** | 143,168 | 6.33 | 9.00 | 26.08 | 6.7 | 65 | 0 | 206% |
| 3 | hyper-express | 142,643 | 6.38 | 12.00 | 18.23 | 7.1 | 78 | 0 | 206% |
| 4 | node-http | 69,409 | 13.91 | 26.00 | 13.17 | 14.5 | 107 | 0 | 100% |
| 5 | polka | 68,406 | 14.10 | 28.00 | 11.81 | 14.7 | 105 | 0 | 99% |
| 6 | fastify | 68,312 | 14.12 | 28.00 | 11.86 | 14.7 | 113 | 0 | 98% |
| 7 | hono | 65,922 | 14.65 | 29.00 | 10.44 | 15.2 | 113 | 0 | 95% |
| 8 | h3 | 65,040 | 14.86 | 30.00 | 11.04 | 15.4 | 113 | 0 | 94% |
| 9 | 0http | 63,862 | 15.17 | 33.00 | 11.02 | 20.2 | 157 | 0 | 92% |
| 10 | restify | 51,268 | 19.02 | 41.00 | 8.95 | 19.6 | 124 | 0 | 74% |
| 11 | koa | 50,644 | 19.24 | 38.00 | 8.74 | 19.9 | 129 | 0 | 73% |
| 12 | hapi | 45,777 | 21.31 | 43.00 | 9.95 | 22.1 | 164 | 0 | 66% |
| 13 | tinyhttp | 37,008 | 26.53 | 54.00 | 6.03 | 39.3 | 183 | 0 | 53% |
| 14 | express | 16,172 | 61.31 | 84.00 | 2.79 | 71.3 | 163 | 0 | 23% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 155,123 | 6.15 | 10.00 | 77.22 | 6.4 | 68 | 0 | 461% |
| 2 | uws | 134,216 | 7.14 | 12.00 | 61.69 | 7.7 | 67 | 0 | 399% |
| 3 | hyper-express | 73,513 | 13.18 | 21.00 | 32.60 | 14.0 | 101 | 0 | 219% |
| 4 | 0http | 35,665 | 27.53 | 60.00 | 17.41 | 36.5 | 169 | 0 | 106% |
| 5 | node-http | 33,640 | 29.22 | 62.00 | 17.04 | 30.3 | 114 | 0 | 100% |
| 6 | fastify | 32,771 | 30.01 | 62.00 | 16.03 | 30.9 | 109 | 0 | 97% |
| 7 | h3 | 31,268 | 31.49 | 65.00 | 15.18 | 32.4 | 114 | 0 | 93% |
| 8 | hono | 29,690 | 33.15 | 66.00 | 14.07 | 34.1 | 104 | 0 | 88% |
| 9 | polka | 28,833 | 34.17 | 70.00 | 14.08 | 35.3 | 102 | 0 | 86% |
| 10 | restify | 23,488 | 42.05 | 76.00 | 11.51 | 43.2 | 113 | 0 | 70% |
| 11 | tinyhttp | 20,625 | 47.97 | 85.00 | 11.51 | 64.4 | 187 | 0 | 61% |
| 12 | koa | 19,728 | 50.15 | 85.00 | 9.63 | 51.5 | 117 | 0 | 59% |
| 13 | hapi | 15,363 | 64.56 | 98.00 | 7.87 | 65.8 | 165 | 0 | 46% |
| 14 | express | 8,900 | 111.71 | 147.00 | 4.35 | 126.7 | 168 | 0 | 26% |

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
