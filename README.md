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
Run on 11/02/2026, 07:27:37 (Manila Time, UTC+8) · AMD EPYC 7763 64-Core Processor (4 threads, 16 GB) · Linux 7.0.0-1017-azure (x64) · Node v22.23.4

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 2.6.0 | 104,029 | 100,715 | 109,222 | 104,597 | 315% |
| 2 | uws | 20.71.0 | 100,386 | 101,616 | 88,709 | 96,724 | 291% |
| 3 | hyper-express | 7.0.2 | 107,450 | 101,211 | 45,230 | 78,938 | 238% |
| 4 | 0http | 5.2.0 | 52,362 | 50,858 | 21,360 | 38,459 | 116% |
| 5 | node-http | 22.23.4 | 44,392 | 44,747 | 18,425 | 33,202 | 100% |
| 6 | fastify | 5.12.7 | 44,522 | 43,409 | 17,446 | 32,306 | 97% |
| 7 | polka | 0.5.2 | 45,751 | 43,209 | 15,768 | 31,471 | 95% |
| 8 | h3 | 2.0.2 | 43,046 | 41,279 | 17,466 | 31,426 | 95% |
| 9 | hono | 4.13.13 | 43,467 | 42,112 | 16,783 | 31,319 | 94% |
| 10 | restify | 12.0.0 | 33,201 | 32,804 | 12,618 | 23,952 | 72% |
| 11 | koa | 3.2.1 | 31,447 | 31,256 | 11,078 | 22,165 | 67% |
| 12 | hapi | 21.4.10 | 30,679 | 29,517 | 9,298 | 20,344 | 61% |
| 13 | tinyhttp | 3.0.11 | 23,994 | 23,550 | 12,051 | 18,954 | 57% |
| 14 | express | 5.3.0 | 11,381 | 11,130 | 6,018 | 9,135 | 28% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 107,450 | 8.81 | 17.00 | 14.35 | 9.4 | 70 | 0 | 242% |
| 2 | **kidlat** | 104,029 | 9.18 | 14.00 | 19.54 | 9.4 | 63 | 0 | 234% |
| 3 | uws | 100,386 | 9.39 | 15.00 | 15.03 | 9.0 | 58 | 0 | 226% |
| 4 | 0http | 52,362 | 18.59 | 34.00 | 9.34 | 19.3 | 103 | 0 | 118% |
| 5 | polka | 45,751 | 21.37 | 33.00 | 8.16 | 22.0 | 100 | 0 | 103% |
| 6 | fastify | 44,522 | 21.96 | 37.00 | 7.98 | 22.6 | 104 | 0 | 100% |
| 7 | node-http | 44,392 | 22.03 | 37.00 | 8.72 | 22.7 | 105 | 0 | 100% |
| 8 | hono | 43,467 | 22.50 | 40.00 | 7.13 | 23.1 | 104 | 0 | 98% |
| 9 | h3 | 43,046 | 22.73 | 44.00 | 7.55 | 23.4 | 106 | 0 | 97% |
| 10 | restify | 33,201 | 29.61 | 54.00 | 5.98 | 30.4 | 113 | 0 | 75% |
| 11 | koa | 31,447 | 31.29 | 59.00 | 5.61 | 32.0 | 117 | 0 | 71% |
| 12 | hapi | 30,679 | 32.08 | 61.00 | 6.85 | 33.0 | 120 | 0 | 69% |
| 13 | tinyhttp | 23,994 | 41.18 | 85.00 | 4.05 | 56.1 | 178 | 0 | 54% |
| 14 | express | 11,381 | 87.26 | 117.00 | 2.03 | 99.8 | 155 | 0 | 26% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 101,616 | 9.28 | 12.00 | 14.63 | 8.9 | 58 | 0 | 227% |
| 2 | hyper-express | 101,211 | 9.35 | 18.00 | 12.93 | 10.0 | 78 | 0 | 226% |
| 3 | **kidlat** | 100,715 | 9.42 | 16.00 | 18.34 | 9.6 | 63 | 0 | 225% |
| 4 | 0http | 50,858 | 19.17 | 36.00 | 8.78 | 20.0 | 107 | 0 | 114% |
| 5 | node-http | 44,747 | 21.85 | 34.00 | 8.49 | 22.4 | 109 | 0 | 100% |
| 6 | fastify | 43,409 | 22.52 | 39.00 | 7.53 | 23.1 | 109 | 0 | 97% |
| 7 | polka | 43,209 | 22.64 | 38.00 | 7.46 | 23.2 | 107 | 0 | 97% |
| 8 | hono | 42,112 | 23.27 | 39.00 | 6.67 | 23.8 | 109 | 0 | 94% |
| 9 | h3 | 41,279 | 23.71 | 40.00 | 7.01 | 24.3 | 110 | 0 | 92% |
| 10 | restify | 32,804 | 29.98 | 54.00 | 5.72 | 30.6 | 124 | 0 | 73% |
| 11 | koa | 31,256 | 31.48 | 57.00 | 5.40 | 32.2 | 126 | 0 | 70% |
| 12 | hapi | 29,517 | 33.37 | 63.00 | 6.42 | 34.5 | 129 | 0 | 66% |
| 13 | tinyhttp | 23,550 | 41.93 | 81.00 | 3.84 | 57.1 | 179 | 0 | 53% |
| 14 | express | 11,130 | 89.27 | 125.00 | 1.92 | 101.2 | 160 | 0 | 25% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 109,222 | 8.56 | 15.00 | 54.37 | 9.0 | 65 | 0 | 593% |
| 2 | uws | 88,709 | 10.69 | 20.00 | 40.78 | 11.4 | 67 | 0 | 481% |
| 3 | hyper-express | 45,230 | 21.62 | 36.00 | 20.06 | 22.5 | 99 | 0 | 245% |
| 4 | 0http | 21,360 | 46.29 | 94.00 | 10.43 | 48.0 | 110 | 0 | 116% |
| 5 | node-http | 18,425 | 53.75 | 79.00 | 9.33 | 54.9 | 107 | 0 | 100% |
| 6 | h3 | 17,466 | 56.72 | 83.00 | 8.48 | 57.9 | 109 | 0 | 95% |
| 7 | fastify | 17,446 | 56.79 | 82.00 | 8.54 | 58.0 | 114 | 0 | 95% |
| 8 | hono | 16,783 | 59.05 | 88.00 | 7.95 | 60.4 | 111 | 0 | 91% |
| 9 | polka | 15,768 | 62.88 | 89.00 | 7.70 | 64.4 | 98 | 0 | 86% |
| 10 | restify | 12,618 | 78.68 | 116.00 | 6.18 | 80.3 | 112 | 0 | 68% |
| 11 | tinyhttp | 12,051 | 82.42 | 117.00 | 6.72 | 101.3 | 181 | 0 | 65% |
| 12 | koa | 11,078 | 89.69 | 122.00 | 5.41 | 91.6 | 111 | 0 | 60% |
| 13 | hapi | 9,298 | 106.93 | 147.00 | 4.76 | 108.5 | 129 | 0 | 50% |
| 14 | express | 6,018 | 165.38 | 204.00 | 2.94 | 181.9 | 161 | 0 | 33% |

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
