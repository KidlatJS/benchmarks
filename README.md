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
Run on 11/12/2026, 09:25:32 (Manila Time, UTC+8) · AMD EPYC 9V45 96-Core Processor (4 threads, 16 GB) · Linux 7.0.0-1019-azure (x64) · Node v22.23.4

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | uws | 20.71.0 | 169,885 | 170,973 | 151,152 | 163,744 | 250% |
| 2 | **kidlat** | 2.6.0 | 153,981 | 158,614 | 162,096 | 158,195 | 242% |
| 3 | hyper-express | 7.0.2 | 171,734 | 167,117 | 92,381 | 138,405 | 212% |
| 4 | fastify | 5.12.7 | 79,986 | 81,435 | 46,317 | 67,069 | 103% |
| 5 | node-http | 22.23.4 | 78,488 | 78,347 | 45,531 | 65,420 | 100% |
| 6 | hono | 4.13.13 | 78,550 | 77,219 | 42,681 | 63,734 | 97% |
| 7 | polka | 0.5.2 | 78,632 | 75,299 | 42,854 | 63,308 | 97% |
| 8 | h3 | 2.0.2 | 73,925 | 73,195 | 44,134 | 62,041 | 95% |
| 9 | 0http | 5.2.0 | 60,451 | 59,758 | 35,895 | 50,615 | 77% |
| 10 | koa | 3.2.1 | 58,110 | 56,950 | 33,636 | 48,104 | 74% |
| 11 | restify | 12.0.0 | 58,244 | 58,079 | 32,857 | 48,080 | 73% |
| 12 | hapi | 21.4.10 | 58,306 | 54,944 | 28,275 | 44,910 | 69% |
| 13 | tinyhttp | 3.0.11 | 45,794 | 41,205 | 26,892 | 37,022 | 57% |
| 14 | express | 5.3.0 | 20,760 | 20,769 | 14,739 | 18,523 | 28% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 171,734 | 5.19 | 8.00 | 22.93 | 6.0 | 78 | 0 | 219% |
| 2 | uws | 169,885 | 5.38 | 8.00 | 25.44 | 5.7 | 58 | 0 | 216% |
| 3 | **kidlat** | 153,981 | 6.08 | 9.00 | 28.93 | 6.0 | 63 | 0 | 196% |
| 4 | fastify | 79,986 | 12.00 | 24.00 | 14.34 | 12.6 | 108 | 0 | 102% |
| 5 | polka | 78,632 | 12.20 | 25.00 | 14.02 | 12.8 | 101 | 0 | 100% |
| 6 | hono | 78,550 | 12.23 | 25.00 | 12.88 | 12.8 | 109 | 0 | 100% |
| 7 | node-http | 78,488 | 12.25 | 24.00 | 15.42 | 12.8 | 105 | 0 | 100% |
| 8 | h3 | 73,925 | 13.03 | 26.00 | 12.97 | 13.6 | 109 | 0 | 94% |
| 9 | 0http | 60,451 | 16.05 | 34.00 | 10.78 | 21.7 | 151 | 0 | 77% |
| 10 | hapi | 58,306 | 16.66 | 33.00 | 13.01 | 17.5 | 126 | 0 | 74% |
| 11 | restify | 58,244 | 16.67 | 32.00 | 10.50 | 17.3 | 116 | 0 | 74% |
| 12 | koa | 58,110 | 16.71 | 33.00 | 10.36 | 17.4 | 116 | 0 | 74% |
| 13 | tinyhttp | 45,794 | 21.33 | 43.00 | 7.73 | 33.8 | 191 | 0 | 58% |
| 14 | express | 20,760 | 47.64 | 79.00 | 3.70 | 57.3 | 188 | 0 | 26% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 170,973 | 5.37 | 8.00 | 24.62 | 5.6 | 60 | 0 | 218% |
| 2 | hyper-express | 167,117 | 5.37 | 8.00 | 21.36 | 6.1 | 79 | 0 | 213% |
| 3 | **kidlat** | 158,614 | 5.87 | 9.00 | 28.89 | 5.9 | 63 | 0 | 202% |
| 4 | fastify | 81,435 | 11.77 | 23.00 | 14.14 | 12.3 | 113 | 0 | 104% |
| 5 | node-http | 78,347 | 12.27 | 24.00 | 14.87 | 12.8 | 111 | 0 | 100% |
| 6 | hono | 77,219 | 12.46 | 26.00 | 12.22 | 13.0 | 113 | 0 | 99% |
| 7 | polka | 75,299 | 12.79 | 27.00 | 13.00 | 13.3 | 107 | 0 | 96% |
| 8 | h3 | 73,195 | 13.17 | 26.00 | 12.43 | 13.7 | 113 | 0 | 93% |
| 9 | 0http | 59,758 | 16.24 | 34.00 | 10.31 | 22.1 | 153 | 0 | 76% |
| 10 | restify | 58,079 | 16.71 | 33.00 | 10.14 | 17.3 | 127 | 0 | 74% |
| 11 | koa | 56,950 | 17.06 | 34.00 | 9.83 | 17.7 | 125 | 0 | 73% |
| 12 | hapi | 54,944 | 17.70 | 35.00 | 11.95 | 18.5 | 154 | 0 | 70% |
| 13 | tinyhttp | 41,205 | 23.77 | 48.00 | 6.72 | 38.4 | 190 | 0 | 53% |
| 14 | express | 20,769 | 47.64 | 80.00 | 3.58 | 57.9 | 188 | 0 | 27% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 162,096 | 5.69 | 8.00 | 80.69 | 6.0 | 68 | 0 | 356% |
| 2 | uws | 151,152 | 6.16 | 9.00 | 69.48 | 7.0 | 67 | 0 | 332% |
| 3 | hyper-express | 92,381 | 10.32 | 14.00 | 40.97 | 11.5 | 100 | 0 | 203% |
| 4 | fastify | 46,317 | 21.09 | 48.00 | 22.66 | 22.1 | 112 | 0 | 102% |
| 5 | node-http | 45,531 | 21.47 | 47.00 | 23.06 | 22.5 | 109 | 0 | 100% |
| 6 | h3 | 44,134 | 22.16 | 51.00 | 21.42 | 23.0 | 112 | 0 | 97% |
| 7 | polka | 42,854 | 22.83 | 51.00 | 20.93 | 24.1 | 107 | 0 | 94% |
| 8 | hono | 42,681 | 22.93 | 53.00 | 20.23 | 23.9 | 114 | 0 | 94% |
| 9 | 0http | 35,895 | 27.35 | 57.00 | 17.53 | 38.1 | 174 | 0 | 79% |
| 10 | koa | 33,636 | 29.22 | 63.00 | 16.42 | 30.6 | 117 | 0 | 74% |
| 11 | restify | 32,857 | 29.93 | 67.00 | 16.11 | 31.3 | 114 | 0 | 72% |
| 12 | hapi | 28,275 | 34.85 | 72.00 | 14.48 | 36.0 | 156 | 0 | 62% |
| 13 | tinyhttp | 26,892 | 36.68 | 75.00 | 15.00 | 56.1 | 195 | 0 | 59% |
| 14 | express | 14,739 | 67.31 | 94.00 | 7.20 | 81.5 | 189 | 0 | 32% |

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
