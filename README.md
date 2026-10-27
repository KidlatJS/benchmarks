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
Run on 10/27/2026, 12:38:21 (Manila Time, UTC+8) · AMD EPYC 7763 64-Core Processor (4 threads, 16 GB) · Linux 6.17.0-1022-azure (x64) · Node v22.23.3

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 2.4.0 | 105,949 | 104,365 | 108,064 | 106,115 | 330% |
| 2 | uws | 20.71.0 | 106,667 | 106,672 | 92,590 | 101,753 | 316% |
| 3 | hyper-express | 7.0.2 | 110,557 | 105,123 | 48,726 | 82,734 | 257% |
| 4 | 0http | 5.2.0 | 54,131 | 51,386 | 22,750 | 39,850 | 124% |
| 5 | fastify | 5.12.7 | 45,276 | 44,298 | 17,527 | 32,758 | 102% |
| 6 | node-http | 22.23.3 | 43,702 | 42,982 | 17,719 | 32,167 | 100% |
| 7 | polka | 0.5.2 | 44,354 | 42,493 | 15,640 | 30,890 | 96% |
| 8 | hono | 4.13.13 | 42,838 | 41,430 | 16,438 | 30,784 | 96% |
| 9 | h3 | 2.0.2 | 42,120 | 40,322 | 16,998 | 30,677 | 95% |
| 10 | restify | 12.0.0 | 32,830 | 32,273 | 12,690 | 23,779 | 74% |
| 11 | koa | 3.2.1 | 30,816 | 30,100 | 11,177 | 21,805 | 68% |
| 12 | hapi | 21.4.10 | 32,156 | 31,312 | 9,302 | 21,079 | 66% |
| 13 | tinyhttp | 3.0.11 | 24,186 | 23,852 | 12,249 | 19,189 | 60% |
| 14 | express | 5.3.0 | 10,905 | 10,727 | 5,960 | 8,867 | 28% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 110,557 | 8.44 | 15.00 | 14.76 | 9.2 | 70 | 0 | 253% |
| 2 | uws | 106,667 | 9.11 | 14.00 | 15.97 | 8.6 | 58 | 0 | 244% |
| 3 | **kidlat** | 105,949 | 9.11 | 13.00 | 19.90 | 9.2 | 61 | 0 | 242% |
| 4 | 0http | 54,131 | 17.97 | 31.00 | 9.65 | 19.0 | 101 | 0 | 124% |
| 5 | fastify | 45,276 | 21.60 | 35.00 | 8.12 | 22.2 | 106 | 0 | 104% |
| 6 | polka | 44,354 | 22.05 | 37.00 | 7.91 | 22.7 | 97 | 0 | 101% |
| 7 | node-http | 43,702 | 22.37 | 37.00 | 8.59 | 23.0 | 104 | 0 | 100% |
| 8 | hono | 42,838 | 22.84 | 38.00 | 7.03 | 23.5 | 103 | 0 | 98% |
| 9 | h3 | 42,120 | 23.25 | 37.00 | 7.39 | 23.9 | 106 | 0 | 96% |
| 10 | restify | 32,830 | 29.96 | 51.00 | 5.92 | 30.7 | 113 | 0 | 75% |
| 11 | hapi | 32,156 | 30.59 | 54.00 | 7.18 | 31.5 | 119 | 0 | 74% |
| 12 | koa | 30,816 | 31.94 | 52.00 | 5.50 | 32.7 | 119 | 0 | 71% |
| 13 | tinyhttp | 24,186 | 40.84 | 84.00 | 4.08 | 57.4 | 175 | 0 | 55% |
| 14 | express | 10,905 | 91.10 | 123.00 | 1.94 | 104.1 | 160 | 0 | 25% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 106,672 | 9.10 | 14.00 | 15.36 | 8.3 | 58 | 0 | 248% |
| 2 | hyper-express | 105,123 | 9.13 | 17.00 | 13.43 | 9.6 | 78 | 0 | 245% |
| 3 | **kidlat** | 104,365 | 9.15 | 13.00 | 19.01 | 9.4 | 61 | 0 | 243% |
| 4 | 0http | 51,386 | 18.96 | 31.00 | 8.87 | 19.8 | 106 | 0 | 120% |
| 5 | fastify | 44,298 | 22.08 | 37.00 | 7.69 | 22.7 | 112 | 0 | 103% |
| 6 | node-http | 42,982 | 22.77 | 37.00 | 8.16 | 23.3 | 109 | 0 | 100% |
| 7 | polka | 42,493 | 23.02 | 37.00 | 7.33 | 23.6 | 103 | 0 | 99% |
| 8 | hono | 41,430 | 23.63 | 37.00 | 6.56 | 24.2 | 107 | 0 | 96% |
| 9 | h3 | 40,322 | 24.30 | 38.00 | 6.84 | 24.9 | 111 | 0 | 94% |
| 10 | restify | 32,273 | 30.48 | 52.00 | 5.63 | 31.1 | 124 | 0 | 75% |
| 11 | hapi | 31,312 | 31.43 | 54.00 | 6.81 | 32.3 | 119 | 0 | 73% |
| 12 | koa | 30,100 | 32.71 | 55.00 | 5.20 | 33.4 | 128 | 0 | 70% |
| 13 | tinyhttp | 23,852 | 41.41 | 77.00 | 3.89 | 57.9 | 174 | 0 | 55% |
| 14 | express | 10,727 | 92.62 | 124.00 | 1.85 | 104.9 | 163 | 0 | 25% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 108,064 | 8.75 | 15.00 | 53.79 | 9.1 | 62 | 0 | 610% |
| 2 | uws | 92,590 | 10.21 | 16.00 | 42.56 | 11.0 | 67 | 0 | 523% |
| 3 | hyper-express | 48,726 | 20.00 | 31.00 | 21.61 | 20.9 | 99 | 0 | 275% |
| 4 | 0http | 22,750 | 43.44 | 94.00 | 11.11 | 45.1 | 110 | 0 | 128% |
| 5 | node-http | 17,719 | 55.90 | 88.00 | 8.97 | 57.0 | 104 | 0 | 100% |
| 6 | fastify | 17,527 | 56.53 | 81.00 | 8.57 | 57.6 | 108 | 0 | 99% |
| 7 | h3 | 16,998 | 58.30 | 82.00 | 8.25 | 59.6 | 108 | 0 | 96% |
| 8 | hono | 16,438 | 60.29 | 87.00 | 7.79 | 61.6 | 106 | 0 | 93% |
| 9 | polka | 15,640 | 63.40 | 91.00 | 7.64 | 64.9 | 98 | 0 | 88% |
| 10 | restify | 12,690 | 78.23 | 109.00 | 6.22 | 79.9 | 112 | 0 | 72% |
| 11 | tinyhttp | 12,249 | 81.06 | 109.00 | 6.83 | 100.2 | 177 | 0 | 69% |
| 12 | koa | 11,177 | 88.89 | 121.00 | 5.46 | 90.9 | 119 | 0 | 63% |
| 13 | hapi | 9,302 | 106.89 | 138.00 | 4.76 | 108.5 | 121 | 0 | 52% |
| 14 | express | 5,960 | 166.90 | 196.00 | 2.91 | 184.0 | 164 | 0 | 34% |

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
