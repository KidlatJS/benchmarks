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
Run on 10/30/2026, 14:57:00 (Manila Time, UTC+8) · AMD EPYC 7763 64-Core Processor (4 threads, 16 GB) · Linux 7.0.0-1017-azure (x64) · Node v22.23.4

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 2.4.0 | 104,101 | 104,379 | 108,526 | 105,650 | 322% |
| 2 | uws | 20.71.0 | 99,256 | 99,466 | 88,678 | 95,664 | 291% |
| 3 | hyper-express | 7.0.2 | 107,926 | 102,571 | 46,447 | 80,113 | 244% |
| 4 | 0http | 5.2.0 | 52,806 | 51,281 | 20,996 | 38,452 | 117% |
| 5 | node-http | 22.23.4 | 44,137 | 44,460 | 18,082 | 32,860 | 100% |
| 6 | fastify | 5.12.7 | 44,873 | 43,524 | 16,890 | 32,071 | 98% |
| 7 | h3 | 2.0.2 | 43,459 | 41,087 | 17,005 | 31,197 | 95% |
| 8 | hono | 4.13.13 | 43,220 | 41,962 | 16,467 | 31,025 | 94% |
| 9 | polka | 0.5.2 | 44,884 | 42,294 | 15,347 | 30,770 | 94% |
| 10 | restify | 12.0.0 | 32,474 | 32,080 | 12,183 | 23,326 | 71% |
| 11 | koa | 3.2.1 | 31,526 | 30,663 | 10,811 | 21,863 | 67% |
| 12 | hapi | 21.4.10 | 30,900 | 30,233 | 9,261 | 20,529 | 62% |
| 13 | tinyhttp | 3.0.11 | 23,516 | 23,298 | 11,678 | 18,565 | 56% |
| 14 | express | 5.3.0 | 11,381 | 11,276 | 6,003 | 9,167 | 28% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 107,926 | 8.77 | 17.00 | 14.41 | 9.4 | 70 | 0 | 245% |
| 2 | **kidlat** | 104,101 | 9.19 | 14.00 | 19.56 | 9.3 | 61 | 0 | 236% |
| 3 | uws | 99,256 | 9.59 | 14.00 | 14.86 | 9.0 | 58 | 0 | 225% |
| 4 | 0http | 52,806 | 18.44 | 32.00 | 9.42 | 19.2 | 100 | 0 | 120% |
| 5 | polka | 44,884 | 21.79 | 36.00 | 8.00 | 22.4 | 101 | 0 | 102% |
| 6 | fastify | 44,873 | 21.79 | 36.00 | 8.05 | 22.4 | 108 | 0 | 102% |
| 7 | node-http | 44,137 | 22.16 | 37.00 | 8.67 | 22.8 | 104 | 0 | 100% |
| 8 | h3 | 43,459 | 22.51 | 38.00 | 7.63 | 23.1 | 103 | 0 | 98% |
| 9 | hono | 43,220 | 22.62 | 39.00 | 7.09 | 23.3 | 102 | 0 | 98% |
| 10 | restify | 32,474 | 30.29 | 60.00 | 5.85 | 31.0 | 113 | 0 | 74% |
| 11 | koa | 31,526 | 31.22 | 57.00 | 5.62 | 31.9 | 116 | 0 | 71% |
| 12 | hapi | 30,900 | 31.86 | 59.00 | 6.90 | 32.8 | 119 | 0 | 70% |
| 13 | tinyhttp | 23,516 | 42.02 | 86.00 | 3.97 | 57.0 | 170 | 0 | 53% |
| 14 | express | 11,381 | 87.30 | 120.00 | 2.03 | 99.1 | 161 | 0 | 26% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 104,379 | 9.14 | 11.00 | 19.01 | 9.3 | 61 | 0 | 235% |
| 2 | hyper-express | 102,571 | 9.30 | 18.00 | 13.11 | 9.9 | 78 | 0 | 231% |
| 3 | uws | 99,466 | 9.54 | 14.00 | 14.32 | 9.0 | 58 | 0 | 224% |
| 4 | 0http | 51,281 | 19.01 | 34.00 | 8.85 | 19.9 | 105 | 0 | 115% |
| 5 | node-http | 44,460 | 22.00 | 35.00 | 8.44 | 22.6 | 109 | 0 | 100% |
| 6 | fastify | 43,524 | 22.47 | 38.00 | 7.55 | 23.1 | 113 | 0 | 98% |
| 7 | polka | 42,294 | 23.14 | 41.00 | 7.30 | 23.7 | 106 | 0 | 95% |
| 8 | hono | 41,962 | 23.33 | 44.00 | 6.64 | 23.9 | 107 | 0 | 94% |
| 9 | h3 | 41,087 | 23.84 | 40.00 | 6.97 | 24.4 | 108 | 0 | 92% |
| 10 | restify | 32,080 | 30.66 | 57.00 | 5.60 | 31.3 | 124 | 0 | 72% |
| 11 | koa | 30,663 | 32.10 | 60.00 | 5.29 | 32.8 | 125 | 0 | 69% |
| 12 | hapi | 30,233 | 32.57 | 59.00 | 6.57 | 33.5 | 125 | 0 | 68% |
| 13 | tinyhttp | 23,298 | 42.42 | 83.00 | 3.80 | 57.3 | 171 | 0 | 52% |
| 14 | express | 11,276 | 88.09 | 123.00 | 1.95 | 98.9 | 164 | 0 | 25% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 108,526 | 8.67 | 15.00 | 54.03 | 9.1 | 62 | 0 | 600% |
| 2 | uws | 88,678 | 10.69 | 20.00 | 40.76 | 11.4 | 67 | 0 | 490% |
| 3 | hyper-express | 46,447 | 21.08 | 36.00 | 20.60 | 21.9 | 101 | 0 | 257% |
| 4 | 0http | 20,996 | 47.10 | 93.00 | 10.25 | 48.6 | 114 | 0 | 116% |
| 5 | node-http | 18,082 | 54.78 | 79.00 | 9.16 | 55.9 | 108 | 0 | 100% |
| 6 | h3 | 17,005 | 58.27 | 84.00 | 8.25 | 59.5 | 107 | 0 | 94% |
| 7 | fastify | 16,890 | 58.67 | 87.00 | 8.26 | 59.9 | 107 | 0 | 93% |
| 8 | hono | 16,467 | 60.17 | 91.00 | 7.80 | 61.5 | 103 | 0 | 91% |
| 9 | polka | 15,347 | 64.62 | 96.00 | 7.49 | 66.1 | 100 | 0 | 85% |
| 10 | restify | 12,183 | 81.52 | 118.00 | 5.97 | 83.1 | 119 | 0 | 67% |
| 11 | tinyhttp | 11,678 | 85.03 | 121.00 | 6.52 | 103.8 | 173 | 0 | 65% |
| 12 | koa | 10,811 | 91.91 | 131.00 | 5.28 | 93.6 | 111 | 0 | 60% |
| 13 | hapi | 9,261 | 107.36 | 142.00 | 4.74 | 108.9 | 126 | 0 | 51% |
| 14 | express | 6,003 | 165.77 | 203.00 | 2.93 | 181.5 | 165 | 0 | 33% |

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
