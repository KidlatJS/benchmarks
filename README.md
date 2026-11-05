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
Run on 11/05/2026, 11:22:58 (Manila Time, UTC+8) · AMD EPYC 9V45 96-Core Processor (4 threads, 16 GB) · Linux 7.0.0-1017-azure (x64) · Node v22.23.4

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 2.6.0 | 190,224 | 196,141 | 192,771 | 193,030 | 275% |
| 2 | uws | 20.71.0 | 199,741 | 198,995 | 165,412 | 187,338 | 267% |
| 3 | hyper-express | 7.0.2 | 179,850 | 167,866 | 103,342 | 146,122 | 208% |
| 4 | fastify | 5.12.7 | 84,307 | 86,507 | 50,904 | 71,871 | 102% |
| 5 | node-http | 22.23.4 | 85,779 | 82,677 | 48,810 | 70,214 | 100% |
| 6 | h3 | 2.0.2 | 79,952 | 78,666 | 48,316 | 67,231 | 96% |
| 7 | polka | 0.5.2 | 81,306 | 77,217 | 45,176 | 65,702 | 94% |
| 8 | hono | 4.13.13 | 79,539 | 78,453 | 44,665 | 65,321 | 93% |
| 9 | 0http | 5.2.0 | 70,110 | 67,932 | 39,081 | 57,096 | 81% |
| 10 | restify | 12.0.0 | 70,122 | 69,674 | 35,892 | 55,972 | 80% |
| 11 | koa | 3.2.1 | 61,206 | 60,196 | 34,417 | 50,240 | 72% |
| 12 | hapi | 21.4.10 | 60,687 | 61,778 | 32,070 | 49,356 | 70% |
| 13 | tinyhttp | 3.0.11 | 52,102 | 51,134 | 32,028 | 44,025 | 63% |
| 14 | express | 5.3.0 | 21,550 | 20,856 | 15,297 | 19,015 | 27% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 199,741 | 4.40 | 6.00 | 29.91 | 4.9 | 58 | 0 | 233% |
| 2 | **kidlat** | 190,224 | 4.92 | 8.00 | 35.74 | 5.0 | 65 | 0 | 222% |
| 3 | hyper-express | 179,850 | 5.11 | 7.00 | 24.01 | 5.7 | 80 | 0 | 210% |
| 4 | node-http | 85,779 | 11.14 | 20.00 | 16.85 | 11.7 | 106 | 0 | 100% |
| 5 | fastify | 84,307 | 11.37 | 23.00 | 15.12 | 11.9 | 108 | 0 | 98% |
| 6 | polka | 81,306 | 11.79 | 23.00 | 14.50 | 12.4 | 97 | 0 | 95% |
| 7 | h3 | 79,952 | 12.02 | 23.00 | 14.03 | 12.6 | 104 | 0 | 93% |
| 8 | hono | 79,539 | 12.08 | 24.00 | 13.05 | 12.6 | 107 | 0 | 93% |
| 9 | restify | 70,122 | 13.77 | 28.00 | 12.64 | 14.4 | 116 | 0 | 82% |
| 10 | 0http | 70,110 | 13.76 | 29.00 | 12.50 | 18.6 | 153 | 0 | 82% |
| 11 | koa | 61,206 | 15.84 | 32.00 | 10.91 | 16.5 | 118 | 0 | 71% |
| 12 | hapi | 60,687 | 15.98 | 34.00 | 13.54 | 16.7 | 127 | 0 | 71% |
| 13 | tinyhttp | 52,102 | 18.70 | 38.00 | 8.79 | 29.3 | 190 | 0 | 61% |
| 14 | express | 21,550 | 45.88 | 83.00 | 3.84 | 54.9 | 194 | 0 | 25% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 198,995 | 4.45 | 6.00 | 28.66 | 4.9 | 60 | 0 | 241% |
| 2 | **kidlat** | 196,141 | 4.56 | 8.00 | 35.73 | 4.9 | 65 | 0 | 237% |
| 3 | hyper-express | 167,866 | 5.31 | 8.00 | 21.45 | 6.1 | 79 | 0 | 203% |
| 4 | fastify | 86,507 | 11.08 | 22.00 | 15.01 | 11.6 | 113 | 0 | 105% |
| 5 | node-http | 82,677 | 11.62 | 23.00 | 15.69 | 12.1 | 111 | 0 | 100% |
| 6 | h3 | 78,666 | 12.21 | 25.00 | 13.35 | 12.8 | 109 | 0 | 95% |
| 7 | hono | 78,453 | 12.25 | 25.00 | 12.42 | 12.8 | 112 | 0 | 95% |
| 8 | polka | 77,217 | 12.49 | 25.00 | 13.33 | 13.0 | 103 | 0 | 93% |
| 9 | restify | 69,674 | 13.85 | 27.00 | 12.16 | 14.4 | 127 | 0 | 84% |
| 10 | 0http | 67,932 | 14.22 | 32.00 | 11.73 | 19.2 | 153 | 0 | 82% |
| 11 | hapi | 61,778 | 15.66 | 31.00 | 13.43 | 16.4 | 138 | 0 | 75% |
| 12 | koa | 60,196 | 16.12 | 32.00 | 10.39 | 16.7 | 127 | 0 | 73% |
| 13 | tinyhttp | 51,134 | 19.06 | 40.00 | 8.34 | 30.2 | 191 | 0 | 62% |
| 14 | express | 20,856 | 47.44 | 62.00 | 3.60 | 56.4 | 194 | 0 | 25% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 192,771 | 4.75 | 8.00 | 95.97 | 5.1 | 69 | 0 | 395% |
| 2 | uws | 165,412 | 5.40 | 10.00 | 76.03 | 6.2 | 68 | 0 | 339% |
| 3 | hyper-express | 103,342 | 9.25 | 12.00 | 45.82 | 10.0 | 100 | 0 | 212% |
| 4 | fastify | 50,904 | 19.14 | 45.00 | 24.91 | 19.9 | 112 | 0 | 104% |
| 5 | node-http | 48,810 | 19.99 | 45.00 | 24.72 | 20.9 | 108 | 0 | 100% |
| 6 | h3 | 48,316 | 20.19 | 45.00 | 23.45 | 21.0 | 113 | 0 | 99% |
| 7 | polka | 45,176 | 21.63 | 49.00 | 22.06 | 22.9 | 111 | 0 | 93% |
| 8 | hono | 44,665 | 21.90 | 51.00 | 21.17 | 22.7 | 116 | 0 | 92% |
| 9 | 0http | 39,081 | 25.09 | 53.00 | 19.08 | 34.5 | 175 | 0 | 80% |
| 10 | restify | 35,892 | 27.34 | 62.00 | 17.59 | 28.6 | 115 | 0 | 74% |
| 11 | koa | 34,417 | 28.54 | 63.00 | 16.81 | 29.9 | 121 | 0 | 71% |
| 12 | hapi | 32,070 | 30.69 | 68.00 | 16.42 | 31.6 | 139 | 0 | 66% |
| 13 | tinyhttp | 32,028 | 30.72 | 70.00 | 17.87 | 45.2 | 196 | 0 | 66% |
| 14 | express | 15,297 | 64.84 | 90.00 | 7.47 | 77.1 | 194 | 0 | 31% |

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
