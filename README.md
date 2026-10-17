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
Run on 10/17/2026, 20:52:38 (Manila Time, UTC+8) · AMD EPYC 7763 64-Core Processor (4 threads, 16 GB) · Linux 6.17.0-1022-azure (x64) · Node v22.23.3

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 2.4.0 | 104,646 | 103,174 | 109,106 | 105,612 | 322% |
| 2 | uws | 20.71.0 | 109,171 | 113,154 | 92,885 | 104,690 | 320% |
| 3 | hyper-express | 7.0.2 | 108,533 | 103,203 | 47,377 | 80,961 | 247% |
| 4 | 0http | 5.2.0 | 51,361 | 49,378 | 20,922 | 37,577 | 115% |
| 5 | fastify | 5.12.7 | 46,382 | 45,250 | 17,829 | 33,447 | 102% |
| 6 | node-http | 22.23.3 | 45,381 | 44,857 | 17,271 | 32,760 | 100% |
| 7 | h3 | 2.0.2 | 43,767 | 41,409 | 17,116 | 31,420 | 96% |
| 8 | polka | 0.5.2 | 45,397 | 42,860 | 15,861 | 31,367 | 96% |
| 9 | hono | 4.13.13 | 43,026 | 41,922 | 16,754 | 31,148 | 95% |
| 10 | restify | 12.0.0 | 33,413 | 32,950 | 12,517 | 23,975 | 73% |
| 11 | koa | 3.2.1 | 31,549 | 30,825 | 11,311 | 22,240 | 68% |
| 12 | hapi | 21.4.10 | 31,424 | 30,578 | 9,493 | 20,894 | 64% |
| 13 | tinyhttp | 3.0.11 | 24,525 | 24,160 | 12,003 | 19,231 | 59% |
| 14 | express | 5.3.0 | 11,351 | 11,245 | 6,177 | 9,238 | 28% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 109,171 | 8.65 | 14.00 | 16.35 | 8.2 | 58 | 0 | 241% |
| 2 | hyper-express | 108,533 | 8.72 | 15.00 | 14.49 | 9.3 | 70 | 0 | 239% |
| 3 | **kidlat** | 104,646 | 9.19 | 15.00 | 19.66 | 9.3 | 62 | 0 | 231% |
| 4 | 0http | 51,361 | 18.97 | 31.00 | 9.16 | 19.8 | 100 | 0 | 113% |
| 5 | fastify | 46,382 | 21.03 | 33.00 | 8.32 | 21.7 | 103 | 0 | 102% |
| 6 | polka | 45,397 | 21.56 | 34.00 | 8.10 | 22.1 | 99 | 0 | 100% |
| 7 | node-http | 45,381 | 21.56 | 35.00 | 8.92 | 22.2 | 101 | 0 | 100% |
| 8 | h3 | 43,767 | 22.34 | 36.00 | 7.68 | 23.0 | 107 | 0 | 96% |
| 9 | hono | 43,026 | 22.73 | 38.00 | 7.06 | 23.4 | 106 | 0 | 95% |
| 10 | restify | 33,413 | 29.42 | 49.00 | 6.02 | 30.2 | 113 | 0 | 74% |
| 11 | koa | 31,549 | 31.19 | 52.00 | 5.63 | 31.9 | 117 | 0 | 70% |
| 12 | hapi | 31,424 | 31.31 | 54.00 | 7.01 | 32.2 | 125 | 0 | 69% |
| 13 | tinyhttp | 24,525 | 40.27 | 77.00 | 4.14 | 54.9 | 178 | 0 | 54% |
| 14 | express | 11,351 | 87.53 | 118.00 | 2.02 | 99.5 | 168 | 0 | 25% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 113,154 | 8.31 | 12.00 | 16.29 | 8.1 | 59 | 0 | 252% |
| 2 | hyper-express | 103,203 | 9.21 | 16.00 | 13.19 | 9.8 | 78 | 0 | 230% |
| 3 | **kidlat** | 103,174 | 9.23 | 15.00 | 18.79 | 9.4 | 62 | 0 | 230% |
| 4 | 0http | 49,378 | 19.74 | 35.00 | 8.52 | 20.7 | 104 | 0 | 110% |
| 5 | fastify | 45,250 | 21.64 | 30.00 | 7.85 | 22.2 | 108 | 0 | 101% |
| 6 | node-http | 44,857 | 21.79 | 35.00 | 8.51 | 22.4 | 106 | 0 | 100% |
| 7 | polka | 42,860 | 22.82 | 36.00 | 7.40 | 23.4 | 104 | 0 | 96% |
| 8 | hono | 41,922 | 23.37 | 37.00 | 6.64 | 24.0 | 111 | 0 | 93% |
| 9 | h3 | 41,409 | 23.66 | 38.00 | 7.03 | 24.2 | 111 | 0 | 92% |
| 10 | restify | 32,950 | 29.84 | 51.00 | 5.75 | 30.5 | 124 | 0 | 73% |
| 11 | koa | 30,825 | 31.94 | 53.00 | 5.32 | 32.6 | 127 | 0 | 69% |
| 12 | hapi | 30,578 | 32.19 | 55.00 | 6.65 | 33.1 | 133 | 0 | 68% |
| 13 | tinyhttp | 24,160 | 40.87 | 75.00 | 3.94 | 55.7 | 178 | 0 | 54% |
| 14 | express | 11,245 | 88.36 | 115.00 | 1.94 | 99.6 | 167 | 0 | 25% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 109,106 | 8.63 | 14.00 | 54.32 | 9.0 | 62 | 0 | 632% |
| 2 | uws | 92,885 | 10.25 | 16.00 | 42.69 | 10.9 | 67 | 0 | 538% |
| 3 | hyper-express | 47,377 | 20.60 | 31.00 | 21.01 | 21.5 | 99 | 0 | 274% |
| 4 | 0http | 20,922 | 47.27 | 101.00 | 10.22 | 50.4 | 170 | 0 | 121% |
| 5 | fastify | 17,829 | 55.54 | 80.00 | 8.72 | 56.7 | 106 | 0 | 103% |
| 6 | node-http | 17,271 | 57.37 | 95.00 | 8.75 | 58.5 | 101 | 0 | 100% |
| 7 | h3 | 17,116 | 57.89 | 83.00 | 8.31 | 59.1 | 108 | 0 | 99% |
| 8 | hono | 16,754 | 59.15 | 86.00 | 7.94 | 60.5 | 103 | 0 | 97% |
| 9 | polka | 15,861 | 62.52 | 87.00 | 7.74 | 64.0 | 98 | 0 | 92% |
| 10 | restify | 12,517 | 79.31 | 116.00 | 6.14 | 80.9 | 112 | 0 | 72% |
| 11 | tinyhttp | 12,003 | 82.75 | 110.00 | 6.70 | 102.2 | 182 | 0 | 70% |
| 12 | koa | 11,311 | 87.83 | 119.00 | 5.52 | 89.6 | 116 | 0 | 65% |
| 13 | hapi | 9,493 | 104.72 | 136.00 | 4.86 | 106.4 | 141 | 0 | 55% |
| 14 | express | 6,177 | 161.11 | 191.00 | 3.02 | 177.6 | 166 | 0 | 36% |

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
