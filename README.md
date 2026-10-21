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
Run on 10/21/2026, 12:18:24 (Manila Time, UTC+8) · AMD EPYC 9V45 96-Core Processor (4 threads, 16 GB) · Linux 6.17.0-1022-azure (x64) · Node v22.23.3

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | uws | 20.71.0 | 195,162 | 189,910 | 170,173 | 184,761 | 267% |
| 2 | **kidlat** | 2.4.0 | 168,438 | 176,922 | 186,214 | 177,043 | 255% |
| 3 | hyper-express | 7.0.2 | 182,672 | 174,662 | 101,637 | 148,016 | 214% |
| 4 | fastify | 5.12.7 | 82,198 | 82,683 | 50,749 | 70,130 | 101% |
| 5 | node-http | 22.23.3 | 80,803 | 80,307 | 51,335 | 69,321 | 100% |
| 6 | hono | 4.13.13 | 84,266 | 79,618 | 48,141 | 68,611 | 99% |
| 7 | polka | 0.5.2 | 84,462 | 80,923 | 46,033 | 68,014 | 98% |
| 8 | h3 | 2.0.2 | 79,469 | 77,373 | 48,741 | 66,921 | 97% |
| 9 | 0http | 5.2.0 | 72,997 | 72,296 | 47,328 | 62,977 | 91% |
| 10 | koa | 3.2.1 | 65,576 | 65,541 | 35,760 | 53,565 | 77% |
| 11 | restify | 12.0.0 | 65,229 | 63,002 | 37,007 | 53,378 | 77% |
| 12 | tinyhttp | 3.0.11 | 48,845 | 48,892 | 33,579 | 43,123 | 62% |
| 13 | hapi | 21.4.10 | 51,108 | 50,478 | 27,847 | 41,571 | 60% |
| 14 | express | 5.3.0 | 21,522 | 21,638 | 15,063 | 19,143 | 28% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 195,162 | 4.65 | 7.00 | 29.22 | 5.0 | 58 | 0 | 242% |
| 2 | hyper-express | 182,672 | 5.11 | 8.00 | 24.39 | 5.6 | 79 | 0 | 226% |
| 3 | **kidlat** | 168,438 | 5.31 | 9.00 | 31.65 | 5.5 | 61 | 0 | 208% |
| 4 | polka | 84,462 | 11.34 | 21.00 | 15.06 | 11.9 | 98 | 0 | 105% |
| 5 | hono | 84,266 | 11.37 | 22.00 | 13.82 | 11.9 | 107 | 0 | 104% |
| 6 | fastify | 82,198 | 11.68 | 22.00 | 14.74 | 12.2 | 105 | 0 | 102% |
| 7 | node-http | 80,803 | 11.90 | 22.00 | 15.87 | 12.4 | 104 | 0 | 100% |
| 8 | h3 | 79,469 | 12.08 | 23.00 | 13.94 | 12.7 | 103 | 0 | 98% |
| 9 | 0http | 72,997 | 13.21 | 27.00 | 13.02 | 17.8 | 150 | 0 | 90% |
| 10 | koa | 65,576 | 14.75 | 28.00 | 11.69 | 15.4 | 120 | 0 | 81% |
| 11 | restify | 65,229 | 14.83 | 28.00 | 11.76 | 15.4 | 114 | 0 | 81% |
| 12 | hapi | 51,108 | 19.07 | 38.00 | 11.40 | 19.9 | 117 | 0 | 63% |
| 13 | tinyhttp | 48,845 | 19.98 | 43.00 | 8.24 | 31.4 | 194 | 0 | 60% |
| 14 | express | 21,522 | 45.95 | 83.00 | 3.84 | 55.7 | 188 | 0 | 27% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 189,910 | 4.91 | 7.00 | 27.35 | 5.1 | 59 | 0 | 236% |
| 2 | **kidlat** | 176,922 | 5.14 | 8.00 | 32.23 | 5.3 | 61 | 0 | 220% |
| 3 | hyper-express | 174,662 | 5.23 | 9.00 | 22.32 | 5.8 | 79 | 0 | 217% |
| 4 | fastify | 82,683 | 11.60 | 21.00 | 14.35 | 12.2 | 110 | 0 | 103% |
| 5 | polka | 80,923 | 11.85 | 21.00 | 13.97 | 12.4 | 104 | 0 | 101% |
| 6 | node-http | 80,307 | 11.96 | 23.00 | 15.24 | 12.5 | 110 | 0 | 100% |
| 7 | hono | 79,618 | 12.07 | 23.00 | 12.60 | 12.6 | 111 | 0 | 99% |
| 8 | h3 | 77,373 | 12.43 | 24.00 | 13.13 | 13.0 | 108 | 0 | 96% |
| 9 | 0http | 72,296 | 13.32 | 28.00 | 12.48 | 18.0 | 150 | 0 | 90% |
| 10 | koa | 65,541 | 14.77 | 27.00 | 11.31 | 15.3 | 129 | 0 | 82% |
| 11 | restify | 63,002 | 15.38 | 29.00 | 10.99 | 16.0 | 124 | 0 | 78% |
| 12 | hapi | 50,478 | 19.31 | 38.00 | 10.98 | 20.2 | 121 | 0 | 63% |
| 13 | tinyhttp | 48,892 | 19.95 | 41.00 | 7.97 | 31.5 | 193 | 0 | 61% |
| 14 | express | 21,638 | 45.69 | 83.00 | 3.74 | 54.9 | 191 | 0 | 27% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 186,214 | 5.08 | 8.00 | 92.71 | 5.2 | 65 | 0 | 363% |
| 2 | uws | 170,173 | 5.26 | 8.00 | 78.22 | 6.0 | 67 | 0 | 331% |
| 3 | hyper-express | 101,637 | 9.38 | 15.00 | 45.07 | 10.1 | 100 | 0 | 198% |
| 4 | node-http | 51,335 | 18.98 | 40.00 | 26.00 | 19.8 | 109 | 0 | 100% |
| 5 | fastify | 50,749 | 19.20 | 42.00 | 24.83 | 20.0 | 112 | 0 | 99% |
| 6 | h3 | 48,741 | 20.01 | 43.00 | 23.66 | 20.9 | 111 | 0 | 95% |
| 7 | hono | 48,141 | 20.27 | 44.00 | 22.82 | 21.1 | 105 | 0 | 94% |
| 8 | 0http | 47,328 | 20.63 | 42.00 | 23.11 | 21.9 | 167 | 0 | 92% |
| 9 | polka | 46,033 | 21.22 | 47.00 | 22.48 | 22.3 | 108 | 0 | 90% |
| 10 | restify | 37,007 | 26.50 | 58.00 | 18.14 | 27.5 | 120 | 0 | 72% |
| 11 | koa | 35,760 | 27.46 | 62.00 | 17.46 | 28.6 | 126 | 0 | 70% |
| 12 | tinyhttp | 33,579 | 29.28 | 61.00 | 18.74 | 43.4 | 198 | 0 | 65% |
| 13 | hapi | 27,847 | 35.40 | 70.00 | 14.26 | 36.5 | 131 | 0 | 54% |
| 14 | express | 15,063 | 65.85 | 95.00 | 7.35 | 78.5 | 190 | 0 | 29% |

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
