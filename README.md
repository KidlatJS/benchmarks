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
Run on 11/01/2026, 01:36:24 (Manila Time, UTC+8) · AMD EPYC 7763 64-Core Processor (4 threads, 16 GB) · Linux 7.0.0-1017-azure (x64) · Node v22.23.4

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 2.4.0 | 104,099 | 100,419 | 104,726 | 103,064 | 309% |
| 2 | uws | 20.71.0 | 100,658 | 105,046 | 91,059 | 98,745 | 296% |
| 3 | hyper-express | 7.0.2 | 106,411 | 100,443 | 44,944 | 78,318 | 235% |
| 4 | 0http | 5.2.0 | 44,269 | 44,672 | 19,708 | 33,905 | 102% |
| 5 | node-http | 22.23.4 | 45,049 | 44,999 | 18,350 | 33,382 | 100% |
| 6 | fastify | 5.12.7 | 44,551 | 43,874 | 17,730 | 32,603 | 98% |
| 7 | h3 | 2.0.2 | 43,926 | 41,190 | 17,031 | 31,351 | 94% |
| 8 | polka | 0.5.2 | 45,175 | 42,884 | 15,529 | 31,102 | 93% |
| 9 | hono | 4.13.13 | 43,258 | 41,760 | 16,413 | 30,951 | 93% |
| 10 | restify | 12.0.0 | 32,819 | 32,200 | 12,413 | 23,584 | 71% |
| 11 | koa | 3.2.1 | 31,063 | 30,350 | 11,002 | 21,809 | 65% |
| 12 | tinyhttp | 3.0.11 | 23,472 | 22,899 | 12,003 | 18,616 | 56% |
| 13 | hapi | 21.4.10 | 26,410 | 25,802 | 8,287 | 17,808 | 53% |
| 14 | express | 5.3.0 | 11,362 | 11,281 | 6,160 | 9,243 | 28% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 106,411 | 8.78 | 17.00 | 14.21 | 9.5 | 71 | 0 | 236% |
| 2 | **kidlat** | 104,099 | 9.26 | 15.00 | 19.56 | 9.3 | 62 | 0 | 231% |
| 3 | uws | 100,658 | 9.41 | 14.00 | 15.07 | 8.9 | 58 | 0 | 223% |
| 4 | polka | 45,175 | 21.64 | 37.00 | 8.06 | 22.3 | 98 | 0 | 100% |
| 5 | node-http | 45,049 | 21.72 | 37.00 | 8.85 | 22.3 | 103 | 0 | 100% |
| 6 | fastify | 44,551 | 21.97 | 39.00 | 7.99 | 22.6 | 107 | 0 | 99% |
| 7 | 0http | 44,269 | 22.09 | 51.00 | 7.89 | 28.5 | 145 | 0 | 98% |
| 8 | h3 | 43,926 | 22.26 | 41.00 | 7.71 | 22.9 | 104 | 0 | 98% |
| 9 | hono | 43,258 | 22.61 | 39.00 | 7.10 | 23.3 | 107 | 0 | 96% |
| 10 | restify | 32,819 | 29.96 | 56.00 | 5.92 | 30.7 | 115 | 0 | 73% |
| 11 | koa | 31,063 | 31.67 | 57.00 | 5.54 | 32.4 | 113 | 0 | 69% |
| 12 | hapi | 26,410 | 37.34 | 67.00 | 5.89 | 38.3 | 115 | 0 | 59% |
| 13 | tinyhttp | 23,472 | 42.10 | 87.00 | 3.96 | 57.2 | 171 | 0 | 52% |
| 14 | express | 11,362 | 87.42 | 121.00 | 2.03 | 99.1 | 152 | 0 | 25% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 105,046 | 9.10 | 15.00 | 15.13 | 8.7 | 58 | 0 | 233% |
| 2 | hyper-express | 100,443 | 9.49 | 19.00 | 12.84 | 10.1 | 79 | 0 | 223% |
| 3 | **kidlat** | 100,419 | 9.51 | 14.00 | 18.29 | 9.6 | 62 | 0 | 223% |
| 4 | node-http | 44,999 | 21.74 | 35.00 | 8.54 | 22.3 | 108 | 0 | 100% |
| 5 | 0http | 44,672 | 21.89 | 49.00 | 7.71 | 28.0 | 145 | 0 | 99% |
| 6 | fastify | 43,874 | 22.29 | 41.00 | 7.62 | 22.9 | 112 | 0 | 97% |
| 7 | polka | 42,884 | 22.81 | 39.00 | 7.40 | 23.4 | 104 | 0 | 95% |
| 8 | hono | 41,760 | 23.46 | 43.00 | 6.61 | 24.0 | 111 | 0 | 93% |
| 9 | h3 | 41,190 | 23.78 | 40.00 | 6.99 | 24.4 | 108 | 0 | 92% |
| 10 | restify | 32,200 | 30.56 | 57.00 | 5.62 | 31.3 | 124 | 0 | 72% |
| 11 | koa | 30,350 | 32.44 | 60.00 | 5.24 | 33.1 | 122 | 0 | 67% |
| 12 | hapi | 25,802 | 38.24 | 66.00 | 5.61 | 39.1 | 130 | 0 | 57% |
| 13 | tinyhttp | 22,899 | 43.17 | 85.00 | 3.73 | 58.7 | 179 | 0 | 51% |
| 14 | express | 11,281 | 88.05 | 114.00 | 1.95 | 99.2 | 152 | 0 | 25% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 104,726 | 9.08 | 16.00 | 52.13 | 9.4 | 62 | 0 | 571% |
| 2 | uws | 91,059 | 10.38 | 18.00 | 41.86 | 11.1 | 67 | 0 | 496% |
| 3 | hyper-express | 44,944 | 21.77 | 36.00 | 19.93 | 22.8 | 101 | 0 | 245% |
| 4 | 0http | 19,708 | 50.21 | 104.00 | 9.62 | 61.6 | 166 | 0 | 107% |
| 5 | node-http | 18,350 | 53.96 | 79.00 | 9.29 | 55.1 | 106 | 0 | 100% |
| 6 | fastify | 17,730 | 55.87 | 81.00 | 8.67 | 57.1 | 110 | 0 | 97% |
| 7 | h3 | 17,031 | 58.18 | 86.00 | 8.27 | 59.4 | 103 | 0 | 93% |
| 8 | hono | 16,413 | 60.38 | 88.00 | 7.78 | 61.7 | 103 | 0 | 89% |
| 9 | polka | 15,529 | 63.86 | 92.00 | 7.58 | 65.4 | 98 | 0 | 85% |
| 10 | restify | 12,413 | 79.94 | 115.00 | 6.08 | 81.7 | 112 | 0 | 68% |
| 11 | tinyhttp | 12,003 | 82.72 | 114.00 | 6.70 | 102.1 | 182 | 0 | 65% |
| 12 | koa | 11,002 | 90.27 | 128.00 | 5.37 | 92.3 | 110 | 0 | 60% |
| 13 | hapi | 8,287 | 119.99 | 158.00 | 4.24 | 122.0 | 130 | 0 | 45% |
| 14 | express | 6,160 | 161.53 | 201.00 | 3.01 | 177.9 | 152 | 0 | 34% |

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
