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
Run on 10/29/2026, 04:54:42 (Manila Time, UTC+8) · AMD EPYC 9V45 96-Core Processor (4 threads, 16 GB) · Linux 7.0.0-1017-azure (x64) · Node v22.23.4

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | uws | 20.71.0 | 201,648 | 192,682 | 161,142 | 184,310 | 262% |
| 2 | **kidlat** | 2.4.0 | 177,357 | 170,048 | 188,896 | 178,600 | 254% |
| 3 | hyper-express | 7.0.2 | 186,429 | 177,142 | 100,542 | 149,186 | 212% |
| 4 | node-http | 22.23.4 | 84,440 | 84,088 | 48,974 | 70,320 | 100% |
| 5 | fastify | 5.12.7 | 82,190 | 80,931 | 49,638 | 69,117 | 98% |
| 6 | polka | 0.5.2 | 83,098 | 83,614 | 45,771 | 68,258 | 97% |
| 7 | hono | 4.13.13 | 82,766 | 81,003 | 45,458 | 67,296 | 96% |
| 8 | h3 | 2.0.2 | 80,709 | 77,904 | 47,327 | 66,762 | 95% |
| 9 | 0http | 5.2.0 | 71,141 | 69,474 | 41,764 | 59,099 | 84% |
| 10 | restify | 12.0.0 | 67,095 | 67,484 | 37,293 | 55,272 | 79% |
| 11 | koa | 3.2.1 | 65,259 | 63,450 | 37,070 | 53,543 | 76% |
| 12 | hapi | 21.4.10 | 61,593 | 59,818 | 29,578 | 47,765 | 68% |
| 13 | tinyhttp | 3.0.11 | 45,936 | 46,563 | 29,803 | 39,947 | 57% |
| 14 | express | 5.3.0 | 21,315 | 21,350 | 14,979 | 18,961 | 27% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 201,648 | 4.31 | 7.00 | 30.19 | 4.8 | 58 | 0 | 239% |
| 2 | hyper-express | 186,429 | 5.02 | 7.00 | 24.89 | 5.5 | 79 | 0 | 221% |
| 3 | **kidlat** | 177,357 | 5.18 | 8.00 | 33.32 | 5.3 | 61 | 0 | 210% |
| 4 | node-http | 84,440 | 11.34 | 22.00 | 16.59 | 11.9 | 102 | 0 | 100% |
| 5 | polka | 83,098 | 11.54 | 22.00 | 14.82 | 12.1 | 98 | 0 | 98% |
| 6 | hono | 82,766 | 11.59 | 23.00 | 13.58 | 12.2 | 105 | 0 | 98% |
| 7 | fastify | 82,190 | 11.65 | 23.00 | 14.74 | 12.2 | 108 | 0 | 97% |
| 8 | h3 | 80,709 | 11.89 | 23.00 | 14.16 | 12.5 | 105 | 0 | 96% |
| 9 | 0http | 71,141 | 13.57 | 28.00 | 12.69 | 18.4 | 153 | 0 | 84% |
| 10 | restify | 67,095 | 14.40 | 29.00 | 12.09 | 15.0 | 114 | 0 | 79% |
| 11 | koa | 65,259 | 14.83 | 30.00 | 11.64 | 15.4 | 118 | 0 | 77% |
| 12 | hapi | 61,593 | 15.73 | 31.00 | 13.74 | 16.5 | 122 | 0 | 73% |
| 13 | tinyhttp | 45,936 | 21.27 | 44.00 | 7.75 | 34.4 | 186 | 0 | 54% |
| 14 | express | 21,315 | 46.40 | 81.00 | 3.80 | 55.9 | 189 | 0 | 25% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 192,682 | 4.67 | 7.00 | 27.74 | 5.0 | 60 | 0 | 229% |
| 2 | hyper-express | 177,142 | 5.16 | 7.00 | 22.64 | 5.8 | 80 | 0 | 211% |
| 3 | **kidlat** | 170,048 | 5.42 | 8.00 | 30.98 | 5.5 | 61 | 0 | 202% |
| 4 | node-http | 84,088 | 11.38 | 23.00 | 15.96 | 11.9 | 107 | 0 | 100% |
| 5 | polka | 83,614 | 11.47 | 22.00 | 14.43 | 12.0 | 104 | 0 | 99% |
| 6 | hono | 81,003 | 11.84 | 24.00 | 12.82 | 12.4 | 110 | 0 | 96% |
| 7 | fastify | 80,931 | 11.85 | 24.00 | 14.05 | 12.4 | 113 | 0 | 96% |
| 8 | h3 | 77,904 | 12.33 | 26.00 | 13.22 | 12.9 | 110 | 0 | 93% |
| 9 | 0http | 69,474 | 13.90 | 29.00 | 11.99 | 18.6 | 153 | 0 | 83% |
| 10 | restify | 67,484 | 14.33 | 28.00 | 11.78 | 14.9 | 124 | 0 | 80% |
| 11 | koa | 63,450 | 15.26 | 30.00 | 10.95 | 15.8 | 127 | 0 | 75% |
| 12 | hapi | 59,818 | 16.21 | 32.00 | 13.01 | 17.0 | 135 | 0 | 71% |
| 13 | tinyhttp | 46,563 | 20.98 | 43.00 | 7.59 | 34.3 | 191 | 0 | 55% |
| 14 | express | 21,350 | 46.31 | 80.00 | 3.69 | 55.6 | 190 | 0 | 25% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 188,896 | 5.03 | 7.00 | 94.03 | 5.2 | 65 | 0 | 386% |
| 2 | uws | 161,142 | 5.67 | 9.00 | 74.08 | 6.4 | 67 | 0 | 329% |
| 3 | hyper-express | 100,542 | 9.46 | 14.00 | 44.58 | 10.3 | 99 | 0 | 205% |
| 4 | fastify | 49,638 | 19.65 | 45.00 | 24.28 | 20.5 | 112 | 0 | 101% |
| 5 | node-http | 48,974 | 19.92 | 45.00 | 24.80 | 20.9 | 113 | 0 | 100% |
| 6 | h3 | 47,327 | 20.63 | 47.00 | 22.97 | 21.4 | 114 | 0 | 97% |
| 7 | polka | 45,771 | 21.34 | 48.00 | 22.35 | 22.3 | 105 | 0 | 93% |
| 8 | hono | 45,458 | 21.49 | 50.00 | 21.55 | 22.4 | 115 | 0 | 93% |
| 9 | 0http | 41,764 | 23.44 | 49.00 | 20.39 | 32.1 | 176 | 0 | 85% |
| 10 | restify | 37,293 | 26.31 | 61.00 | 18.28 | 27.3 | 115 | 0 | 76% |
| 11 | koa | 37,070 | 26.46 | 60.00 | 18.10 | 27.5 | 117 | 0 | 76% |
| 12 | tinyhttp | 29,803 | 33.05 | 72.00 | 16.63 | 50.0 | 196 | 0 | 61% |
| 13 | hapi | 29,578 | 33.29 | 72.00 | 15.15 | 34.4 | 135 | 0 | 60% |
| 14 | express | 14,979 | 66.22 | 99.00 | 7.31 | 79.7 | 190 | 0 | 31% |

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
