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
Run on 10/29/2026, 14:54:11 (Manila Time, UTC+8) · AMD EPYC 7763 64-Core Processor (4 threads, 16 GB) · Linux 7.0.0-1017-azure (x64) · Node v22.23.4

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 2.4.0 | 106,387 | 105,410 | 111,922 | 107,868 | 324% |
| 2 | uws | 20.71.0 | 102,197 | 107,170 | 88,043 | 98,795 | 297% |
| 3 | hyper-express | 7.0.2 | 106,744 | 101,773 | 48,194 | 80,598 | 242% |
| 4 | 0http | 5.2.0 | 45,663 | 45,010 | 20,088 | 34,562 | 104% |
| 5 | node-http | 22.23.4 | 44,554 | 44,700 | 18,568 | 33,316 | 100% |
| 6 | fastify | 5.12.7 | 44,672 | 43,773 | 17,598 | 32,527 | 98% |
| 7 | h3 | 2.0.2 | 43,630 | 41,111 | 17,389 | 31,478 | 94% |
| 8 | polka | 0.5.2 | 45,656 | 42,608 | 15,728 | 31,276 | 94% |
| 9 | hono | 4.13.13 | 43,542 | 42,210 | 16,628 | 31,265 | 94% |
| 10 | restify | 12.0.0 | 32,159 | 31,980 | 12,419 | 23,375 | 70% |
| 11 | koa | 3.2.1 | 31,203 | 30,828 | 10,787 | 21,811 | 65% |
| 12 | hapi | 21.4.10 | 31,710 | 30,940 | 9,348 | 20,932 | 63% |
| 13 | tinyhttp | 3.0.11 | 23,991 | 23,731 | 12,082 | 19,018 | 57% |
| 14 | express | 5.3.0 | 11,091 | 11,097 | 6,010 | 9,043 | 27% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 106,744 | 9.06 | 16.00 | 14.25 | 9.5 | 71 | 0 | 240% |
| 2 | **kidlat** | 106,387 | 9.10 | 13.00 | 19.99 | 9.1 | 61 | 0 | 239% |
| 3 | uws | 102,197 | 9.24 | 11.00 | 15.30 | 8.8 | 58 | 0 | 229% |
| 4 | 0http | 45,663 | 21.39 | 47.00 | 8.14 | 27.4 | 146 | 0 | 102% |
| 5 | polka | 45,656 | 21.41 | 35.00 | 8.14 | 22.0 | 97 | 0 | 102% |
| 6 | fastify | 44,672 | 21.89 | 36.00 | 8.01 | 22.5 | 106 | 0 | 100% |
| 7 | node-http | 44,554 | 21.94 | 37.00 | 8.75 | 22.6 | 104 | 0 | 100% |
| 8 | h3 | 43,630 | 22.42 | 38.00 | 7.66 | 23.1 | 104 | 0 | 98% |
| 9 | hono | 43,542 | 22.47 | 39.00 | 7.14 | 23.1 | 105 | 0 | 98% |
| 10 | restify | 32,159 | 30.60 | 58.00 | 5.80 | 31.3 | 113 | 0 | 72% |
| 11 | hapi | 31,710 | 31.03 | 56.00 | 7.08 | 31.9 | 125 | 0 | 71% |
| 12 | koa | 31,203 | 31.55 | 59.00 | 5.56 | 32.3 | 116 | 0 | 70% |
| 13 | tinyhttp | 23,991 | 41.17 | 87.00 | 4.05 | 56.0 | 170 | 0 | 54% |
| 14 | express | 11,091 | 89.58 | 126.00 | 1.98 | 101.3 | 157 | 0 | 25% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 107,170 | 8.96 | 12.00 | 15.43 | 8.6 | 58 | 0 | 240% |
| 2 | **kidlat** | 105,410 | 9.15 | 14.00 | 19.20 | 9.2 | 61 | 0 | 236% |
| 3 | hyper-express | 101,773 | 9.20 | 15.00 | 13.01 | 10.0 | 80 | 0 | 228% |
| 4 | 0http | 45,010 | 21.72 | 51.00 | 7.77 | 27.7 | 146 | 0 | 101% |
| 5 | node-http | 44,700 | 21.86 | 35.00 | 8.48 | 22.4 | 108 | 0 | 100% |
| 6 | fastify | 43,773 | 22.33 | 37.00 | 7.60 | 22.9 | 112 | 0 | 98% |
| 7 | polka | 42,608 | 22.94 | 43.00 | 7.35 | 23.5 | 102 | 0 | 95% |
| 8 | hono | 42,210 | 23.23 | 40.00 | 6.68 | 23.8 | 110 | 0 | 94% |
| 9 | h3 | 41,111 | 23.82 | 37.00 | 6.98 | 24.4 | 109 | 0 | 92% |
| 10 | restify | 31,980 | 30.75 | 56.00 | 5.58 | 31.4 | 124 | 0 | 72% |
| 11 | hapi | 30,940 | 31.80 | 57.00 | 6.73 | 32.6 | 139 | 0 | 69% |
| 12 | koa | 30,828 | 31.92 | 55.00 | 5.32 | 32.6 | 125 | 0 | 69% |
| 13 | tinyhttp | 23,731 | 41.64 | 82.00 | 3.87 | 56.5 | 171 | 0 | 53% |
| 14 | express | 11,097 | 89.54 | 116.00 | 1.92 | 100.9 | 159 | 0 | 25% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 111,922 | 8.39 | 14.00 | 55.72 | 8.8 | 62 | 0 | 603% |
| 2 | uws | 88,043 | 10.76 | 21.00 | 40.47 | 11.5 | 67 | 0 | 474% |
| 3 | hyper-express | 48,194 | 20.21 | 35.00 | 21.37 | 21.1 | 99 | 0 | 260% |
| 4 | 0http | 20,088 | 49.26 | 102.00 | 9.81 | 60.0 | 167 | 0 | 108% |
| 5 | node-http | 18,568 | 53.32 | 76.00 | 9.40 | 54.5 | 107 | 0 | 100% |
| 6 | fastify | 17,598 | 56.30 | 81.00 | 8.61 | 57.4 | 115 | 0 | 95% |
| 7 | h3 | 17,389 | 56.98 | 87.00 | 8.44 | 58.2 | 109 | 0 | 94% |
| 8 | hono | 16,628 | 59.60 | 92.00 | 7.88 | 60.8 | 108 | 0 | 90% |
| 9 | polka | 15,728 | 63.06 | 94.00 | 7.68 | 64.1 | 111 | 0 | 85% |
| 10 | restify | 12,419 | 79.94 | 117.00 | 6.09 | 81.5 | 112 | 0 | 67% |
| 11 | tinyhttp | 12,082 | 82.18 | 118.00 | 6.74 | 100.5 | 175 | 0 | 65% |
| 12 | koa | 10,787 | 92.08 | 130.00 | 5.27 | 93.5 | 136 | 0 | 58% |
| 13 | hapi | 9,348 | 106.35 | 142.00 | 4.79 | 107.9 | 140 | 0 | 50% |
| 14 | express | 6,010 | 165.59 | 211.00 | 2.93 | 181.7 | 159 | 0 | 32% |

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
