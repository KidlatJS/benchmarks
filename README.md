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
Run on 11/07/2026, 01:19:47 (Manila Time, UTC+8) · AMD EPYC 7763 64-Core Processor (4 threads, 16 GB) · Linux 7.0.0-1019-azure (x64) · Node v22.23.4

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 2.6.0 | 106,837 | 103,426 | 108,710 | 106,302 | 320% |
| 2 | uws | 20.71.0 | 102,245 | 94,998 | 85,915 | 94,147 | 284% |
| 3 | hyper-express | 7.0.2 | 110,933 | 103,690 | 47,079 | 81,509 | 246% |
| 4 | 0http | 5.2.0 | 55,402 | 52,931 | 21,686 | 39,916 | 120% |
| 5 | node-http | 22.23.4 | 44,745 | 44,894 | 18,206 | 33,193 | 100% |
| 6 | fastify | 5.12.7 | 43,967 | 43,126 | 17,520 | 32,146 | 97% |
| 7 | polka | 0.5.2 | 45,137 | 42,609 | 15,829 | 31,224 | 94% |
| 8 | hono | 4.13.13 | 43,069 | 41,723 | 16,300 | 30,826 | 93% |
| 9 | h3 | 2.0.2 | 43,402 | 39,982 | 16,829 | 30,795 | 93% |
| 10 | restify | 12.0.0 | 33,112 | 31,577 | 12,300 | 23,429 | 71% |
| 11 | koa | 3.2.1 | 31,464 | 31,076 | 10,866 | 21,984 | 66% |
| 12 | hapi | 21.4.10 | 31,529 | 30,473 | 9,105 | 20,604 | 62% |
| 13 | tinyhttp | 3.0.11 | 24,253 | 23,506 | 12,019 | 18,994 | 57% |
| 14 | express | 5.3.0 | 11,588 | 11,345 | 6,001 | 9,240 | 28% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 110,933 | 8.37 | 17.00 | 14.81 | 9.2 | 70 | 0 | 248% |
| 2 | **kidlat** | 106,837 | 8.97 | 16.00 | 20.07 | 9.1 | 64 | 0 | 239% |
| 3 | uws | 102,245 | 9.38 | 15.00 | 15.31 | 8.7 | 58 | 0 | 229% |
| 4 | 0http | 55,402 | 17.56 | 27.00 | 9.88 | 18.3 | 102 | 0 | 124% |
| 5 | polka | 45,137 | 21.68 | 38.00 | 8.05 | 22.3 | 98 | 0 | 101% |
| 6 | node-http | 44,745 | 21.88 | 45.00 | 8.79 | 22.5 | 105 | 0 | 100% |
| 7 | fastify | 43,967 | 22.26 | 45.00 | 7.88 | 22.9 | 104 | 0 | 98% |
| 8 | h3 | 43,402 | 22.55 | 47.00 | 7.62 | 23.2 | 105 | 0 | 97% |
| 9 | hono | 43,069 | 22.70 | 46.00 | 7.06 | 23.3 | 104 | 0 | 96% |
| 10 | restify | 33,112 | 29.71 | 56.00 | 5.97 | 30.4 | 114 | 0 | 74% |
| 11 | hapi | 31,529 | 31.21 | 62.00 | 7.04 | 32.1 | 120 | 0 | 70% |
| 12 | koa | 31,464 | 31.28 | 59.00 | 5.61 | 32.0 | 118 | 0 | 70% |
| 13 | tinyhttp | 24,253 | 40.72 | 79.00 | 4.09 | 55.6 | 174 | 0 | 54% |
| 14 | express | 11,588 | 85.74 | 127.00 | 2.07 | 97.5 | 148 | 0 | 26% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 103,690 | 9.29 | 17.00 | 13.25 | 9.8 | 79 | 0 | 231% |
| 2 | **kidlat** | 103,426 | 9.26 | 14.00 | 18.84 | 9.3 | 64 | 0 | 230% |
| 3 | uws | 94,998 | 10.19 | 16.00 | 13.68 | 9.3 | 58 | 0 | 212% |
| 4 | 0http | 52,931 | 18.39 | 35.00 | 9.14 | 19.3 | 106 | 0 | 118% |
| 5 | node-http | 44,894 | 21.80 | 37.00 | 8.52 | 22.3 | 110 | 0 | 100% |
| 6 | fastify | 43,126 | 22.68 | 42.00 | 7.49 | 23.3 | 109 | 0 | 96% |
| 7 | polka | 42,609 | 22.96 | 42.00 | 7.35 | 23.5 | 104 | 0 | 95% |
| 8 | hono | 41,723 | 23.46 | 49.00 | 6.61 | 24.0 | 108 | 0 | 93% |
| 9 | h3 | 39,982 | 24.51 | 48.00 | 6.79 | 25.1 | 110 | 0 | 89% |
| 10 | restify | 31,577 | 31.16 | 63.00 | 5.51 | 31.8 | 125 | 0 | 70% |
| 11 | koa | 31,076 | 31.67 | 59.00 | 5.36 | 32.3 | 127 | 0 | 69% |
| 12 | hapi | 30,473 | 32.31 | 65.00 | 6.63 | 33.4 | 152 | 0 | 68% |
| 13 | tinyhttp | 23,506 | 42.04 | 82.00 | 3.83 | 56.7 | 174 | 0 | 52% |
| 14 | express | 11,345 | 87.57 | 122.00 | 1.96 | 99.2 | 164 | 0 | 25% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 108,710 | 8.64 | 15.00 | 54.12 | 9.0 | 69 | 0 | 597% |
| 2 | uws | 85,915 | 11.17 | 21.00 | 39.49 | 12.0 | 67 | 0 | 472% |
| 3 | hyper-express | 47,079 | 20.70 | 35.00 | 20.88 | 21.8 | 99 | 0 | 259% |
| 4 | 0http | 21,686 | 45.59 | 91.00 | 10.59 | 47.2 | 111 | 0 | 119% |
| 5 | node-http | 18,206 | 54.41 | 77.00 | 9.22 | 55.5 | 109 | 0 | 100% |
| 6 | fastify | 17,520 | 56.54 | 84.00 | 8.57 | 57.7 | 110 | 0 | 96% |
| 7 | h3 | 16,829 | 58.88 | 86.00 | 8.17 | 60.2 | 108 | 0 | 92% |
| 8 | hono | 16,300 | 60.82 | 93.00 | 7.73 | 62.2 | 105 | 0 | 90% |
| 9 | polka | 15,829 | 62.64 | 94.00 | 7.73 | 64.2 | 104 | 0 | 87% |
| 10 | restify | 12,300 | 80.73 | 117.00 | 6.03 | 82.4 | 113 | 0 | 68% |
| 11 | tinyhttp | 12,019 | 82.64 | 113.00 | 6.71 | 101.3 | 177 | 0 | 66% |
| 12 | koa | 10,866 | 91.43 | 126.00 | 5.31 | 93.4 | 115 | 0 | 60% |
| 13 | hapi | 9,105 | 109.18 | 144.00 | 4.66 | 110.9 | 153 | 0 | 50% |
| 14 | express | 6,001 | 165.85 | 208.00 | 2.93 | 182.8 | 165 | 0 | 33% |

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
