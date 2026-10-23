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
Run on 10/23/2026, 12:22:18 (Manila Time, UTC+8) · AMD EPYC 7763 64-Core Processor (4 threads, 16 GB) · Linux 6.17.0-1022-azure (x64) · Node v22.23.3

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 2.4.0 | 101,501 | 101,962 | 107,394 | 103,585 | 321% |
| 2 | uws | 20.71.0 | 106,794 | 111,525 | 88,909 | 101,927 | 316% |
| 3 | hyper-express | 7.0.2 | 107,139 | 101,469 | 47,073 | 79,987 | 248% |
| 4 | 0http | 5.2.0 | 44,209 | 43,545 | 19,893 | 33,707 | 104% |
| 5 | node-http | 22.23.3 | 44,814 | 44,523 | 16,853 | 32,277 | 100% |
| 6 | fastify | 5.12.7 | 44,650 | 43,470 | 16,707 | 31,889 | 99% |
| 7 | polka | 0.5.2 | 44,652 | 41,904 | 15,246 | 30,555 | 95% |
| 8 | hono | 4.13.13 | 42,228 | 40,535 | 16,279 | 30,317 | 94% |
| 9 | h3 | 2.0.2 | 42,650 | 39,936 | 16,340 | 30,305 | 94% |
| 10 | restify | 12.0.0 | 32,436 | 32,110 | 12,261 | 23,374 | 72% |
| 11 | koa | 3.2.1 | 30,875 | 30,363 | 10,600 | 21,499 | 67% |
| 12 | hapi | 21.4.10 | 30,760 | 30,038 | 9,189 | 20,401 | 63% |
| 13 | tinyhttp | 3.0.11 | 23,788 | 23,250 | 11,865 | 18,722 | 58% |
| 14 | express | 5.3.0 | 11,140 | 10,909 | 5,994 | 8,998 | 28% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 107,139 | 8.80 | 17.00 | 14.31 | 9.5 | 70 | 0 | 239% |
| 2 | uws | 106,794 | 8.98 | 15.00 | 15.99 | 8.4 | 58 | 0 | 238% |
| 3 | **kidlat** | 101,501 | 9.42 | 16.00 | 19.07 | 9.3 | 61 | 0 | 226% |
| 4 | node-http | 44,814 | 21.82 | 37.00 | 8.80 | 22.4 | 104 | 0 | 100% |
| 5 | polka | 44,652 | 21.90 | 36.00 | 7.96 | 22.5 | 100 | 0 | 100% |
| 6 | fastify | 44,650 | 21.91 | 36.00 | 8.01 | 22.5 | 103 | 0 | 100% |
| 7 | 0http | 44,209 | 22.13 | 47.00 | 7.88 | 28.5 | 145 | 0 | 99% |
| 8 | h3 | 42,650 | 22.94 | 39.00 | 7.48 | 23.6 | 105 | 0 | 95% |
| 9 | hono | 42,228 | 23.18 | 38.00 | 6.93 | 23.8 | 106 | 0 | 94% |
| 10 | restify | 32,436 | 30.33 | 52.00 | 5.85 | 31.1 | 113 | 0 | 72% |
| 11 | koa | 30,875 | 31.88 | 55.00 | 5.51 | 32.6 | 114 | 0 | 69% |
| 12 | hapi | 30,760 | 32.00 | 58.00 | 6.86 | 33.0 | 118 | 0 | 69% |
| 13 | tinyhttp | 23,788 | 41.53 | 84.00 | 4.02 | 58.2 | 167 | 0 | 53% |
| 14 | express | 11,140 | 89.19 | 118.00 | 1.99 | 101.1 | 161 | 0 | 25% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 111,525 | 8.45 | 11.00 | 16.06 | 8.3 | 59 | 0 | 250% |
| 2 | **kidlat** | 101,962 | 9.34 | 15.00 | 18.57 | 9.4 | 61 | 0 | 229% |
| 3 | hyper-express | 101,469 | 9.43 | 18.00 | 12.97 | 10.0 | 78 | 0 | 228% |
| 4 | node-http | 44,523 | 21.96 | 36.00 | 8.45 | 22.5 | 108 | 0 | 100% |
| 5 | 0http | 43,545 | 22.47 | 48.00 | 7.52 | 28.9 | 145 | 0 | 98% |
| 6 | fastify | 43,470 | 22.50 | 38.00 | 7.54 | 23.1 | 108 | 0 | 98% |
| 7 | polka | 41,904 | 23.37 | 37.00 | 7.23 | 23.9 | 106 | 0 | 94% |
| 8 | hono | 40,535 | 24.16 | 40.00 | 6.42 | 24.8 | 111 | 0 | 91% |
| 9 | h3 | 39,936 | 24.53 | 39.00 | 6.78 | 25.1 | 110 | 0 | 90% |
| 10 | restify | 32,110 | 30.63 | 52.00 | 5.60 | 31.3 | 123 | 0 | 72% |
| 11 | koa | 30,363 | 32.43 | 55.00 | 5.24 | 33.1 | 123 | 0 | 68% |
| 12 | hapi | 30,038 | 32.78 | 56.00 | 6.53 | 33.7 | 130 | 0 | 67% |
| 13 | tinyhttp | 23,250 | 42.50 | 83.00 | 3.79 | 58.8 | 169 | 0 | 52% |
| 14 | express | 10,909 | 91.07 | 117.00 | 1.88 | 102.6 | 162 | 0 | 25% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 107,394 | 8.88 | 14.00 | 53.46 | 9.1 | 62 | 0 | 637% |
| 2 | uws | 88,909 | 10.68 | 20.00 | 40.87 | 11.4 | 67 | 0 | 528% |
| 3 | hyper-express | 47,073 | 20.76 | 32.00 | 20.87 | 21.8 | 98 | 0 | 279% |
| 4 | 0http | 19,893 | 49.73 | 102.00 | 9.71 | 61.5 | 165 | 0 | 118% |
| 5 | node-http | 16,853 | 58.78 | 97.00 | 8.53 | 60.1 | 106 | 0 | 100% |
| 6 | fastify | 16,707 | 59.32 | 89.00 | 8.17 | 60.6 | 110 | 0 | 99% |
| 7 | h3 | 16,340 | 60.67 | 90.00 | 7.93 | 62.0 | 107 | 0 | 97% |
| 8 | hono | 16,279 | 60.90 | 88.00 | 7.72 | 62.3 | 110 | 0 | 97% |
| 9 | polka | 15,246 | 65.05 | 95.00 | 7.44 | 66.6 | 102 | 0 | 90% |
| 10 | restify | 12,261 | 80.98 | 111.00 | 6.01 | 82.6 | 112 | 0 | 73% |
| 11 | tinyhttp | 11,865 | 83.72 | 110.00 | 6.62 | 103.8 | 171 | 0 | 70% |
| 12 | koa | 10,600 | 93.75 | 125.00 | 5.18 | 95.7 | 113 | 0 | 63% |
| 13 | hapi | 9,189 | 108.20 | 139.00 | 4.71 | 110.0 | 138 | 0 | 55% |
| 14 | express | 5,994 | 166.05 | 199.00 | 2.93 | 183.3 | 161 | 0 | 36% |

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
