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
Run on 11/03/2026, 22:56:57 (Manila Time, UTC+8) · AMD EPYC 9V45 96-Core Processor (4 threads, 16 GB) · Linux 7.0.0-1017-azure (x64) · Node v22.23.4

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | uws | 20.71.0 | 203,619 | 204,637 | 168,486 | 191,480 | 267% |
| 2 | **kidlat** | 2.6.0 | 163,488 | 181,664 | 190,630 | 178,231 | 249% |
| 3 | hyper-express | 7.0.2 | 177,773 | 174,525 | 101,776 | 146,709 | 205% |
| 4 | node-http | 22.23.4 | 84,880 | 86,739 | 50,085 | 71,709 | 100% |
| 5 | fastify | 5.12.7 | 83,688 | 82,320 | 49,228 | 69,737 | 97% |
| 6 | h3 | 2.0.2 | 81,478 | 82,442 | 48,429 | 68,775 | 96% |
| 7 | hono | 4.13.13 | 82,685 | 80,557 | 44,405 | 66,627 | 93% |
| 8 | polka | 0.5.2 | 80,571 | 77,704 | 43,625 | 64,881 | 90% |
| 9 | 0http | 5.2.0 | 84,243 | 73,282 | 41,690 | 63,610 | 89% |
| 10 | restify | 12.0.0 | 71,015 | 69,766 | 37,471 | 57,047 | 80% |
| 11 | koa | 3.2.1 | 65,111 | 62,670 | 35,546 | 52,541 | 73% |
| 12 | hapi | 21.4.10 | 60,929 | 60,875 | 30,515 | 48,372 | 67% |
| 13 | tinyhttp | 3.0.11 | 45,726 | 46,126 | 30,838 | 40,216 | 56% |
| 14 | express | 5.3.0 | 21,921 | 22,049 | 16,197 | 19,856 | 28% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 203,619 | 4.31 | 6.00 | 30.49 | 4.8 | 57 | 0 | 240% |
| 2 | hyper-express | 177,773 | 5.09 | 7.00 | 23.74 | 5.8 | 70 | 0 | 209% |
| 3 | **kidlat** | 163,488 | 5.61 | 8.00 | 30.71 | 5.6 | 63 | 0 | 193% |
| 4 | node-http | 84,880 | 11.27 | 23.00 | 16.67 | 11.8 | 103 | 0 | 100% |
| 5 | 0http | 84,243 | 11.38 | 23.00 | 15.02 | 12.2 | 119 | 0 | 99% |
| 6 | fastify | 83,688 | 11.45 | 20.00 | 15.00 | 12.0 | 106 | 0 | 99% |
| 7 | hono | 82,685 | 11.60 | 23.00 | 13.56 | 12.2 | 104 | 0 | 97% |
| 8 | h3 | 81,478 | 11.77 | 24.00 | 14.30 | 12.4 | 108 | 0 | 96% |
| 9 | polka | 80,571 | 11.90 | 24.00 | 14.37 | 12.5 | 102 | 0 | 95% |
| 10 | restify | 71,015 | 13.58 | 27.00 | 12.80 | 14.2 | 117 | 0 | 84% |
| 11 | koa | 65,111 | 14.86 | 30.00 | 11.61 | 15.5 | 117 | 0 | 77% |
| 12 | hapi | 60,929 | 15.91 | 31.00 | 13.60 | 16.7 | 125 | 0 | 72% |
| 13 | tinyhttp | 45,726 | 21.38 | 44.00 | 7.72 | 34.4 | 190 | 0 | 54% |
| 14 | express | 21,921 | 45.11 | 84.00 | 3.91 | 54.9 | 191 | 0 | 26% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 204,637 | 4.28 | 7.00 | 29.47 | 4.7 | 59 | 0 | 236% |
| 2 | **kidlat** | 181,664 | 4.98 | 8.00 | 33.09 | 5.2 | 63 | 0 | 209% |
| 3 | hyper-express | 174,525 | 5.15 | 7.00 | 22.30 | 5.9 | 78 | 0 | 201% |
| 4 | node-http | 86,739 | 11.02 | 20.00 | 16.46 | 11.6 | 108 | 0 | 100% |
| 5 | h3 | 82,442 | 11.63 | 24.00 | 14.00 | 12.2 | 112 | 0 | 95% |
| 6 | fastify | 82,320 | 11.65 | 23.00 | 14.29 | 12.2 | 110 | 0 | 95% |
| 7 | hono | 80,557 | 11.91 | 24.00 | 12.75 | 12.5 | 109 | 0 | 93% |
| 8 | polka | 77,704 | 12.38 | 24.00 | 13.41 | 12.9 | 107 | 0 | 90% |
| 9 | 0http | 73,282 | 13.15 | 26.00 | 12.65 | 14.0 | 119 | 0 | 84% |
| 10 | restify | 69,766 | 13.83 | 27.00 | 12.18 | 14.4 | 128 | 0 | 80% |
| 11 | koa | 62,670 | 15.46 | 31.00 | 10.82 | 16.1 | 126 | 0 | 72% |
| 12 | hapi | 60,875 | 15.93 | 31.00 | 13.24 | 16.7 | 158 | 0 | 70% |
| 13 | tinyhttp | 46,126 | 21.18 | 42.00 | 7.52 | 33.9 | 190 | 0 | 53% |
| 14 | express | 22,049 | 44.83 | 82.00 | 3.81 | 53.6 | 191 | 0 | 25% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 190,630 | 4.85 | 7.00 | 94.89 | 5.1 | 68 | 0 | 381% |
| 2 | uws | 168,486 | 5.36 | 8.00 | 77.45 | 6.2 | 67 | 0 | 336% |
| 3 | hyper-express | 101,776 | 9.34 | 13.00 | 45.13 | 10.3 | 98 | 0 | 203% |
| 4 | node-http | 50,085 | 19.46 | 41.00 | 25.36 | 20.5 | 112 | 0 | 100% |
| 5 | fastify | 49,228 | 19.81 | 42.00 | 24.08 | 20.9 | 115 | 0 | 98% |
| 6 | h3 | 48,429 | 20.15 | 46.00 | 23.51 | 21.0 | 114 | 0 | 97% |
| 7 | hono | 44,405 | 22.03 | 51.00 | 21.04 | 23.1 | 116 | 0 | 89% |
| 8 | polka | 43,625 | 22.42 | 51.00 | 21.30 | 23.9 | 106 | 0 | 87% |
| 9 | 0http | 41,690 | 23.49 | 50.00 | 20.36 | 25.3 | 121 | 0 | 83% |
| 10 | restify | 37,471 | 26.17 | 62.00 | 18.37 | 27.2 | 119 | 0 | 75% |
| 11 | koa | 35,546 | 27.62 | 63.00 | 17.36 | 28.9 | 138 | 0 | 71% |
| 12 | tinyhttp | 30,838 | 31.93 | 69.00 | 17.20 | 48.1 | 195 | 0 | 62% |
| 13 | hapi | 30,515 | 32.26 | 69.00 | 15.63 | 33.6 | 160 | 0 | 61% |
| 14 | express | 16,197 | 61.21 | 90.00 | 7.91 | 73.1 | 194 | 0 | 32% |

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
