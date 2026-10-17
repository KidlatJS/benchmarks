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
Run on 10/17/2026, 11:58:57 (Manila Time, UTC+8) · AMD EPYC 9V74 80-Core Processor (4 threads, 16 GB) · Linux 6.17.0-1022-azure (x64) · Node v22.23.3

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 2.4.0 | 109,317 | 109,248 | 114,213 | 110,902 | 256% |
| 2 | uws | 20.71.0 | 111,998 | 111,328 | 102,786 | 108,622 | 251% |
| 3 | hyper-express | 7.0.2 | 116,368 | 113,547 | 57,853 | 91,435 | 211% |
| 4 | 0http | 5.2.0 | 58,555 | 57,401 | 31,258 | 47,186 | 109% |
| 5 | node-http | 22.23.3 | 54,186 | 54,413 | 27,432 | 43,246 | 100% |
| 6 | fastify | 5.12.7 | 54,913 | 53,720 | 25,261 | 42,081 | 97% |
| 7 | h3 | 2.0.2 | 53,850 | 51,694 | 24,830 | 41,039 | 95% |
| 8 | polka | 0.5.2 | 56,013 | 53,651 | 22,964 | 41,018 | 95% |
| 9 | hono | 4.13.13 | 54,017 | 52,978 | 23,681 | 40,770 | 94% |
| 10 | restify | 12.0.0 | 40,599 | 40,431 | 18,151 | 31,001 | 72% |
| 11 | koa | 3.2.1 | 39,850 | 38,886 | 15,809 | 29,043 | 67% |
| 12 | hapi | 21.4.10 | 35,578 | 35,171 | 12,572 | 25,057 | 58% |
| 13 | tinyhttp | 3.0.11 | 29,378 | 29,388 | 17,115 | 24,539 | 57% |
| 14 | express | 5.3.0 | 13,019 | 12,938 | 7,308 | 10,717 | 25% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 116,368 | 8.21 | 14.00 | 15.54 | 8.7 | 70 | 0 | 215% |
| 2 | uws | 111,998 | 8.31 | 11.00 | 16.77 | 8.3 | 58 | 0 | 207% |
| 3 | **kidlat** | 109,317 | 8.52 | 13.00 | 20.54 | 8.9 | 61 | 0 | 202% |
| 4 | 0http | 58,555 | 16.58 | 28.00 | 10.44 | 17.4 | 101 | 0 | 108% |
| 5 | polka | 56,013 | 17.35 | 30.00 | 9.99 | 18.0 | 97 | 0 | 103% |
| 6 | fastify | 54,913 | 17.71 | 31.00 | 9.85 | 18.3 | 106 | 0 | 101% |
| 7 | node-http | 54,186 | 17.95 | 31.00 | 10.64 | 18.6 | 104 | 0 | 100% |
| 8 | hono | 54,017 | 18.02 | 30.00 | 8.86 | 18.7 | 106 | 0 | 100% |
| 9 | h3 | 53,850 | 18.09 | 32.00 | 9.45 | 18.7 | 102 | 0 | 99% |
| 10 | restify | 40,599 | 24.13 | 44.00 | 7.32 | 24.8 | 114 | 0 | 75% |
| 11 | koa | 39,850 | 24.59 | 46.00 | 7.11 | 25.3 | 117 | 0 | 74% |
| 12 | hapi | 35,578 | 27.60 | 57.00 | 7.94 | 28.6 | 120 | 0 | 66% |
| 13 | tinyhttp | 29,378 | 33.53 | 73.00 | 4.96 | 50.6 | 169 | 0 | 54% |
| 14 | express | 13,019 | 76.25 | 104.00 | 2.32 | 90.3 | 153 | 0 | 24% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 113,547 | 8.21 | 12.00 | 14.51 | 9.0 | 78 | 0 | 209% |
| 2 | uws | 111,328 | 8.38 | 12.00 | 16.03 | 8.3 | 59 | 0 | 205% |
| 3 | **kidlat** | 109,248 | 8.51 | 13.00 | 19.90 | 9.0 | 61 | 0 | 201% |
| 4 | 0http | 57,401 | 16.92 | 29.00 | 9.91 | 17.8 | 105 | 0 | 105% |
| 5 | node-http | 54,413 | 17.87 | 31.00 | 10.33 | 18.5 | 108 | 0 | 100% |
| 6 | fastify | 53,720 | 18.12 | 31.00 | 9.32 | 18.7 | 112 | 0 | 99% |
| 7 | polka | 53,651 | 18.14 | 31.00 | 9.26 | 18.7 | 103 | 0 | 99% |
| 8 | hono | 52,978 | 18.38 | 32.00 | 8.39 | 19.0 | 111 | 0 | 97% |
| 9 | h3 | 51,694 | 18.85 | 32.00 | 8.78 | 19.4 | 107 | 0 | 95% |
| 10 | restify | 40,431 | 24.23 | 43.00 | 7.06 | 24.9 | 125 | 0 | 74% |
| 11 | koa | 38,886 | 25.21 | 47.00 | 6.71 | 25.9 | 126 | 0 | 71% |
| 12 | hapi | 35,171 | 27.93 | 50.00 | 7.65 | 28.9 | 135 | 0 | 65% |
| 13 | tinyhttp | 29,388 | 33.53 | 69.00 | 4.79 | 50.7 | 169 | 0 | 54% |
| 14 | express | 12,938 | 76.70 | 103.00 | 2.23 | 90.2 | 167 | 0 | 24% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 114,213 | 8.33 | 13.00 | 56.86 | 8.6 | 62 | 0 | 416% |
| 2 | uws | 102,786 | 9.29 | 15.00 | 47.25 | 9.9 | 67 | 0 | 375% |
| 3 | hyper-express | 57,853 | 16.80 | 25.00 | 25.65 | 18.0 | 99 | 0 | 211% |
| 4 | 0http | 31,258 | 31.49 | 65.00 | 15.26 | 33.3 | 116 | 0 | 114% |
| 5 | node-http | 27,432 | 35.93 | 71.00 | 13.89 | 37.1 | 108 | 0 | 100% |
| 6 | fastify | 25,261 | 39.07 | 78.00 | 12.36 | 40.2 | 111 | 0 | 92% |
| 7 | h3 | 24,830 | 39.76 | 79.00 | 12.05 | 40.8 | 105 | 0 | 91% |
| 8 | hono | 23,681 | 41.71 | 82.00 | 11.22 | 43.0 | 115 | 0 | 86% |
| 9 | polka | 22,964 | 43.03 | 82.00 | 11.21 | 44.2 | 112 | 0 | 84% |
| 10 | restify | 18,151 | 54.56 | 89.00 | 8.90 | 56.0 | 115 | 0 | 66% |
| 11 | tinyhttp | 17,115 | 57.91 | 91.00 | 9.55 | 77.3 | 173 | 0 | 62% |
| 12 | koa | 15,809 | 62.69 | 98.00 | 7.72 | 64.4 | 113 | 0 | 58% |
| 13 | hapi | 12,572 | 78.99 | 113.00 | 6.44 | 80.3 | 136 | 0 | 46% |
| 14 | express | 7,308 | 136.14 | 172.00 | 3.57 | 155.6 | 168 | 0 | 27% |

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
