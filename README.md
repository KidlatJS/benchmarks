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
Run on 10/18/2026, 03:10:37 (Manila Time, UTC+8) · AMD EPYC 9V74 80-Core Processor (4 threads, 16 GB) · Linux 6.17.0-1022-azure (x64) · Node v22.23.3

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 2.4.0 | 141,059 | 137,140 | 147,942 | 141,977 | 259% |
| 2 | uws | 20.71.0 | 141,586 | 140,877 | 130,781 | 137,658 | 251% |
| 3 | hyper-express | 7.0.2 | 148,909 | 141,067 | 76,506 | 117,133 | 214% |
| 4 | node-http | 22.23.3 | 69,280 | 69,475 | 34,146 | 54,776 | 100% |
| 5 | fastify | 5.12.7 | 70,232 | 69,712 | 33,012 | 54,472 | 99% |
| 6 | h3 | 2.0.2 | 68,915 | 65,823 | 31,244 | 52,138 | 95% |
| 7 | hono | 4.13.13 | 68,621 | 66,533 | 29,858 | 51,466 | 94% |
| 8 | polka | 0.5.2 | 69,845 | 66,884 | 28,284 | 50,933 | 93% |
| 9 | 0http | 5.2.0 | 62,766 | 60,004 | 34,279 | 50,541 | 92% |
| 10 | restify | 12.0.0 | 51,542 | 51,533 | 22,129 | 38,881 | 71% |
| 11 | koa | 3.2.1 | 51,086 | 50,723 | 19,829 | 37,177 | 68% |
| 12 | hapi | 21.4.10 | 46,026 | 44,706 | 15,903 | 31,985 | 58% |
| 13 | tinyhttp | 3.0.11 | 37,539 | 36,831 | 20,172 | 30,326 | 55% |
| 14 | express | 5.3.0 | 16,212 | 16,055 | 8,964 | 13,263 | 24% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 148,909 | 6.15 | 11.00 | 19.88 | 6.8 | 71 | 0 | 215% |
| 2 | uws | 141,586 | 6.56 | 10.00 | 21.20 | 6.6 | 58 | 0 | 204% |
| 3 | **kidlat** | 141,059 | 6.46 | 9.00 | 26.50 | 6.9 | 61 | 0 | 204% |
| 4 | fastify | 70,232 | 13.74 | 24.00 | 12.59 | 14.3 | 106 | 0 | 101% |
| 5 | polka | 69,845 | 13.83 | 25.00 | 12.46 | 14.4 | 102 | 0 | 101% |
| 6 | node-http | 69,280 | 13.92 | 24.00 | 13.61 | 14.5 | 103 | 0 | 100% |
| 7 | h3 | 68,915 | 14.00 | 25.00 | 12.09 | 14.6 | 104 | 0 | 99% |
| 8 | hono | 68,621 | 14.06 | 25.00 | 11.26 | 14.7 | 103 | 0 | 99% |
| 9 | 0http | 62,766 | 15.43 | 32.00 | 11.19 | 20.8 | 156 | 0 | 91% |
| 10 | restify | 51,542 | 18.92 | 36.00 | 9.29 | 19.5 | 114 | 0 | 74% |
| 11 | koa | 51,086 | 19.07 | 36.00 | 9.11 | 19.7 | 115 | 0 | 74% |
| 12 | hapi | 46,026 | 21.23 | 39.00 | 10.27 | 22.1 | 120 | 0 | 66% |
| 13 | tinyhttp | 37,539 | 26.14 | 53.00 | 6.34 | 39.8 | 181 | 0 | 54% |
| 14 | express | 16,212 | 61.15 | 82.00 | 2.89 | 72.1 | 170 | 0 | 23% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 141,067 | 6.45 | 11.00 | 18.03 | 7.2 | 79 | 0 | 203% |
| 2 | uws | 140,877 | 6.51 | 10.00 | 20.28 | 6.6 | 59 | 0 | 203% |
| 3 | **kidlat** | 137,140 | 6.85 | 10.00 | 24.98 | 7.1 | 62 | 0 | 197% |
| 4 | fastify | 69,712 | 13.83 | 24.00 | 12.10 | 14.4 | 113 | 0 | 100% |
| 5 | node-http | 69,475 | 13.88 | 24.00 | 13.18 | 14.4 | 109 | 0 | 100% |
| 6 | polka | 66,884 | 14.44 | 26.00 | 11.54 | 15.0 | 107 | 0 | 96% |
| 7 | hono | 66,533 | 14.51 | 26.00 | 10.53 | 15.1 | 107 | 0 | 96% |
| 8 | h3 | 65,823 | 14.67 | 25.00 | 11.17 | 15.2 | 110 | 0 | 95% |
| 9 | 0http | 60,004 | 16.16 | 34.00 | 10.36 | 21.8 | 156 | 0 | 86% |
| 10 | restify | 51,533 | 18.92 | 35.00 | 8.99 | 19.5 | 124 | 0 | 74% |
| 11 | koa | 50,723 | 19.19 | 36.00 | 8.76 | 19.8 | 124 | 0 | 73% |
| 12 | hapi | 44,706 | 21.86 | 41.00 | 9.72 | 22.7 | 135 | 0 | 64% |
| 13 | tinyhttp | 36,831 | 26.64 | 52.00 | 6.01 | 40.5 | 181 | 0 | 53% |
| 14 | express | 16,055 | 61.75 | 82.00 | 2.77 | 72.4 | 171 | 0 | 23% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 147,942 | 6.18 | 10.00 | 73.65 | 6.6 | 62 | 0 | 433% |
| 2 | uws | 130,781 | 7.24 | 12.00 | 60.12 | 7.8 | 67 | 0 | 383% |
| 3 | hyper-express | 76,506 | 12.66 | 21.00 | 33.92 | 13.4 | 99 | 0 | 224% |
| 4 | 0http | 34,279 | 28.68 | 61.00 | 16.74 | 38.8 | 168 | 0 | 100% |
| 5 | node-http | 34,146 | 28.77 | 60.00 | 17.29 | 29.7 | 107 | 0 | 100% |
| 6 | fastify | 33,012 | 29.78 | 62.00 | 16.15 | 30.7 | 111 | 0 | 97% |
| 7 | h3 | 31,244 | 31.51 | 64.00 | 15.17 | 32.4 | 115 | 0 | 92% |
| 8 | hono | 29,858 | 32.98 | 67.00 | 14.15 | 33.9 | 107 | 0 | 87% |
| 9 | polka | 28,284 | 34.84 | 70.00 | 13.81 | 36.0 | 98 | 0 | 83% |
| 10 | restify | 22,129 | 44.67 | 84.00 | 10.85 | 45.7 | 113 | 0 | 65% |
| 11 | tinyhttp | 20,172 | 49.06 | 78.00 | 11.25 | 66.8 | 185 | 0 | 59% |
| 12 | koa | 19,829 | 49.91 | 83.00 | 9.68 | 51.1 | 116 | 0 | 58% |
| 13 | hapi | 15,903 | 62.36 | 98.00 | 8.14 | 63.6 | 137 | 0 | 47% |
| 14 | express | 8,964 | 110.93 | 145.00 | 4.38 | 127.9 | 171 | 0 | 26% |

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
