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
| **kidlat** | 2.1.0 | Native C++ HTTP layer; focus of this benchmark |
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
Run on 10/15/2026, 12:13:04 (Manila Time, UTC+8) · AMD EPYC 9V45 96-Core Processor (4 threads, 16 GB) · Linux 6.17.0-1022-azure (x64) · Node v22.23.3

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | uws | 20.71.0 | 175,357 | 180,323 | 162,115 | 172,425 | 273% |
| 2 | **kidlat** | 2.2.0 | 152,163 | 157,136 | 154,461 | 154,573 | 244% |
| 3 | hyper-express | 7.0.2 | 175,280 | 162,787 | 90,573 | 137,230 | 217% |
| 4 | h3 | 2.0.2 | 76,635 | 73,774 | 47,050 | 64,313 | 102% |
| 5 | fastify | 5.12.7 | 73,358 | 74,890 | 48,052 | 64,150 | 101% |
| 6 | node-http | 22.23.3 | 72,469 | 72,166 | 48,320 | 63,222 | 100% |
| 7 | hono | 4.13.13 | 75,411 | 75,542 | 43,438 | 62,781 | 99% |
| 8 | polka | 0.5.2 | 75,934 | 73,224 | 43,302 | 62,211 | 98% |
| 9 | restify | 12.0.0 | 62,544 | 62,823 | 34,854 | 51,545 | 82% |
| 10 | 0http | 5.2.0 | 60,685 | 59,762 | 37,082 | 51,233 | 81% |
| 11 | koa | 3.2.1 | 61,290 | 60,249 | 33,484 | 49,819 | 79% |
| 12 | hapi | 21.4.10 | 54,495 | 55,028 | 28,440 | 44,017 | 70% |
| 13 | tinyhttp | 3.0.11 | 44,347 | 43,134 | 28,753 | 38,030 | 60% |
| 14 | express | 5.3.0 | 20,428 | 20,766 | 14,355 | 18,261 | 29% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 175,357 | 5.25 | 8.00 | 26.26 | 5.5 | 58 | 0 | 242% |
| 2 | hyper-express | 175,280 | 5.21 | 7.00 | 23.40 | 5.8 | 70 | 0 | 242% |
| 3 | **kidlat** | 152,163 | 6.14 | 8.00 | 28.59 | 6.1 | 62 | 0 | 210% |
| 4 | h3 | 76,635 | 12.55 | 23.00 | 13.45 | 13.1 | 104 | 0 | 106% |
| 5 | polka | 75,934 | 12.67 | 22.00 | 13.54 | 13.2 | 100 | 0 | 105% |
| 6 | hono | 75,411 | 12.77 | 24.00 | 12.37 | 13.4 | 103 | 0 | 104% |
| 7 | fastify | 73,358 | 13.14 | 24.00 | 13.15 | 13.7 | 108 | 0 | 101% |
| 8 | node-http | 72,469 | 13.30 | 24.00 | 14.24 | 13.9 | 101 | 0 | 100% |
| 9 | restify | 62,544 | 15.48 | 30.00 | 11.27 | 16.1 | 113 | 0 | 86% |
| 10 | koa | 61,290 | 15.82 | 30.00 | 10.93 | 16.5 | 119 | 0 | 85% |
| 11 | 0http | 60,685 | 15.98 | 32.00 | 10.82 | 21.8 | 152 | 0 | 84% |
| 12 | hapi | 54,495 | 17.85 | 33.00 | 12.16 | 18.7 | 125 | 0 | 75% |
| 13 | tinyhttp | 44,347 | 22.05 | 46.00 | 7.49 | 35.1 | 195 | 0 | 61% |
| 14 | express | 20,428 | 48.43 | 67.00 | 3.64 | 59.5 | 185 | 0 | 28% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 180,323 | 5.13 | 7.00 | 25.97 | 5.4 | 60 | 0 | 250% |
| 2 | hyper-express | 162,787 | 5.63 | 8.00 | 20.80 | 6.3 | 78 | 0 | 226% |
| 3 | **kidlat** | 157,136 | 5.91 | 9.00 | 28.62 | 6.0 | 62 | 0 | 218% |
| 4 | hono | 75,542 | 12.73 | 23.00 | 11.96 | 13.3 | 108 | 0 | 105% |
| 5 | fastify | 74,890 | 12.85 | 23.00 | 13.00 | 13.4 | 112 | 0 | 104% |
| 6 | h3 | 73,774 | 13.06 | 24.00 | 12.52 | 13.6 | 109 | 0 | 102% |
| 7 | polka | 73,224 | 13.17 | 24.00 | 12.64 | 13.7 | 106 | 0 | 101% |
| 8 | node-http | 72,166 | 13.36 | 23.00 | 13.70 | 13.9 | 106 | 0 | 100% |
| 9 | restify | 62,823 | 15.42 | 29.00 | 10.96 | 16.0 | 124 | 0 | 87% |
| 10 | koa | 60,249 | 16.10 | 29.00 | 10.40 | 16.7 | 127 | 0 | 83% |
| 11 | 0http | 59,762 | 16.24 | 32.00 | 10.32 | 22.2 | 151 | 0 | 83% |
| 12 | hapi | 55,028 | 17.67 | 31.00 | 11.97 | 18.5 | 164 | 0 | 76% |
| 13 | tinyhttp | 43,134 | 22.69 | 46.00 | 7.03 | 36.3 | 195 | 0 | 60% |
| 14 | express | 20,766 | 47.64 | 71.00 | 3.58 | 58.3 | 185 | 0 | 29% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 162,115 | 5.67 | 8.00 | 74.52 | 6.3 | 68 | 0 | 336% |
| 2 | **kidlat** | 154,461 | 5.98 | 11.00 | 76.89 | 7.1 | 114 | 0 | 320% |
| 3 | hyper-express | 90,573 | 10.55 | 15.00 | 40.17 | 11.9 | 101 | 0 | 187% |
| 4 | node-http | 48,320 | 20.20 | 41.00 | 24.47 | 21.3 | 115 | 0 | 100% |
| 5 | fastify | 48,052 | 20.31 | 43.00 | 23.51 | 21.4 | 110 | 0 | 99% |
| 6 | h3 | 47,050 | 20.75 | 44.00 | 22.84 | 21.7 | 111 | 0 | 97% |
| 7 | hono | 43,438 | 22.52 | 48.00 | 20.59 | 23.6 | 118 | 0 | 90% |
| 8 | polka | 43,302 | 22.59 | 49.00 | 21.14 | 24.0 | 101 | 0 | 90% |
| 9 | 0http | 37,082 | 26.46 | 53.00 | 18.11 | 37.0 | 168 | 0 | 77% |
| 10 | restify | 34,854 | 28.18 | 61.00 | 17.08 | 29.3 | 117 | 0 | 72% |
| 11 | koa | 33,484 | 29.35 | 63.00 | 16.35 | 30.8 | 121 | 0 | 69% |
| 12 | tinyhttp | 28,753 | 34.28 | 71.00 | 16.04 | 52.6 | 201 | 0 | 60% |
| 13 | hapi | 28,440 | 34.66 | 70.00 | 14.56 | 35.9 | 171 | 0 | 59% |
| 14 | express | 14,355 | 69.11 | 99.00 | 7.01 | 84.2 | 186 | 0 | 30% |

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
