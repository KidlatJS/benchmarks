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
Run on 11/15/2026, 17:05:15 (Manila Time, UTC+8) · AMD EPYC 7763 64-Core Processor (4 threads, 16 GB) · Linux 7.0.0-1019-azure (x64) · Node v22.23.4

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 2.6.0 | 102,424 | 95,448 | 104,474 | 100,707 | 310% |
| 2 | uws | 20.71.0 | 99,302 | 103,920 | 88,264 | 96,935 | 298% |
| 3 | hyper-express | 7.0.2 | 103,694 | 99,362 | 45,551 | 77,713 | 239% |
| 4 | 0http | 5.2.0 | 43,994 | 43,838 | 18,947 | 33,184 | 102% |
| 5 | node-http | 22.23.4 | 44,300 | 43,598 | 17,789 | 32,510 | 100% |
| 6 | fastify | 5.12.7 | 42,965 | 42,330 | 17,078 | 31,434 | 97% |
| 7 | hono | 4.13.13 | 42,977 | 41,094 | 16,787 | 30,950 | 95% |
| 8 | polka | 0.5.2 | 44,616 | 42,562 | 15,500 | 30,876 | 95% |
| 9 | h3 | 2.0.2 | 43,650 | 40,100 | 16,552 | 30,713 | 94% |
| 10 | restify | 12.0.0 | 32,675 | 32,209 | 12,243 | 23,444 | 72% |
| 11 | koa | 3.2.1 | 31,362 | 30,474 | 10,883 | 21,828 | 67% |
| 12 | hapi | 21.4.10 | 30,598 | 29,537 | 9,038 | 20,140 | 62% |
| 13 | tinyhttp | 3.0.11 | 23,951 | 23,544 | 11,968 | 18,898 | 58% |
| 14 | express | 5.3.0 | 11,478 | 11,238 | 5,994 | 9,178 | 28% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 103,694 | 9.25 | 17.00 | 13.84 | 9.8 | 70 | 0 | 234% |
| 2 | **kidlat** | 102,424 | 9.27 | 15.00 | 19.24 | 9.5 | 63 | 0 | 231% |
| 3 | uws | 99,302 | 9.65 | 16.00 | 14.87 | 9.1 | 58 | 0 | 224% |
| 4 | polka | 44,616 | 21.92 | 40.00 | 7.96 | 22.5 | 102 | 0 | 101% |
| 5 | node-http | 44,300 | 22.09 | 44.00 | 8.70 | 22.7 | 105 | 0 | 100% |
| 6 | 0http | 43,994 | 22.23 | 54.00 | 7.85 | 28.3 | 145 | 0 | 99% |
| 7 | h3 | 43,650 | 22.40 | 36.00 | 7.66 | 23.0 | 108 | 0 | 99% |
| 8 | hono | 42,977 | 22.77 | 45.00 | 7.05 | 23.4 | 103 | 0 | 97% |
| 9 | fastify | 42,965 | 22.77 | 42.00 | 7.70 | 23.4 | 103 | 0 | 97% |
| 10 | restify | 32,675 | 30.10 | 59.00 | 5.89 | 30.9 | 113 | 0 | 74% |
| 11 | koa | 31,362 | 31.39 | 59.00 | 5.59 | 32.1 | 116 | 0 | 71% |
| 12 | hapi | 30,598 | 32.18 | 63.00 | 6.83 | 33.1 | 125 | 0 | 69% |
| 13 | tinyhttp | 23,951 | 41.24 | 86.00 | 4.04 | 57.1 | 170 | 0 | 54% |
| 14 | express | 11,478 | 86.54 | 126.00 | 2.05 | 98.6 | 161 | 0 | 26% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 103,920 | 9.16 | 15.00 | 14.96 | 8.9 | 58 | 0 | 238% |
| 2 | hyper-express | 99,362 | 9.49 | 18.00 | 12.70 | 10.2 | 79 | 0 | 228% |
| 3 | **kidlat** | 95,448 | 10.11 | 18.00 | 17.38 | 9.9 | 64 | 0 | 219% |
| 4 | 0http | 43,838 | 22.31 | 53.00 | 7.57 | 28.4 | 146 | 0 | 101% |
| 5 | node-http | 43,598 | 22.45 | 45.00 | 8.27 | 23.0 | 110 | 0 | 100% |
| 6 | polka | 42,562 | 22.99 | 43.00 | 7.35 | 23.6 | 107 | 0 | 98% |
| 7 | fastify | 42,330 | 23.12 | 45.00 | 7.35 | 23.7 | 108 | 0 | 97% |
| 8 | hono | 41,094 | 23.83 | 45.00 | 6.51 | 24.4 | 108 | 0 | 94% |
| 9 | h3 | 40,100 | 24.43 | 49.00 | 6.81 | 25.0 | 112 | 0 | 92% |
| 10 | restify | 32,209 | 30.53 | 58.00 | 5.62 | 31.2 | 124 | 0 | 74% |
| 11 | koa | 30,474 | 32.31 | 63.00 | 5.26 | 33.0 | 125 | 0 | 70% |
| 12 | hapi | 29,537 | 33.34 | 68.00 | 6.42 | 34.2 | 133 | 0 | 68% |
| 13 | tinyhttp | 23,544 | 41.96 | 80.00 | 3.84 | 58.2 | 175 | 0 | 54% |
| 14 | express | 11,238 | 88.41 | 121.00 | 1.94 | 99.8 | 161 | 0 | 26% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 104,474 | 9.14 | 16.00 | 52.01 | 9.4 | 69 | 0 | 587% |
| 2 | uws | 88,264 | 10.76 | 21.00 | 40.57 | 11.6 | 68 | 0 | 496% |
| 3 | hyper-express | 45,551 | 21.44 | 36.00 | 20.20 | 22.4 | 101 | 0 | 256% |
| 4 | 0http | 18,947 | 52.25 | 109.00 | 9.25 | 63.8 | 162 | 0 | 107% |
| 5 | node-http | 17,789 | 55.69 | 81.00 | 9.01 | 56.9 | 108 | 0 | 100% |
| 6 | fastify | 17,078 | 58.02 | 87.00 | 8.36 | 59.3 | 109 | 0 | 96% |
| 7 | hono | 16,787 | 59.04 | 89.00 | 7.96 | 60.4 | 102 | 0 | 94% |
| 8 | h3 | 16,552 | 59.88 | 93.00 | 8.03 | 61.2 | 107 | 0 | 93% |
| 9 | polka | 15,500 | 63.97 | 93.00 | 7.57 | 65.7 | 103 | 0 | 87% |
| 10 | restify | 12,243 | 81.10 | 117.00 | 6.00 | 82.9 | 112 | 0 | 69% |
| 11 | tinyhttp | 11,968 | 82.98 | 118.00 | 6.68 | 103.1 | 178 | 0 | 67% |
| 12 | koa | 10,883 | 91.31 | 130.00 | 5.31 | 93.4 | 115 | 0 | 61% |
| 13 | hapi | 9,038 | 110.03 | 145.00 | 4.63 | 111.7 | 139 | 0 | 51% |
| 14 | express | 5,994 | 166.05 | 210.00 | 2.93 | 183.6 | 162 | 0 | 34% |

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
