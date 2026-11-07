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
Run on 11/07/2026, 10:40:34 (Manila Time, UTC+8) · AMD EPYC 7763 64-Core Processor (4 threads, 16 GB) · Linux 7.0.0-1019-azure (x64) · Node v22.23.4

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 2.6.0 | 98,798 | 100,117 | 110,728 | 103,079 | 315% |
| 2 | uws | 20.71.0 | 100,200 | 105,614 | 90,280 | 98,490 | 301% |
| 3 | hyper-express | 7.0.2 | 106,210 | 99,800 | 44,441 | 77,808 | 238% |
| 4 | 0http | 5.2.0 | 44,587 | 44,063 | 19,904 | 33,942 | 104% |
| 5 | node-http | 22.23.4 | 43,921 | 43,961 | 18,128 | 32,711 | 100% |
| 6 | fastify | 5.12.7 | 43,565 | 42,152 | 17,248 | 31,640 | 97% |
| 7 | h3 | 2.0.2 | 42,587 | 40,532 | 17,338 | 31,047 | 95% |
| 8 | polka | 0.5.2 | 43,953 | 41,576 | 15,786 | 30,669 | 94% |
| 9 | hono | 4.13.13 | 42,224 | 40,935 | 16,427 | 30,507 | 93% |
| 10 | restify | 12.0.0 | 32,955 | 32,515 | 12,336 | 23,644 | 72% |
| 11 | koa | 3.2.1 | 30,943 | 30,414 | 10,815 | 21,671 | 66% |
| 12 | hapi | 21.4.10 | 29,980 | 30,054 | 9,115 | 20,176 | 62% |
| 13 | tinyhttp | 3.0.11 | 22,968 | 23,052 | 11,948 | 18,495 | 57% |
| 14 | express | 5.3.0 | 11,352 | 11,425 | 6,241 | 9,319 | 28% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 106,210 | 8.96 | 17.00 | 14.18 | 9.6 | 71 | 0 | 242% |
| 2 | uws | 100,200 | 9.44 | 16.00 | 15.00 | 9.0 | 58 | 0 | 228% |
| 3 | **kidlat** | 98,798 | 9.69 | 18.00 | 18.56 | 9.7 | 63 | 0 | 225% |
| 4 | 0http | 44,587 | 21.93 | 52.00 | 7.95 | 28.3 | 146 | 0 | 102% |
| 5 | polka | 43,953 | 22.25 | 37.00 | 7.84 | 22.9 | 97 | 0 | 100% |
| 6 | node-http | 43,921 | 22.26 | 41.00 | 8.63 | 22.9 | 106 | 0 | 100% |
| 7 | fastify | 43,565 | 22.45 | 37.00 | 7.81 | 23.1 | 107 | 0 | 99% |
| 8 | h3 | 42,587 | 22.97 | 42.00 | 7.47 | 23.6 | 103 | 0 | 97% |
| 9 | hono | 42,224 | 23.18 | 42.00 | 6.93 | 23.8 | 108 | 0 | 96% |
| 10 | restify | 32,955 | 29.84 | 58.00 | 5.94 | 30.6 | 113 | 0 | 75% |
| 11 | koa | 30,943 | 31.81 | 60.00 | 5.52 | 32.5 | 117 | 0 | 70% |
| 12 | hapi | 29,980 | 32.84 | 67.00 | 6.69 | 33.8 | 121 | 0 | 68% |
| 13 | tinyhttp | 22,968 | 43.02 | 89.00 | 3.88 | 58.4 | 173 | 0 | 52% |
| 14 | express | 11,352 | 87.52 | 132.00 | 2.02 | 98.4 | 165 | 0 | 26% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 105,614 | 9.00 | 15.00 | 15.21 | 8.8 | 58 | 0 | 240% |
| 2 | **kidlat** | 100,117 | 9.52 | 15.00 | 18.24 | 9.6 | 64 | 0 | 228% |
| 3 | hyper-express | 99,800 | 9.44 | 16.00 | 12.75 | 10.2 | 78 | 0 | 227% |
| 4 | 0http | 44,063 | 22.20 | 52.00 | 7.61 | 28.5 | 146 | 0 | 100% |
| 5 | node-http | 43,961 | 22.24 | 36.00 | 8.34 | 22.8 | 111 | 0 | 100% |
| 6 | fastify | 42,152 | 23.21 | 46.00 | 7.32 | 23.8 | 112 | 0 | 96% |
| 7 | polka | 41,576 | 23.56 | 41.00 | 7.18 | 24.1 | 102 | 0 | 95% |
| 8 | hono | 40,935 | 23.94 | 48.00 | 6.48 | 24.5 | 113 | 0 | 93% |
| 9 | h3 | 40,532 | 24.16 | 38.00 | 6.88 | 24.8 | 108 | 0 | 92% |
| 10 | restify | 32,515 | 30.25 | 57.00 | 5.67 | 30.9 | 124 | 0 | 74% |
| 11 | koa | 30,414 | 32.37 | 57.00 | 5.25 | 33.0 | 126 | 0 | 69% |
| 12 | hapi | 30,054 | 32.77 | 61.00 | 6.53 | 33.6 | 135 | 0 | 68% |
| 13 | tinyhttp | 23,052 | 42.87 | 82.00 | 3.76 | 58.3 | 181 | 0 | 52% |
| 14 | express | 11,425 | 86.96 | 120.00 | 1.97 | 97.7 | 165 | 0 | 26% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 110,728 | 8.45 | 13.00 | 55.12 | 8.9 | 64 | 0 | 611% |
| 2 | uws | 90,280 | 10.48 | 22.00 | 41.50 | 11.3 | 68 | 0 | 498% |
| 3 | hyper-express | 44,441 | 21.97 | 36.00 | 19.71 | 23.0 | 100 | 0 | 245% |
| 4 | 0http | 19,904 | 49.71 | 104.00 | 9.72 | 61.0 | 166 | 0 | 110% |
| 5 | node-http | 18,128 | 54.63 | 78.00 | 9.18 | 55.9 | 108 | 0 | 100% |
| 6 | h3 | 17,338 | 57.14 | 83.00 | 8.42 | 58.5 | 105 | 0 | 96% |
| 7 | fastify | 17,248 | 57.45 | 91.00 | 8.44 | 58.9 | 110 | 0 | 95% |
| 8 | hono | 16,427 | 60.34 | 90.00 | 7.79 | 61.7 | 105 | 0 | 91% |
| 9 | polka | 15,786 | 62.82 | 87.00 | 7.71 | 64.2 | 111 | 0 | 87% |
| 10 | restify | 12,336 | 80.47 | 117.00 | 6.05 | 82.3 | 113 | 0 | 68% |
| 11 | tinyhttp | 11,948 | 83.14 | 115.00 | 6.66 | 103.4 | 184 | 0 | 66% |
| 12 | koa | 10,815 | 91.87 | 128.00 | 5.28 | 93.9 | 115 | 0 | 60% |
| 13 | hapi | 9,115 | 109.06 | 146.00 | 4.67 | 110.9 | 135 | 0 | 50% |
| 14 | express | 6,241 | 159.41 | 196.00 | 3.05 | 175.1 | 166 | 0 | 34% |

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
