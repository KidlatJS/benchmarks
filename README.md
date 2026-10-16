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
Run on 10/17/2026, 07:24:38 (Manila Time, UTC+8) · AMD EPYC 7763 64-Core Processor (4 threads, 16 GB) · Linux 6.17.0-1022-azure (x64) · Node v22.23.3

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 2.4.0 | 101,542 | 103,704 | 107,896 | 104,348 | 325% |
| 2 | uws | 20.71.0 | 105,995 | 107,595 | 88,842 | 100,438 | 313% |
| 3 | hyper-express | 7.0.2 | 109,526 | 103,971 | 48,810 | 82,221 | 256% |
| 4 | 0http | 5.2.0 | 51,461 | 50,341 | 22,148 | 38,569 | 120% |
| 5 | node-http | 22.23.3 | 44,046 | 43,854 | 17,097 | 32,083 | 100% |
| 6 | fastify | 5.12.7 | 44,334 | 43,502 | 16,865 | 31,921 | 99% |
| 7 | polka | 0.5.2 | 45,178 | 42,917 | 15,568 | 31,136 | 97% |
| 8 | h3 | 2.0.2 | 42,691 | 39,997 | 16,913 | 30,681 | 96% |
| 9 | hono | 4.13.13 | 42,834 | 41,402 | 16,056 | 30,536 | 95% |
| 10 | restify | 12.0.0 | 32,944 | 32,366 | 12,627 | 23,790 | 74% |
| 11 | koa | 3.2.1 | 30,948 | 30,790 | 10,928 | 21,837 | 68% |
| 12 | hapi | 21.4.10 | 31,849 | 30,795 | 9,525 | 21,061 | 66% |
| 13 | tinyhttp | 3.0.11 | 23,448 | 23,407 | 11,714 | 18,594 | 58% |
| 14 | express | 5.3.0 | 11,218 | 11,011 | 6,040 | 9,070 | 28% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 109,526 | 8.53 | 16.00 | 14.62 | 9.3 | 70 | 0 | 249% |
| 2 | uws | 105,995 | 9.13 | 14.00 | 15.87 | 8.3 | 58 | 0 | 241% |
| 3 | **kidlat** | 101,542 | 9.45 | 16.00 | 19.08 | 9.2 | 61 | 0 | 231% |
| 4 | 0http | 51,461 | 18.93 | 33.00 | 9.18 | 19.8 | 103 | 0 | 117% |
| 5 | polka | 45,178 | 21.64 | 35.00 | 8.06 | 22.3 | 99 | 0 | 103% |
| 6 | fastify | 44,334 | 22.07 | 36.00 | 7.95 | 22.7 | 104 | 0 | 101% |
| 7 | node-http | 44,046 | 22.20 | 37.00 | 8.65 | 22.8 | 100 | 0 | 100% |
| 8 | hono | 42,834 | 22.84 | 37.00 | 7.03 | 23.5 | 106 | 0 | 97% |
| 9 | h3 | 42,691 | 22.92 | 37.00 | 7.49 | 23.6 | 103 | 0 | 97% |
| 10 | restify | 32,944 | 29.85 | 52.00 | 5.94 | 30.6 | 113 | 0 | 75% |
| 11 | hapi | 31,849 | 30.89 | 52.00 | 7.11 | 31.8 | 119 | 0 | 72% |
| 12 | koa | 30,948 | 31.81 | 54.00 | 5.52 | 32.5 | 114 | 0 | 70% |
| 13 | tinyhttp | 23,448 | 42.14 | 86.00 | 3.96 | 59.4 | 166 | 0 | 53% |
| 14 | express | 11,218 | 88.53 | 122.00 | 2.00 | 100.9 | 153 | 0 | 25% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 107,595 | 8.83 | 14.00 | 15.49 | 8.3 | 58 | 0 | 245% |
| 2 | hyper-express | 103,971 | 9.26 | 17.00 | 13.29 | 9.8 | 78 | 0 | 237% |
| 3 | **kidlat** | 103,704 | 9.22 | 13.00 | 18.89 | 9.3 | 61 | 0 | 236% |
| 4 | 0http | 50,341 | 19.37 | 34.00 | 8.69 | 20.3 | 107 | 0 | 115% |
| 5 | node-http | 43,854 | 22.29 | 36.00 | 8.32 | 22.9 | 106 | 0 | 100% |
| 6 | fastify | 43,502 | 22.48 | 37.00 | 7.55 | 23.1 | 109 | 0 | 99% |
| 7 | polka | 42,917 | 22.79 | 36.00 | 7.41 | 23.4 | 105 | 0 | 98% |
| 8 | hono | 41,402 | 23.67 | 39.00 | 6.55 | 24.2 | 110 | 0 | 94% |
| 9 | h3 | 39,997 | 24.49 | 39.00 | 6.79 | 25.1 | 108 | 0 | 91% |
| 10 | restify | 32,366 | 30.40 | 52.00 | 5.65 | 31.0 | 124 | 0 | 74% |
| 11 | hapi | 30,795 | 31.97 | 54.00 | 6.70 | 32.8 | 133 | 0 | 70% |
| 12 | koa | 30,790 | 31.97 | 53.00 | 5.31 | 32.6 | 122 | 0 | 70% |
| 13 | tinyhttp | 23,407 | 42.22 | 80.00 | 3.82 | 58.8 | 172 | 0 | 53% |
| 14 | express | 11,011 | 90.22 | 121.00 | 1.90 | 102.7 | 155 | 0 | 25% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 107,896 | 8.78 | 14.00 | 53.71 | 9.1 | 62 | 0 | 631% |
| 2 | uws | 88,842 | 10.70 | 20.00 | 40.84 | 11.4 | 67 | 0 | 520% |
| 3 | hyper-express | 48,810 | 19.99 | 30.00 | 21.64 | 21.0 | 101 | 0 | 285% |
| 4 | 0http | 22,148 | 44.63 | 92.00 | 10.81 | 46.5 | 110 | 0 | 130% |
| 5 | node-http | 17,097 | 57.95 | 95.00 | 8.66 | 59.2 | 106 | 0 | 100% |
| 6 | h3 | 16,913 | 58.59 | 85.00 | 8.21 | 59.9 | 109 | 0 | 99% |
| 7 | fastify | 16,865 | 58.76 | 86.00 | 8.25 | 60.1 | 107 | 0 | 99% |
| 8 | hono | 16,056 | 61.73 | 92.00 | 7.61 | 63.1 | 110 | 0 | 94% |
| 9 | polka | 15,568 | 63.70 | 90.00 | 7.60 | 65.2 | 108 | 0 | 91% |
| 10 | restify | 12,627 | 78.64 | 107.00 | 6.19 | 80.3 | 112 | 0 | 74% |
| 11 | tinyhttp | 11,714 | 84.80 | 116.00 | 6.53 | 104.5 | 175 | 0 | 69% |
| 12 | koa | 10,928 | 90.93 | 125.00 | 5.34 | 92.9 | 113 | 0 | 64% |
| 13 | hapi | 9,525 | 104.37 | 134.00 | 4.88 | 106.0 | 144 | 0 | 56% |
| 14 | express | 6,040 | 164.78 | 198.00 | 2.95 | 181.9 | 156 | 0 | 35% |

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
