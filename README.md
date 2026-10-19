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
Run on 10/19/2026, 09:03:43 (Manila Time, UTC+8) · AMD EPYC 7763 64-Core Processor (4 threads, 16 GB) · Linux 6.17.0-1022-azure (x64) · Node v22.23.3

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 2.4.0 | 105,094 | 103,435 | 111,925 | 106,756 | 339% |
| 2 | uws | 20.71.0 | 105,019 | 108,618 | 90,042 | 100,895 | 321% |
| 3 | hyper-express | 7.0.2 | 107,432 | 99,741 | 46,758 | 79,424 | 253% |
| 4 | 0http | 5.2.0 | 44,882 | 45,165 | 20,549 | 34,665 | 110% |
| 5 | fastify | 5.12.7 | 44,248 | 43,211 | 17,027 | 31,931 | 102% |
| 6 | hono | 4.13.13 | 43,946 | 42,307 | 16,845 | 31,521 | 100% |
| 7 | node-http | 22.23.3 | 42,666 | 43,302 | 16,835 | 31,448 | 100% |
| 8 | polka | 0.5.2 | 45,079 | 43,099 | 15,863 | 31,353 | 100% |
| 9 | h3 | 2.0.2 | 43,971 | 41,159 | 16,572 | 31,070 | 99% |
| 10 | restify | 12.0.0 | 32,258 | 31,613 | 12,304 | 23,237 | 74% |
| 11 | koa | 3.2.1 | 31,525 | 31,161 | 11,163 | 22,217 | 71% |
| 12 | hapi | 21.4.10 | 31,149 | 30,288 | 9,266 | 20,600 | 66% |
| 13 | tinyhttp | 3.0.11 | 23,417 | 23,008 | 11,889 | 18,572 | 59% |
| 14 | express | 5.3.0 | 11,231 | 11,098 | 6,093 | 9,124 | 29% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 107,432 | 8.85 | 16.00 | 14.34 | 9.5 | 70 | 0 | 252% |
| 2 | **kidlat** | 105,094 | 9.19 | 15.00 | 19.74 | 9.2 | 61 | 0 | 246% |
| 3 | uws | 105,019 | 9.18 | 15.00 | 15.72 | 8.5 | 58 | 0 | 246% |
| 4 | polka | 45,079 | 21.72 | 36.00 | 8.04 | 22.3 | 98 | 0 | 106% |
| 5 | 0http | 44,882 | 21.78 | 46.00 | 8.00 | 28.4 | 144 | 0 | 105% |
| 6 | fastify | 44,248 | 22.10 | 34.00 | 7.93 | 22.7 | 105 | 0 | 104% |
| 7 | h3 | 43,971 | 22.23 | 37.00 | 7.72 | 22.9 | 107 | 0 | 103% |
| 8 | hono | 43,946 | 22.24 | 36.00 | 7.21 | 22.9 | 106 | 0 | 103% |
| 9 | node-http | 42,666 | 22.94 | 38.00 | 8.38 | 23.6 | 100 | 0 | 100% |
| 10 | restify | 32,258 | 30.50 | 53.00 | 5.81 | 31.3 | 113 | 0 | 76% |
| 11 | koa | 31,525 | 31.23 | 53.00 | 5.62 | 31.9 | 119 | 0 | 74% |
| 12 | hapi | 31,149 | 31.59 | 55.00 | 6.95 | 32.5 | 126 | 0 | 73% |
| 13 | tinyhttp | 23,417 | 42.20 | 82.00 | 3.95 | 58.5 | 167 | 0 | 55% |
| 14 | express | 11,231 | 88.46 | 123.00 | 2.00 | 100.3 | 155 | 0 | 26% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 108,618 | 8.73 | 12.00 | 15.64 | 8.4 | 58 | 0 | 251% |
| 2 | **kidlat** | 103,435 | 9.21 | 14.00 | 18.84 | 9.3 | 61 | 0 | 239% |
| 3 | hyper-express | 99,741 | 9.50 | 18.00 | 12.75 | 10.2 | 78 | 0 | 230% |
| 4 | 0http | 45,165 | 21.64 | 46.00 | 7.80 | 27.9 | 144 | 0 | 104% |
| 5 | node-http | 43,302 | 22.59 | 36.00 | 8.22 | 23.2 | 105 | 0 | 100% |
| 6 | fastify | 43,211 | 22.63 | 37.00 | 7.50 | 23.2 | 110 | 0 | 100% |
| 7 | polka | 43,099 | 22.68 | 37.00 | 7.44 | 23.3 | 104 | 0 | 100% |
| 8 | hono | 42,307 | 23.15 | 38.00 | 6.70 | 23.7 | 110 | 0 | 98% |
| 9 | h3 | 41,159 | 23.79 | 39.00 | 6.99 | 24.4 | 111 | 0 | 95% |
| 10 | restify | 31,613 | 31.12 | 55.00 | 5.52 | 31.8 | 123 | 0 | 73% |
| 11 | koa | 31,161 | 31.59 | 54.00 | 5.38 | 32.2 | 128 | 0 | 72% |
| 12 | hapi | 30,288 | 32.50 | 56.00 | 6.59 | 33.4 | 134 | 0 | 70% |
| 13 | tinyhttp | 23,008 | 42.94 | 81.00 | 3.75 | 59.1 | 173 | 0 | 53% |
| 14 | express | 11,098 | 89.52 | 119.00 | 1.92 | 101.1 | 160 | 0 | 26% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 111,925 | 8.35 | 13.00 | 55.72 | 8.8 | 62 | 0 | 665% |
| 2 | uws | 90,042 | 10.54 | 19.00 | 41.38 | 11.3 | 67 | 0 | 535% |
| 3 | hyper-express | 46,758 | 20.89 | 32.00 | 20.74 | 22.0 | 99 | 0 | 278% |
| 4 | 0http | 20,549 | 48.14 | 103.00 | 10.03 | 59.8 | 166 | 0 | 122% |
| 5 | fastify | 17,027 | 58.20 | 82.00 | 8.33 | 59.5 | 108 | 0 | 101% |
| 6 | hono | 16,845 | 58.82 | 86.00 | 7.98 | 60.1 | 110 | 0 | 100% |
| 7 | node-http | 16,835 | 58.87 | 96.00 | 8.53 | 59.9 | 114 | 0 | 100% |
| 8 | h3 | 16,572 | 59.80 | 88.00 | 8.04 | 61.1 | 103 | 0 | 98% |
| 9 | polka | 15,863 | 62.51 | 90.00 | 7.75 | 64.0 | 104 | 0 | 94% |
| 10 | restify | 12,304 | 80.72 | 116.00 | 6.03 | 82.6 | 112 | 0 | 73% |
| 11 | tinyhttp | 11,889 | 83.53 | 114.00 | 6.63 | 103.7 | 176 | 0 | 71% |
| 12 | koa | 11,163 | 88.99 | 123.00 | 5.45 | 90.8 | 114 | 0 | 66% |
| 13 | hapi | 9,266 | 107.29 | 141.00 | 4.75 | 109.0 | 141 | 0 | 55% |
| 14 | express | 6,093 | 163.33 | 200.00 | 2.98 | 179.9 | 163 | 0 | 36% |

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
