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
Run on 11/12/2026, 17:37:17 (Manila Time, UTC+8) · AMD EPYC 9V74 80-Core Processor (4 threads, 16 GB) · Linux 7.0.0-1019-azure (x64) · Node v22.23.4

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | uws | 20.71.0 | 163,069 | 166,842 | 129,650 | 152,224 | 280% |
| 2 | **kidlat** | 2.6.0 | 142,640 | 142,326 | 156,422 | 146,985 | 270% |
| 3 | hyper-express | 7.0.2 | 147,470 | 142,549 | 73,354 | 115,530 | 212% |
| 4 | fastify | 5.12.7 | 71,075 | 69,909 | 32,617 | 54,521 | 100% |
| 5 | node-http | 22.23.4 | 68,926 | 69,549 | 33,667 | 54,445 | 100% |
| 6 | h3 | 2.0.2 | 67,044 | 65,685 | 30,282 | 51,090 | 94% |
| 7 | hono | 4.13.13 | 67,396 | 65,388 | 30,078 | 50,987 | 94% |
| 8 | polka | 0.5.2 | 69,804 | 66,496 | 27,318 | 50,239 | 92% |
| 9 | 0http | 5.2.0 | 61,003 | 59,077 | 34,326 | 49,827 | 92% |
| 10 | restify | 12.0.0 | 52,713 | 51,370 | 23,040 | 39,662 | 73% |
| 11 | koa | 3.2.1 | 50,971 | 50,319 | 19,335 | 36,739 | 67% |
| 12 | hapi | 21.4.10 | 47,182 | 45,454 | 15,266 | 31,991 | 59% |
| 13 | tinyhttp | 3.0.11 | 36,922 | 36,121 | 19,858 | 29,808 | 55% |
| 14 | express | 5.3.0 | 16,084 | 16,171 | 8,914 | 13,236 | 24% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 163,069 | 5.59 | 9.00 | 24.42 | 5.9 | 58 | 0 | 237% |
| 2 | hyper-express | 147,470 | 6.25 | 11.00 | 19.69 | 6.9 | 71 | 0 | 214% |
| 3 | **kidlat** | 142,640 | 6.38 | 10.00 | 26.80 | 6.7 | 63 | 0 | 207% |
| 4 | fastify | 71,075 | 13.63 | 25.00 | 12.74 | 14.1 | 107 | 0 | 103% |
| 5 | polka | 69,804 | 13.89 | 29.00 | 12.45 | 14.4 | 98 | 0 | 101% |
| 6 | node-http | 68,926 | 14.00 | 27.00 | 13.54 | 14.6 | 103 | 0 | 100% |
| 7 | hono | 67,396 | 14.32 | 28.00 | 11.06 | 14.9 | 108 | 0 | 98% |
| 8 | h3 | 67,044 | 14.40 | 30.00 | 11.77 | 15.0 | 106 | 0 | 97% |
| 9 | 0http | 61,003 | 15.89 | 35.00 | 10.88 | 21.3 | 147 | 0 | 89% |
| 10 | restify | 52,713 | 18.44 | 38.00 | 9.50 | 19.1 | 114 | 0 | 76% |
| 11 | koa | 50,971 | 19.16 | 41.00 | 9.09 | 19.8 | 118 | 0 | 74% |
| 12 | hapi | 47,182 | 20.74 | 44.00 | 10.53 | 21.5 | 120 | 0 | 68% |
| 13 | tinyhttp | 36,922 | 26.58 | 55.00 | 6.23 | 39.6 | 175 | 0 | 54% |
| 14 | express | 16,084 | 61.63 | 85.00 | 2.87 | 72.3 | 169 | 0 | 23% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 166,842 | 5.36 | 9.00 | 24.03 | 5.9 | 59 | 0 | 240% |
| 2 | hyper-express | 142,549 | 6.40 | 12.00 | 18.22 | 7.1 | 79 | 0 | 205% |
| 3 | **kidlat** | 142,326 | 6.37 | 10.00 | 25.92 | 6.6 | 63 | 0 | 205% |
| 4 | fastify | 69,909 | 13.84 | 26.00 | 12.13 | 14.4 | 112 | 0 | 101% |
| 5 | node-http | 69,549 | 13.90 | 26.00 | 13.20 | 14.4 | 107 | 0 | 100% |
| 6 | polka | 66,496 | 14.51 | 29.00 | 11.48 | 15.1 | 104 | 0 | 96% |
| 7 | h3 | 65,685 | 14.70 | 27.00 | 11.15 | 15.3 | 110 | 0 | 94% |
| 8 | hono | 65,388 | 14.77 | 30.00 | 10.35 | 15.4 | 113 | 0 | 94% |
| 9 | 0http | 59,077 | 16.43 | 36.00 | 10.20 | 22.0 | 153 | 0 | 85% |
| 10 | restify | 51,370 | 19.00 | 40.00 | 8.96 | 19.6 | 124 | 0 | 74% |
| 11 | koa | 50,319 | 19.38 | 41.00 | 8.69 | 20.0 | 127 | 0 | 72% |
| 12 | hapi | 45,454 | 21.47 | 46.00 | 9.88 | 22.3 | 121 | 0 | 65% |
| 13 | tinyhttp | 36,121 | 27.18 | 55.00 | 5.89 | 40.8 | 175 | 0 | 52% |
| 14 | express | 16,171 | 61.31 | 84.00 | 2.79 | 72.5 | 169 | 0 | 23% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 156,422 | 6.12 | 10.00 | 77.87 | 6.3 | 68 | 0 | 465% |
| 2 | uws | 129,650 | 7.37 | 13.00 | 59.59 | 7.9 | 68 | 0 | 385% |
| 3 | hyper-express | 73,354 | 13.24 | 21.00 | 32.53 | 14.0 | 101 | 0 | 218% |
| 4 | 0http | 34,326 | 28.63 | 62.00 | 16.76 | 38.0 | 168 | 0 | 102% |
| 5 | node-http | 33,667 | 29.20 | 60.00 | 17.05 | 30.1 | 114 | 0 | 100% |
| 6 | fastify | 32,617 | 30.15 | 61.00 | 15.96 | 31.1 | 106 | 0 | 97% |
| 7 | h3 | 30,282 | 32.51 | 66.00 | 14.70 | 33.5 | 111 | 0 | 90% |
| 8 | hono | 30,078 | 32.74 | 67.00 | 14.26 | 33.8 | 113 | 0 | 89% |
| 9 | polka | 27,318 | 36.09 | 74.00 | 13.34 | 37.2 | 105 | 0 | 81% |
| 10 | restify | 23,040 | 42.88 | 77.00 | 11.29 | 44.0 | 113 | 0 | 68% |
| 11 | tinyhttp | 19,858 | 49.84 | 79.00 | 11.08 | 67.4 | 179 | 0 | 59% |
| 12 | koa | 19,335 | 51.20 | 84.00 | 9.44 | 52.5 | 116 | 0 | 57% |
| 13 | hapi | 15,266 | 64.95 | 99.00 | 7.82 | 66.2 | 122 | 0 | 45% |
| 14 | express | 8,914 | 111.52 | 148.00 | 4.35 | 128.0 | 170 | 0 | 26% |

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
