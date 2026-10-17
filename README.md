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
Run on 10/18/2026, 00:17:06 (Manila Time, UTC+8) · INTEL(R) XEON(R) PLATINUM 8573C (4 threads, 16 GB) · Linux 6.17.0-1022-azure (x64) · Node v22.23.3

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | uws | 20.71.0 | 147,473 | 149,299 | 127,456 | 141,051 | 226% |
| 2 | **kidlat** | 2.4.0 | 129,121 | 132,275 | 151,123 | 137,173 | 220% |
| 3 | hyper-express | 7.0.2 | 167,238 | 152,992 | 75,605 | 124,600 | 199% |
| 4 | 0http | 5.2.0 | 85,269 | 84,005 | 45,334 | 68,734 | 110% |
| 5 | node-http | 22.23.3 | 76,429 | 75,554 | 42,253 | 62,487 | 100% |
| 6 | fastify | 5.12.7 | 76,250 | 75,632 | 40,009 | 61,334 | 98% |
| 7 | h3 | 2.0.2 | 75,237 | 72,133 | 37,846 | 59,001 | 94% |
| 8 | polka | 0.5.2 | 78,515 | 75,229 | 34,610 | 58,909 | 94% |
| 9 | hono | 4.13.13 | 76,814 | 73,160 | 36,358 | 58,898 | 94% |
| 10 | restify | 12.0.0 | 54,514 | 53,898 | 27,247 | 43,099 | 69% |
| 11 | koa | 3.2.1 | 55,314 | 55,668 | 25,172 | 42,637 | 68% |
| 12 | hapi | 21.4.10 | 49,845 | 48,065 | 21,568 | 37,246 | 60% |
| 13 | tinyhttp | 3.0.11 | 38,114 | 38,101 | 23,640 | 32,500 | 52% |
| 14 | express | 5.3.0 | 16,309 | 16,300 | 10,627 | 14,137 | 23% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 167,238 | 5.43 | 8.00 | 22.33 | 6.2 | 79 | 0 | 219% |
| 2 | uws | 147,473 | 6.27 | 9.00 | 22.08 | 5.9 | 58 | 0 | 193% |
| 3 | **kidlat** | 129,121 | 7.33 | 11.00 | 24.26 | 6.6 | 61 | 0 | 169% |
| 4 | 0http | 85,269 | 11.23 | 17.00 | 15.21 | 12.1 | 103 | 0 | 112% |
| 5 | polka | 78,515 | 12.25 | 20.00 | 14.00 | 12.8 | 100 | 0 | 103% |
| 6 | hono | 76,814 | 12.51 | 20.00 | 12.60 | 13.1 | 107 | 0 | 101% |
| 7 | node-http | 76,429 | 12.58 | 20.00 | 15.02 | 13.2 | 101 | 0 | 100% |
| 8 | fastify | 76,250 | 12.61 | 21.00 | 13.67 | 13.2 | 106 | 0 | 100% |
| 9 | h3 | 75,237 | 12.79 | 22.00 | 13.20 | 13.4 | 106 | 0 | 98% |
| 10 | koa | 55,314 | 17.58 | 31.00 | 9.87 | 18.3 | 112 | 0 | 72% |
| 11 | restify | 54,514 | 17.84 | 30.00 | 9.83 | 18.6 | 115 | 0 | 71% |
| 12 | hapi | 49,845 | 19.56 | 33.00 | 11.12 | 20.5 | 131 | 0 | 65% |
| 13 | tinyhttp | 38,114 | 25.74 | 51.00 | 6.43 | 42.9 | 182 | 0 | 50% |
| 14 | express | 16,309 | 60.78 | 79.00 | 2.91 | 72.3 | 167 | 0 | 21% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 152,992 | 6.11 | 10.00 | 19.55 | 6.7 | 79 | 0 | 202% |
| 2 | uws | 149,299 | 6.24 | 9.00 | 21.50 | 5.9 | 60 | 0 | 198% |
| 3 | **kidlat** | 132,275 | 7.18 | 11.00 | 24.10 | 6.5 | 61 | 0 | 175% |
| 4 | 0http | 84,005 | 11.41 | 17.00 | 14.50 | 12.5 | 107 | 0 | 111% |
| 5 | fastify | 75,632 | 12.72 | 20.00 | 13.13 | 13.3 | 111 | 0 | 100% |
| 6 | node-http | 75,554 | 12.74 | 21.00 | 14.34 | 13.3 | 106 | 0 | 100% |
| 7 | polka | 75,229 | 12.79 | 20.00 | 12.99 | 13.4 | 106 | 0 | 100% |
| 8 | hono | 73,160 | 13.16 | 21.00 | 11.58 | 13.8 | 111 | 0 | 97% |
| 9 | h3 | 72,133 | 13.37 | 22.00 | 12.24 | 13.9 | 111 | 0 | 95% |
| 10 | koa | 55,668 | 17.47 | 30.00 | 9.61 | 18.1 | 123 | 0 | 74% |
| 11 | restify | 53,898 | 18.06 | 31.00 | 9.41 | 18.7 | 124 | 0 | 71% |
| 12 | hapi | 48,065 | 20.33 | 36.00 | 10.45 | 21.4 | 137 | 0 | 64% |
| 13 | tinyhttp | 38,101 | 25.75 | 49.00 | 6.21 | 42.8 | 182 | 0 | 50% |
| 14 | express | 16,300 | 60.82 | 81.00 | 2.81 | 71.8 | 169 | 0 | 22% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 151,123 | 6.21 | 10.00 | 75.24 | 6.4 | 63 | 0 | 358% |
| 2 | uws | 127,456 | 7.33 | 11.00 | 58.58 | 8.1 | 67 | 0 | 302% |
| 3 | hyper-express | 75,605 | 12.72 | 18.00 | 33.53 | 13.8 | 99 | 0 | 179% |
| 4 | 0http | 45,334 | 21.56 | 43.00 | 22.14 | 23.3 | 105 | 0 | 107% |
| 5 | node-http | 42,253 | 23.17 | 47.00 | 21.40 | 24.2 | 107 | 0 | 100% |
| 6 | fastify | 40,009 | 24.49 | 50.00 | 19.57 | 25.6 | 111 | 0 | 95% |
| 7 | h3 | 37,846 | 25.92 | 53.00 | 18.37 | 27.0 | 113 | 0 | 90% |
| 8 | hono | 36,358 | 27.00 | 54.00 | 17.23 | 28.1 | 117 | 0 | 86% |
| 9 | polka | 34,610 | 28.39 | 57.00 | 16.90 | 29.8 | 99 | 0 | 82% |
| 10 | restify | 27,247 | 36.19 | 71.00 | 13.36 | 37.5 | 113 | 0 | 64% |
| 11 | koa | 25,172 | 39.21 | 76.00 | 12.29 | 40.8 | 118 | 0 | 60% |
| 12 | tinyhttp | 23,640 | 41.80 | 82.00 | 13.19 | 63.1 | 187 | 0 | 56% |
| 13 | hapi | 21,568 | 45.84 | 79.00 | 11.05 | 47.1 | 142 | 0 | 51% |
| 14 | express | 10,627 | 93.50 | 123.00 | 5.19 | 109.3 | 178 | 0 | 25% |

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
