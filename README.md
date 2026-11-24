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
Run on 11/25/2026, 01:24:49 (Manila Time, UTC+8) · INTEL(R) XEON(R) PLATINUM 8573C (4 threads, 16 GB) · Linux 7.0.0-1020-azure (x64) · Node v22.23.5

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | uws | 20.71.0 | 149,248 | 147,017 | 124,082 | 139,635 | 222% |
| 2 | **kidlat** | 2.6.0 | 128,589 | 131,364 | 149,043 | 136,039 | 216% |
| 3 | hyper-express | 7.0.2 | 169,862 | 156,906 | 75,440 | 126,215 | 201% |
| 4 | node-http | 22.23.5 | 78,048 | 78,603 | 40,549 | 62,892 | 100% |
| 5 | fastify | 5.12.7 | 77,755 | 76,485 | 39,168 | 61,529 | 98% |
| 6 | polka | 0.5.2 | 80,509 | 76,802 | 34,936 | 60,002 | 95% |
| 7 | 0http | 5.2.0 | 70,229 | 68,964 | 42,447 | 59,020 | 94% |
| 8 | h3 | 2.0.2 | 75,366 | 71,301 | 37,444 | 58,598 | 93% |
| 9 | hono | 4.13.13 | 73,717 | 72,722 | 35,180 | 57,347 | 91% |
| 10 | restify | 12.0.0 | 54,498 | 53,862 | 26,680 | 42,784 | 68% |
| 11 | koa | 3.2.1 | 56,211 | 54,297 | 25,205 | 42,530 | 68% |
| 12 | hapi | 21.4.10 | 49,462 | 48,158 | 20,905 | 36,790 | 58% |
| 13 | tinyhttp | 3.0.11 | 37,435 | 37,183 | 23,262 | 31,873 | 51% |
| 14 | express | 5.3.0 | 16,080 | 15,990 | 10,320 | 13,844 | 22% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 169,862 | 5.37 | 8.00 | 22.68 | 6.1 | 79 | 0 | 218% |
| 2 | uws | 149,248 | 6.21 | 10.00 | 22.35 | 5.7 | 58 | 0 | 191% |
| 3 | **kidlat** | 128,589 | 7.31 | 11.00 | 24.16 | 6.2 | 64 | 0 | 165% |
| 4 | polka | 80,509 | 11.93 | 21.00 | 14.36 | 12.5 | 101 | 0 | 103% |
| 5 | node-http | 78,048 | 12.31 | 21.00 | 15.33 | 12.9 | 103 | 0 | 100% |
| 6 | fastify | 77,755 | 12.37 | 22.00 | 13.94 | 13.0 | 107 | 0 | 100% |
| 7 | h3 | 75,366 | 12.77 | 21.00 | 13.23 | 13.4 | 107 | 0 | 97% |
| 8 | hono | 73,717 | 13.07 | 24.00 | 12.09 | 13.7 | 106 | 0 | 94% |
| 9 | 0http | 70,229 | 13.75 | 28.00 | 12.52 | 20.0 | 141 | 0 | 90% |
| 10 | koa | 56,211 | 17.28 | 35.00 | 10.02 | 18.0 | 121 | 0 | 72% |
| 11 | restify | 54,498 | 17.85 | 35.00 | 9.82 | 18.5 | 117 | 0 | 70% |
| 12 | hapi | 49,462 | 19.71 | 38.00 | 11.04 | 20.7 | 119 | 0 | 63% |
| 13 | tinyhttp | 37,435 | 26.22 | 49.00 | 6.32 | 42.8 | 177 | 0 | 48% |
| 14 | express | 16,080 | 61.65 | 80.00 | 2.87 | 73.2 | 174 | 0 | 21% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 156,906 | 5.80 | 9.00 | 20.05 | 6.7 | 78 | 0 | 200% |
| 2 | uws | 147,017 | 6.35 | 10.00 | 21.17 | 5.8 | 60 | 0 | 187% |
| 3 | **kidlat** | 131,364 | 7.20 | 11.00 | 23.93 | 6.2 | 64 | 0 | 167% |
| 4 | node-http | 78,603 | 12.23 | 19.00 | 14.92 | 12.8 | 107 | 0 | 100% |
| 5 | polka | 76,802 | 12.53 | 22.00 | 13.26 | 13.1 | 106 | 0 | 98% |
| 6 | fastify | 76,485 | 12.58 | 24.00 | 13.28 | 13.2 | 112 | 0 | 97% |
| 7 | hono | 72,722 | 13.24 | 24.00 | 11.51 | 13.8 | 110 | 0 | 93% |
| 8 | h3 | 71,301 | 13.52 | 25.00 | 12.10 | 14.1 | 112 | 0 | 91% |
| 9 | 0http | 68,964 | 14.00 | 30.00 | 11.90 | 20.4 | 142 | 0 | 88% |
| 10 | koa | 54,297 | 17.92 | 36.00 | 9.37 | 18.6 | 130 | 0 | 69% |
| 11 | restify | 53,862 | 18.07 | 36.00 | 9.40 | 18.7 | 128 | 0 | 69% |
| 12 | hapi | 48,158 | 20.28 | 38.00 | 10.47 | 21.1 | 159 | 0 | 61% |
| 13 | tinyhttp | 37,183 | 26.39 | 51.00 | 6.06 | 43.1 | 185 | 0 | 47% |
| 14 | express | 15,990 | 62.00 | 82.00 | 2.76 | 73.3 | 174 | 0 | 20% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 149,043 | 6.26 | 10.00 | 74.20 | 6.4 | 68 | 0 | 368% |
| 2 | uws | 124,082 | 7.56 | 12.00 | 57.04 | 8.5 | 67 | 0 | 306% |
| 3 | hyper-express | 75,440 | 12.73 | 19.00 | 33.45 | 14.0 | 100 | 0 | 186% |
| 4 | 0http | 42,447 | 23.05 | 48.00 | 20.73 | 24.9 | 167 | 0 | 105% |
| 5 | node-http | 40,549 | 24.16 | 52.00 | 20.53 | 25.3 | 111 | 0 | 100% |
| 6 | fastify | 39,168 | 25.02 | 53.00 | 19.16 | 26.2 | 110 | 0 | 97% |
| 7 | h3 | 37,444 | 26.21 | 56.00 | 18.18 | 27.3 | 115 | 0 | 92% |
| 8 | hono | 35,180 | 27.91 | 60.00 | 16.67 | 29.2 | 116 | 0 | 87% |
| 9 | polka | 34,936 | 28.12 | 59.00 | 17.06 | 29.7 | 107 | 0 | 86% |
| 10 | restify | 26,680 | 36.98 | 71.00 | 13.08 | 38.3 | 112 | 0 | 66% |
| 11 | koa | 25,205 | 39.17 | 77.00 | 12.31 | 40.9 | 116 | 0 | 62% |
| 12 | tinyhttp | 23,262 | 42.47 | 84.00 | 12.98 | 64.0 | 193 | 0 | 57% |
| 13 | hapi | 20,905 | 47.32 | 80.00 | 10.71 | 48.8 | 160 | 0 | 52% |
| 14 | express | 10,320 | 96.30 | 128.00 | 5.04 | 113.1 | 178 | 0 | 25% |

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
