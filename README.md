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
| **kidlat** | 2.3.0 | Native C++ HTTP layer; focus of this benchmark |
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
Run on 10/16/2026, 20:17:31 (Manila Time, UTC+8) · AMD EPYC 7763 64-Core Processor (4 threads, 16 GB) · Linux 6.17.0-1022-azure (x64) · Node v22.23.3

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 2.3.0 | 114,902 | 120,739 | 89,458 | 107,464 | 318% |
| 2 | uws | 20.71.0 | 112,442 | 115,806 | 94,168 | 107,034 | 317% |
| 3 | hyper-express | 7.0.2 | 113,362 | 106,019 | 48,297 | 83,417 | 247% |
| 4 | 0http | 5.2.0 | 47,450 | 46,982 | 21,369 | 36,251 | 107% |
| 5 | node-http | 22.23.3 | 46,250 | 46,122 | 18,077 | 33,784 | 100% |
| 6 | fastify | 5.12.7 | 46,755 | 45,850 | 17,933 | 33,750 | 100% |
| 7 | h3 | 2.0.2 | 44,758 | 41,995 | 17,472 | 32,023 | 95% |
| 8 | hono | 4.13.13 | 44,166 | 42,938 | 16,988 | 31,819 | 94% |
| 9 | polka | 0.5.2 | 46,018 | 43,840 | 15,896 | 31,771 | 94% |
| 10 | restify | 12.0.0 | 34,149 | 33,747 | 12,971 | 24,634 | 73% |
| 11 | koa | 3.2.1 | 32,127 | 31,622 | 11,479 | 22,677 | 67% |
| 12 | hapi | 21.4.10 | 31,814 | 30,558 | 9,582 | 21,041 | 62% |
| 13 | tinyhttp | 3.0.11 | 24,921 | 24,918 | 12,655 | 19,881 | 59% |
| 14 | express | 5.3.0 | 11,371 | 11,139 | 6,243 | 9,247 | 27% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 114,902 | 8.27 | 16.00 | 17.98 | 8.3 | 61 | 0 | 248% |
| 2 | hyper-express | 113,362 | 8.18 | 14.00 | 15.14 | 9.0 | 70 | 0 | 245% |
| 3 | uws | 112,442 | 8.30 | 12.00 | 16.83 | 7.9 | 58 | 0 | 243% |
| 4 | 0http | 47,450 | 20.59 | 43.00 | 8.46 | 26.4 | 145 | 0 | 103% |
| 5 | fastify | 46,755 | 20.87 | 34.00 | 8.38 | 21.5 | 105 | 0 | 101% |
| 6 | node-http | 46,250 | 21.16 | 32.00 | 9.09 | 21.7 | 103 | 0 | 100% |
| 7 | polka | 46,018 | 21.22 | 35.00 | 8.21 | 21.8 | 99 | 0 | 100% |
| 8 | h3 | 44,758 | 21.86 | 35.00 | 7.85 | 22.5 | 106 | 0 | 97% |
| 9 | hono | 44,166 | 22.12 | 36.00 | 7.24 | 22.8 | 102 | 0 | 95% |
| 10 | restify | 34,149 | 28.79 | 49.00 | 6.16 | 29.5 | 113 | 0 | 74% |
| 11 | koa | 32,127 | 30.60 | 52.00 | 5.73 | 31.3 | 119 | 0 | 69% |
| 12 | hapi | 31,814 | 30.93 | 55.00 | 7.10 | 31.8 | 120 | 0 | 69% |
| 13 | tinyhttp | 24,921 | 39.62 | 82.00 | 4.21 | 55.0 | 168 | 0 | 54% |
| 14 | express | 11,371 | 87.36 | 120.00 | 2.03 | 98.0 | 138 | 0 | 25% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 120,739 | 8.06 | 10.00 | 18.19 | 8.1 | 62 | 0 | 262% |
| 2 | uws | 115,806 | 8.16 | 13.00 | 16.68 | 7.9 | 59 | 0 | 251% |
| 3 | hyper-express | 106,019 | 9.08 | 17.00 | 13.55 | 9.6 | 78 | 0 | 230% |
| 4 | 0http | 46,982 | 20.79 | 45.00 | 8.11 | 26.4 | 145 | 0 | 102% |
| 5 | node-http | 46,122 | 21.20 | 35.00 | 8.75 | 21.7 | 108 | 0 | 100% |
| 6 | fastify | 45,850 | 21.31 | 35.00 | 7.96 | 21.9 | 111 | 0 | 99% |
| 7 | polka | 43,840 | 22.29 | 35.00 | 7.57 | 22.9 | 105 | 0 | 95% |
| 8 | hono | 42,938 | 22.76 | 37.00 | 6.80 | 23.4 | 106 | 0 | 93% |
| 9 | h3 | 41,995 | 23.34 | 38.00 | 7.13 | 23.9 | 111 | 0 | 91% |
| 10 | restify | 33,747 | 29.10 | 49.00 | 5.89 | 29.8 | 124 | 0 | 73% |
| 11 | koa | 31,622 | 31.12 | 53.00 | 5.46 | 31.8 | 128 | 0 | 69% |
| 12 | hapi | 30,558 | 32.21 | 59.00 | 6.64 | 33.3 | 118 | 0 | 66% |
| 13 | tinyhttp | 24,918 | 39.63 | 72.00 | 4.06 | 54.7 | 168 | 0 | 54% |
| 14 | express | 11,139 | 89.19 | 114.00 | 1.92 | 99.2 | 162 | 0 | 24% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 94,168 | 10.17 | 17.00 | 43.29 | 10.8 | 67 | 0 | 521% |
| 2 | **kidlat** | 89,458 | 10.63 | 19.00 | 41.72 | 11.5 | 109 | 0 | 495% |
| 3 | hyper-express | 48,297 | 20.15 | 31.00 | 21.42 | 21.0 | 99 | 0 | 267% |
| 4 | 0http | 21,369 | 46.25 | 96.00 | 10.43 | 56.5 | 169 | 0 | 118% |
| 5 | node-http | 18,077 | 54.79 | 84.00 | 9.15 | 55.9 | 113 | 0 | 100% |
| 6 | fastify | 17,933 | 55.24 | 79.00 | 8.77 | 56.3 | 108 | 0 | 99% |
| 7 | h3 | 17,472 | 56.71 | 83.00 | 8.48 | 57.8 | 114 | 0 | 97% |
| 8 | hono | 16,988 | 58.32 | 82.00 | 8.05 | 59.4 | 102 | 0 | 94% |
| 9 | polka | 15,896 | 62.37 | 88.00 | 7.76 | 63.8 | 103 | 0 | 88% |
| 10 | restify | 12,971 | 76.54 | 109.00 | 6.36 | 77.9 | 112 | 0 | 72% |
| 11 | tinyhttp | 12,655 | 78.46 | 108.00 | 7.06 | 97.0 | 172 | 0 | 70% |
| 12 | koa | 11,479 | 86.54 | 117.00 | 5.60 | 88.3 | 120 | 0 | 63% |
| 13 | hapi | 9,582 | 103.72 | 132.00 | 4.91 | 105.3 | 120 | 0 | 53% |
| 14 | express | 6,243 | 159.41 | 188.00 | 3.05 | 174.4 | 161 | 0 | 35% |

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
