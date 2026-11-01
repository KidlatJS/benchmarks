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
Run on 11/01/2026, 15:17:23 (Manila Time, UTC+8) · AMD EPYC 9V45 96-Core Processor (4 threads, 16 GB) · Linux 7.0.0-1017-azure (x64) · Node v22.23.4

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 2.4.0 | 202,685 | 202,826 | 198,838 | 201,441 | 273% |
| 2 | uws | 20.71.0 | 208,970 | 211,795 | 180,102 | 199,759 | 270% |
| 3 | hyper-express | 7.0.2 | 196,512 | 185,683 | 91,533 | 149,479 | 202% |
| 4 | fastify | 5.12.7 | 88,963 | 88,510 | 51,956 | 74,236 | 100% |
| 5 | node-http | 22.23.4 | 88,973 | 88,744 | 51,128 | 73,907 | 100% |
| 6 | h3 | 2.0.2 | 86,357 | 84,320 | 50,782 | 71,776 | 97% |
| 7 | hono | 4.13.13 | 87,560 | 82,551 | 48,035 | 70,285 | 95% |
| 8 | polka | 0.5.2 | 79,773 | 79,187 | 47,938 | 67,152 | 91% |
| 9 | 0http | 5.2.0 | 75,667 | 74,160 | 45,686 | 63,526 | 86% |
| 10 | restify | 12.0.0 | 71,906 | 71,629 | 39,367 | 58,748 | 79% |
| 11 | koa | 3.2.1 | 67,399 | 61,630 | 37,090 | 53,609 | 73% |
| 12 | hapi | 21.4.10 | 63,995 | 63,594 | 31,638 | 50,496 | 68% |
| 13 | tinyhttp | 3.0.11 | 51,882 | 52,582 | 33,962 | 45,250 | 61% |
| 14 | express | 5.3.0 | 22,318 | 21,994 | 16,409 | 20,045 | 27% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 208,970 | 4.17 | 6.00 | 31.29 | 4.7 | 58 | 0 | 235% |
| 2 | **kidlat** | 202,685 | 4.29 | 7.00 | 38.08 | 4.7 | 61 | 0 | 228% |
| 3 | hyper-express | 196,512 | 4.48 | 6.00 | 26.24 | 5.2 | 79 | 0 | 221% |
| 4 | node-http | 88,973 | 10.75 | 21.00 | 17.48 | 11.3 | 105 | 0 | 100% |
| 5 | fastify | 88,963 | 10.74 | 20.00 | 15.95 | 11.3 | 108 | 0 | 100% |
| 6 | hono | 87,560 | 10.94 | 20.00 | 14.36 | 11.5 | 102 | 0 | 98% |
| 7 | h3 | 86,357 | 11.11 | 22.00 | 15.15 | 11.6 | 104 | 0 | 97% |
| 8 | polka | 79,773 | 12.02 | 23.00 | 14.23 | 12.6 | 101 | 0 | 90% |
| 9 | 0http | 75,667 | 12.73 | 26.00 | 13.49 | 17.1 | 163 | 0 | 85% |
| 10 | restify | 71,906 | 13.42 | 26.00 | 12.96 | 14.0 | 113 | 0 | 81% |
| 11 | koa | 67,399 | 14.34 | 28.00 | 12.02 | 14.9 | 115 | 0 | 76% |
| 12 | hapi | 63,995 | 15.12 | 30.00 | 14.28 | 15.9 | 124 | 0 | 72% |
| 13 | tinyhttp | 51,882 | 18.78 | 40.00 | 8.76 | 29.3 | 190 | 0 | 58% |
| 14 | express | 22,318 | 44.29 | 83.00 | 3.98 | 52.6 | 194 | 0 | 25% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 211,795 | 4.12 | 6.00 | 30.50 | 4.6 | 60 | 0 | 239% |
| 2 | **kidlat** | 202,826 | 4.28 | 7.00 | 36.95 | 4.8 | 61 | 0 | 229% |
| 3 | hyper-express | 185,683 | 5.07 | 7.00 | 23.73 | 5.5 | 79 | 0 | 209% |
| 4 | node-http | 88,744 | 10.77 | 20.00 | 16.84 | 11.3 | 110 | 0 | 100% |
| 5 | fastify | 88,510 | 10.78 | 21.00 | 15.36 | 11.3 | 113 | 0 | 100% |
| 6 | h3 | 84,320 | 11.36 | 22.00 | 14.31 | 11.9 | 110 | 0 | 95% |
| 7 | hono | 82,551 | 11.63 | 24.00 | 13.07 | 12.2 | 108 | 0 | 93% |
| 8 | polka | 79,187 | 12.16 | 23.00 | 13.67 | 12.7 | 107 | 0 | 89% |
| 9 | 0http | 74,160 | 12.99 | 27.00 | 12.80 | 17.4 | 163 | 0 | 84% |
| 10 | restify | 71,629 | 13.47 | 26.00 | 12.50 | 14.0 | 124 | 0 | 81% |
| 11 | hapi | 63,594 | 15.23 | 31.00 | 13.83 | 16.0 | 138 | 0 | 72% |
| 12 | koa | 61,630 | 15.73 | 31.00 | 10.64 | 16.3 | 123 | 0 | 69% |
| 13 | tinyhttp | 52,582 | 18.52 | 37.00 | 8.57 | 29.1 | 190 | 0 | 59% |
| 14 | express | 21,994 | 44.95 | 84.00 | 3.80 | 53.1 | 194 | 0 | 25% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 198,838 | 4.41 | 7.00 | 99.00 | 4.9 | 66 | 0 | 389% |
| 2 | uws | 180,102 | 5.07 | 7.00 | 82.79 | 5.6 | 68 | 0 | 352% |
| 3 | hyper-express | 91,533 | 10.44 | 14.00 | 40.59 | 11.7 | 98 | 0 | 179% |
| 4 | fastify | 51,956 | 18.75 | 44.00 | 25.42 | 19.5 | 114 | 0 | 102% |
| 5 | node-http | 51,128 | 19.06 | 42.00 | 25.89 | 20.0 | 115 | 0 | 100% |
| 6 | h3 | 50,782 | 19.20 | 44.00 | 24.65 | 19.9 | 113 | 0 | 99% |
| 7 | hono | 48,035 | 20.32 | 48.00 | 22.77 | 21.1 | 114 | 0 | 94% |
| 8 | polka | 47,938 | 20.35 | 48.00 | 23.41 | 21.2 | 107 | 0 | 94% |
| 9 | 0http | 45,686 | 21.39 | 45.00 | 22.31 | 28.9 | 174 | 0 | 89% |
| 10 | restify | 39,367 | 24.90 | 57.00 | 19.30 | 25.8 | 116 | 0 | 77% |
| 11 | koa | 37,090 | 26.45 | 60.00 | 18.11 | 27.4 | 119 | 0 | 73% |
| 12 | tinyhttp | 33,962 | 28.94 | 65.00 | 18.95 | 42.1 | 195 | 0 | 66% |
| 13 | hapi | 31,638 | 31.10 | 70.00 | 16.20 | 32.0 | 138 | 0 | 62% |
| 14 | express | 16,409 | 60.40 | 81.00 | 8.01 | 71.2 | 195 | 0 | 32% |

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
