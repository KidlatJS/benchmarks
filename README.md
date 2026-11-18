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
Run on 11/18/2026, 11:33:01 (Manila Time, UTC+8) · AMD EPYC 9V45 96-Core Processor (4 threads, 16 GB) · Linux 7.0.0-1019-azure (x64) · Node v22.23.4

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | uws | 20.71.0 | 196,237 | 192,346 | 156,749 | 180,865 | 282% |
| 2 | **kidlat** | 2.6.0 | 178,966 | 181,290 | 181,629 | 180,624 | 281% |
| 3 | hyper-express | 7.0.2 | 172,602 | 164,989 | 96,237 | 139,942 | 218% |
| 4 | fastify | 5.12.7 | 83,093 | 82,296 | 50,506 | 70,161 | 109% |
| 5 | polka | 0.5.2 | 86,464 | 83,997 | 46,630 | 69,704 | 109% |
| 6 | node-http | 22.23.4 | 74,624 | 76,978 | 46,122 | 64,227 | 100% |
| 7 | hono | 4.13.13 | 74,720 | 77,005 | 43,694 | 63,114 | 98% |
| 8 | h3 | 2.0.2 | 75,107 | 71,218 | 41,949 | 60,766 | 95% |
| 9 | 0http | 5.2.0 | 67,688 | 66,545 | 40,396 | 56,666 | 88% |
| 10 | restify | 12.0.0 | 67,328 | 66,949 | 36,387 | 54,739 | 85% |
| 11 | koa | 3.2.1 | 60,958 | 62,257 | 37,492 | 52,206 | 81% |
| 12 | hapi | 21.4.10 | 64,173 | 58,953 | 26,880 | 46,676 | 73% |
| 13 | tinyhttp | 3.0.11 | 45,307 | 45,626 | 29,465 | 39,345 | 61% |
| 14 | express | 5.3.0 | 21,283 | 21,669 | 15,602 | 19,306 | 30% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 196,237 | 4.60 | 6.00 | 29.38 | 5.0 | 58 | 0 | 263% |
| 2 | **kidlat** | 178,966 | 5.11 | 7.00 | 33.63 | 5.3 | 63 | 0 | 240% |
| 3 | hyper-express | 172,602 | 5.18 | 7.00 | 23.04 | 5.9 | 79 | 0 | 231% |
| 4 | polka | 86,464 | 11.05 | 21.00 | 15.42 | 11.6 | 101 | 0 | 116% |
| 5 | fastify | 83,093 | 11.54 | 20.00 | 14.90 | 12.1 | 106 | 0 | 111% |
| 6 | h3 | 75,107 | 12.81 | 24.00 | 13.18 | 13.4 | 108 | 0 | 101% |
| 7 | hono | 74,720 | 12.89 | 25.00 | 12.26 | 13.5 | 105 | 0 | 100% |
| 8 | node-http | 74,624 | 12.91 | 23.00 | 14.66 | 13.5 | 103 | 0 | 100% |
| 9 | 0http | 67,688 | 14.28 | 29.00 | 12.07 | 19.4 | 158 | 0 | 91% |
| 10 | restify | 67,328 | 14.36 | 27.00 | 12.14 | 15.0 | 117 | 0 | 90% |
| 11 | hapi | 64,173 | 15.09 | 29.00 | 14.32 | 15.8 | 131 | 0 | 86% |
| 12 | koa | 60,958 | 15.91 | 31.00 | 10.87 | 16.6 | 114 | 0 | 82% |
| 13 | tinyhttp | 45,307 | 21.57 | 42.00 | 7.65 | 34.0 | 184 | 0 | 61% |
| 14 | express | 21,283 | 46.47 | 80.00 | 3.80 | 56.2 | 188 | 0 | 29% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 192,346 | 4.76 | 7.00 | 27.70 | 5.1 | 60 | 0 | 250% |
| 2 | **kidlat** | 181,290 | 5.09 | 8.00 | 33.02 | 5.3 | 64 | 0 | 236% |
| 3 | hyper-express | 164,989 | 5.51 | 8.00 | 21.09 | 6.2 | 79 | 0 | 214% |
| 4 | polka | 83,997 | 11.42 | 22.00 | 14.50 | 12.0 | 107 | 0 | 109% |
| 5 | fastify | 82,296 | 11.66 | 22.00 | 14.28 | 12.2 | 112 | 0 | 107% |
| 6 | hono | 77,005 | 12.50 | 24.00 | 12.19 | 13.1 | 109 | 0 | 100% |
| 7 | node-http | 76,978 | 12.48 | 23.00 | 14.61 | 13.1 | 109 | 0 | 100% |
| 8 | h3 | 71,218 | 13.55 | 25.00 | 12.09 | 14.1 | 113 | 0 | 93% |
| 9 | restify | 66,949 | 14.44 | 28.00 | 11.68 | 15.0 | 128 | 0 | 87% |
| 10 | 0http | 66,545 | 14.53 | 30.00 | 11.49 | 19.7 | 158 | 0 | 86% |
| 11 | koa | 62,257 | 15.56 | 30.00 | 10.75 | 16.2 | 122 | 0 | 81% |
| 12 | hapi | 58,953 | 16.46 | 32.00 | 12.82 | 17.2 | 138 | 0 | 77% |
| 13 | tinyhttp | 45,626 | 21.42 | 42.00 | 7.44 | 34.2 | 190 | 0 | 59% |
| 14 | express | 21,669 | 45.62 | 80.00 | 3.74 | 55.1 | 188 | 0 | 28% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 181,629 | 5.09 | 7.00 | 90.41 | 5.4 | 67 | 0 | 394% |
| 2 | uws | 156,749 | 5.94 | 8.00 | 72.05 | 6.7 | 68 | 0 | 340% |
| 3 | hyper-express | 96,237 | 9.87 | 13.00 | 42.68 | 11.0 | 101 | 0 | 209% |
| 4 | fastify | 50,506 | 19.30 | 43.00 | 24.71 | 20.3 | 110 | 0 | 110% |
| 5 | polka | 46,630 | 20.94 | 47.00 | 22.77 | 22.2 | 108 | 0 | 101% |
| 6 | node-http | 46,122 | 21.18 | 45.00 | 23.36 | 22.3 | 112 | 0 | 100% |
| 7 | hono | 43,694 | 22.39 | 49.00 | 20.71 | 23.4 | 116 | 0 | 95% |
| 8 | h3 | 41,949 | 23.34 | 52.00 | 20.36 | 24.4 | 114 | 0 | 91% |
| 9 | 0http | 40,396 | 24.25 | 51.00 | 19.72 | 33.6 | 177 | 0 | 88% |
| 10 | koa | 37,492 | 26.15 | 58.00 | 18.31 | 27.4 | 123 | 0 | 81% |
| 11 | restify | 36,387 | 26.98 | 61.00 | 17.84 | 28.1 | 119 | 0 | 79% |
| 12 | tinyhttp | 29,465 | 33.43 | 70.00 | 16.44 | 50.6 | 195 | 0 | 64% |
| 13 | hapi | 26,880 | 36.69 | 74.00 | 13.77 | 38.1 | 139 | 0 | 58% |
| 14 | express | 15,602 | 63.56 | 85.00 | 7.62 | 76.9 | 190 | 0 | 34% |

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
