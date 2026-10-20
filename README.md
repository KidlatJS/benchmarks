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
Run on 10/20/2026, 13:49:49 (Manila Time, UTC+8) · AMD EPYC 7763 64-Core Processor (4 threads, 16 GB) · Linux 7.0.0-1017-azure (x64) · Node v22.23.3

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 2.4.0 | 94,982 | 98,733 | 103,886 | 99,134 | 301% |
| 2 | uws | 20.71.0 | 96,979 | 98,760 | 88,491 | 94,635 | 288% |
| 3 | hyper-express | 7.0.2 | 107,368 | 103,022 | 44,405 | 78,900 | 240% |
| 4 | 0http | 5.2.0 | 49,897 | 47,898 | 20,837 | 36,791 | 112% |
| 5 | node-http | 22.23.3 | 44,128 | 44,331 | 18,172 | 32,881 | 100% |
| 6 | fastify | 5.12.7 | 43,070 | 42,814 | 17,469 | 31,818 | 97% |
| 7 | polka | 0.5.2 | 45,069 | 42,325 | 15,896 | 31,183 | 95% |
| 8 | h3 | 2.0.2 | 41,858 | 39,810 | 17,044 | 30,510 | 93% |
| 9 | hono | 4.13.13 | 41,917 | 41,106 | 16,199 | 30,334 | 92% |
| 10 | restify | 12.0.0 | 32,207 | 31,668 | 12,712 | 23,492 | 71% |
| 11 | koa | 3.2.1 | 30,650 | 30,146 | 10,928 | 21,614 | 66% |
| 12 | hapi | 21.4.10 | 31,322 | 30,051 | 9,136 | 20,487 | 62% |
| 13 | tinyhttp | 3.0.11 | 23,085 | 22,814 | 12,006 | 18,492 | 56% |
| 14 | express | 5.3.0 | 11,203 | 10,977 | 6,107 | 9,090 | 28% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 107,368 | 8.81 | 17.00 | 14.33 | 9.4 | 71 | 0 | 243% |
| 2 | uws | 96,979 | 9.92 | 14.00 | 14.52 | 9.3 | 58 | 0 | 220% |
| 3 | **kidlat** | 94,982 | 10.08 | 16.00 | 17.85 | 9.9 | 61 | 0 | 215% |
| 4 | 0http | 49,897 | 19.54 | 32.00 | 8.90 | 20.4 | 104 | 0 | 113% |
| 5 | polka | 45,069 | 21.70 | 35.00 | 8.04 | 22.3 | 101 | 0 | 102% |
| 6 | node-http | 44,128 | 22.16 | 38.00 | 8.67 | 22.8 | 101 | 0 | 100% |
| 7 | fastify | 43,070 | 22.71 | 44.00 | 7.72 | 23.4 | 106 | 0 | 98% |
| 8 | hono | 41,917 | 23.36 | 42.00 | 6.88 | 24.0 | 103 | 0 | 95% |
| 9 | h3 | 41,858 | 23.39 | 42.00 | 7.35 | 24.0 | 103 | 0 | 95% |
| 10 | restify | 32,207 | 30.54 | 57.00 | 5.81 | 31.3 | 113 | 0 | 73% |
| 11 | hapi | 31,322 | 31.41 | 56.00 | 6.99 | 32.4 | 119 | 0 | 71% |
| 12 | koa | 30,650 | 32.12 | 60.00 | 5.47 | 32.9 | 116 | 0 | 69% |
| 13 | tinyhttp | 23,085 | 42.82 | 90.00 | 3.90 | 60.7 | 175 | 0 | 52% |
| 14 | express | 11,203 | 88.70 | 120.00 | 2.00 | 101.4 | 155 | 0 | 25% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 103,022 | 9.23 | 16.00 | 13.17 | 9.8 | 79 | 0 | 232% |
| 2 | uws | 98,760 | 9.65 | 12.00 | 14.22 | 9.2 | 58 | 0 | 223% |
| 3 | **kidlat** | 98,733 | 9.66 | 16.00 | 17.98 | 9.7 | 61 | 0 | 223% |
| 4 | 0http | 47,898 | 20.37 | 37.00 | 8.27 | 21.4 | 108 | 0 | 108% |
| 5 | node-http | 44,331 | 22.05 | 33.00 | 8.41 | 22.6 | 106 | 0 | 100% |
| 6 | fastify | 42,814 | 22.85 | 39.00 | 7.43 | 23.5 | 112 | 0 | 97% |
| 7 | polka | 42,325 | 23.12 | 41.00 | 7.31 | 23.7 | 106 | 0 | 95% |
| 8 | hono | 41,106 | 23.82 | 41.00 | 6.51 | 24.4 | 107 | 0 | 93% |
| 9 | h3 | 39,810 | 24.61 | 42.00 | 6.76 | 25.2 | 108 | 0 | 90% |
| 10 | restify | 31,668 | 31.07 | 58.00 | 5.53 | 31.8 | 124 | 0 | 71% |
| 11 | koa | 30,146 | 32.66 | 58.00 | 5.20 | 33.3 | 124 | 0 | 68% |
| 12 | hapi | 30,051 | 32.76 | 61.00 | 6.53 | 33.7 | 121 | 0 | 68% |
| 13 | tinyhttp | 22,814 | 43.33 | 84.00 | 3.72 | 61.5 | 175 | 0 | 51% |
| 14 | express | 10,977 | 90.52 | 122.00 | 1.89 | 102.5 | 155 | 0 | 25% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 103,886 | 9.23 | 15.00 | 51.71 | 9.4 | 62 | 0 | 572% |
| 2 | uws | 88,491 | 10.82 | 18.00 | 40.68 | 11.5 | 67 | 0 | 487% |
| 3 | hyper-express | 44,405 | 22.04 | 36.00 | 19.69 | 23.0 | 100 | 0 | 244% |
| 4 | 0http | 20,837 | 47.47 | 96.00 | 10.17 | 49.5 | 107 | 0 | 115% |
| 5 | node-http | 18,172 | 54.49 | 79.00 | 9.20 | 55.8 | 106 | 0 | 100% |
| 6 | fastify | 17,469 | 56.71 | 81.00 | 8.55 | 58.0 | 111 | 0 | 96% |
| 7 | h3 | 17,044 | 58.13 | 82.00 | 8.27 | 59.4 | 103 | 0 | 94% |
| 8 | hono | 16,199 | 61.20 | 94.00 | 7.68 | 62.6 | 108 | 0 | 89% |
| 9 | polka | 15,896 | 62.37 | 89.00 | 7.76 | 64.0 | 97 | 0 | 87% |
| 10 | restify | 12,712 | 78.10 | 110.00 | 6.23 | 79.9 | 112 | 0 | 70% |
| 11 | tinyhttp | 12,006 | 82.70 | 118.00 | 6.70 | 104.5 | 178 | 0 | 66% |
| 12 | koa | 10,928 | 90.93 | 125.00 | 5.34 | 93.0 | 114 | 0 | 60% |
| 13 | hapi | 9,136 | 108.81 | 145.00 | 4.68 | 110.6 | 122 | 0 | 50% |
| 14 | express | 6,107 | 162.94 | 202.00 | 2.98 | 180.6 | 156 | 0 | 34% |

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
