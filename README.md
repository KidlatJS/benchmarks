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
Run on 11/08/2026, 00:15:25 (Manila Time, UTC+8) · AMD EPYC 7763 64-Core Processor (4 threads, 16 GB) · Linux 7.0.0-1019-azure (x64) · Node v22.23.4

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 2.6.0 | 104,590 | 102,725 | 110,018 | 105,733 | 316% |
| 2 | uws | 20.71.0 | 105,504 | 116,104 | 91,677 | 103,942 | 311% |
| 3 | hyper-express | 7.0.2 | 105,528 | 101,637 | 44,488 | 78,142 | 234% |
| 4 | 0http | 5.2.0 | 45,754 | 44,704 | 19,875 | 34,384 | 103% |
| 5 | node-http | 22.23.4 | 45,179 | 45,394 | 18,267 | 33,460 | 100% |
| 6 | fastify | 5.12.7 | 44,765 | 44,311 | 17,370 | 32,540 | 97% |
| 7 | hono | 4.13.13 | 43,552 | 41,783 | 17,222 | 31,528 | 94% |
| 8 | h3 | 2.0.2 | 43,490 | 41,167 | 17,372 | 31,449 | 94% |
| 9 | polka | 0.5.2 | 45,750 | 43,113 | 15,443 | 31,230 | 93% |
| 10 | restify | 12.0.0 | 33,616 | 33,222 | 12,399 | 24,014 | 72% |
| 11 | koa | 3.2.1 | 31,366 | 30,852 | 10,823 | 21,879 | 65% |
| 12 | tinyhttp | 3.0.11 | 24,878 | 23,928 | 12,048 | 19,285 | 58% |
| 13 | hapi | 21.4.10 | 27,104 | 26,126 | 8,171 | 17,953 | 54% |
| 14 | express | 5.3.0 | 11,506 | 11,440 | 6,191 | 9,341 | 28% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 105,528 | 9.05 | 17.00 | 14.09 | 9.6 | 71 | 0 | 234% |
| 2 | uws | 105,504 | 9.05 | 12.00 | 15.80 | 8.6 | 58 | 0 | 234% |
| 3 | **kidlat** | 104,590 | 9.17 | 15.00 | 19.65 | 9.4 | 63 | 0 | 232% |
| 4 | 0http | 45,754 | 21.34 | 47.00 | 8.16 | 27.4 | 146 | 0 | 101% |
| 5 | polka | 45,750 | 21.36 | 36.00 | 8.16 | 22.0 | 98 | 0 | 101% |
| 6 | node-http | 45,179 | 21.67 | 36.00 | 8.88 | 22.2 | 106 | 0 | 100% |
| 7 | fastify | 44,765 | 21.84 | 47.00 | 8.03 | 22.5 | 107 | 0 | 99% |
| 8 | hono | 43,552 | 22.43 | 40.00 | 7.14 | 23.1 | 103 | 0 | 96% |
| 9 | h3 | 43,490 | 22.48 | 42.00 | 7.63 | 23.1 | 108 | 0 | 96% |
| 10 | restify | 33,616 | 29.23 | 56.00 | 6.06 | 29.9 | 113 | 0 | 74% |
| 11 | koa | 31,366 | 31.37 | 62.00 | 5.59 | 32.1 | 114 | 0 | 69% |
| 12 | hapi | 27,104 | 36.39 | 66.00 | 6.05 | 37.3 | 118 | 0 | 60% |
| 13 | tinyhttp | 24,878 | 39.69 | 79.00 | 4.20 | 53.7 | 171 | 0 | 55% |
| 14 | express | 11,506 | 86.34 | 122.00 | 2.05 | 96.8 | 155 | 0 | 25% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 116,104 | 8.16 | 14.00 | 16.72 | 8.3 | 60 | 0 | 256% |
| 2 | **kidlat** | 102,725 | 9.26 | 16.00 | 18.71 | 9.5 | 64 | 0 | 226% |
| 3 | hyper-express | 101,637 | 9.26 | 17.00 | 12.99 | 10.0 | 79 | 0 | 224% |
| 4 | node-http | 45,394 | 21.57 | 33.00 | 8.62 | 22.1 | 110 | 0 | 100% |
| 5 | 0http | 44,704 | 21.87 | 52.00 | 7.72 | 27.9 | 146 | 0 | 98% |
| 6 | fastify | 44,311 | 22.07 | 38.00 | 7.69 | 22.6 | 112 | 0 | 98% |
| 7 | polka | 43,113 | 22.66 | 36.00 | 7.44 | 23.3 | 104 | 0 | 95% |
| 8 | hono | 41,783 | 23.45 | 47.00 | 6.62 | 24.0 | 107 | 0 | 92% |
| 9 | h3 | 41,167 | 23.78 | 38.00 | 6.99 | 24.4 | 112 | 0 | 91% |
| 10 | restify | 33,222 | 29.59 | 58.00 | 5.80 | 30.2 | 124 | 0 | 73% |
| 11 | koa | 30,852 | 31.90 | 62.00 | 5.33 | 32.6 | 124 | 0 | 68% |
| 12 | hapi | 26,126 | 37.76 | 67.00 | 5.68 | 38.7 | 118 | 0 | 58% |
| 13 | tinyhttp | 23,928 | 41.28 | 79.00 | 3.90 | 55.5 | 173 | 0 | 53% |
| 14 | express | 11,440 | 86.84 | 116.00 | 1.97 | 97.7 | 155 | 0 | 25% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 110,018 | 8.51 | 13.00 | 54.77 | 9.0 | 68 | 0 | 602% |
| 2 | uws | 91,677 | 10.31 | 18.00 | 42.14 | 11.1 | 68 | 0 | 502% |
| 3 | hyper-express | 44,488 | 21.94 | 35.00 | 19.73 | 22.8 | 99 | 0 | 244% |
| 4 | 0http | 19,875 | 49.78 | 104.00 | 9.70 | 60.3 | 166 | 0 | 109% |
| 5 | node-http | 18,267 | 54.22 | 74.00 | 9.25 | 55.3 | 108 | 0 | 100% |
| 6 | h3 | 17,372 | 57.03 | 81.00 | 8.43 | 58.2 | 109 | 0 | 95% |
| 7 | fastify | 17,370 | 57.04 | 90.00 | 8.50 | 58.2 | 108 | 0 | 95% |
| 8 | hono | 17,222 | 57.54 | 86.00 | 8.16 | 58.7 | 104 | 0 | 94% |
| 9 | polka | 15,443 | 64.20 | 99.00 | 7.54 | 65.6 | 103 | 0 | 85% |
| 10 | restify | 12,399 | 80.08 | 120.00 | 6.08 | 81.6 | 113 | 0 | 68% |
| 11 | tinyhttp | 12,048 | 82.43 | 120.00 | 6.72 | 100.6 | 177 | 0 | 66% |
| 12 | koa | 10,823 | 91.77 | 130.00 | 5.28 | 93.7 | 117 | 0 | 59% |
| 13 | hapi | 8,171 | 121.72 | 159.00 | 4.18 | 123.3 | 118 | 0 | 45% |
| 14 | express | 6,191 | 160.74 | 203.00 | 3.02 | 175.5 | 157 | 0 | 34% |

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
