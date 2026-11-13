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
Run on 11/14/2026, 00:02:36 (Manila Time, UTC+8) · AMD EPYC 9V45 96-Core Processor (4 threads, 16 GB) · Linux 7.0.0-1019-azure (x64) · Node v22.23.4

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 2.6.0 | 181,507 | 172,835 | 179,280 | 177,836 | 276% |
| 2 | uws | 20.71.0 | 190,893 | 179,562 | 152,573 | 173,577 | 269% |
| 3 | hyper-express | 7.0.2 | 175,818 | 166,781 | 88,462 | 137,401 | 213% |
| 4 | h3 | 2.0.2 | 78,683 | 75,238 | 47,082 | 65,322 | 101% |
| 5 | hono | 4.13.13 | 80,152 | 78,984 | 42,816 | 64,717 | 100% |
| 6 | fastify | 5.12.7 | 76,488 | 76,238 | 45,954 | 64,471 | 100% |
| 7 | node-http | 22.23.4 | 74,779 | 77,739 | 46,066 | 64,456 | 100% |
| 8 | polka | 0.5.2 | 79,157 | 77,010 | 41,793 | 63,394 | 98% |
| 9 | 0http | 5.2.0 | 66,153 | 72,548 | 43,114 | 59,147 | 92% |
| 10 | restify | 12.0.0 | 62,939 | 62,363 | 35,482 | 51,834 | 80% |
| 11 | koa | 3.2.1 | 59,866 | 59,703 | 33,977 | 49,521 | 77% |
| 12 | hapi | 21.4.10 | 57,314 | 55,838 | 28,928 | 45,238 | 70% |
| 13 | tinyhttp | 3.0.11 | 45,078 | 45,126 | 29,300 | 39,062 | 61% |
| 14 | express | 5.3.0 | 21,070 | 21,004 | 14,256 | 18,478 | 29% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 190,893 | 4.93 | 7.00 | 28.59 | 5.1 | 58 | 0 | 255% |
| 2 | **kidlat** | 181,507 | 5.12 | 8.00 | 34.11 | 5.2 | 63 | 0 | 243% |
| 3 | hyper-express | 175,818 | 5.17 | 8.00 | 23.47 | 5.8 | 70 | 0 | 235% |
| 4 | hono | 80,152 | 11.97 | 24.00 | 13.15 | 12.5 | 105 | 0 | 107% |
| 5 | polka | 79,157 | 12.12 | 25.00 | 14.12 | 12.7 | 99 | 0 | 106% |
| 6 | h3 | 78,683 | 12.22 | 24.00 | 13.81 | 12.8 | 103 | 0 | 105% |
| 7 | fastify | 76,488 | 12.60 | 26.00 | 13.71 | 13.2 | 108 | 0 | 102% |
| 8 | node-http | 74,779 | 12.87 | 27.00 | 14.69 | 13.4 | 103 | 0 | 100% |
| 9 | 0http | 66,153 | 14.62 | 28.00 | 11.80 | 15.5 | 104 | 0 | 88% |
| 10 | restify | 62,939 | 15.38 | 31.00 | 11.34 | 16.0 | 114 | 0 | 84% |
| 11 | koa | 59,866 | 16.21 | 32.00 | 10.68 | 16.8 | 119 | 0 | 80% |
| 12 | hapi | 57,314 | 16.95 | 33.00 | 12.79 | 17.8 | 127 | 0 | 77% |
| 13 | tinyhttp | 45,078 | 21.69 | 44.00 | 7.61 | 34.2 | 192 | 0 | 60% |
| 14 | express | 21,070 | 46.94 | 79.00 | 3.76 | 56.8 | 181 | 0 | 28% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 179,562 | 5.15 | 7.00 | 25.86 | 5.4 | 60 | 0 | 231% |
| 2 | **kidlat** | 172,835 | 5.31 | 10.00 | 31.48 | 5.5 | 64 | 0 | 222% |
| 3 | hyper-express | 166,781 | 5.40 | 10.00 | 21.31 | 6.2 | 79 | 0 | 215% |
| 4 | hono | 78,984 | 12.15 | 24.00 | 12.50 | 12.7 | 109 | 0 | 102% |
| 5 | node-http | 77,739 | 12.35 | 24.00 | 14.75 | 12.9 | 108 | 0 | 100% |
| 6 | polka | 77,010 | 12.51 | 25.00 | 13.29 | 13.0 | 104 | 0 | 99% |
| 7 | fastify | 76,238 | 12.64 | 24.00 | 13.23 | 13.2 | 113 | 0 | 98% |
| 8 | h3 | 75,238 | 12.80 | 26.00 | 12.77 | 13.4 | 109 | 0 | 97% |
| 9 | 0http | 72,548 | 13.29 | 27.00 | 12.52 | 14.1 | 110 | 0 | 93% |
| 10 | restify | 62,363 | 15.54 | 31.00 | 10.88 | 16.2 | 124 | 0 | 80% |
| 11 | koa | 59,703 | 16.25 | 32.00 | 10.31 | 16.9 | 128 | 0 | 77% |
| 12 | hapi | 55,838 | 17.40 | 34.00 | 12.14 | 18.2 | 127 | 0 | 72% |
| 13 | tinyhttp | 45,126 | 21.67 | 44.00 | 7.36 | 34.9 | 191 | 0 | 58% |
| 14 | express | 21,004 | 47.08 | 74.00 | 3.63 | 56.9 | 181 | 0 | 27% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 179,280 | 5.19 | 8.00 | 89.25 | 5.4 | 68 | 0 | 389% |
| 2 | uws | 152,573 | 6.11 | 9.00 | 70.13 | 6.9 | 67 | 0 | 331% |
| 3 | hyper-express | 88,462 | 10.87 | 16.00 | 39.23 | 12.1 | 100 | 0 | 192% |
| 4 | h3 | 47,082 | 20.73 | 46.00 | 22.85 | 21.6 | 112 | 0 | 102% |
| 5 | node-http | 46,066 | 21.21 | 47.00 | 23.33 | 22.3 | 109 | 0 | 100% |
| 6 | fastify | 45,954 | 21.25 | 48.00 | 22.48 | 22.4 | 116 | 0 | 100% |
| 7 | 0http | 43,114 | 22.69 | 48.00 | 21.05 | 24.3 | 113 | 0 | 94% |
| 8 | hono | 42,816 | 22.86 | 51.00 | 20.29 | 24.0 | 117 | 0 | 93% |
| 9 | polka | 41,793 | 23.43 | 54.00 | 20.41 | 24.9 | 105 | 0 | 91% |
| 10 | restify | 35,482 | 27.67 | 63.00 | 17.39 | 28.9 | 124 | 0 | 77% |
| 11 | koa | 33,977 | 28.93 | 66.00 | 16.59 | 30.2 | 116 | 0 | 74% |
| 12 | tinyhttp | 29,300 | 33.62 | 71.00 | 16.35 | 50.7 | 197 | 0 | 64% |
| 13 | hapi | 28,928 | 34.06 | 70.00 | 14.81 | 35.3 | 128 | 0 | 63% |
| 14 | express | 14,256 | 69.60 | 98.00 | 6.96 | 85.3 | 185 | 0 | 31% |

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
