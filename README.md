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
Run on 11/01/2026, 22:54:57 (Manila Time, UTC+8) · AMD EPYC 9V45 96-Core Processor (4 threads, 16 GB) · Linux 7.0.0-1017-azure (x64) · Node v22.23.4

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | uws | 20.71.0 | 199,645 | 191,062 | 166,589 | 185,222 | 258% |
| 2 | **kidlat** | 2.4.0 | 159,053 | 161,380 | 167,690 | 162,667 | 227% |
| 3 | hyper-express | 7.0.2 | 185,440 | 169,885 | 96,819 | 145,024 | 202% |
| 4 | node-http | 22.23.4 | 85,494 | 84,933 | 50,920 | 71,774 | 100% |
| 5 | h3 | 2.0.2 | 81,872 | 81,568 | 48,866 | 68,848 | 96% |
| 6 | fastify | 5.12.7 | 79,541 | 76,674 | 45,490 | 65,221 | 91% |
| 7 | hono | 4.13.13 | 77,203 | 76,541 | 44,329 | 63,984 | 89% |
| 8 | polka | 0.5.2 | 77,688 | 75,854 | 43,909 | 63,723 | 89% |
| 9 | 0http | 5.2.0 | 69,245 | 66,876 | 43,096 | 58,439 | 81% |
| 10 | restify | 12.0.0 | 63,095 | 61,098 | 35,146 | 51,361 | 72% |
| 11 | koa | 3.2.1 | 57,874 | 56,925 | 33,145 | 47,797 | 67% |
| 12 | hapi | 21.4.10 | 59,298 | 57,842 | 29,588 | 46,645 | 65% |
| 13 | tinyhttp | 3.0.11 | 45,846 | 44,780 | 29,456 | 39,251 | 55% |
| 14 | express | 5.3.0 | 20,880 | 21,314 | 14,293 | 18,528 | 26% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 199,645 | 4.46 | 6.00 | 29.89 | 4.9 | 58 | 0 | 234% |
| 2 | hyper-express | 185,440 | 5.07 | 7.00 | 24.76 | 5.5 | 71 | 0 | 217% |
| 3 | **kidlat** | 159,053 | 5.90 | 8.00 | 29.88 | 5.8 | 61 | 0 | 186% |
| 4 | node-http | 85,494 | 11.20 | 21.00 | 16.80 | 11.8 | 100 | 0 | 100% |
| 5 | h3 | 81,872 | 11.72 | 22.00 | 14.37 | 12.3 | 105 | 0 | 96% |
| 6 | fastify | 79,541 | 12.07 | 23.00 | 14.26 | 12.6 | 105 | 0 | 93% |
| 7 | polka | 77,688 | 12.39 | 25.00 | 13.85 | 12.9 | 102 | 0 | 91% |
| 8 | hono | 77,203 | 12.45 | 24.00 | 12.66 | 13.0 | 101 | 0 | 90% |
| 9 | 0http | 69,245 | 13.95 | 29.00 | 12.35 | 18.8 | 146 | 0 | 81% |
| 10 | restify | 63,095 | 15.34 | 30.00 | 11.37 | 16.0 | 114 | 0 | 74% |
| 11 | hapi | 59,298 | 16.37 | 34.00 | 13.23 | 17.2 | 121 | 0 | 69% |
| 12 | koa | 57,874 | 16.77 | 33.00 | 10.32 | 17.4 | 115 | 0 | 68% |
| 13 | tinyhttp | 45,846 | 21.32 | 44.00 | 7.74 | 33.7 | 190 | 0 | 54% |
| 14 | express | 20,880 | 47.37 | 78.00 | 3.72 | 57.3 | 189 | 0 | 24% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 191,062 | 4.73 | 8.00 | 27.51 | 5.0 | 60 | 0 | 225% |
| 2 | hyper-express | 169,885 | 5.28 | 9.00 | 21.71 | 6.0 | 79 | 0 | 200% |
| 3 | **kidlat** | 161,380 | 5.75 | 8.00 | 29.40 | 5.8 | 61 | 0 | 190% |
| 4 | node-http | 84,933 | 11.27 | 21.00 | 16.12 | 11.8 | 105 | 0 | 100% |
| 5 | h3 | 81,568 | 11.77 | 24.00 | 13.85 | 12.3 | 110 | 0 | 96% |
| 6 | fastify | 76,674 | 12.55 | 26.00 | 13.31 | 13.1 | 110 | 0 | 90% |
| 7 | hono | 76,541 | 12.57 | 26.00 | 12.12 | 13.1 | 106 | 0 | 90% |
| 8 | polka | 75,854 | 12.68 | 24.00 | 13.09 | 13.2 | 108 | 0 | 89% |
| 9 | 0http | 66,876 | 14.45 | 30.00 | 11.54 | 19.5 | 152 | 0 | 79% |
| 10 | restify | 61,098 | 15.87 | 31.00 | 10.66 | 16.5 | 125 | 0 | 72% |
| 11 | hapi | 57,842 | 16.79 | 33.00 | 12.58 | 17.6 | 134 | 0 | 68% |
| 12 | koa | 56,925 | 17.07 | 35.00 | 9.83 | 17.7 | 124 | 0 | 67% |
| 13 | tinyhttp | 44,780 | 21.84 | 44.00 | 7.30 | 35.1 | 190 | 0 | 53% |
| 14 | express | 21,314 | 46.39 | 83.00 | 3.68 | 55.9 | 189 | 0 | 25% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 167,690 | 5.41 | 8.00 | 83.48 | 5.8 | 62 | 0 | 329% |
| 2 | uws | 166,589 | 5.44 | 8.00 | 76.57 | 6.1 | 67 | 0 | 327% |
| 3 | hyper-express | 96,819 | 9.85 | 14.00 | 42.93 | 11.0 | 97 | 0 | 190% |
| 4 | node-http | 50,920 | 19.14 | 41.00 | 25.79 | 19.9 | 113 | 0 | 100% |
| 5 | h3 | 48,866 | 19.97 | 46.00 | 23.72 | 20.7 | 110 | 0 | 96% |
| 6 | fastify | 45,490 | 21.48 | 49.00 | 22.26 | 22.5 | 114 | 0 | 89% |
| 7 | hono | 44,329 | 22.05 | 50.00 | 21.01 | 23.1 | 104 | 0 | 87% |
| 8 | polka | 43,909 | 22.29 | 49.00 | 21.44 | 23.6 | 103 | 0 | 86% |
| 9 | 0http | 43,096 | 22.70 | 47.00 | 21.04 | 31.0 | 176 | 0 | 85% |
| 10 | restify | 35,146 | 27.95 | 63.00 | 17.23 | 29.1 | 124 | 0 | 69% |
| 11 | koa | 33,145 | 29.65 | 69.00 | 16.18 | 31.2 | 121 | 0 | 65% |
| 12 | hapi | 29,588 | 33.29 | 71.00 | 15.15 | 34.5 | 135 | 0 | 58% |
| 13 | tinyhttp | 29,456 | 33.44 | 72.00 | 16.44 | 50.3 | 195 | 0 | 58% |
| 14 | express | 14,293 | 69.40 | 100.00 | 6.98 | 84.6 | 190 | 0 | 28% |

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
