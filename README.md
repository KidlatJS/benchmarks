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
Run on 10/22/2026, 23:06:11 (Manila Time, UTC+8) · AMD EPYC 7763 64-Core Processor (4 threads, 16 GB) · Linux 6.17.0-1022-azure (x64) · Node v22.23.3

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 2.4.0 | 103,075 | 102,704 | 109,019 | 104,893 | 320% |
| 2 | uws | 20.71.0 | 106,370 | 108,629 | 89,304 | 101,052 | 309% |
| 3 | hyper-express | 7.0.2 | 110,258 | 101,526 | 47,542 | 81,038 | 248% |
| 4 | 0http | 5.2.0 | 44,560 | 43,978 | 20,188 | 34,074 | 104% |
| 5 | node-http | 22.23.3 | 44,752 | 45,258 | 17,328 | 32,741 | 100% |
| 6 | fastify | 5.12.7 | 44,441 | 43,259 | 17,039 | 31,997 | 98% |
| 7 | h3 | 2.0.2 | 42,817 | 40,581 | 16,998 | 30,911 | 94% |
| 8 | polka | 0.5.2 | 45,094 | 42,600 | 15,211 | 30,801 | 94% |
| 9 | hono | 4.13.13 | 42,654 | 41,088 | 16,030 | 30,400 | 93% |
| 10 | restify | 12.0.0 | 32,575 | 32,348 | 12,317 | 23,501 | 72% |
| 11 | koa | 3.2.1 | 30,532 | 30,237 | 10,906 | 21,593 | 66% |
| 12 | hapi | 21.4.10 | 31,634 | 31,043 | 9,252 | 20,866 | 64% |
| 13 | tinyhttp | 3.0.11 | 23,977 | 23,410 | 12,062 | 18,917 | 58% |
| 14 | express | 5.3.0 | 11,265 | 11,000 | 6,073 | 9,096 | 28% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 110,258 | 8.47 | 16.00 | 14.72 | 9.2 | 70 | 0 | 246% |
| 2 | uws | 106,370 | 9.08 | 14.00 | 15.93 | 8.3 | 58 | 0 | 238% |
| 3 | **kidlat** | 103,075 | 9.31 | 15.00 | 19.37 | 9.2 | 61 | 0 | 230% |
| 4 | polka | 45,094 | 21.69 | 35.00 | 8.04 | 22.3 | 101 | 0 | 101% |
| 5 | node-http | 44,752 | 21.84 | 36.00 | 8.79 | 22.5 | 103 | 0 | 100% |
| 6 | 0http | 44,560 | 21.94 | 45.00 | 7.95 | 28.6 | 145 | 0 | 100% |
| 7 | fastify | 44,441 | 22.00 | 35.00 | 7.97 | 22.6 | 107 | 0 | 99% |
| 8 | h3 | 42,817 | 22.84 | 39.00 | 7.51 | 23.5 | 104 | 0 | 96% |
| 9 | hono | 42,654 | 22.94 | 37.00 | 7.00 | 23.6 | 106 | 0 | 95% |
| 10 | restify | 32,575 | 30.19 | 53.00 | 5.87 | 30.9 | 113 | 0 | 73% |
| 11 | hapi | 31,634 | 31.10 | 54.00 | 7.06 | 32.0 | 124 | 0 | 71% |
| 12 | koa | 30,532 | 32.25 | 56.00 | 5.44 | 33.0 | 117 | 0 | 68% |
| 13 | tinyhttp | 23,977 | 41.19 | 83.00 | 4.05 | 57.6 | 167 | 0 | 54% |
| 14 | express | 11,265 | 88.18 | 119.00 | 2.01 | 99.9 | 153 | 0 | 25% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 108,629 | 8.73 | 14.00 | 15.64 | 8.3 | 58 | 0 | 240% |
| 2 | **kidlat** | 102,704 | 9.31 | 15.00 | 18.71 | 9.4 | 62 | 0 | 227% |
| 3 | hyper-express | 101,526 | 9.44 | 18.00 | 12.97 | 10.0 | 79 | 0 | 224% |
| 4 | node-http | 45,258 | 21.60 | 35.00 | 8.59 | 22.2 | 109 | 0 | 100% |
| 5 | 0http | 43,978 | 22.25 | 47.00 | 7.59 | 28.9 | 145 | 0 | 97% |
| 6 | fastify | 43,259 | 22.60 | 37.00 | 7.51 | 23.2 | 112 | 0 | 96% |
| 7 | polka | 42,600 | 22.97 | 37.00 | 7.35 | 23.5 | 107 | 0 | 94% |
| 8 | hono | 41,088 | 23.83 | 38.00 | 6.51 | 24.4 | 111 | 0 | 91% |
| 9 | h3 | 40,581 | 24.12 | 39.00 | 6.89 | 24.7 | 109 | 0 | 90% |
| 10 | restify | 32,348 | 30.41 | 52.00 | 5.65 | 31.1 | 124 | 0 | 71% |
| 11 | hapi | 31,043 | 31.71 | 54.00 | 6.75 | 32.5 | 145 | 0 | 69% |
| 12 | koa | 30,237 | 32.57 | 56.00 | 5.22 | 33.2 | 126 | 0 | 67% |
| 13 | tinyhttp | 23,410 | 42.21 | 82.00 | 3.82 | 58.7 | 169 | 0 | 52% |
| 14 | express | 11,000 | 90.32 | 117.00 | 1.90 | 102.0 | 160 | 0 | 24% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 109,019 | 8.66 | 13.00 | 54.27 | 9.0 | 63 | 0 | 629% |
| 2 | uws | 89,304 | 10.65 | 19.00 | 41.05 | 11.4 | 67 | 0 | 515% |
| 3 | hyper-express | 47,542 | 20.53 | 30.00 | 21.08 | 21.6 | 99 | 0 | 274% |
| 4 | 0http | 20,188 | 48.99 | 105.00 | 9.86 | 60.7 | 167 | 0 | 117% |
| 5 | node-http | 17,328 | 57.16 | 95.00 | 8.77 | 58.3 | 104 | 0 | 100% |
| 6 | fastify | 17,039 | 58.15 | 82.00 | 8.34 | 59.5 | 115 | 0 | 98% |
| 7 | h3 | 16,998 | 58.31 | 83.00 | 8.25 | 59.6 | 110 | 0 | 98% |
| 8 | hono | 16,030 | 61.84 | 87.00 | 7.60 | 63.3 | 110 | 0 | 93% |
| 9 | polka | 15,211 | 65.20 | 94.00 | 7.43 | 66.7 | 103 | 0 | 88% |
| 10 | restify | 12,317 | 80.63 | 109.00 | 6.04 | 82.4 | 118 | 0 | 71% |
| 11 | tinyhttp | 12,062 | 82.31 | 115.00 | 6.73 | 102.4 | 171 | 0 | 70% |
| 12 | koa | 10,906 | 91.11 | 124.00 | 5.33 | 93.2 | 118 | 0 | 63% |
| 13 | hapi | 9,252 | 107.46 | 139.00 | 4.74 | 109.2 | 147 | 0 | 53% |
| 14 | express | 6,073 | 163.87 | 194.00 | 2.97 | 181.1 | 166 | 0 | 35% |

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
