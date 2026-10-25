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
Run on 10/25/2026, 23:55:53 (Manila Time, UTC+8) · AMD EPYC 9V45 96-Core Processor (4 threads, 16 GB) · Linux 6.17.0-1022-azure (x64) · Node v22.23.3

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | uws | 20.71.0 | 206,090 | 204,595 | 176,339 | 195,179 | 259% |
| 2 | **kidlat** | 2.4.0 | 181,562 | 187,021 | 199,462 | 189,202 | 251% |
| 3 | hyper-express | 7.0.2 | 195,974 | 188,394 | 104,758 | 156,971 | 208% |
| 4 | fastify | 5.12.7 | 88,064 | 88,178 | 55,266 | 75,429 | 100% |
| 5 | node-http | 22.23.3 | 87,515 | 87,322 | 56,137 | 75,420 | 100% |
| 6 | polka | 0.5.2 | 89,936 | 87,786 | 51,998 | 74,322 | 99% |
| 7 | h3 | 2.0.2 | 85,266 | 83,968 | 54,140 | 72,912 | 97% |
| 8 | hono | 4.13.13 | 87,461 | 85,171 | 49,812 | 71,859 | 95% |
| 9 | 0http | 5.2.0 | 76,267 | 75,638 | 47,635 | 65,013 | 86% |
| 10 | restify | 12.0.0 | 70,348 | 71,435 | 40,783 | 58,959 | 78% |
| 11 | koa | 3.2.1 | 68,334 | 67,629 | 39,634 | 56,791 | 75% |
| 12 | tinyhttp | 3.0.11 | 52,632 | 51,639 | 34,922 | 45,615 | 60% |
| 13 | hapi | 21.4.10 | 55,027 | 53,673 | 30,085 | 44,623 | 59% |
| 14 | express | 5.3.0 | 23,455 | 22,756 | 16,209 | 20,529 | 27% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 206,090 | 4.20 | 6.00 | 30.86 | 4.7 | 58 | 0 | 235% |
| 2 | hyper-express | 195,974 | 4.48 | 6.00 | 26.16 | 5.2 | 78 | 0 | 224% |
| 3 | **kidlat** | 181,562 | 5.07 | 7.00 | 34.12 | 5.1 | 61 | 0 | 207% |
| 4 | polka | 89,936 | 10.61 | 20.00 | 16.04 | 11.2 | 100 | 0 | 103% |
| 5 | fastify | 88,064 | 10.87 | 20.00 | 15.79 | 11.4 | 104 | 0 | 101% |
| 6 | node-http | 87,515 | 10.94 | 20.00 | 17.19 | 11.5 | 104 | 0 | 100% |
| 7 | hono | 87,461 | 10.95 | 20.00 | 14.35 | 11.5 | 104 | 0 | 100% |
| 8 | h3 | 85,266 | 11.23 | 20.00 | 14.96 | 11.8 | 104 | 0 | 97% |
| 9 | 0http | 76,267 | 12.64 | 25.00 | 13.60 | 17.0 | 152 | 0 | 87% |
| 10 | restify | 70,348 | 13.73 | 27.00 | 12.68 | 14.3 | 111 | 0 | 80% |
| 11 | koa | 68,334 | 14.13 | 25.00 | 12.19 | 14.7 | 118 | 0 | 78% |
| 12 | hapi | 55,027 | 17.66 | 35.00 | 12.28 | 18.5 | 119 | 0 | 63% |
| 13 | tinyhttp | 52,632 | 18.51 | 39.00 | 8.88 | 28.8 | 196 | 0 | 60% |
| 14 | express | 23,455 | 42.12 | 81.00 | 4.18 | 50.3 | 194 | 0 | 27% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 204,595 | 4.23 | 6.00 | 29.46 | 4.7 | 59 | 0 | 234% |
| 2 | hyper-express | 188,394 | 5.02 | 6.00 | 24.08 | 5.4 | 79 | 0 | 216% |
| 3 | **kidlat** | 187,021 | 5.01 | 7.00 | 34.07 | 5.0 | 61 | 0 | 214% |
| 4 | fastify | 88,178 | 10.82 | 20.00 | 15.31 | 11.4 | 110 | 0 | 101% |
| 5 | polka | 87,786 | 10.91 | 20.00 | 15.15 | 11.4 | 105 | 0 | 101% |
| 6 | node-http | 87,322 | 10.98 | 20.00 | 16.57 | 11.5 | 109 | 0 | 100% |
| 7 | hono | 85,171 | 11.25 | 21.00 | 13.48 | 11.8 | 108 | 0 | 98% |
| 8 | h3 | 83,968 | 11.39 | 20.00 | 14.25 | 12.0 | 109 | 0 | 96% |
| 9 | 0http | 75,638 | 12.73 | 25.00 | 13.06 | 17.1 | 152 | 0 | 87% |
| 10 | restify | 71,435 | 13.53 | 24.00 | 12.47 | 14.1 | 122 | 0 | 82% |
| 11 | koa | 67,629 | 14.28 | 27.00 | 11.67 | 14.9 | 127 | 0 | 77% |
| 12 | hapi | 53,673 | 18.13 | 35.00 | 11.67 | 18.9 | 137 | 0 | 61% |
| 13 | tinyhttp | 51,639 | 18.87 | 39.00 | 8.42 | 29.5 | 196 | 0 | 59% |
| 14 | express | 22,756 | 43.42 | 83.00 | 3.93 | 52.1 | 195 | 0 | 26% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 199,462 | 4.46 | 6.00 | 99.30 | 4.9 | 67 | 0 | 355% |
| 2 | uws | 176,339 | 5.15 | 7.00 | 81.06 | 5.8 | 67 | 0 | 314% |
| 3 | hyper-express | 104,758 | 9.01 | 12.00 | 46.46 | 9.9 | 99 | 0 | 187% |
| 4 | node-http | 56,137 | 17.34 | 37.00 | 28.43 | 18.0 | 107 | 0 | 100% |
| 5 | fastify | 55,266 | 17.60 | 38.00 | 27.04 | 18.3 | 114 | 0 | 98% |
| 6 | h3 | 54,140 | 17.93 | 39.00 | 26.28 | 18.7 | 112 | 0 | 96% |
| 7 | polka | 51,998 | 18.73 | 40.00 | 25.39 | 19.6 | 106 | 0 | 93% |
| 8 | hono | 49,812 | 19.57 | 43.00 | 23.61 | 20.3 | 117 | 0 | 89% |
| 9 | 0http | 47,635 | 20.49 | 41.00 | 23.26 | 28.3 | 179 | 0 | 85% |
| 10 | restify | 40,783 | 24.03 | 53.00 | 19.99 | 24.8 | 117 | 0 | 73% |
| 11 | koa | 39,634 | 24.71 | 55.00 | 19.35 | 25.6 | 118 | 0 | 71% |
| 12 | tinyhttp | 34,922 | 28.13 | 60.00 | 19.48 | 41.6 | 204 | 0 | 62% |
| 13 | hapi | 30,085 | 32.73 | 66.00 | 15.41 | 33.7 | 137 | 0 | 54% |
| 14 | express | 16,209 | 61.16 | 82.00 | 7.91 | 73.7 | 200 | 0 | 29% |

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
