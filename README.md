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
Run on 11/13/2026, 08:02:45 (Manila Time, UTC+8) · INTEL(R) XEON(R) PLATINUM 8573C (4 threads, 16 GB) · Linux 7.0.0-1019-azure (x64) · Node v22.23.4

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | uws | 20.71.0 | 155,274 | 155,907 | 130,922 | 146,890 | 237% |
| 2 | **kidlat** | 2.6.0 | 134,144 | 137,931 | 158,141 | 143,030 | 231% |
| 3 | hyper-express | 7.0.2 | 169,702 | 156,848 | 74,309 | 125,527 | 203% |
| 4 | fastify | 5.12.7 | 79,154 | 79,320 | 38,916 | 62,516 | 101% |
| 5 | node-http | 22.23.4 | 77,152 | 77,221 | 39,794 | 61,892 | 100% |
| 6 | h3 | 2.0.2 | 76,598 | 75,008 | 36,870 | 59,612 | 96% |
| 7 | polka | 0.5.2 | 81,723 | 75,901 | 33,902 | 59,466 | 96% |
| 8 | hono | 4.13.13 | 74,862 | 73,358 | 35,405 | 57,933 | 94% |
| 9 | 0http | 5.2.0 | 72,912 | 70,490 | 36,586 | 57,290 | 93% |
| 10 | restify | 12.0.0 | 55,628 | 54,954 | 26,626 | 43,338 | 70% |
| 11 | koa | 3.2.1 | 54,402 | 54,357 | 24,834 | 41,877 | 68% |
| 12 | hapi | 21.4.10 | 48,688 | 46,666 | 21,232 | 36,403 | 59% |
| 13 | tinyhttp | 3.0.11 | 38,284 | 37,313 | 23,035 | 32,045 | 52% |
| 14 | express | 5.3.0 | 16,301 | 15,951 | 10,482 | 13,969 | 23% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 169,702 | 5.36 | 9.00 | 22.66 | 6.2 | 72 | 0 | 220% |
| 2 | uws | 155,274 | 6.10 | 9.00 | 23.25 | 5.6 | 58 | 0 | 201% |
| 3 | **kidlat** | 134,144 | 7.03 | 11.00 | 25.21 | 6.0 | 63 | 0 | 174% |
| 4 | polka | 81,723 | 11.73 | 20.00 | 14.57 | 12.3 | 101 | 0 | 106% |
| 5 | fastify | 79,154 | 12.14 | 21.00 | 14.19 | 12.7 | 106 | 0 | 103% |
| 6 | node-http | 77,152 | 12.47 | 21.00 | 15.16 | 13.1 | 103 | 0 | 100% |
| 7 | h3 | 76,598 | 12.56 | 22.00 | 13.44 | 13.2 | 108 | 0 | 99% |
| 8 | hono | 74,862 | 12.86 | 22.00 | 12.28 | 13.5 | 108 | 0 | 97% |
| 9 | 0http | 72,912 | 13.22 | 28.00 | 13.00 | 19.1 | 141 | 0 | 95% |
| 10 | restify | 55,628 | 17.48 | 32.00 | 10.03 | 18.2 | 117 | 0 | 72% |
| 11 | koa | 54,402 | 17.88 | 36.00 | 9.70 | 18.6 | 119 | 0 | 71% |
| 12 | hapi | 48,688 | 20.04 | 38.00 | 10.87 | 21.0 | 125 | 0 | 63% |
| 13 | tinyhttp | 38,284 | 25.63 | 48.00 | 6.46 | 42.1 | 178 | 0 | 50% |
| 14 | express | 16,301 | 60.81 | 81.00 | 2.91 | 72.4 | 175 | 0 | 21% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 156,848 | 5.87 | 9.00 | 20.04 | 6.6 | 80 | 0 | 203% |
| 2 | uws | 155,907 | 6.06 | 9.00 | 22.45 | 5.7 | 59 | 0 | 202% |
| 3 | **kidlat** | 137,931 | 6.73 | 11.00 | 25.12 | 6.2 | 64 | 0 | 179% |
| 4 | fastify | 79,320 | 12.12 | 20.00 | 13.77 | 12.7 | 112 | 0 | 103% |
| 5 | node-http | 77,221 | 12.45 | 21.00 | 14.65 | 13.0 | 108 | 0 | 100% |
| 6 | polka | 75,901 | 12.69 | 24.00 | 13.10 | 13.2 | 107 | 0 | 98% |
| 7 | h3 | 75,008 | 12.83 | 22.00 | 12.73 | 13.4 | 112 | 0 | 97% |
| 8 | hono | 73,358 | 13.13 | 24.00 | 11.61 | 13.7 | 112 | 0 | 95% |
| 9 | 0http | 70,490 | 13.70 | 29.00 | 12.17 | 19.7 | 142 | 0 | 91% |
| 10 | restify | 54,954 | 17.70 | 34.00 | 9.59 | 18.3 | 128 | 0 | 71% |
| 11 | koa | 54,357 | 17.90 | 36.00 | 9.38 | 18.5 | 128 | 0 | 70% |
| 12 | hapi | 46,666 | 20.92 | 39.00 | 10.15 | 21.8 | 159 | 0 | 60% |
| 13 | tinyhttp | 37,313 | 26.31 | 50.00 | 6.08 | 42.9 | 178 | 0 | 48% |
| 14 | express | 15,951 | 62.14 | 81.00 | 2.75 | 73.2 | 175 | 0 | 21% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 158,141 | 6.01 | 9.00 | 78.73 | 6.1 | 68 | 0 | 397% |
| 2 | uws | 130,922 | 7.18 | 11.00 | 60.18 | 8.0 | 67 | 0 | 329% |
| 3 | hyper-express | 74,309 | 13.01 | 19.00 | 32.95 | 14.2 | 102 | 0 | 187% |
| 4 | node-http | 39,794 | 24.63 | 53.00 | 20.15 | 25.8 | 110 | 0 | 100% |
| 5 | fastify | 38,916 | 25.19 | 54.00 | 19.04 | 26.4 | 116 | 0 | 98% |
| 6 | h3 | 36,870 | 26.62 | 59.00 | 17.90 | 27.7 | 114 | 0 | 93% |
| 7 | 0http | 36,586 | 26.84 | 59.00 | 17.86 | 38.3 | 169 | 0 | 92% |
| 8 | hono | 35,405 | 27.74 | 59.00 | 16.78 | 28.9 | 109 | 0 | 89% |
| 9 | polka | 33,902 | 28.99 | 62.00 | 16.55 | 30.5 | 106 | 0 | 85% |
| 10 | restify | 26,626 | 37.05 | 73.00 | 13.05 | 38.4 | 114 | 0 | 67% |
| 11 | koa | 24,834 | 39.76 | 77.00 | 12.13 | 41.4 | 114 | 0 | 62% |
| 12 | tinyhttp | 23,035 | 42.90 | 85.00 | 12.85 | 64.1 | 192 | 0 | 58% |
| 13 | hapi | 21,232 | 46.57 | 76.00 | 10.87 | 48.1 | 159 | 0 | 53% |
| 14 | express | 10,482 | 94.80 | 130.00 | 5.12 | 111.0 | 179 | 0 | 26% |

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
