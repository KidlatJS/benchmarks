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
Run on 11/19/2026, 05:16:57 (Manila Time, UTC+8) · Intel(R) Xeon(R) Platinum 8370C CPU @ 2.80GHz (4 threads, 16 GB) · Linux 7.0.0-1019-azure (x64) · Node v22.23.4

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | uws | 20.71.0 | 129,334 | 129,414 | 104,576 | 120,515 | 248% |
| 2 | **kidlat** | 2.6.0 | 113,392 | 114,784 | 128,545 | 118,715 | 244% |
| 3 | hyper-express | 7.0.2 | 126,804 | 122,096 | 56,850 | 95,835 | 197% |
| 4 | 0http | 5.2.0 | 69,134 | 69,035 | 31,417 | 53,127 | 109% |
| 5 | node-http | 22.23.4 | 64,516 | 64,453 | 27,576 | 48,583 | 100% |
| 6 | fastify | 5.12.7 | 62,464 | 61,552 | 26,706 | 46,827 | 96% |
| 7 | h3 | 2.0.2 | 62,510 | 59,171 | 26,149 | 45,903 | 94% |
| 8 | polka | 0.5.2 | 65,120 | 60,828 | 23,714 | 45,457 | 94% |
| 9 | hono | 4.13.13 | 61,628 | 58,614 | 24,673 | 44,668 | 92% |
| 10 | restify | 12.0.0 | 44,656 | 44,100 | 18,966 | 33,427 | 69% |
| 11 | koa | 3.2.1 | 43,221 | 42,699 | 16,844 | 31,443 | 65% |
| 12 | hapi | 21.4.10 | 40,038 | 38,357 | 13,600 | 27,539 | 57% |
| 13 | tinyhttp | 3.0.11 | 31,075 | 30,484 | 17,724 | 25,606 | 53% |
| 14 | express | 5.3.0 | 13,242 | 13,077 | 7,701 | 11,007 | 23% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 129,334 | 7.25 | 12.00 | 19.37 | 6.9 | 58 | 0 | 200% |
| 2 | hyper-express | 126,804 | 7.35 | 12.00 | 16.93 | 8.2 | 70 | 0 | 197% |
| 3 | **kidlat** | 113,392 | 8.36 | 14.00 | 21.30 | 7.5 | 64 | 0 | 176% |
| 4 | 0http | 69,134 | 13.97 | 21.00 | 12.33 | 15.0 | 102 | 0 | 107% |
| 5 | polka | 65,120 | 14.86 | 24.00 | 11.61 | 15.5 | 101 | 0 | 101% |
| 6 | node-http | 64,516 | 15.01 | 25.00 | 12.68 | 15.6 | 102 | 0 | 100% |
| 7 | h3 | 62,510 | 15.51 | 26.00 | 10.97 | 16.1 | 107 | 0 | 97% |
| 8 | fastify | 62,464 | 15.52 | 28.00 | 11.20 | 16.1 | 104 | 0 | 97% |
| 9 | hono | 61,628 | 15.73 | 30.00 | 10.11 | 16.4 | 106 | 0 | 96% |
| 10 | restify | 44,656 | 21.89 | 43.00 | 8.05 | 22.6 | 114 | 0 | 69% |
| 11 | koa | 43,221 | 22.63 | 43.00 | 7.71 | 23.4 | 117 | 0 | 67% |
| 12 | hapi | 40,038 | 24.48 | 46.00 | 8.93 | 25.4 | 126 | 0 | 62% |
| 13 | tinyhttp | 31,075 | 31.68 | 61.00 | 5.25 | 48.8 | 180 | 0 | 48% |
| 14 | express | 13,242 | 74.97 | 99.00 | 2.36 | 86.8 | 159 | 0 | 21% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 129,414 | 7.26 | 12.00 | 18.64 | 7.0 | 59 | 0 | 201% |
| 2 | hyper-express | 122,096 | 7.68 | 13.00 | 15.60 | 8.5 | 79 | 0 | 189% |
| 3 | **kidlat** | 114,784 | 8.23 | 11.00 | 20.91 | 7.5 | 65 | 0 | 178% |
| 4 | 0http | 69,035 | 13.98 | 22.00 | 11.92 | 14.8 | 105 | 0 | 107% |
| 5 | node-http | 64,453 | 15.03 | 25.00 | 12.23 | 15.6 | 107 | 0 | 100% |
| 6 | fastify | 61,552 | 15.75 | 28.00 | 10.68 | 16.3 | 109 | 0 | 95% |
| 7 | polka | 60,828 | 15.94 | 29.00 | 10.50 | 16.5 | 106 | 0 | 94% |
| 8 | h3 | 59,171 | 16.39 | 27.00 | 10.04 | 17.0 | 112 | 0 | 92% |
| 9 | hono | 58,614 | 16.56 | 33.00 | 9.28 | 17.1 | 110 | 0 | 91% |
| 10 | restify | 44,100 | 22.17 | 43.00 | 7.70 | 22.8 | 125 | 0 | 68% |
| 11 | koa | 42,699 | 22.92 | 42.00 | 7.37 | 23.6 | 127 | 0 | 66% |
| 12 | hapi | 38,357 | 25.56 | 49.00 | 8.34 | 26.5 | 130 | 0 | 60% |
| 13 | tinyhttp | 30,484 | 32.31 | 59.00 | 4.97 | 49.4 | 180 | 0 | 47% |
| 14 | express | 13,077 | 75.91 | 100.00 | 2.26 | 87.3 | 161 | 0 | 20% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 128,545 | 7.29 | 12.00 | 63.99 | 7.6 | 66 | 0 | 466% |
| 2 | uws | 104,576 | 9.08 | 15.00 | 48.07 | 9.9 | 67 | 0 | 379% |
| 3 | hyper-express | 56,850 | 17.14 | 26.00 | 25.21 | 18.3 | 98 | 0 | 206% |
| 4 | 0http | 31,417 | 31.32 | 65.00 | 15.34 | 33.3 | 114 | 0 | 114% |
| 5 | node-http | 27,576 | 35.75 | 69.00 | 13.96 | 37.0 | 105 | 0 | 100% |
| 6 | fastify | 26,706 | 36.93 | 71.00 | 13.07 | 38.2 | 117 | 0 | 97% |
| 7 | h3 | 26,149 | 37.73 | 73.00 | 12.69 | 39.0 | 111 | 0 | 95% |
| 8 | hono | 24,673 | 40.02 | 78.00 | 11.69 | 41.3 | 109 | 0 | 89% |
| 9 | polka | 23,714 | 41.66 | 78.00 | 11.58 | 43.3 | 105 | 0 | 86% |
| 10 | restify | 18,966 | 52.19 | 84.00 | 9.30 | 53.8 | 122 | 0 | 69% |
| 11 | tinyhttp | 17,724 | 55.89 | 83.00 | 9.89 | 77.6 | 184 | 0 | 64% |
| 12 | koa | 16,844 | 58.83 | 87.00 | 8.22 | 60.9 | 120 | 0 | 61% |
| 13 | hapi | 13,600 | 72.97 | 109.00 | 6.96 | 74.6 | 130 | 0 | 49% |
| 14 | express | 7,701 | 129.16 | 169.00 | 3.76 | 146.1 | 162 | 0 | 28% |

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
