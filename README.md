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
Run on 10/23/2026, 17:53:16 (Manila Time, UTC+8) · AMD EPYC 9V74 80-Core Processor (4 threads, 16 GB) · Linux 6.17.0-1022-azure (x64) · Node v22.23.3

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | uws | 20.71.0 | 142,973 | 150,077 | 133,450 | 142,002 | 267% |
| 2 | **kidlat** | 2.4.0 | 139,609 | 137,144 | 147,389 | 141,314 | 266% |
| 3 | hyper-express | 7.0.2 | 147,569 | 143,478 | 71,745 | 114,954 | 216% |
| 4 | fastify | 5.12.7 | 69,430 | 67,530 | 32,540 | 53,435 | 100% |
| 5 | node-http | 22.23.3 | 67,086 | 66,536 | 33,706 | 53,186 | 100% |
| 6 | h3 | 2.0.2 | 67,214 | 64,804 | 31,640 | 51,653 | 97% |
| 7 | 0http | 5.2.0 | 64,317 | 61,282 | 34,131 | 51,239 | 96% |
| 8 | polka | 0.5.2 | 70,021 | 67,127 | 27,934 | 50,826 | 96% |
| 9 | hono | 4.13.13 | 65,928 | 65,467 | 29,326 | 50,209 | 94% |
| 10 | restify | 12.0.0 | 50,608 | 49,952 | 23,070 | 38,780 | 73% |
| 11 | koa | 3.2.1 | 49,886 | 48,860 | 19,824 | 36,423 | 68% |
| 12 | hapi | 21.4.10 | 47,052 | 45,896 | 15,914 | 32,512 | 61% |
| 13 | tinyhttp | 3.0.11 | 37,303 | 36,392 | 20,647 | 30,376 | 57% |
| 14 | express | 5.3.0 | 16,402 | 16,511 | 9,097 | 13,506 | 25% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 147,569 | 6.22 | 11.00 | 19.70 | 6.9 | 70 | 0 | 220% |
| 2 | uws | 142,973 | 6.41 | 10.00 | 21.41 | 6.5 | 58 | 0 | 213% |
| 3 | **kidlat** | 139,609 | 6.62 | 10.00 | 26.23 | 7.0 | 62 | 0 | 208% |
| 4 | polka | 70,021 | 13.77 | 24.00 | 12.49 | 14.4 | 102 | 0 | 104% |
| 5 | fastify | 69,430 | 13.89 | 23.00 | 12.45 | 14.5 | 103 | 0 | 103% |
| 6 | h3 | 67,214 | 14.37 | 25.00 | 11.79 | 15.0 | 108 | 0 | 100% |
| 7 | node-http | 67,086 | 14.42 | 25.00 | 13.18 | 15.0 | 103 | 0 | 100% |
| 8 | hono | 65,928 | 14.68 | 26.00 | 10.81 | 15.3 | 103 | 0 | 98% |
| 9 | 0http | 64,317 | 15.05 | 32.00 | 11.47 | 20.2 | 151 | 0 | 96% |
| 10 | restify | 50,608 | 19.25 | 36.00 | 9.12 | 20.0 | 113 | 0 | 75% |
| 11 | koa | 49,886 | 19.55 | 37.00 | 8.90 | 20.2 | 118 | 0 | 74% |
| 12 | hapi | 47,052 | 20.76 | 38.00 | 10.50 | 21.6 | 122 | 0 | 70% |
| 13 | tinyhttp | 37,303 | 26.32 | 54.00 | 6.30 | 40.2 | 182 | 0 | 56% |
| 14 | express | 16,402 | 60.44 | 84.00 | 2.92 | 70.9 | 167 | 0 | 24% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 150,077 | 6.17 | 8.00 | 21.61 | 6.2 | 60 | 0 | 226% |
| 2 | hyper-express | 143,478 | 6.32 | 10.00 | 18.34 | 7.1 | 78 | 0 | 216% |
| 3 | **kidlat** | 137,144 | 6.90 | 10.00 | 24.98 | 7.1 | 62 | 0 | 206% |
| 4 | fastify | 67,530 | 14.30 | 26.00 | 11.72 | 14.9 | 109 | 0 | 101% |
| 5 | polka | 67,127 | 14.40 | 25.00 | 11.59 | 15.0 | 107 | 0 | 101% |
| 6 | node-http | 66,536 | 14.54 | 26.00 | 12.63 | 15.1 | 109 | 0 | 100% |
| 7 | hono | 65,467 | 14.79 | 26.00 | 10.36 | 15.3 | 108 | 0 | 98% |
| 8 | h3 | 64,804 | 14.95 | 26.00 | 11.00 | 15.5 | 111 | 0 | 97% |
| 9 | 0http | 61,282 | 15.82 | 34.00 | 10.58 | 21.2 | 152 | 0 | 92% |
| 10 | restify | 49,952 | 19.51 | 37.00 | 8.72 | 20.2 | 124 | 0 | 75% |
| 11 | koa | 48,860 | 19.96 | 38.00 | 8.43 | 20.6 | 127 | 0 | 73% |
| 12 | hapi | 45,896 | 21.29 | 39.00 | 9.98 | 22.1 | 158 | 0 | 69% |
| 13 | tinyhttp | 36,392 | 26.98 | 54.00 | 5.93 | 41.6 | 184 | 0 | 55% |
| 14 | express | 16,511 | 60.04 | 82.00 | 2.85 | 70.2 | 173 | 0 | 25% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 147,389 | 6.25 | 10.00 | 73.38 | 6.6 | 62 | 0 | 437% |
| 2 | uws | 133,450 | 7.11 | 12.00 | 61.34 | 7.7 | 67 | 0 | 396% |
| 3 | hyper-express | 71,745 | 13.45 | 22.00 | 31.81 | 14.7 | 99 | 0 | 213% |
| 4 | 0http | 34,131 | 28.80 | 61.00 | 16.67 | 39.6 | 169 | 0 | 101% |
| 5 | node-http | 33,706 | 29.16 | 60.00 | 17.07 | 30.2 | 105 | 0 | 100% |
| 6 | fastify | 32,540 | 30.22 | 62.00 | 15.92 | 31.2 | 114 | 0 | 97% |
| 7 | h3 | 31,640 | 31.10 | 64.00 | 15.36 | 32.0 | 112 | 0 | 94% |
| 8 | hono | 29,326 | 33.60 | 68.00 | 13.90 | 34.6 | 116 | 0 | 87% |
| 9 | polka | 27,934 | 35.29 | 71.00 | 13.64 | 36.6 | 100 | 0 | 83% |
| 10 | restify | 23,070 | 42.83 | 79.00 | 11.31 | 44.1 | 123 | 0 | 68% |
| 11 | tinyhttp | 20,647 | 47.93 | 80.00 | 11.52 | 65.0 | 187 | 0 | 61% |
| 12 | koa | 19,824 | 49.91 | 85.00 | 9.68 | 51.3 | 112 | 0 | 59% |
| 13 | hapi | 15,914 | 62.30 | 94.00 | 8.15 | 63.5 | 160 | 0 | 47% |
| 14 | express | 9,097 | 109.30 | 142.00 | 4.44 | 123.3 | 174 | 0 | 27% |

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
