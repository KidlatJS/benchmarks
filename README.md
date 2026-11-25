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
Run on 11/25/2026, 10:10:11 (Manila Time, UTC+8) · AMD EPYC 7763 64-Core Processor (4 threads, 16 GB) · Linux 7.0.0-1020-azure (x64) · Node v22.23.5

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 2.6.0 | 98,114 | 99,016 | 108,038 | 101,626 | 313% |
| 2 | uws | 20.71.0 | 93,249 | 98,867 | 86,488 | 92,729 | 286% |
| 3 | hyper-express | 7.0.2 | 107,080 | 100,595 | 44,387 | 78,195 | 241% |
| 4 | 0http | 5.2.0 | 43,343 | 44,048 | 19,574 | 33,433 | 103% |
| 5 | node-http | 22.23.5 | 44,018 | 42,996 | 18,075 | 32,462 | 100% |
| 6 | fastify | 5.12.7 | 43,726 | 42,374 | 16,959 | 31,555 | 97% |
| 7 | polka | 0.5.2 | 43,907 | 41,888 | 15,629 | 30,633 | 94% |
| 8 | hono | 4.13.13 | 42,956 | 40,878 | 15,848 | 30,304 | 93% |
| 9 | h3 | 2.0.2 | 42,431 | 39,497 | 16,329 | 30,135 | 93% |
| 10 | restify | 12.0.0 | 32,581 | 31,775 | 12,069 | 23,204 | 71% |
| 11 | koa | 3.2.1 | 30,158 | 29,476 | 10,571 | 21,102 | 65% |
| 12 | hapi | 21.4.10 | 30,566 | 29,812 | 9,116 | 20,252 | 62% |
| 13 | tinyhttp | 3.0.11 | 22,970 | 22,740 | 11,803 | 18,336 | 56% |
| 14 | express | 5.3.0 | 11,350 | 11,284 | 5,912 | 9,114 | 28% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 107,080 | 8.84 | 15.00 | 14.30 | 9.5 | 71 | 0 | 243% |
| 2 | **kidlat** | 98,114 | 9.72 | 16.00 | 18.44 | 9.8 | 64 | 0 | 223% |
| 3 | uws | 93,249 | 10.29 | 18.00 | 13.96 | 9.6 | 57 | 0 | 212% |
| 4 | node-http | 44,018 | 22.21 | 35.00 | 8.65 | 22.8 | 106 | 0 | 100% |
| 5 | polka | 43,907 | 22.29 | 46.00 | 7.83 | 22.9 | 101 | 0 | 100% |
| 6 | fastify | 43,726 | 22.37 | 44.00 | 7.84 | 23.0 | 104 | 0 | 99% |
| 7 | 0http | 43,343 | 22.57 | 56.00 | 7.73 | 28.8 | 146 | 0 | 98% |
| 8 | hono | 42,956 | 22.77 | 43.00 | 7.05 | 23.4 | 103 | 0 | 98% |
| 9 | h3 | 42,431 | 23.06 | 39.00 | 7.45 | 23.7 | 107 | 0 | 96% |
| 10 | restify | 32,581 | 30.17 | 58.00 | 5.87 | 30.9 | 113 | 0 | 74% |
| 11 | hapi | 30,566 | 32.21 | 63.00 | 6.82 | 33.2 | 119 | 0 | 69% |
| 12 | koa | 30,158 | 32.64 | 61.00 | 5.38 | 33.4 | 116 | 0 | 69% |
| 13 | tinyhttp | 22,970 | 43.02 | 90.00 | 3.88 | 58.7 | 173 | 0 | 52% |
| 14 | express | 11,350 | 87.54 | 125.00 | 2.02 | 99.7 | 158 | 0 | 26% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 100,595 | 9.41 | 17.00 | 12.85 | 10.1 | 78 | 0 | 234% |
| 2 | **kidlat** | 99,016 | 9.53 | 14.00 | 18.03 | 9.6 | 64 | 0 | 230% |
| 3 | uws | 98,867 | 9.65 | 18.00 | 14.24 | 9.2 | 58 | 0 | 230% |
| 4 | 0http | 44,048 | 22.20 | 51.00 | 7.60 | 28.4 | 147 | 0 | 102% |
| 5 | node-http | 42,996 | 22.75 | 42.00 | 8.16 | 23.3 | 111 | 0 | 100% |
| 6 | fastify | 42,374 | 23.10 | 43.00 | 7.35 | 23.7 | 110 | 0 | 99% |
| 7 | polka | 41,888 | 23.37 | 46.00 | 7.23 | 23.9 | 107 | 0 | 97% |
| 8 | hono | 40,878 | 23.96 | 43.00 | 6.47 | 24.6 | 108 | 0 | 95% |
| 9 | h3 | 39,497 | 24.82 | 45.00 | 6.70 | 25.4 | 112 | 0 | 92% |
| 10 | restify | 31,775 | 30.96 | 57.00 | 5.55 | 31.6 | 125 | 0 | 74% |
| 11 | hapi | 29,812 | 33.03 | 66.00 | 6.48 | 33.9 | 131 | 0 | 69% |
| 12 | koa | 29,476 | 33.41 | 63.00 | 5.09 | 34.1 | 125 | 0 | 69% |
| 13 | tinyhttp | 22,740 | 43.47 | 85.00 | 3.71 | 59.2 | 173 | 0 | 53% |
| 14 | express | 11,284 | 88.04 | 120.00 | 1.95 | 99.5 | 159 | 0 | 26% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 108,038 | 8.75 | 14.00 | 53.78 | 9.1 | 69 | 0 | 598% |
| 2 | uws | 86,488 | 11.03 | 21.00 | 39.76 | 11.8 | 67 | 0 | 478% |
| 3 | hyper-express | 44,387 | 22.07 | 36.00 | 19.69 | 23.0 | 100 | 0 | 246% |
| 4 | 0http | 19,574 | 50.57 | 104.00 | 9.56 | 61.6 | 166 | 0 | 108% |
| 5 | node-http | 18,075 | 54.80 | 85.00 | 9.15 | 56.2 | 109 | 0 | 100% |
| 6 | fastify | 16,959 | 58.44 | 87.00 | 8.30 | 59.8 | 108 | 0 | 94% |
| 7 | h3 | 16,329 | 60.70 | 97.00 | 7.93 | 62.1 | 111 | 0 | 90% |
| 8 | hono | 15,848 | 62.56 | 96.00 | 7.51 | 64.0 | 109 | 0 | 88% |
| 9 | polka | 15,629 | 63.45 | 92.00 | 7.63 | 65.2 | 105 | 0 | 86% |
| 10 | restify | 12,069 | 82.29 | 117.00 | 5.92 | 84.1 | 120 | 0 | 67% |
| 11 | tinyhttp | 11,803 | 84.16 | 118.00 | 6.58 | 104.2 | 177 | 0 | 65% |
| 12 | koa | 10,571 | 94.01 | 131.00 | 5.16 | 96.3 | 116 | 0 | 58% |
| 13 | hapi | 9,116 | 109.07 | 145.00 | 4.67 | 110.9 | 138 | 0 | 50% |
| 14 | express | 5,912 | 168.38 | 215.00 | 2.89 | 185.9 | 159 | 0 | 33% |

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
