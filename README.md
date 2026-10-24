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
Run on 10/24/2026, 09:30:54 (Manila Time, UTC+8) · AMD EPYC 7763 64-Core Processor (4 threads, 16 GB) · Linux 6.17.0-1022-azure (x64) · Node v22.23.3

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 2.4.0 | 103,250 | 103,880 | 109,854 | 105,620 | 327% |
| 2 | uws | 20.71.0 | 105,843 | 106,539 | 92,717 | 101,495 | 314% |
| 3 | hyper-express | 7.0.2 | 108,088 | 101,955 | 44,941 | 79,118 | 245% |
| 4 | 0http | 5.2.0 | 53,414 | 50,654 | 23,268 | 39,781 | 123% |
| 5 | fastify | 5.12.7 | 45,478 | 44,478 | 17,251 | 32,678 | 101% |
| 6 | node-http | 22.23.3 | 44,798 | 44,262 | 16,985 | 32,294 | 100% |
| 7 | polka | 0.5.2 | 45,877 | 43,650 | 15,665 | 31,538 | 98% |
| 8 | hono | 4.13.13 | 43,126 | 41,986 | 16,551 | 31,061 | 96% |
| 9 | h3 | 2.0.2 | 43,473 | 40,771 | 16,903 | 31,058 | 96% |
| 10 | restify | 12.0.0 | 33,322 | 32,981 | 12,482 | 23,938 | 74% |
| 11 | koa | 3.2.1 | 29,704 | 29,346 | 10,705 | 21,053 | 65% |
| 12 | hapi | 21.4.10 | 31,866 | 30,876 | 9,453 | 21,030 | 65% |
| 13 | tinyhttp | 3.0.11 | 23,716 | 23,737 | 12,027 | 18,918 | 59% |
| 14 | express | 5.3.0 | 11,568 | 11,263 | 6,152 | 9,289 | 29% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 108,088 | 8.74 | 16.00 | 14.43 | 9.4 | 70 | 0 | 241% |
| 2 | uws | 105,843 | 9.11 | 13.00 | 15.85 | 8.4 | 58 | 0 | 236% |
| 3 | **kidlat** | 103,250 | 9.28 | 16.00 | 19.40 | 9.2 | 61 | 0 | 230% |
| 4 | 0http | 53,414 | 18.22 | 27.00 | 9.53 | 19.2 | 103 | 0 | 119% |
| 5 | polka | 45,877 | 21.29 | 35.00 | 8.18 | 21.9 | 100 | 0 | 102% |
| 6 | fastify | 45,478 | 21.50 | 35.00 | 8.15 | 22.1 | 107 | 0 | 102% |
| 7 | node-http | 44,798 | 21.83 | 35.00 | 8.80 | 22.4 | 104 | 0 | 100% |
| 8 | h3 | 43,473 | 22.49 | 36.00 | 7.63 | 23.1 | 106 | 0 | 97% |
| 9 | hono | 43,126 | 22.67 | 38.00 | 7.07 | 23.3 | 102 | 0 | 96% |
| 10 | restify | 33,322 | 29.50 | 50.00 | 6.01 | 30.2 | 114 | 0 | 74% |
| 11 | hapi | 31,866 | 30.88 | 53.00 | 7.11 | 31.8 | 120 | 0 | 71% |
| 12 | koa | 29,704 | 33.16 | 57.00 | 5.30 | 33.9 | 113 | 0 | 66% |
| 13 | tinyhttp | 23,716 | 41.66 | 81.00 | 4.00 | 57.5 | 168 | 0 | 53% |
| 14 | express | 11,568 | 85.87 | 117.00 | 2.06 | 98.0 | 149 | 0 | 26% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 106,539 | 9.08 | 13.00 | 15.34 | 8.4 | 58 | 0 | 241% |
| 2 | **kidlat** | 103,880 | 9.19 | 14.00 | 18.92 | 9.3 | 61 | 0 | 235% |
| 3 | hyper-express | 101,955 | 9.34 | 17.00 | 13.03 | 10.0 | 78 | 0 | 230% |
| 4 | 0http | 50,654 | 19.24 | 32.00 | 8.74 | 20.2 | 107 | 0 | 114% |
| 5 | fastify | 44,478 | 22.00 | 36.00 | 7.72 | 22.6 | 112 | 0 | 100% |
| 6 | node-http | 44,262 | 22.08 | 36.00 | 8.40 | 22.7 | 109 | 0 | 100% |
| 7 | polka | 43,650 | 22.39 | 35.00 | 7.53 | 23.0 | 106 | 0 | 99% |
| 8 | hono | 41,986 | 23.31 | 37.00 | 6.65 | 23.9 | 107 | 0 | 95% |
| 9 | h3 | 40,771 | 24.05 | 39.00 | 6.92 | 24.6 | 111 | 0 | 92% |
| 10 | restify | 32,981 | 29.81 | 51.00 | 5.76 | 30.5 | 125 | 0 | 75% |
| 11 | hapi | 30,876 | 31.88 | 55.00 | 6.71 | 32.9 | 152 | 0 | 70% |
| 12 | koa | 29,346 | 33.56 | 58.00 | 5.07 | 34.2 | 122 | 0 | 66% |
| 13 | tinyhttp | 23,737 | 41.62 | 75.00 | 3.87 | 57.0 | 175 | 0 | 54% |
| 14 | express | 11,263 | 88.21 | 118.00 | 1.94 | 100.0 | 161 | 0 | 25% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 109,854 | 8.49 | 14.00 | 54.69 | 8.9 | 62 | 0 | 647% |
| 2 | uws | 92,717 | 10.22 | 16.00 | 42.62 | 10.9 | 67 | 0 | 546% |
| 3 | hyper-express | 44,941 | 21.76 | 34.00 | 19.93 | 23.0 | 101 | 0 | 265% |
| 4 | 0http | 23,268 | 42.46 | 84.00 | 11.36 | 44.2 | 110 | 0 | 137% |
| 5 | fastify | 17,251 | 57.44 | 81.00 | 8.44 | 58.7 | 109 | 0 | 102% |
| 6 | node-http | 16,985 | 58.34 | 89.00 | 8.60 | 59.4 | 107 | 0 | 100% |
| 7 | h3 | 16,903 | 58.63 | 81.00 | 8.20 | 59.8 | 105 | 0 | 100% |
| 8 | hono | 16,551 | 59.89 | 84.00 | 7.84 | 61.2 | 108 | 0 | 97% |
| 9 | polka | 15,665 | 63.30 | 92.00 | 7.65 | 64.7 | 104 | 0 | 92% |
| 10 | restify | 12,482 | 79.53 | 112.00 | 6.12 | 81.0 | 112 | 0 | 73% |
| 11 | tinyhttp | 12,027 | 82.60 | 112.00 | 6.71 | 102.1 | 175 | 0 | 71% |
| 12 | koa | 10,705 | 92.81 | 122.00 | 5.23 | 94.3 | 135 | 0 | 63% |
| 13 | hapi | 9,453 | 105.15 | 134.00 | 4.84 | 106.7 | 153 | 0 | 56% |
| 14 | express | 6,152 | 161.70 | 190.00 | 3.00 | 178.4 | 161 | 0 | 36% |

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
