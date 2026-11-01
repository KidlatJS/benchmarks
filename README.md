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
Run on 11/01/2026, 08:53:24 (Manila Time, UTC+8) · AMD EPYC 9V45 96-Core Processor (4 threads, 16 GB) · Linux 7.0.0-1017-azure (x64) · Node v22.23.4

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | uws | 20.71.0 | 208,422 | 204,301 | 167,165 | 192,362 | 265% |
| 2 | **kidlat** | 2.4.0 | 190,998 | 198,819 | 186,035 | 191,879 | 264% |
| 3 | hyper-express | 7.0.2 | 182,064 | 177,750 | 100,747 | 148,282 | 204% |
| 4 | node-http | 22.23.4 | 85,624 | 87,128 | 51,238 | 72,574 | 100% |
| 5 | fastify | 5.12.7 | 80,146 | 82,315 | 48,713 | 68,496 | 94% |
| 6 | polka | 0.5.2 | 83,704 | 80,674 | 45,384 | 67,421 | 93% |
| 7 | h3 | 2.0.2 | 81,200 | 78,560 | 46,972 | 66,916 | 92% |
| 8 | hono | 4.13.13 | 81,688 | 81,099 | 45,175 | 66,890 | 92% |
| 9 | 0http | 5.2.0 | 70,418 | 70,688 | 41,338 | 59,037 | 81% |
| 10 | restify | 12.0.0 | 66,856 | 66,744 | 36,967 | 54,843 | 76% |
| 11 | koa | 3.2.1 | 62,819 | 61,242 | 36,558 | 52,004 | 72% |
| 12 | hapi | 21.4.10 | 61,680 | 61,351 | 29,916 | 48,375 | 67% |
| 13 | tinyhttp | 3.0.11 | 46,351 | 44,426 | 29,599 | 39,354 | 54% |
| 14 | express | 5.3.0 | 22,247 | 22,041 | 15,081 | 19,482 | 27% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 208,422 | 4.16 | 7.00 | 31.20 | 4.7 | 58 | 0 | 243% |
| 2 | **kidlat** | 190,998 | 4.82 | 8.00 | 35.89 | 5.0 | 62 | 0 | 223% |
| 3 | hyper-express | 182,064 | 5.15 | 8.00 | 24.31 | 5.6 | 79 | 0 | 213% |
| 4 | node-http | 85,624 | 11.15 | 21.00 | 16.82 | 11.7 | 104 | 0 | 100% |
| 5 | polka | 83,704 | 11.46 | 23.00 | 14.93 | 12.0 | 102 | 0 | 98% |
| 6 | hono | 81,688 | 11.74 | 24.00 | 13.40 | 12.3 | 107 | 0 | 95% |
| 7 | h3 | 81,200 | 11.80 | 24.00 | 14.25 | 12.4 | 107 | 0 | 95% |
| 8 | fastify | 80,146 | 11.97 | 24.00 | 14.37 | 12.6 | 109 | 0 | 94% |
| 9 | 0http | 70,418 | 13.70 | 28.00 | 12.56 | 18.6 | 157 | 0 | 82% |
| 10 | restify | 66,856 | 14.45 | 28.00 | 12.05 | 15.0 | 117 | 0 | 78% |
| 11 | koa | 62,819 | 15.41 | 31.00 | 11.20 | 16.0 | 116 | 0 | 73% |
| 12 | hapi | 61,680 | 15.71 | 32.00 | 13.76 | 16.5 | 129 | 0 | 72% |
| 13 | tinyhttp | 46,351 | 21.07 | 43.00 | 7.82 | 33.9 | 186 | 0 | 54% |
| 14 | express | 22,247 | 44.44 | 82.00 | 3.97 | 52.7 | 188 | 0 | 26% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 204,301 | 4.23 | 6.00 | 29.42 | 4.8 | 60 | 0 | 234% |
| 2 | **kidlat** | 198,819 | 4.40 | 7.00 | 36.21 | 4.9 | 62 | 0 | 228% |
| 3 | hyper-express | 177,750 | 5.09 | 7.00 | 22.71 | 5.7 | 79 | 0 | 204% |
| 4 | node-http | 87,128 | 10.96 | 21.00 | 16.53 | 11.5 | 109 | 0 | 100% |
| 5 | fastify | 82,315 | 11.63 | 23.00 | 14.29 | 12.2 | 114 | 0 | 94% |
| 6 | hono | 81,099 | 11.83 | 25.00 | 12.84 | 12.4 | 112 | 0 | 93% |
| 7 | polka | 80,674 | 11.87 | 24.00 | 13.93 | 12.4 | 107 | 0 | 93% |
| 8 | h3 | 78,560 | 12.24 | 25.00 | 13.34 | 12.8 | 112 | 0 | 90% |
| 9 | 0http | 70,688 | 13.65 | 29.00 | 12.20 | 18.3 | 156 | 0 | 81% |
| 10 | restify | 66,744 | 14.48 | 28.00 | 11.65 | 15.1 | 128 | 0 | 77% |
| 11 | hapi | 61,351 | 15.78 | 31.00 | 13.34 | 16.5 | 135 | 0 | 70% |
| 12 | koa | 61,242 | 15.84 | 31.00 | 10.57 | 16.4 | 125 | 0 | 70% |
| 13 | tinyhttp | 44,426 | 22.01 | 44.00 | 7.25 | 35.9 | 191 | 0 | 51% |
| 14 | express | 22,041 | 44.85 | 83.00 | 3.80 | 53.1 | 189 | 0 | 25% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 186,035 | 5.10 | 9.00 | 92.61 | 5.2 | 66 | 0 | 363% |
| 2 | uws | 167,165 | 5.31 | 8.00 | 76.84 | 6.1 | 67 | 0 | 326% |
| 3 | hyper-express | 100,747 | 9.56 | 13.00 | 44.68 | 10.1 | 99 | 0 | 197% |
| 4 | node-http | 51,238 | 19.01 | 43.00 | 25.95 | 19.7 | 108 | 0 | 100% |
| 5 | fastify | 48,713 | 20.02 | 46.00 | 23.83 | 20.9 | 112 | 0 | 95% |
| 6 | h3 | 46,972 | 20.80 | 47.00 | 22.80 | 21.5 | 107 | 0 | 92% |
| 7 | polka | 45,384 | 21.54 | 49.00 | 22.16 | 22.4 | 106 | 0 | 89% |
| 8 | hono | 45,175 | 21.63 | 51.00 | 21.41 | 22.4 | 114 | 0 | 88% |
| 9 | 0http | 41,338 | 23.69 | 50.00 | 20.18 | 32.6 | 180 | 0 | 81% |
| 10 | restify | 36,967 | 26.54 | 62.00 | 18.12 | 27.4 | 117 | 0 | 72% |
| 11 | koa | 36,558 | 26.85 | 62.00 | 17.85 | 27.9 | 118 | 0 | 71% |
| 12 | hapi | 29,916 | 32.92 | 69.00 | 15.32 | 33.8 | 137 | 0 | 58% |
| 13 | tinyhttp | 29,599 | 33.28 | 72.00 | 16.51 | 51.4 | 196 | 0 | 58% |
| 14 | express | 15,081 | 65.77 | 91.00 | 7.36 | 76.9 | 189 | 0 | 29% |

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
