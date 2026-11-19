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
Run on 11/19/2026, 11:05:38 (Manila Time, UTC+8) · AMD EPYC 9V74 80-Core Processor (4 threads, 16 GB) · Linux 7.0.0-1019-azure (x64) · Node v22.23.4

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | uws | 20.71.0 | 156,016 | 157,158 | 135,931 | 149,374 | 287% |
| 2 | **kidlat** | 2.6.0 | 142,442 | 143,635 | 150,496 | 145,481 | 280% |
| 3 | hyper-express | 7.0.2 | 149,280 | 139,122 | 75,934 | 116,398 | 224% |
| 4 | 0http | 5.2.0 | 70,411 | 69,094 | 35,498 | 55,688 | 107% |
| 5 | fastify | 5.12.7 | 69,469 | 67,290 | 32,255 | 53,225 | 102% |
| 6 | node-http | 22.23.4 | 65,337 | 64,938 | 33,176 | 52,019 | 100% |
| 7 | h3 | 2.0.2 | 68,191 | 63,146 | 30,705 | 50,944 | 98% |
| 8 | polka | 0.5.2 | 66,825 | 67,820 | 29,003 | 50,845 | 98% |
| 9 | hono | 4.13.13 | 68,056 | 65,446 | 29,300 | 50,723 | 98% |
| 10 | restify | 12.0.0 | 50,138 | 48,876 | 22,146 | 37,860 | 73% |
| 11 | koa | 3.2.1 | 50,840 | 49,552 | 19,659 | 36,724 | 71% |
| 12 | hapi | 21.4.10 | 44,478 | 42,869 | 15,298 | 30,783 | 59% |
| 13 | tinyhttp | 3.0.11 | 36,179 | 36,581 | 20,230 | 29,916 | 58% |
| 14 | express | 5.3.0 | 16,058 | 16,258 | 8,944 | 13,267 | 26% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 156,016 | 6.00 | 10.00 | 23.36 | 6.1 | 58 | 0 | 239% |
| 2 | hyper-express | 149,280 | 6.17 | 11.00 | 19.93 | 6.8 | 71 | 0 | 228% |
| 3 | **kidlat** | 142,442 | 6.42 | 10.00 | 26.76 | 6.8 | 63 | 0 | 218% |
| 4 | 0http | 70,411 | 13.72 | 26.00 | 12.56 | 14.5 | 105 | 0 | 108% |
| 5 | fastify | 69,469 | 13.92 | 26.00 | 12.46 | 14.5 | 105 | 0 | 106% |
| 6 | h3 | 68,191 | 14.21 | 27.00 | 11.97 | 14.7 | 103 | 0 | 104% |
| 7 | hono | 68,056 | 14.21 | 28.00 | 11.16 | 14.8 | 105 | 0 | 104% |
| 8 | polka | 66,825 | 14.46 | 28.00 | 11.92 | 15.1 | 101 | 0 | 102% |
| 9 | node-http | 65,337 | 14.80 | 28.00 | 12.84 | 15.4 | 106 | 0 | 100% |
| 10 | koa | 50,840 | 19.17 | 38.00 | 9.07 | 19.8 | 121 | 0 | 78% |
| 11 | restify | 50,138 | 19.44 | 40.00 | 9.04 | 20.1 | 113 | 0 | 77% |
| 12 | hapi | 44,478 | 22.01 | 45.00 | 9.93 | 22.9 | 121 | 0 | 68% |
| 13 | tinyhttp | 36,179 | 27.14 | 57.00 | 6.11 | 40.5 | 183 | 0 | 55% |
| 14 | express | 16,058 | 61.74 | 85.00 | 2.86 | 73.7 | 169 | 0 | 25% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 157,158 | 5.98 | 9.00 | 22.63 | 6.1 | 59 | 0 | 242% |
| 2 | **kidlat** | 143,635 | 6.33 | 10.00 | 26.17 | 6.7 | 64 | 0 | 221% |
| 3 | hyper-express | 139,122 | 6.63 | 12.00 | 17.78 | 7.3 | 78 | 0 | 214% |
| 4 | 0http | 69,094 | 13.96 | 26.00 | 11.93 | 14.8 | 109 | 0 | 106% |
| 5 | polka | 67,820 | 14.26 | 27.00 | 11.71 | 14.8 | 107 | 0 | 104% |
| 6 | fastify | 67,290 | 14.39 | 30.00 | 11.68 | 14.9 | 111 | 0 | 104% |
| 7 | hono | 65,446 | 14.76 | 30.00 | 10.36 | 15.4 | 110 | 0 | 101% |
| 8 | node-http | 64,938 | 14.89 | 29.00 | 12.32 | 15.5 | 110 | 0 | 100% |
| 9 | h3 | 63,146 | 15.31 | 32.00 | 10.72 | 15.9 | 109 | 0 | 97% |
| 10 | koa | 49,552 | 19.66 | 40.00 | 8.55 | 20.3 | 130 | 0 | 76% |
| 11 | restify | 48,876 | 19.95 | 41.00 | 8.53 | 20.6 | 124 | 0 | 75% |
| 12 | hapi | 42,869 | 22.80 | 48.00 | 9.32 | 23.7 | 139 | 0 | 66% |
| 13 | tinyhttp | 36,581 | 26.83 | 55.00 | 5.97 | 40.2 | 183 | 0 | 56% |
| 14 | express | 16,258 | 60.95 | 83.00 | 2.81 | 71.3 | 168 | 0 | 25% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 150,496 | 6.13 | 9.00 | 74.92 | 6.5 | 68 | 0 | 454% |
| 2 | uws | 135,931 | 7.04 | 12.00 | 62.48 | 7.6 | 67 | 0 | 410% |
| 3 | hyper-express | 75,934 | 12.75 | 21.00 | 33.68 | 13.6 | 101 | 0 | 229% |
| 4 | 0http | 35,498 | 27.67 | 61.00 | 17.33 | 29.3 | 111 | 0 | 107% |
| 5 | node-http | 33,176 | 29.63 | 61.00 | 16.80 | 30.8 | 104 | 0 | 100% |
| 6 | fastify | 32,255 | 30.49 | 64.00 | 15.78 | 31.5 | 111 | 0 | 97% |
| 7 | h3 | 30,705 | 32.06 | 66.00 | 14.90 | 33.1 | 113 | 0 | 93% |
| 8 | hono | 29,300 | 33.63 | 68.00 | 13.89 | 34.7 | 118 | 0 | 88% |
| 9 | polka | 29,003 | 33.97 | 69.00 | 14.16 | 35.2 | 111 | 0 | 87% |
| 10 | restify | 22,146 | 44.63 | 79.00 | 10.86 | 46.0 | 120 | 0 | 67% |
| 11 | tinyhttp | 20,230 | 48.91 | 82.00 | 11.29 | 66.6 | 187 | 0 | 61% |
| 12 | koa | 19,659 | 50.35 | 85.00 | 9.60 | 51.7 | 117 | 0 | 59% |
| 13 | hapi | 15,298 | 64.80 | 97.00 | 7.83 | 66.4 | 140 | 0 | 46% |
| 14 | express | 8,944 | 111.20 | 146.00 | 4.37 | 126.3 | 169 | 0 | 27% |

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
