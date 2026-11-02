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
Run on 11/02/2026, 23:26:30 (Manila Time, UTC+8) · AMD EPYC 9V74 80-Core Processor (4 threads, 16 GB) · Linux 7.0.0-1017-azure (x64) · Node v22.23.4

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | uws | 20.71.0 | 166,397 | 169,373 | 132,594 | 155,180 | 278% |
| 2 | **kidlat** | 2.6.0 | 146,352 | 144,150 | 158,054 | 149,396 | 268% |
| 3 | hyper-express | 7.0.2 | 148,706 | 141,794 | 75,573 | 116,802 | 209% |
| 4 | node-http | 22.23.4 | 70,660 | 70,320 | 35,056 | 55,848 | 100% |
| 5 | fastify | 5.12.7 | 70,944 | 70,477 | 32,460 | 54,547 | 98% |
| 6 | hono | 4.13.13 | 68,545 | 67,662 | 30,450 | 52,076 | 93% |
| 7 | polka | 0.5.2 | 71,096 | 68,431 | 28,619 | 51,830 | 93% |
| 8 | h3 | 2.0.2 | 68,948 | 65,249 | 30,116 | 51,361 | 92% |
| 9 | 0http | 5.2.0 | 63,569 | 62,267 | 33,621 | 51,055 | 91% |
| 10 | restify | 12.0.0 | 51,904 | 52,014 | 23,854 | 40,083 | 72% |
| 11 | koa | 3.2.1 | 50,625 | 50,359 | 20,358 | 37,302 | 67% |
| 12 | tinyhttp | 3.0.11 | 36,967 | 37,263 | 20,440 | 30,423 | 54% |
| 13 | hapi | 21.4.10 | 39,576 | 38,237 | 14,075 | 27,720 | 50% |
| 14 | express | 5.3.0 | 16,184 | 16,278 | 9,055 | 13,361 | 24% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 166,397 | 5.40 | 10.00 | 24.91 | 5.8 | 58 | 0 | 235% |
| 2 | hyper-express | 148,706 | 6.19 | 11.00 | 19.85 | 6.9 | 71 | 0 | 210% |
| 3 | **kidlat** | 146,352 | 6.25 | 9.00 | 27.49 | 6.6 | 63 | 0 | 207% |
| 4 | polka | 71,096 | 13.56 | 27.00 | 12.68 | 14.1 | 101 | 0 | 101% |
| 5 | fastify | 70,944 | 13.62 | 27.00 | 12.72 | 14.2 | 107 | 0 | 100% |
| 6 | node-http | 70,660 | 13.70 | 25.00 | 13.88 | 14.2 | 103 | 0 | 100% |
| 7 | h3 | 68,948 | 14.02 | 28.00 | 12.10 | 14.6 | 105 | 0 | 98% |
| 8 | hono | 68,545 | 14.09 | 28.00 | 11.24 | 14.7 | 109 | 0 | 97% |
| 9 | 0http | 63,569 | 15.24 | 33.00 | 11.34 | 20.4 | 145 | 0 | 90% |
| 10 | restify | 51,904 | 18.77 | 39.00 | 9.35 | 19.4 | 113 | 0 | 73% |
| 11 | koa | 50,625 | 19.27 | 43.00 | 9.03 | 19.9 | 117 | 0 | 72% |
| 12 | hapi | 39,576 | 24.76 | 50.00 | 8.83 | 25.7 | 117 | 0 | 56% |
| 13 | tinyhttp | 36,967 | 26.56 | 57.00 | 6.24 | 39.1 | 182 | 0 | 52% |
| 14 | express | 16,184 | 61.25 | 83.00 | 2.89 | 71.4 | 169 | 0 | 23% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 169,373 | 5.30 | 8.00 | 24.39 | 5.8 | 59 | 0 | 241% |
| 2 | **kidlat** | 144,150 | 6.30 | 7.00 | 26.26 | 6.6 | 64 | 0 | 205% |
| 3 | hyper-express | 141,794 | 6.44 | 12.00 | 18.12 | 7.2 | 79 | 0 | 202% |
| 4 | fastify | 70,477 | 13.74 | 25.00 | 12.23 | 14.3 | 112 | 0 | 100% |
| 5 | node-http | 70,320 | 13.75 | 26.00 | 13.35 | 14.3 | 108 | 0 | 100% |
| 6 | polka | 68,431 | 14.12 | 27.00 | 11.81 | 14.7 | 107 | 0 | 97% |
| 7 | hono | 67,662 | 14.30 | 29.00 | 10.71 | 14.8 | 113 | 0 | 96% |
| 8 | h3 | 65,249 | 14.81 | 29.00 | 11.08 | 15.4 | 111 | 0 | 93% |
| 9 | 0http | 62,267 | 15.56 | 34.00 | 10.75 | 20.7 | 152 | 0 | 89% |
| 10 | restify | 52,014 | 18.73 | 37.00 | 9.08 | 19.4 | 125 | 0 | 74% |
| 11 | koa | 50,359 | 19.38 | 42.00 | 8.69 | 20.0 | 127 | 0 | 72% |
| 12 | hapi | 38,237 | 25.65 | 52.00 | 8.31 | 26.5 | 133 | 0 | 54% |
| 13 | tinyhttp | 37,263 | 26.34 | 54.00 | 6.08 | 39.4 | 182 | 0 | 53% |
| 14 | express | 16,278 | 60.89 | 83.00 | 2.81 | 70.7 | 176 | 0 | 23% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 158,054 | 6.08 | 10.00 | 78.69 | 6.2 | 67 | 0 | 451% |
| 2 | uws | 132,594 | 7.19 | 13.00 | 60.95 | 7.7 | 67 | 0 | 378% |
| 3 | hyper-express | 75,573 | 12.81 | 21.00 | 33.52 | 13.6 | 99 | 0 | 216% |
| 4 | node-http | 35,056 | 28.01 | 60.00 | 17.75 | 29.0 | 114 | 0 | 100% |
| 5 | 0http | 33,621 | 29.24 | 68.00 | 16.42 | 39.1 | 168 | 0 | 96% |
| 6 | fastify | 32,460 | 30.30 | 64.00 | 15.88 | 31.3 | 112 | 0 | 93% |
| 7 | hono | 30,450 | 32.33 | 66.00 | 14.43 | 33.3 | 116 | 0 | 87% |
| 8 | h3 | 30,116 | 32.68 | 69.00 | 14.62 | 33.7 | 112 | 0 | 86% |
| 9 | polka | 28,619 | 34.43 | 71.00 | 13.97 | 35.6 | 106 | 0 | 82% |
| 10 | restify | 23,854 | 41.41 | 77.00 | 11.69 | 42.5 | 113 | 0 | 68% |
| 11 | tinyhttp | 20,440 | 48.40 | 84.00 | 11.40 | 65.1 | 186 | 0 | 58% |
| 12 | koa | 20,358 | 48.60 | 79.00 | 9.94 | 50.1 | 114 | 0 | 58% |
| 13 | hapi | 14,075 | 70.49 | 106.00 | 7.21 | 71.8 | 134 | 0 | 40% |
| 14 | express | 9,055 | 109.80 | 146.00 | 4.42 | 124.5 | 177 | 0 | 26% |

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
