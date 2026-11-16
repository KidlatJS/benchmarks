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
Run on 11/17/2026, 04:12:55 (Manila Time, UTC+8) · Intel(R) Xeon(R) 6975P-C (4 threads, 15 GB) · Linux 7.0.0-1016-aws (x64) · Node v22.23.4

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | uws | 20.71.0 | 171,622 | 172,067 | 180,298 | 174,617 | 197% |
| 2 | hyper-express | 7.0.2 | 231,613 | 219,491 | 104,158 | 174,298 | 197% |
| 3 | **kidlat** | 2.6.0 | 157,149 | 160,368 | 181,517 | 166,003 | 188% |
| 4 | node-http | 22.23.4 | 105,789 | 107,786 | 60,617 | 88,416 | 100% |
| 5 | polka | 0.5.2 | 112,157 | 105,757 | 53,538 | 85,954 | 97% |
| 6 | fastify | 5.12.7 | 107,853 | 104,139 | 56,479 | 85,923 | 97% |
| 7 | hono | 4.13.13 | 108,275 | 103,997 | 54,331 | 84,892 | 96% |
| 8 | h3 | 2.0.2 | 105,203 | 101,314 | 56,062 | 84,228 | 95% |
| 9 | 0http | 5.2.0 | 90,352 | 89,702 | 49,310 | 73,659 | 83% |
| 10 | restify | 12.0.0 | 76,986 | 76,582 | 40,084 | 61,826 | 70% |
| 11 | koa | 3.2.1 | 75,354 | 75,568 | 37,726 | 59,891 | 68% |
| 12 | hapi | 21.4.10 | 70,800 | 66,626 | 31,239 | 52,819 | 60% |
| 13 | tinyhttp | 3.0.11 | 51,393 | 50,470 | 33,986 | 44,505 | 50% |
| 14 | express | 5.3.0 | 20,788 | 20,674 | 14,502 | 18,403 | 21% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 231,613 | 3.87 | 7.00 | 30.92 | 4.6 | 72 | 0 | 219% |
| 2 | uws | 171,622 | 5.29 | 7.00 | 25.70 | 5.1 | 58 | 0 | 162% |
| 3 | **kidlat** | 157,149 | 5.78 | 8.00 | 29.52 | 5.7 | 64 | 0 | 149% |
| 4 | polka | 112,157 | 8.43 | 13.00 | 20.00 | 9.0 | 100 | 0 | 106% |
| 5 | hono | 108,275 | 8.72 | 14.00 | 17.76 | 9.3 | 104 | 0 | 102% |
| 6 | fastify | 107,853 | 8.76 | 15.00 | 19.34 | 9.3 | 107 | 0 | 102% |
| 7 | node-http | 105,789 | 8.97 | 14.00 | 20.78 | 9.5 | 101 | 0 | 100% |
| 8 | h3 | 105,203 | 9.01 | 13.00 | 18.46 | 9.6 | 107 | 0 | 99% |
| 9 | 0http | 90,352 | 10.56 | 22.00 | 16.11 | 15.9 | 153 | 0 | 85% |
| 10 | restify | 76,986 | 12.51 | 23.00 | 13.88 | 13.1 | 118 | 0 | 73% |
| 11 | koa | 75,354 | 12.77 | 23.00 | 13.44 | 13.4 | 118 | 0 | 71% |
| 12 | hapi | 70,800 | 13.58 | 25.00 | 15.80 | 14.5 | 118 | 0 | 67% |
| 13 | tinyhttp | 51,393 | 18.96 | 36.00 | 8.68 | 33.1 | 184 | 0 | 49% |
| 14 | express | 20,788 | 47.58 | 85.00 | 3.71 | 58.7 | 186 | 0 | 20% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 219,491 | 4.07 | 6.00 | 28.05 | 4.8 | 79 | 0 | 204% |
| 2 | uws | 172,067 | 5.35 | 7.00 | 24.78 | 5.1 | 59 | 0 | 160% |
| 3 | **kidlat** | 160,368 | 5.78 | 8.00 | 29.21 | 5.6 | 65 | 0 | 149% |
| 4 | node-http | 107,786 | 8.79 | 12.00 | 20.46 | 9.3 | 107 | 0 | 100% |
| 5 | polka | 105,757 | 8.92 | 13.00 | 18.25 | 9.5 | 106 | 0 | 98% |
| 6 | fastify | 104,139 | 9.11 | 13.00 | 18.08 | 9.7 | 112 | 0 | 97% |
| 7 | hono | 103,997 | 9.08 | 15.00 | 16.46 | 9.7 | 110 | 0 | 96% |
| 8 | h3 | 101,314 | 9.40 | 13.00 | 17.20 | 9.9 | 112 | 0 | 94% |
| 9 | 0http | 89,702 | 10.65 | 22.00 | 15.48 | 15.9 | 153 | 0 | 83% |
| 10 | restify | 76,582 | 12.59 | 23.00 | 13.36 | 13.2 | 129 | 0 | 71% |
| 11 | koa | 75,568 | 12.72 | 23.00 | 13.04 | 13.4 | 127 | 0 | 70% |
| 12 | hapi | 66,626 | 14.56 | 26.00 | 14.49 | 15.3 | 137 | 0 | 62% |
| 13 | tinyhttp | 50,470 | 19.33 | 36.00 | 8.23 | 33.8 | 184 | 0 | 47% |
| 14 | express | 20,674 | 47.85 | 84.00 | 3.57 | 58.8 | 186 | 0 | 19% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 181,517 | 5.07 | 7.00 | 90.37 | 5.3 | 69 | 0 | 299% |
| 2 | uws | 180,298 | 5.12 | 8.00 | 82.88 | 5.9 | 68 | 0 | 297% |
| 3 | hyper-express | 104,158 | 8.99 | 12.00 | 46.19 | 10.4 | 100 | 0 | 172% |
| 4 | node-http | 60,617 | 16.01 | 35.00 | 30.70 | 17.1 | 107 | 0 | 100% |
| 5 | fastify | 56,479 | 17.19 | 38.00 | 27.63 | 18.3 | 111 | 0 | 93% |
| 6 | h3 | 56,062 | 17.34 | 39.00 | 27.21 | 18.4 | 115 | 0 | 92% |
| 7 | hono | 54,331 | 17.92 | 39.00 | 25.75 | 19.0 | 111 | 0 | 90% |
| 8 | polka | 53,538 | 18.18 | 39.00 | 26.14 | 19.6 | 101 | 0 | 88% |
| 9 | 0http | 49,310 | 19.78 | 41.00 | 24.08 | 29.5 | 168 | 0 | 81% |
| 10 | restify | 40,084 | 24.45 | 52.00 | 19.65 | 25.8 | 113 | 0 | 66% |
| 11 | koa | 37,726 | 26.01 | 56.00 | 18.42 | 27.5 | 121 | 0 | 62% |
| 12 | tinyhttp | 33,986 | 28.93 | 62.00 | 18.96 | 46.6 | 191 | 0 | 56% |
| 13 | hapi | 31,239 | 31.50 | 65.00 | 16.00 | 32.9 | 138 | 0 | 52% |
| 14 | express | 14,502 | 68.41 | 89.00 | 7.08 | 83.7 | 187 | 0 | 24% |

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
