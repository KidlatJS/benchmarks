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
Run on 10/21/2026, 00:43:16 (Manila Time, UTC+8) · AMD EPYC 7763 64-Core Processor (4 threads, 16 GB) · Linux 7.0.0-1017-azure (x64) · Node v22.23.3

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 2.4.0 | 104,549 | 102,573 | 110,091 | 105,690 | 316% |
| 2 | uws | 20.71.0 | 99,392 | 101,843 | 88,602 | 96,437 | 288% |
| 3 | hyper-express | 7.0.2 | 109,176 | 103,123 | 44,837 | 79,623 | 238% |
| 4 | 0http | 5.2.0 | 51,695 | 49,960 | 20,984 | 37,843 | 113% |
| 5 | node-http | 22.23.3 | 44,798 | 45,362 | 18,460 | 33,476 | 100% |
| 6 | fastify | 5.12.7 | 44,834 | 43,894 | 17,484 | 32,525 | 97% |
| 7 | polka | 0.5.2 | 45,368 | 42,792 | 15,771 | 31,284 | 93% |
| 8 | hono | 4.13.13 | 42,617 | 41,270 | 16,593 | 30,788 | 92% |
| 9 | h3 | 2.0.2 | 42,349 | 40,431 | 16,570 | 30,499 | 91% |
| 10 | restify | 12.0.0 | 32,741 | 32,463 | 12,329 | 23,576 | 70% |
| 11 | koa | 3.2.1 | 31,347 | 30,870 | 11,117 | 22,075 | 66% |
| 12 | tinyhttp | 3.0.11 | 23,280 | 23,211 | 11,870 | 18,580 | 56% |
| 13 | hapi | 21.4.10 | 26,813 | 26,229 | 8,613 | 18,229 | 54% |
| 14 | express | 5.3.0 | 11,118 | 11,117 | 6,046 | 9,074 | 27% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 109,176 | 8.54 | 16.00 | 14.58 | 9.3 | 70 | 0 | 244% |
| 2 | **kidlat** | 104,549 | 9.18 | 14.00 | 19.64 | 9.3 | 61 | 0 | 233% |
| 3 | uws | 99,392 | 9.47 | 15.00 | 14.88 | 9.1 | 58 | 0 | 222% |
| 4 | 0http | 51,695 | 18.84 | 30.00 | 9.22 | 19.6 | 102 | 0 | 115% |
| 5 | polka | 45,368 | 21.54 | 37.00 | 8.09 | 22.2 | 98 | 0 | 101% |
| 6 | fastify | 44,834 | 21.82 | 35.00 | 8.04 | 22.4 | 104 | 0 | 100% |
| 7 | node-http | 44,798 | 21.84 | 37.00 | 8.80 | 22.4 | 104 | 0 | 100% |
| 8 | hono | 42,617 | 22.95 | 41.00 | 6.99 | 23.6 | 107 | 0 | 95% |
| 9 | h3 | 42,349 | 23.10 | 41.00 | 7.43 | 23.7 | 107 | 0 | 95% |
| 10 | restify | 32,741 | 30.03 | 56.00 | 5.90 | 30.8 | 113 | 0 | 73% |
| 11 | koa | 31,347 | 31.40 | 59.00 | 5.59 | 32.1 | 113 | 0 | 70% |
| 12 | hapi | 26,813 | 36.79 | 65.00 | 5.98 | 37.8 | 115 | 0 | 60% |
| 13 | tinyhttp | 23,280 | 42.44 | 88.00 | 3.93 | 58.5 | 171 | 0 | 52% |
| 14 | express | 11,118 | 89.35 | 125.00 | 1.98 | 102.9 | 158 | 0 | 25% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 103,123 | 9.24 | 17.00 | 13.18 | 9.8 | 79 | 0 | 227% |
| 2 | **kidlat** | 102,573 | 9.32 | 13.00 | 18.68 | 9.4 | 61 | 0 | 226% |
| 3 | uws | 101,843 | 9.28 | 15.00 | 14.67 | 8.9 | 58 | 0 | 225% |
| 4 | 0http | 49,960 | 19.51 | 36.00 | 8.62 | 20.4 | 107 | 0 | 110% |
| 5 | node-http | 45,362 | 21.57 | 32.00 | 8.61 | 22.1 | 109 | 0 | 100% |
| 6 | fastify | 43,894 | 22.28 | 40.00 | 7.62 | 22.9 | 109 | 0 | 97% |
| 7 | polka | 42,792 | 22.85 | 38.00 | 7.39 | 23.4 | 103 | 0 | 94% |
| 8 | hono | 41,270 | 23.74 | 43.00 | 6.53 | 24.3 | 111 | 0 | 91% |
| 9 | h3 | 40,431 | 24.22 | 41.00 | 6.86 | 24.8 | 111 | 0 | 89% |
| 10 | restify | 32,463 | 30.29 | 52.00 | 5.67 | 31.0 | 124 | 0 | 72% |
| 11 | koa | 30,870 | 31.88 | 57.00 | 5.33 | 32.6 | 122 | 0 | 68% |
| 12 | hapi | 26,229 | 37.61 | 64.00 | 5.70 | 38.5 | 140 | 0 | 58% |
| 13 | tinyhttp | 23,211 | 42.57 | 84.00 | 3.79 | 58.2 | 172 | 0 | 51% |
| 14 | express | 11,117 | 89.34 | 121.00 | 1.92 | 102.2 | 162 | 0 | 25% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 110,091 | 8.53 | 12.00 | 54.80 | 8.9 | 62 | 0 | 596% |
| 2 | uws | 88,602 | 10.73 | 19.00 | 40.73 | 11.5 | 67 | 0 | 480% |
| 3 | hyper-express | 44,837 | 21.85 | 35.00 | 19.88 | 22.7 | 97 | 0 | 243% |
| 4 | 0http | 20,984 | 47.12 | 96.00 | 10.25 | 48.9 | 111 | 0 | 114% |
| 5 | node-http | 18,460 | 53.64 | 79.00 | 9.35 | 54.8 | 107 | 0 | 100% |
| 6 | fastify | 17,484 | 56.66 | 83.00 | 8.55 | 57.8 | 109 | 0 | 95% |
| 7 | hono | 16,593 | 59.72 | 88.00 | 7.86 | 61.1 | 109 | 0 | 90% |
| 8 | h3 | 16,570 | 59.82 | 87.00 | 8.04 | 61.1 | 109 | 0 | 90% |
| 9 | polka | 15,771 | 62.85 | 88.00 | 7.70 | 64.0 | 111 | 0 | 85% |
| 10 | restify | 12,329 | 80.55 | 115.00 | 6.04 | 82.3 | 112 | 0 | 67% |
| 11 | tinyhttp | 11,870 | 83.67 | 119.00 | 6.62 | 102.8 | 175 | 0 | 64% |
| 12 | koa | 11,117 | 89.37 | 126.00 | 5.43 | 91.3 | 111 | 0 | 60% |
| 13 | hapi | 8,613 | 115.47 | 150.00 | 4.41 | 117.3 | 140 | 0 | 47% |
| 14 | express | 6,046 | 164.62 | 207.00 | 2.95 | 183.0 | 163 | 0 | 33% |

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
