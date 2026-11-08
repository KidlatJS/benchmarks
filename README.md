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
Run on 11/09/2026, 03:28:57 (Manila Time, UTC+8) · AMD EPYC 9V74 80-Core Processor (4 threads, 16 GB) · Linux 7.0.0-1019-azure (x64) · Node v22.23.4

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | uws | 20.71.0 | 152,166 | 159,059 | 132,261 | 147,379 | 273% |
| 2 | **kidlat** | 2.6.0 | 135,971 | 138,770 | 150,310 | 141,550 | 262% |
| 3 | hyper-express | 7.0.2 | 148,365 | 138,822 | 72,430 | 114,262 | 211% |
| 4 | node-http | 22.23.4 | 67,499 | 67,773 | 34,515 | 54,049 | 100% |
| 5 | fastify | 5.12.7 | 69,140 | 67,463 | 32,486 | 53,313 | 99% |
| 6 | h3 | 2.0.2 | 67,183 | 63,751 | 30,556 | 50,771 | 94% |
| 7 | polka | 0.5.2 | 68,719 | 65,052 | 27,995 | 50,019 | 93% |
| 8 | hono | 4.13.13 | 64,216 | 63,581 | 28,808 | 48,996 | 91% |
| 9 | 0http | 5.2.0 | 57,706 | 55,953 | 32,781 | 47,303 | 88% |
| 10 | restify | 12.0.0 | 50,730 | 49,718 | 22,460 | 38,406 | 71% |
| 11 | koa | 3.2.1 | 50,746 | 49,665 | 19,595 | 36,688 | 68% |
| 12 | hapi | 21.4.10 | 45,570 | 44,155 | 15,233 | 31,296 | 58% |
| 13 | tinyhttp | 3.0.11 | 34,934 | 34,754 | 20,420 | 29,159 | 54% |
| 14 | express | 5.3.0 | 16,019 | 15,943 | 8,861 | 13,129 | 24% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 152,166 | 6.09 | 10.00 | 22.78 | 6.3 | 58 | 0 | 225% |
| 2 | hyper-express | 148,365 | 6.18 | 11.00 | 19.81 | 6.9 | 70 | 0 | 220% |
| 3 | **kidlat** | 135,971 | 7.05 | 9.00 | 25.55 | 7.1 | 64 | 0 | 201% |
| 4 | fastify | 69,140 | 13.99 | 25.00 | 12.40 | 14.6 | 107 | 0 | 102% |
| 5 | polka | 68,719 | 14.08 | 28.00 | 12.25 | 14.6 | 99 | 0 | 102% |
| 6 | node-http | 67,499 | 14.30 | 28.00 | 13.26 | 14.9 | 106 | 0 | 100% |
| 7 | h3 | 67,183 | 14.38 | 26.00 | 11.79 | 15.0 | 103 | 0 | 100% |
| 8 | hono | 64,216 | 15.09 | 30.00 | 10.53 | 15.7 | 107 | 0 | 95% |
| 9 | 0http | 57,706 | 16.82 | 37.00 | 10.29 | 22.8 | 153 | 0 | 85% |
| 10 | koa | 50,746 | 19.21 | 39.00 | 9.05 | 19.9 | 123 | 0 | 75% |
| 11 | restify | 50,730 | 19.22 | 40.00 | 9.14 | 19.9 | 114 | 0 | 75% |
| 12 | hapi | 45,570 | 21.45 | 44.00 | 10.17 | 22.3 | 128 | 0 | 68% |
| 13 | tinyhttp | 34,934 | 28.13 | 60.00 | 5.90 | 42.9 | 184 | 0 | 52% |
| 14 | express | 16,019 | 61.90 | 85.00 | 2.86 | 73.7 | 160 | 0 | 24% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 159,059 | 5.75 | 10.00 | 22.91 | 6.1 | 60 | 0 | 235% |
| 2 | hyper-express | 138,822 | 6.64 | 12.00 | 17.74 | 7.4 | 79 | 0 | 205% |
| 3 | **kidlat** | 138,770 | 6.79 | 10.00 | 25.27 | 6.9 | 64 | 0 | 205% |
| 4 | node-http | 67,773 | 14.24 | 26.00 | 12.86 | 14.8 | 111 | 0 | 100% |
| 5 | fastify | 67,463 | 14.33 | 28.00 | 11.71 | 14.9 | 113 | 0 | 100% |
| 6 | polka | 65,052 | 14.86 | 29.00 | 11.23 | 15.4 | 105 | 0 | 96% |
| 7 | h3 | 63,751 | 15.20 | 29.00 | 10.82 | 15.8 | 109 | 0 | 94% |
| 8 | hono | 63,581 | 15.24 | 29.00 | 10.07 | 15.8 | 112 | 0 | 94% |
| 9 | 0http | 55,953 | 17.38 | 39.00 | 9.66 | 23.4 | 153 | 0 | 83% |
| 10 | restify | 49,718 | 19.61 | 41.00 | 8.68 | 20.2 | 124 | 0 | 73% |
| 11 | koa | 49,665 | 19.63 | 39.00 | 8.57 | 20.3 | 131 | 0 | 73% |
| 12 | hapi | 44,155 | 22.14 | 46.00 | 9.60 | 23.0 | 128 | 0 | 65% |
| 13 | tinyhttp | 34,754 | 28.28 | 57.00 | 5.67 | 43.5 | 184 | 0 | 51% |
| 14 | express | 15,943 | 62.19 | 85.00 | 2.75 | 74.3 | 167 | 0 | 24% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 150,310 | 6.16 | 9.00 | 74.82 | 6.5 | 68 | 0 | 435% |
| 2 | uws | 132,261 | 7.15 | 12.00 | 60.80 | 7.8 | 67 | 0 | 383% |
| 3 | hyper-express | 72,430 | 13.32 | 22.00 | 32.12 | 14.4 | 100 | 0 | 210% |
| 4 | node-http | 34,515 | 28.47 | 59.00 | 17.48 | 29.5 | 110 | 0 | 100% |
| 5 | 0http | 32,781 | 30.00 | 67.00 | 16.01 | 40.4 | 168 | 0 | 95% |
| 6 | fastify | 32,486 | 30.28 | 63.00 | 15.89 | 31.3 | 113 | 0 | 94% |
| 7 | h3 | 30,556 | 32.21 | 66.00 | 14.83 | 33.3 | 114 | 0 | 89% |
| 8 | hono | 28,808 | 34.20 | 71.00 | 13.65 | 35.3 | 114 | 0 | 83% |
| 9 | polka | 27,995 | 35.21 | 72.00 | 13.67 | 36.6 | 108 | 0 | 81% |
| 10 | restify | 22,460 | 44.01 | 79.00 | 11.01 | 45.3 | 124 | 0 | 65% |
| 11 | tinyhttp | 20,420 | 48.46 | 82.00 | 11.39 | 67.7 | 189 | 0 | 59% |
| 12 | koa | 19,595 | 50.51 | 84.00 | 9.57 | 52.0 | 117 | 0 | 57% |
| 13 | hapi | 15,233 | 65.12 | 99.00 | 7.80 | 66.5 | 128 | 0 | 44% |
| 14 | express | 8,861 | 112.23 | 147.00 | 4.33 | 130.3 | 169 | 0 | 26% |

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
