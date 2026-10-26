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
Run on 10/27/2026, 03:07:39 (Manila Time, UTC+8) · AMD EPYC 7763 64-Core Processor (4 threads, 16 GB) · Linux 6.17.0-1022-azure (x64) · Node v22.23.3

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 2.4.0 | 102,099 | 103,619 | 112,184 | 105,876 | 324% |
| 2 | uws | 20.71.0 | 109,170 | 112,371 | 91,020 | 103,745 | 318% |
| 3 | hyper-express | 7.0.2 | 109,133 | 101,178 | 47,743 | 80,782 | 247% |
| 4 | 0http | 5.2.0 | 46,064 | 45,233 | 21,012 | 35,245 | 108% |
| 5 | node-http | 22.23.3 | 45,541 | 45,209 | 16,937 | 32,670 | 100% |
| 6 | fastify | 5.12.7 | 44,886 | 44,012 | 17,403 | 32,516 | 100% |
| 7 | polka | 0.5.2 | 46,200 | 43,677 | 15,842 | 31,737 | 97% |
| 8 | h3 | 2.0.2 | 43,703 | 40,836 | 17,163 | 31,288 | 96% |
| 9 | hono | 4.13.13 | 42,390 | 41,266 | 16,182 | 30,476 | 93% |
| 10 | restify | 12.0.0 | 32,108 | 31,840 | 12,416 | 23,327 | 71% |
| 11 | koa | 3.2.1 | 30,020 | 29,650 | 11,021 | 21,407 | 66% |
| 12 | hapi | 21.4.10 | 32,101 | 30,904 | 9,300 | 20,973 | 64% |
| 13 | tinyhttp | 3.0.11 | 24,638 | 24,430 | 12,259 | 19,469 | 60% |
| 14 | express | 5.3.0 | 11,204 | 11,228 | 6,099 | 9,155 | 28% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 109,170 | 8.62 | 14.00 | 16.34 | 8.1 | 58 | 0 | 240% |
| 2 | hyper-express | 109,133 | 8.55 | 16.00 | 14.57 | 9.3 | 70 | 0 | 240% |
| 3 | **kidlat** | 102,099 | 9.31 | 13.00 | 19.18 | 9.1 | 62 | 0 | 224% |
| 4 | polka | 46,200 | 21.12 | 35.00 | 8.24 | 21.8 | 100 | 0 | 101% |
| 5 | 0http | 46,064 | 21.22 | 44.00 | 8.21 | 27.4 | 146 | 0 | 101% |
| 6 | node-http | 45,541 | 21.48 | 35.00 | 8.95 | 22.1 | 100 | 0 | 100% |
| 7 | fastify | 44,886 | 21.82 | 36.00 | 8.05 | 22.4 | 106 | 0 | 99% |
| 8 | h3 | 43,703 | 22.37 | 36.00 | 7.67 | 23.0 | 106 | 0 | 96% |
| 9 | hono | 42,390 | 23.08 | 38.00 | 6.95 | 23.7 | 104 | 0 | 93% |
| 10 | restify | 32,108 | 30.64 | 53.00 | 5.79 | 31.4 | 113 | 0 | 71% |
| 11 | hapi | 32,101 | 30.65 | 53.00 | 7.16 | 31.6 | 124 | 0 | 70% |
| 12 | koa | 30,020 | 32.80 | 56.00 | 5.35 | 33.6 | 115 | 0 | 66% |
| 13 | tinyhttp | 24,638 | 40.08 | 83.00 | 4.16 | 56.0 | 167 | 0 | 54% |
| 14 | express | 11,204 | 88.67 | 125.00 | 2.00 | 99.7 | 160 | 0 | 25% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 112,371 | 8.36 | 15.00 | 16.18 | 8.1 | 59 | 0 | 249% |
| 2 | **kidlat** | 103,619 | 9.23 | 14.00 | 18.87 | 9.3 | 62 | 0 | 229% |
| 3 | hyper-express | 101,178 | 9.39 | 18.00 | 12.93 | 10.0 | 78 | 0 | 224% |
| 4 | 0http | 45,233 | 21.60 | 47.00 | 7.81 | 27.7 | 146 | 0 | 100% |
| 5 | node-http | 45,209 | 21.62 | 34.00 | 8.58 | 22.2 | 105 | 0 | 100% |
| 6 | fastify | 44,012 | 22.21 | 37.00 | 7.64 | 22.8 | 112 | 0 | 97% |
| 7 | polka | 43,677 | 22.38 | 36.00 | 7.54 | 23.0 | 106 | 0 | 97% |
| 8 | hono | 41,266 | 23.74 | 39.00 | 6.53 | 24.3 | 109 | 0 | 91% |
| 9 | h3 | 40,836 | 23.97 | 40.00 | 6.93 | 24.6 | 110 | 0 | 90% |
| 10 | restify | 31,840 | 30.91 | 55.00 | 5.56 | 31.6 | 124 | 0 | 70% |
| 11 | hapi | 30,904 | 31.85 | 54.00 | 6.72 | 32.7 | 141 | 0 | 68% |
| 12 | koa | 29,650 | 33.22 | 57.00 | 5.12 | 33.9 | 124 | 0 | 66% |
| 13 | tinyhttp | 24,430 | 40.42 | 72.00 | 3.98 | 56.2 | 169 | 0 | 54% |
| 14 | express | 11,228 | 88.48 | 121.00 | 1.94 | 99.5 | 160 | 0 | 25% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 112,184 | 8.39 | 15.00 | 55.85 | 8.8 | 62 | 0 | 662% |
| 2 | uws | 91,020 | 10.50 | 19.00 | 41.84 | 11.1 | 67 | 0 | 537% |
| 3 | hyper-express | 47,743 | 20.43 | 31.00 | 21.17 | 21.3 | 100 | 0 | 282% |
| 4 | 0http | 21,012 | 47.08 | 99.00 | 10.26 | 58.6 | 167 | 0 | 124% |
| 5 | fastify | 17,403 | 56.94 | 82.00 | 8.51 | 58.0 | 110 | 0 | 103% |
| 6 | h3 | 17,163 | 57.73 | 84.00 | 8.33 | 58.9 | 110 | 0 | 101% |
| 7 | node-http | 16,937 | 58.51 | 97.00 | 8.58 | 59.5 | 113 | 0 | 100% |
| 8 | hono | 16,182 | 61.26 | 87.00 | 7.67 | 62.7 | 103 | 0 | 96% |
| 9 | polka | 15,842 | 62.58 | 89.00 | 7.74 | 64.0 | 97 | 0 | 94% |
| 10 | restify | 12,416 | 79.94 | 112.00 | 6.09 | 81.8 | 112 | 0 | 73% |
| 11 | tinyhttp | 12,259 | 81.01 | 111.00 | 6.84 | 100.4 | 171 | 0 | 72% |
| 12 | koa | 11,021 | 90.12 | 120.00 | 5.38 | 92.1 | 111 | 0 | 65% |
| 13 | hapi | 9,300 | 106.92 | 142.00 | 4.76 | 108.6 | 141 | 0 | 55% |
| 14 | express | 6,099 | 163.19 | 193.00 | 2.98 | 178.8 | 161 | 0 | 36% |

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
