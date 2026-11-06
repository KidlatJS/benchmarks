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
Run on 11/06/2026, 09:27:35 (Manila Time, UTC+8) · AMD EPYC 9V74 80-Core Processor (4 threads, 16 GB) · Linux 7.0.0-1019-azure (x64) · Node v22.23.4

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | uws | 20.71.0 | 157,283 | 161,523 | 127,576 | 147,989 | 261% |
| 2 | **kidlat** | 2.6.0 | 145,585 | 142,192 | 148,013 | 145,244 | 256% |
| 3 | hyper-express | 7.0.2 | 155,427 | 148,020 | 73,086 | 118,912 | 210% |
| 4 | 0http | 5.2.0 | 72,856 | 72,546 | 35,916 | 57,472 | 101% |
| 5 | node-http | 22.23.4 | 72,442 | 72,408 | 34,751 | 56,700 | 100% |
| 6 | fastify | 5.12.7 | 70,830 | 69,874 | 32,281 | 54,262 | 96% |
| 7 | polka | 0.5.2 | 73,054 | 68,567 | 28,489 | 52,257 | 92% |
| 8 | h3 | 2.0.2 | 68,544 | 65,318 | 31,510 | 52,057 | 92% |
| 9 | hono | 4.13.13 | 67,973 | 67,404 | 30,438 | 51,858 | 91% |
| 10 | restify | 12.0.0 | 51,507 | 50,060 | 23,817 | 39,453 | 70% |
| 11 | koa | 3.2.1 | 51,289 | 50,970 | 20,163 | 37,494 | 66% |
| 12 | hapi | 21.4.10 | 46,822 | 46,741 | 14,938 | 31,975 | 56% |
| 13 | tinyhttp | 3.0.11 | 37,570 | 37,288 | 20,168 | 30,457 | 54% |
| 14 | express | 5.3.0 | 16,095 | 16,099 | 9,141 | 13,330 | 24% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 157,283 | 5.89 | 9.00 | 23.55 | 6.1 | 58 | 0 | 217% |
| 2 | hyper-express | 155,427 | 6.06 | 9.00 | 20.75 | 6.6 | 79 | 0 | 215% |
| 3 | **kidlat** | 145,585 | 6.26 | 9.00 | 27.35 | 6.7 | 63 | 0 | 201% |
| 4 | polka | 73,054 | 13.17 | 23.00 | 13.03 | 13.8 | 96 | 0 | 101% |
| 5 | 0http | 72,856 | 13.22 | 24.00 | 12.99 | 14.1 | 99 | 0 | 101% |
| 6 | node-http | 72,442 | 13.31 | 23.00 | 14.23 | 13.9 | 102 | 0 | 100% |
| 7 | fastify | 70,830 | 13.61 | 26.00 | 12.70 | 14.2 | 107 | 0 | 98% |
| 8 | h3 | 68,544 | 14.11 | 27.00 | 12.03 | 14.7 | 109 | 0 | 95% |
| 9 | hono | 67,973 | 14.22 | 29.00 | 11.15 | 14.8 | 106 | 0 | 94% |
| 10 | restify | 51,507 | 18.90 | 43.00 | 9.28 | 19.6 | 113 | 0 | 71% |
| 11 | koa | 51,289 | 19.00 | 41.00 | 9.15 | 19.7 | 119 | 0 | 71% |
| 12 | hapi | 46,822 | 20.84 | 45.00 | 10.45 | 21.7 | 121 | 0 | 65% |
| 13 | tinyhttp | 37,570 | 26.11 | 56.00 | 6.34 | 39.2 | 190 | 0 | 52% |
| 14 | express | 16,095 | 61.58 | 84.00 | 2.87 | 73.1 | 170 | 0 | 22% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 161,523 | 5.57 | 10.00 | 23.26 | 6.0 | 60 | 0 | 223% |
| 2 | hyper-express | 148,020 | 6.20 | 11.00 | 18.92 | 6.9 | 79 | 0 | 204% |
| 3 | **kidlat** | 142,192 | 6.49 | 10.00 | 25.90 | 6.8 | 64 | 0 | 196% |
| 4 | 0http | 72,546 | 13.29 | 24.00 | 12.52 | 14.1 | 104 | 0 | 100% |
| 5 | node-http | 72,408 | 13.31 | 24.00 | 13.74 | 13.9 | 108 | 0 | 100% |
| 6 | fastify | 69,874 | 13.81 | 27.00 | 12.13 | 14.4 | 113 | 0 | 97% |
| 7 | polka | 68,567 | 14.08 | 27.00 | 11.84 | 14.6 | 102 | 0 | 95% |
| 8 | hono | 67,404 | 14.35 | 30.00 | 10.67 | 14.9 | 111 | 0 | 93% |
| 9 | h3 | 65,318 | 14.80 | 29.00 | 11.09 | 15.4 | 113 | 0 | 90% |
| 10 | koa | 50,970 | 19.13 | 38.00 | 8.80 | 19.8 | 129 | 0 | 70% |
| 11 | restify | 50,060 | 19.48 | 43.00 | 8.74 | 20.1 | 124 | 0 | 69% |
| 12 | hapi | 46,741 | 20.92 | 42.00 | 10.16 | 21.7 | 135 | 0 | 65% |
| 13 | tinyhttp | 37,288 | 26.32 | 54.00 | 6.08 | 39.6 | 190 | 0 | 51% |
| 14 | express | 16,099 | 61.58 | 86.00 | 2.78 | 72.4 | 170 | 0 | 22% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 148,013 | 6.29 | 11.00 | 73.68 | 6.6 | 68 | 0 | 426% |
| 2 | uws | 127,576 | 7.39 | 13.00 | 58.64 | 8.1 | 67 | 0 | 367% |
| 3 | hyper-express | 73,086 | 13.13 | 21.00 | 32.41 | 14.2 | 101 | 0 | 210% |
| 4 | 0http | 35,916 | 27.33 | 62.00 | 17.54 | 30.1 | 170 | 0 | 103% |
| 5 | node-http | 34,751 | 28.27 | 60.00 | 17.60 | 29.3 | 109 | 0 | 100% |
| 6 | fastify | 32,281 | 30.47 | 65.00 | 15.79 | 31.5 | 113 | 0 | 93% |
| 7 | h3 | 31,510 | 31.22 | 65.00 | 15.30 | 32.3 | 115 | 0 | 91% |
| 8 | hono | 30,438 | 32.34 | 67.00 | 14.43 | 33.5 | 109 | 0 | 88% |
| 9 | polka | 28,489 | 34.58 | 70.00 | 13.91 | 35.8 | 111 | 0 | 82% |
| 10 | restify | 23,817 | 41.47 | 76.00 | 11.67 | 42.7 | 116 | 0 | 69% |
| 11 | tinyhttp | 20,168 | 49.07 | 85.00 | 11.25 | 66.9 | 194 | 0 | 58% |
| 12 | koa | 20,163 | 49.06 | 84.00 | 9.85 | 50.6 | 124 | 0 | 58% |
| 13 | hapi | 14,938 | 66.39 | 99.00 | 7.65 | 67.7 | 136 | 0 | 43% |
| 14 | express | 9,141 | 108.74 | 148.00 | 4.46 | 124.9 | 171 | 0 | 26% |

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
