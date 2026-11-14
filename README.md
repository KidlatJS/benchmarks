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
Run on 11/15/2026, 00:56:03 (Manila Time, UTC+8) · AMD EPYC 7763 64-Core Processor (4 threads, 16 GB) · Linux 7.0.0-1019-azure (x64) · Node v22.23.4

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | uws | 20.71.0 | 109,438 | 114,290 | 86,732 | 102,751 | 320% |
| 2 | **kidlat** | 2.6.0 | 98,877 | 95,464 | 111,030 | 101,576 | 316% |
| 3 | hyper-express | 7.0.2 | 105,333 | 100,499 | 44,198 | 77,633 | 241% |
| 4 | 0http | 5.2.0 | 50,652 | 49,706 | 19,881 | 36,854 | 115% |
| 5 | node-http | 22.23.4 | 42,719 | 43,202 | 18,012 | 32,153 | 100% |
| 6 | fastify | 5.12.7 | 43,030 | 42,621 | 17,277 | 31,644 | 98% |
| 7 | hono | 4.13.13 | 42,146 | 40,754 | 15,984 | 30,167 | 94% |
| 8 | h3 | 2.0.2 | 41,454 | 39,327 | 16,733 | 30,103 | 94% |
| 9 | polka | 0.5.2 | 43,088 | 40,617 | 15,336 | 29,940 | 93% |
| 10 | restify | 12.0.0 | 32,135 | 30,833 | 12,444 | 23,102 | 72% |
| 11 | koa | 3.2.1 | 29,981 | 29,812 | 10,623 | 21,175 | 66% |
| 12 | hapi | 21.4.10 | 30,581 | 29,383 | 8,957 | 20,040 | 62% |
| 13 | tinyhttp | 3.0.11 | 22,925 | 22,667 | 11,430 | 18,110 | 56% |
| 14 | express | 5.3.0 | 10,853 | 10,667 | 5,865 | 8,789 | 27% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 109,438 | 8.75 | 12.00 | 16.39 | 8.5 | 58 | 0 | 256% |
| 2 | hyper-express | 105,333 | 9.00 | 17.00 | 14.06 | 9.7 | 71 | 0 | 247% |
| 3 | **kidlat** | 98,877 | 9.58 | 16.00 | 18.58 | 9.5 | 64 | 0 | 231% |
| 4 | 0http | 50,652 | 19.25 | 39.00 | 9.03 | 20.1 | 104 | 0 | 119% |
| 5 | polka | 43,088 | 22.70 | 45.00 | 7.68 | 23.3 | 101 | 0 | 101% |
| 6 | fastify | 43,030 | 22.73 | 47.00 | 7.71 | 23.4 | 106 | 0 | 101% |
| 7 | node-http | 42,719 | 22.90 | 44.00 | 8.39 | 23.5 | 105 | 0 | 100% |
| 8 | hono | 42,146 | 23.22 | 42.00 | 6.91 | 23.9 | 106 | 0 | 99% |
| 9 | h3 | 41,454 | 23.62 | 44.00 | 7.27 | 24.3 | 107 | 0 | 97% |
| 10 | restify | 32,135 | 30.61 | 60.00 | 5.79 | 31.4 | 114 | 0 | 75% |
| 11 | hapi | 30,581 | 32.20 | 61.00 | 6.82 | 33.2 | 121 | 0 | 72% |
| 12 | koa | 29,981 | 32.84 | 67.00 | 5.35 | 33.6 | 118 | 0 | 70% |
| 13 | tinyhttp | 22,925 | 43.12 | 90.00 | 3.87 | 59.2 | 173 | 0 | 54% |
| 14 | express | 10,853 | 91.55 | 135.00 | 1.94 | 103.9 | 161 | 0 | 25% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 114,290 | 8.34 | 15.00 | 16.46 | 8.4 | 59 | 0 | 265% |
| 2 | hyper-express | 100,499 | 9.39 | 18.00 | 12.84 | 10.1 | 78 | 0 | 233% |
| 3 | **kidlat** | 95,464 | 10.13 | 14.00 | 17.39 | 9.6 | 64 | 0 | 221% |
| 4 | 0http | 49,706 | 19.61 | 35.00 | 8.58 | 20.5 | 109 | 0 | 115% |
| 5 | node-http | 43,202 | 22.64 | 39.00 | 8.20 | 23.2 | 109 | 0 | 100% |
| 6 | fastify | 42,621 | 22.95 | 46.00 | 7.40 | 23.6 | 111 | 0 | 99% |
| 7 | hono | 40,754 | 24.04 | 41.00 | 6.45 | 24.6 | 111 | 0 | 94% |
| 8 | polka | 40,617 | 24.13 | 51.00 | 7.01 | 24.7 | 107 | 0 | 94% |
| 9 | h3 | 39,327 | 24.92 | 49.00 | 6.68 | 25.5 | 112 | 0 | 91% |
| 10 | restify | 30,833 | 31.92 | 62.00 | 5.38 | 32.6 | 125 | 0 | 71% |
| 11 | koa | 29,812 | 33.04 | 59.00 | 5.15 | 33.7 | 128 | 0 | 69% |
| 12 | hapi | 29,383 | 33.53 | 62.00 | 6.39 | 34.4 | 136 | 0 | 68% |
| 13 | tinyhttp | 22,667 | 43.61 | 85.00 | 3.70 | 59.1 | 173 | 0 | 52% |
| 14 | express | 10,667 | 93.15 | 129.00 | 1.84 | 105.6 | 161 | 0 | 25% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 111,030 | 8.42 | 12.00 | 55.27 | 8.8 | 64 | 0 | 616% |
| 2 | uws | 86,732 | 10.99 | 21.00 | 39.87 | 11.8 | 67 | 0 | 482% |
| 3 | hyper-express | 44,198 | 22.12 | 36.00 | 19.60 | 23.1 | 100 | 0 | 245% |
| 4 | 0http | 19,881 | 49.78 | 104.00 | 9.71 | 51.7 | 112 | 0 | 110% |
| 5 | node-http | 18,012 | 54.99 | 81.00 | 9.12 | 56.3 | 112 | 0 | 100% |
| 6 | fastify | 17,277 | 57.35 | 83.00 | 8.45 | 58.7 | 105 | 0 | 96% |
| 7 | h3 | 16,733 | 59.20 | 87.00 | 8.12 | 60.7 | 110 | 0 | 93% |
| 8 | hono | 15,984 | 62.03 | 94.00 | 7.58 | 63.6 | 111 | 0 | 89% |
| 9 | polka | 15,336 | 64.66 | 95.00 | 7.49 | 66.5 | 102 | 0 | 85% |
| 10 | restify | 12,444 | 79.77 | 115.00 | 6.10 | 81.6 | 112 | 0 | 69% |
| 11 | tinyhttp | 11,430 | 86.92 | 123.00 | 6.38 | 107.8 | 176 | 0 | 63% |
| 12 | koa | 10,623 | 93.53 | 132.00 | 5.19 | 95.8 | 113 | 0 | 59% |
| 13 | hapi | 8,957 | 111.01 | 149.00 | 4.59 | 112.9 | 136 | 0 | 50% |
| 14 | express | 5,865 | 169.59 | 209.00 | 2.86 | 188.9 | 161 | 0 | 33% |

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
