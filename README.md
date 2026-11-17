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
Run on 11/17/2026, 11:37:39 (Manila Time, UTC+8) · AMD EPYC 7763 64-Core Processor (4 threads, 16 GB) · Linux 7.0.0-1019-azure (x64) · Node v22.23.4

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | uws | 20.71.0 | 105,845 | 113,994 | 90,454 | 102,958 | 319% |
| 2 | **kidlat** | 2.6.0 | 101,314 | 94,590 | 104,336 | 99,996 | 309% |
| 3 | hyper-express | 7.0.2 | 108,933 | 99,531 | 44,506 | 78,436 | 243% |
| 4 | 0http | 5.2.0 | 50,627 | 48,466 | 20,932 | 37,172 | 115% |
| 5 | node-http | 22.23.4 | 43,447 | 43,269 | 17,941 | 32,309 | 100% |
| 6 | fastify | 5.12.7 | 42,374 | 41,174 | 16,817 | 30,843 | 95% |
| 7 | polka | 0.5.2 | 43,780 | 41,655 | 15,555 | 30,498 | 94% |
| 8 | h3 | 2.0.2 | 42,103 | 39,962 | 16,792 | 30,457 | 94% |
| 9 | hono | 4.13.13 | 42,089 | 41,348 | 16,226 | 30,452 | 94% |
| 10 | restify | 12.0.0 | 33,223 | 31,780 | 12,287 | 23,497 | 73% |
| 11 | koa | 3.2.1 | 30,645 | 30,231 | 10,961 | 21,655 | 67% |
| 12 | hapi | 21.4.10 | 30,419 | 29,829 | 9,136 | 20,239 | 63% |
| 13 | tinyhttp | 3.0.11 | 22,955 | 22,832 | 11,844 | 18,378 | 57% |
| 14 | express | 5.3.0 | 11,235 | 10,901 | 6,058 | 9,053 | 28% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 108,933 | 8.61 | 15.00 | 14.54 | 9.3 | 71 | 0 | 251% |
| 2 | uws | 105,845 | 9.07 | 15.00 | 15.85 | 8.7 | 58 | 0 | 244% |
| 3 | **kidlat** | 101,314 | 9.36 | 14.00 | 19.04 | 9.6 | 63 | 0 | 233% |
| 4 | 0http | 50,627 | 19.25 | 35.00 | 9.03 | 20.0 | 103 | 0 | 117% |
| 5 | polka | 43,780 | 22.33 | 40.00 | 7.81 | 22.9 | 98 | 0 | 101% |
| 6 | node-http | 43,447 | 22.52 | 46.00 | 8.54 | 23.1 | 103 | 0 | 100% |
| 7 | fastify | 42,374 | 23.11 | 40.00 | 7.60 | 23.7 | 106 | 0 | 98% |
| 8 | h3 | 42,103 | 23.24 | 48.00 | 7.39 | 23.9 | 105 | 0 | 97% |
| 9 | hono | 42,089 | 23.24 | 48.00 | 6.90 | 23.9 | 103 | 0 | 97% |
| 10 | restify | 33,223 | 29.61 | 54.00 | 5.99 | 30.3 | 113 | 0 | 76% |
| 11 | koa | 30,645 | 32.11 | 65.00 | 5.46 | 32.9 | 119 | 0 | 71% |
| 12 | hapi | 30,419 | 32.37 | 63.00 | 6.79 | 33.3 | 119 | 0 | 70% |
| 13 | tinyhttp | 22,955 | 43.05 | 87.00 | 3.87 | 58.9 | 172 | 0 | 53% |
| 14 | express | 11,235 | 88.42 | 124.00 | 2.00 | 100.6 | 147 | 0 | 26% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 113,994 | 8.30 | 15.00 | 16.41 | 8.4 | 60 | 0 | 263% |
| 2 | hyper-express | 99,531 | 9.55 | 19.00 | 12.72 | 10.2 | 78 | 0 | 230% |
| 3 | **kidlat** | 94,590 | 10.21 | 16.00 | 17.23 | 10.0 | 64 | 0 | 219% |
| 4 | 0http | 48,466 | 20.14 | 35.00 | 8.37 | 21.1 | 108 | 0 | 112% |
| 5 | node-http | 43,269 | 22.60 | 45.00 | 8.21 | 23.2 | 108 | 0 | 100% |
| 6 | polka | 41,655 | 23.54 | 46.00 | 7.19 | 24.1 | 103 | 0 | 96% |
| 7 | hono | 41,348 | 23.68 | 43.00 | 6.55 | 24.3 | 109 | 0 | 96% |
| 8 | fastify | 41,174 | 23.79 | 45.00 | 7.15 | 24.4 | 112 | 0 | 95% |
| 9 | h3 | 39,962 | 24.51 | 45.00 | 6.78 | 25.1 | 110 | 0 | 92% |
| 10 | restify | 31,780 | 30.96 | 62.00 | 5.55 | 31.6 | 124 | 0 | 73% |
| 11 | koa | 30,231 | 32.57 | 62.00 | 5.22 | 33.2 | 128 | 0 | 70% |
| 12 | hapi | 29,829 | 33.02 | 61.00 | 6.49 | 33.9 | 129 | 0 | 69% |
| 13 | tinyhttp | 22,832 | 43.28 | 85.00 | 3.72 | 59.2 | 172 | 0 | 53% |
| 14 | express | 10,901 | 91.15 | 123.00 | 1.88 | 102.8 | 156 | 0 | 25% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 104,336 | 9.24 | 17.00 | 51.94 | 9.4 | 69 | 0 | 582% |
| 2 | uws | 90,454 | 10.44 | 18.00 | 41.58 | 11.3 | 67 | 0 | 504% |
| 3 | hyper-express | 44,506 | 21.96 | 35.00 | 19.74 | 22.9 | 102 | 0 | 248% |
| 4 | 0http | 20,932 | 47.25 | 98.00 | 10.22 | 49.2 | 113 | 0 | 117% |
| 5 | node-http | 17,941 | 55.20 | 79.00 | 9.08 | 56.4 | 108 | 0 | 100% |
| 6 | fastify | 16,817 | 58.92 | 95.00 | 8.23 | 60.3 | 111 | 0 | 94% |
| 7 | h3 | 16,792 | 59.01 | 93.00 | 8.15 | 60.3 | 111 | 0 | 94% |
| 8 | hono | 16,226 | 61.07 | 94.00 | 7.69 | 62.3 | 108 | 0 | 90% |
| 9 | polka | 15,555 | 63.75 | 94.00 | 7.60 | 65.3 | 103 | 0 | 87% |
| 10 | restify | 12,287 | 80.79 | 119.00 | 6.02 | 82.5 | 112 | 0 | 68% |
| 11 | tinyhttp | 11,844 | 83.87 | 119.00 | 6.61 | 103.6 | 175 | 0 | 66% |
| 12 | koa | 10,961 | 90.65 | 128.00 | 5.35 | 92.7 | 117 | 0 | 61% |
| 13 | hapi | 9,136 | 108.85 | 148.00 | 4.68 | 110.6 | 130 | 0 | 51% |
| 14 | express | 6,058 | 164.30 | 210.00 | 2.96 | 180.9 | 157 | 0 | 34% |

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
