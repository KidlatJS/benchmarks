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
Run on 10/25/2026, 06:22:45 (Manila Time, UTC+8) · AMD EPYC 7763 64-Core Processor (4 threads, 16 GB) · Linux 6.17.0-1022-azure (x64) · Node v22.23.3

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 2.4.0 | 100,672 | 98,198 | 103,323 | 100,709 | 316% |
| 2 | uws | 20.71.0 | 104,552 | 105,818 | 87,688 | 98,994 | 311% |
| 3 | hyper-express | 7.0.2 | 104,816 | 98,350 | 44,411 | 77,072 | 242% |
| 4 | 0http | 5.2.0 | 50,418 | 48,607 | 22,243 | 37,916 | 119% |
| 5 | node-http | 22.23.3 | 43,182 | 43,443 | 17,230 | 31,854 | 100% |
| 6 | fastify | 5.12.7 | 43,476 | 42,383 | 16,799 | 31,398 | 99% |
| 7 | polka | 0.5.2 | 43,999 | 41,898 | 15,254 | 30,409 | 95% |
| 8 | h3 | 2.0.2 | 42,167 | 39,582 | 16,806 | 30,384 | 95% |
| 9 | hono | 4.13.13 | 41,387 | 40,680 | 15,910 | 29,921 | 94% |
| 10 | restify | 12.0.0 | 31,620 | 31,412 | 11,938 | 22,803 | 72% |
| 11 | koa | 3.2.1 | 29,959 | 29,198 | 10,633 | 21,030 | 66% |
| 12 | hapi | 21.4.10 | 30,471 | 29,652 | 9,076 | 20,166 | 63% |
| 13 | tinyhttp | 3.0.11 | 23,138 | 22,675 | 11,816 | 18,370 | 58% |
| 14 | express | 5.3.0 | 10,735 | 10,465 | 5,779 | 8,659 | 27% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 104,816 | 9.13 | 16.00 | 13.99 | 9.7 | 70 | 0 | 243% |
| 2 | uws | 104,552 | 9.17 | 16.00 | 15.65 | 8.6 | 58 | 0 | 242% |
| 3 | **kidlat** | 100,672 | 9.49 | 17.00 | 18.92 | 9.5 | 61 | 0 | 233% |
| 4 | 0http | 50,418 | 19.33 | 32.00 | 8.99 | 20.3 | 102 | 0 | 117% |
| 5 | polka | 43,999 | 22.23 | 37.00 | 7.85 | 22.9 | 100 | 0 | 102% |
| 6 | fastify | 43,476 | 22.49 | 37.00 | 7.80 | 23.1 | 107 | 0 | 101% |
| 7 | node-http | 43,182 | 22.65 | 37.00 | 8.48 | 23.3 | 104 | 0 | 100% |
| 8 | h3 | 42,167 | 23.22 | 39.00 | 7.40 | 23.8 | 106 | 0 | 98% |
| 9 | hono | 41,387 | 23.67 | 38.00 | 6.79 | 24.3 | 106 | 0 | 96% |
| 10 | restify | 31,620 | 31.12 | 53.00 | 5.70 | 31.9 | 114 | 0 | 73% |
| 11 | hapi | 30,471 | 32.31 | 57.00 | 6.80 | 33.3 | 121 | 0 | 71% |
| 12 | koa | 29,959 | 32.88 | 56.00 | 5.34 | 33.6 | 118 | 0 | 69% |
| 13 | tinyhttp | 23,138 | 42.70 | 83.00 | 3.91 | 59.0 | 165 | 0 | 54% |
| 14 | express | 10,735 | 92.57 | 124.00 | 1.91 | 106.5 | 167 | 0 | 25% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 105,818 | 9.04 | 13.00 | 15.24 | 8.6 | 58 | 0 | 244% |
| 2 | hyper-express | 98,350 | 9.62 | 17.00 | 12.57 | 10.4 | 78 | 0 | 226% |
| 3 | **kidlat** | 98,198 | 9.67 | 17.00 | 17.88 | 9.7 | 62 | 0 | 226% |
| 4 | 0http | 48,607 | 20.07 | 35.00 | 8.39 | 21.0 | 107 | 0 | 112% |
| 5 | node-http | 43,443 | 22.51 | 37.00 | 8.25 | 23.1 | 109 | 0 | 100% |
| 6 | fastify | 42,383 | 23.09 | 37.00 | 7.36 | 23.7 | 112 | 0 | 98% |
| 7 | polka | 41,898 | 23.38 | 37.00 | 7.23 | 24.0 | 106 | 0 | 96% |
| 8 | hono | 40,680 | 24.08 | 39.00 | 6.44 | 24.7 | 110 | 0 | 94% |
| 9 | h3 | 39,582 | 24.76 | 40.00 | 6.72 | 25.4 | 110 | 0 | 91% |
| 10 | restify | 31,412 | 31.33 | 51.00 | 5.48 | 32.0 | 124 | 0 | 72% |
| 11 | hapi | 29,652 | 33.22 | 56.00 | 6.45 | 34.1 | 141 | 0 | 68% |
| 12 | koa | 29,198 | 33.74 | 58.00 | 5.04 | 34.4 | 127 | 0 | 67% |
| 13 | tinyhttp | 22,675 | 43.59 | 81.00 | 3.70 | 60.0 | 170 | 0 | 52% |
| 14 | express | 10,465 | 94.96 | 126.00 | 1.81 | 108.5 | 165 | 0 | 24% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 103,323 | 9.32 | 17.00 | 51.43 | 9.5 | 62 | 0 | 600% |
| 2 | uws | 87,688 | 10.89 | 19.00 | 40.31 | 11.7 | 67 | 0 | 509% |
| 3 | hyper-express | 44,411 | 22.05 | 34.00 | 19.69 | 23.4 | 100 | 0 | 258% |
| 4 | 0http | 22,243 | 44.43 | 89.00 | 10.86 | 46.4 | 112 | 0 | 129% |
| 5 | node-http | 17,230 | 57.51 | 96.00 | 8.73 | 58.9 | 105 | 0 | 100% |
| 6 | h3 | 16,806 | 58.96 | 87.00 | 8.16 | 60.3 | 114 | 0 | 98% |
| 7 | fastify | 16,799 | 59.00 | 84.00 | 8.22 | 60.4 | 104 | 0 | 97% |
| 8 | hono | 15,910 | 62.32 | 93.00 | 7.54 | 63.7 | 109 | 0 | 92% |
| 9 | polka | 15,254 | 65.02 | 97.00 | 7.45 | 66.8 | 103 | 0 | 89% |
| 10 | restify | 11,938 | 83.20 | 121.00 | 5.85 | 85.0 | 112 | 0 | 69% |
| 11 | tinyhttp | 11,816 | 84.07 | 113.00 | 6.59 | 104.9 | 177 | 0 | 69% |
| 12 | koa | 10,633 | 93.46 | 128.00 | 5.19 | 95.6 | 114 | 0 | 62% |
| 13 | hapi | 9,076 | 109.51 | 139.00 | 4.65 | 111.5 | 141 | 0 | 53% |
| 14 | express | 5,779 | 172.11 | 208.00 | 2.82 | 191.2 | 166 | 0 | 34% |

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
