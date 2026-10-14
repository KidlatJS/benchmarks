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
Run on 10/14/2026, 23:10:24 (Manila Time, UTC+8) · Intel(R) Xeon(R) 6973P-C (4 threads, 16 GB) · Linux 6.17.0-1022-azure (x64) · Node v22.23.3

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | uws | 20.71.0 | 160,435 | 165,757 | 153,322 | 159,756 | 200% |
| 2 | hyper-express | 7.0.2 | 208,237 | 192,054 | 93,091 | 154,988 | 194% |
| 3 | **kidlat** | 2.1.0 | 150,234 | 154,365 | 159,987 | 154,810 | 194% |
| 4 | 0http | 5.2.0 | 101,570 | 99,822 | 53,311 | 81,459 | 102% |
| 5 | node-http | 22.23.3 | 95,602 | 96,192 | 55,154 | 79,750 | 100% |
| 6 | h3 | 2.0.2 | 91,971 | 88,717 | 47,444 | 72,881 | 91% |
| 7 | fastify | 5.12.7 | 91,522 | 88,941 | 45,506 | 71,817 | 90% |
| 8 | hono | 4.13.13 | 89,840 | 88,218 | 45,374 | 71,112 | 89% |
| 9 | polka | 0.5.2 | 90,477 | 86,891 | 41,884 | 69,054 | 87% |
| 10 | restify | 12.0.0 | 64,749 | 64,533 | 30,204 | 50,160 | 63% |
| 11 | koa | 3.2.1 | 63,338 | 63,276 | 28,099 | 48,291 | 61% |
| 12 | tinyhttp | 3.0.11 | 46,352 | 46,539 | 26,908 | 38,719 | 49% |
| 13 | hapi | 21.4.10 | 48,614 | 47,426 | 22,456 | 37,271 | 47% |
| 14 | express | 5.3.0 | 19,381 | 19,483 | 11,695 | 16,406 | 21% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 208,237 | 4.27 | 6.00 | 27.80 | 5.0 | 78 | 0 | 218% |
| 2 | uws | 160,435 | 5.82 | 7.00 | 24.02 | 5.2 | 58 | 0 | 168% |
| 3 | **kidlat** | 150,234 | 6.17 | 8.00 | 28.23 | 5.6 | 62 | 0 | 157% |
| 4 | 0http | 101,570 | 9.35 | 14.00 | 18.11 | 10.2 | 105 | 0 | 106% |
| 5 | node-http | 95,602 | 9.96 | 16.00 | 18.78 | 10.5 | 104 | 0 | 100% |
| 6 | h3 | 91,971 | 10.37 | 16.00 | 16.14 | 11.0 | 107 | 0 | 96% |
| 7 | fastify | 91,522 | 10.42 | 16.00 | 16.41 | 11.0 | 106 | 0 | 96% |
| 8 | polka | 90,477 | 10.55 | 17.00 | 16.14 | 11.1 | 97 | 0 | 95% |
| 9 | hono | 89,840 | 10.62 | 16.00 | 14.74 | 11.2 | 105 | 0 | 94% |
| 10 | restify | 64,749 | 14.95 | 26.00 | 11.67 | 15.6 | 116 | 0 | 68% |
| 11 | koa | 63,338 | 15.28 | 27.00 | 11.30 | 15.9 | 115 | 0 | 66% |
| 12 | hapi | 48,614 | 20.08 | 37.00 | 10.85 | 20.9 | 117 | 0 | 51% |
| 13 | tinyhttp | 46,352 | 21.08 | 41.00 | 7.82 | 34.7 | 181 | 0 | 48% |
| 14 | express | 19,381 | 51.07 | 67.00 | 3.46 | 61.9 | 174 | 0 | 20% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 192,054 | 4.76 | 7.00 | 24.54 | 5.4 | 79 | 0 | 200% |
| 2 | uws | 165,757 | 5.48 | 7.00 | 23.87 | 5.1 | 60 | 0 | 172% |
| 3 | **kidlat** | 154,365 | 6.04 | 8.00 | 28.12 | 5.5 | 66 | 0 | 160% |
| 4 | 0http | 99,822 | 9.53 | 14.00 | 17.23 | 10.5 | 108 | 0 | 104% |
| 5 | node-http | 96,192 | 9.89 | 16.00 | 18.26 | 10.5 | 109 | 0 | 100% |
| 6 | fastify | 88,941 | 10.74 | 16.00 | 15.44 | 11.3 | 111 | 0 | 92% |
| 7 | h3 | 88,717 | 10.76 | 17.00 | 15.06 | 11.3 | 111 | 0 | 92% |
| 8 | hono | 88,218 | 10.83 | 17.00 | 13.97 | 11.4 | 109 | 0 | 92% |
| 9 | polka | 86,891 | 11.01 | 17.00 | 15.00 | 11.6 | 103 | 0 | 90% |
| 10 | restify | 64,533 | 15.00 | 26.00 | 11.26 | 15.6 | 127 | 0 | 67% |
| 11 | koa | 63,276 | 15.32 | 26.00 | 10.92 | 15.9 | 124 | 0 | 66% |
| 12 | hapi | 47,426 | 20.59 | 39.00 | 10.31 | 21.4 | 136 | 0 | 49% |
| 13 | tinyhttp | 46,539 | 20.99 | 39.00 | 7.59 | 34.6 | 182 | 0 | 48% |
| 14 | express | 19,483 | 50.80 | 69.00 | 3.36 | 61.4 | 176 | 0 | 20% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 159,987 | 5.73 | 9.00 | 79.64 | 6.6 | 118 | 0 | 290% |
| 2 | uws | 153,322 | 6.05 | 9.00 | 70.47 | 6.7 | 67 | 0 | 278% |
| 3 | hyper-express | 93,091 | 10.21 | 14.00 | 41.28 | 11.3 | 100 | 0 | 169% |
| 4 | node-http | 55,154 | 17.63 | 38.00 | 27.93 | 18.6 | 107 | 0 | 100% |
| 5 | 0http | 53,311 | 18.26 | 37.00 | 26.03 | 19.8 | 115 | 0 | 97% |
| 6 | h3 | 47,444 | 20.58 | 47.00 | 23.03 | 21.5 | 113 | 0 | 86% |
| 7 | fastify | 45,506 | 21.47 | 47.00 | 22.26 | 22.5 | 111 | 0 | 83% |
| 8 | hono | 45,374 | 21.53 | 47.00 | 21.50 | 22.5 | 116 | 0 | 82% |
| 9 | polka | 41,884 | 23.38 | 50.00 | 20.45 | 24.7 | 106 | 0 | 76% |
| 10 | restify | 30,204 | 32.60 | 67.00 | 14.81 | 33.8 | 116 | 0 | 55% |
| 11 | koa | 28,099 | 35.08 | 69.00 | 13.72 | 36.4 | 118 | 0 | 51% |
| 12 | tinyhttp | 26,908 | 36.66 | 77.00 | 15.01 | 55.2 | 189 | 0 | 49% |
| 13 | hapi | 22,456 | 44.01 | 78.00 | 11.50 | 45.2 | 139 | 0 | 41% |
| 14 | express | 11,695 | 84.93 | 108.00 | 5.71 | 100.7 | 184 | 0 | 21% |

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
