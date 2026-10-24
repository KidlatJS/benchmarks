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
Run on 10/24/2026, 15:06:47 (Manila Time, UTC+8) · AMD EPYC 7763 64-Core Processor (4 threads, 16 GB) · Linux 6.17.0-1022-azure (x64) · Node v22.23.3

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 2.4.0 | 106,072 | 103,976 | 112,861 | 107,570 | 326% |
| 2 | uws | 20.71.0 | 112,243 | 117,374 | 92,120 | 106,667 | 323% |
| 3 | hyper-express | 7.0.2 | 110,243 | 104,635 | 48,432 | 82,361 | 250% |
| 4 | 0http | 5.2.0 | 45,540 | 44,966 | 21,252 | 35,174 | 107% |
| 5 | node-http | 22.23.3 | 45,347 | 44,717 | 17,681 | 32,975 | 100% |
| 6 | fastify | 5.12.7 | 44,370 | 42,916 | 17,509 | 32,185 | 98% |
| 7 | polka | 0.5.2 | 45,265 | 43,050 | 15,465 | 31,119 | 94% |
| 8 | h3 | 2.0.2 | 43,387 | 40,549 | 17,075 | 31,086 | 94% |
| 9 | hono | 4.13.13 | 43,014 | 41,821 | 16,675 | 31,071 | 94% |
| 10 | restify | 12.0.0 | 32,786 | 32,390 | 12,578 | 23,727 | 72% |
| 11 | koa | 3.2.1 | 31,235 | 30,742 | 10,820 | 21,821 | 66% |
| 12 | hapi | 21.4.10 | 31,864 | 31,116 | 9,535 | 21,145 | 64% |
| 13 | tinyhttp | 3.0.11 | 24,290 | 24,166 | 12,216 | 19,284 | 58% |
| 14 | express | 5.3.0 | 11,416 | 11,152 | 6,183 | 9,233 | 28% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 112,243 | 8.35 | 13.00 | 16.80 | 8.1 | 58 | 0 | 248% |
| 2 | hyper-express | 110,243 | 8.47 | 14.00 | 14.72 | 9.2 | 70 | 0 | 243% |
| 3 | **kidlat** | 106,072 | 9.11 | 13.00 | 19.93 | 9.2 | 61 | 0 | 234% |
| 4 | 0http | 45,540 | 21.46 | 44.00 | 8.12 | 27.9 | 144 | 0 | 100% |
| 5 | node-http | 45,347 | 21.58 | 35.00 | 8.91 | 22.2 | 101 | 0 | 100% |
| 6 | polka | 45,265 | 21.62 | 35.00 | 8.07 | 22.2 | 100 | 0 | 100% |
| 7 | fastify | 44,370 | 22.06 | 36.00 | 7.96 | 22.7 | 106 | 0 | 98% |
| 8 | h3 | 43,387 | 22.53 | 37.00 | 7.61 | 23.2 | 104 | 0 | 96% |
| 9 | hono | 43,014 | 22.73 | 37.00 | 7.05 | 23.4 | 102 | 0 | 95% |
| 10 | restify | 32,786 | 29.99 | 52.00 | 5.91 | 30.7 | 113 | 0 | 72% |
| 11 | hapi | 31,864 | 30.88 | 52.00 | 7.11 | 31.8 | 120 | 0 | 70% |
| 12 | koa | 31,235 | 31.53 | 54.00 | 5.57 | 32.2 | 112 | 0 | 69% |
| 13 | tinyhttp | 24,290 | 40.66 | 84.00 | 4.10 | 56.7 | 167 | 0 | 54% |
| 14 | express | 11,416 | 87.01 | 117.00 | 2.04 | 98.5 | 167 | 0 | 25% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 117,374 | 8.17 | 14.00 | 16.90 | 8.1 | 59 | 0 | 262% |
| 2 | hyper-express | 104,635 | 9.19 | 16.00 | 13.37 | 9.7 | 78 | 0 | 234% |
| 3 | **kidlat** | 103,976 | 9.16 | 12.00 | 18.94 | 9.0 | 62 | 0 | 233% |
| 4 | 0http | 44,966 | 21.73 | 46.00 | 7.76 | 28.1 | 145 | 0 | 101% |
| 5 | node-http | 44,717 | 21.86 | 31.00 | 8.49 | 22.4 | 106 | 0 | 100% |
| 6 | polka | 43,050 | 22.71 | 37.00 | 7.43 | 23.3 | 107 | 0 | 96% |
| 7 | fastify | 42,916 | 22.78 | 39.00 | 7.45 | 23.4 | 111 | 0 | 96% |
| 8 | hono | 41,821 | 23.44 | 36.00 | 6.62 | 24.0 | 107 | 0 | 94% |
| 9 | h3 | 40,549 | 24.14 | 38.00 | 6.88 | 24.7 | 109 | 0 | 91% |
| 10 | restify | 32,390 | 30.37 | 50.00 | 5.65 | 31.1 | 123 | 0 | 72% |
| 11 | hapi | 31,116 | 31.63 | 54.00 | 6.77 | 32.5 | 127 | 0 | 70% |
| 12 | koa | 30,742 | 32.01 | 54.00 | 5.31 | 32.7 | 122 | 0 | 69% |
| 13 | tinyhttp | 24,166 | 40.87 | 73.00 | 3.94 | 56.5 | 169 | 0 | 54% |
| 14 | express | 11,152 | 89.07 | 116.00 | 1.92 | 100.2 | 169 | 0 | 25% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 112,861 | 8.32 | 12.00 | 56.18 | 8.7 | 62 | 0 | 638% |
| 2 | uws | 92,120 | 10.27 | 17.00 | 42.35 | 11.0 | 67 | 0 | 521% |
| 3 | hyper-express | 48,432 | 20.11 | 30.00 | 21.48 | 21.0 | 99 | 0 | 274% |
| 4 | 0http | 21,252 | 46.53 | 97.00 | 10.38 | 57.6 | 167 | 0 | 120% |
| 5 | node-http | 17,681 | 56.01 | 88.00 | 8.95 | 57.1 | 101 | 0 | 100% |
| 6 | fastify | 17,509 | 56.58 | 82.00 | 8.57 | 57.7 | 104 | 0 | 99% |
| 7 | h3 | 17,075 | 58.04 | 82.00 | 8.29 | 59.2 | 103 | 0 | 97% |
| 8 | hono | 16,675 | 59.43 | 84.00 | 7.90 | 60.7 | 110 | 0 | 94% |
| 9 | polka | 15,465 | 64.12 | 96.00 | 7.55 | 65.5 | 103 | 0 | 87% |
| 10 | restify | 12,578 | 78.94 | 109.00 | 6.17 | 80.5 | 111 | 0 | 71% |
| 11 | tinyhttp | 12,216 | 81.30 | 112.00 | 6.82 | 100.3 | 171 | 0 | 69% |
| 12 | koa | 10,820 | 91.84 | 124.00 | 5.28 | 93.6 | 110 | 0 | 61% |
| 13 | hapi | 9,535 | 104.27 | 134.00 | 4.88 | 105.7 | 130 | 0 | 54% |
| 14 | express | 6,183 | 160.94 | 194.00 | 3.02 | 177.0 | 167 | 0 | 35% |

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
