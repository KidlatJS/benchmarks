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
Run on 10/22/2026, 07:57:09 (Manila Time, UTC+8) · AMD EPYC 7763 64-Core Processor (4 threads, 16 GB) · Linux 7.0.0-1017-azure (x64) · Node v22.23.3

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 2.4.0 | 92,317 | 93,250 | 93,402 | 92,988 | 279% |
| 2 | uws | 20.71.0 | 90,171 | 92,966 | 85,118 | 89,359 | 269% |
| 3 | hyper-express | 7.0.2 | 110,488 | 100,928 | 45,535 | 79,780 | 240% |
| 4 | 0http | 5.2.0 | 43,610 | 42,852 | 19,994 | 33,431 | 100% |
| 5 | node-http | 22.23.3 | 44,126 | 44,414 | 18,797 | 33,274 | 100% |
| 6 | fastify | 5.12.7 | 43,208 | 42,493 | 17,123 | 31,561 | 95% |
| 7 | polka | 0.5.2 | 44,847 | 41,341 | 15,371 | 30,545 | 92% |
| 8 | h3 | 2.0.2 | 42,607 | 40,093 | 16,624 | 30,509 | 92% |
| 9 | hono | 4.13.13 | 42,309 | 40,718 | 16,148 | 30,300 | 91% |
| 10 | restify | 12.0.0 | 33,183 | 33,096 | 12,334 | 23,838 | 72% |
| 11 | koa | 3.2.1 | 29,468 | 29,492 | 10,962 | 21,199 | 64% |
| 12 | hapi | 21.4.10 | 29,706 | 28,936 | 9,340 | 20,023 | 60% |
| 13 | tinyhttp | 3.0.11 | 22,402 | 22,537 | 11,910 | 18,184 | 55% |
| 14 | express | 5.3.0 | 10,741 | 10,722 | 5,978 | 8,830 | 27% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 110,488 | 8.55 | 18.00 | 14.75 | 9.1 | 71 | 0 | 250% |
| 2 | **kidlat** | 92,317 | 10.38 | 19.00 | 17.35 | 9.6 | 62 | 0 | 209% |
| 3 | uws | 90,171 | 10.57 | 19.00 | 13.50 | 9.3 | 58 | 0 | 204% |
| 4 | polka | 44,847 | 21.80 | 34.00 | 8.00 | 22.4 | 98 | 0 | 102% |
| 5 | node-http | 44,126 | 22.16 | 36.00 | 8.67 | 22.8 | 104 | 0 | 100% |
| 6 | 0http | 43,610 | 22.43 | 49.00 | 7.78 | 28.9 | 146 | 0 | 99% |
| 7 | fastify | 43,208 | 22.64 | 39.00 | 7.75 | 23.3 | 105 | 0 | 98% |
| 8 | h3 | 42,607 | 22.97 | 41.00 | 7.48 | 23.6 | 107 | 0 | 97% |
| 9 | hono | 42,309 | 23.13 | 39.00 | 6.94 | 23.8 | 102 | 0 | 96% |
| 10 | restify | 33,183 | 29.63 | 55.00 | 5.98 | 30.3 | 113 | 0 | 75% |
| 11 | hapi | 29,706 | 33.16 | 63.00 | 6.63 | 34.1 | 124 | 0 | 67% |
| 12 | koa | 29,468 | 33.43 | 65.00 | 5.25 | 34.1 | 116 | 0 | 67% |
| 13 | tinyhttp | 22,402 | 44.13 | 90.00 | 3.78 | 60.2 | 171 | 0 | 51% |
| 14 | express | 10,741 | 92.52 | 128.00 | 1.92 | 105.4 | 160 | 0 | 24% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 100,928 | 9.42 | 19.00 | 12.90 | 10.0 | 79 | 0 | 227% |
| 2 | **kidlat** | 93,250 | 10.29 | 19.00 | 16.99 | 9.5 | 62 | 0 | 210% |
| 3 | uws | 92,966 | 10.28 | 18.00 | 13.39 | 9.1 | 58 | 0 | 209% |
| 4 | node-http | 44,414 | 22.01 | 35.00 | 8.43 | 22.6 | 109 | 0 | 100% |
| 5 | 0http | 42,852 | 22.83 | 50.00 | 7.40 | 29.4 | 146 | 0 | 96% |
| 6 | fastify | 42,493 | 23.03 | 39.00 | 7.38 | 23.6 | 110 | 0 | 96% |
| 7 | polka | 41,341 | 23.69 | 40.00 | 7.14 | 24.3 | 104 | 0 | 93% |
| 8 | hono | 40,718 | 24.06 | 41.00 | 6.45 | 24.6 | 106 | 0 | 92% |
| 9 | h3 | 40,093 | 24.45 | 42.00 | 6.81 | 25.0 | 112 | 0 | 90% |
| 10 | restify | 33,096 | 29.71 | 53.00 | 5.78 | 30.3 | 124 | 0 | 75% |
| 11 | koa | 29,492 | 33.40 | 61.00 | 5.09 | 34.1 | 125 | 0 | 66% |
| 12 | hapi | 28,936 | 34.06 | 65.00 | 6.29 | 34.9 | 129 | 0 | 65% |
| 13 | tinyhttp | 22,537 | 43.86 | 85.00 | 3.68 | 59.6 | 173 | 0 | 51% |
| 14 | express | 10,722 | 92.68 | 124.00 | 1.85 | 104.8 | 160 | 0 | 24% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 93,402 | 10.31 | 19.00 | 46.49 | 9.5 | 62 | 0 | 497% |
| 2 | uws | 85,118 | 11.25 | 21.00 | 39.13 | 12.0 | 68 | 0 | 453% |
| 3 | hyper-express | 45,535 | 21.47 | 35.00 | 20.19 | 22.4 | 101 | 0 | 242% |
| 4 | 0http | 19,994 | 49.50 | 103.00 | 9.76 | 60.6 | 162 | 0 | 106% |
| 5 | node-http | 18,797 | 52.66 | 76.00 | 9.52 | 53.7 | 107 | 0 | 100% |
| 6 | fastify | 17,123 | 57.87 | 87.00 | 8.38 | 59.1 | 109 | 0 | 91% |
| 7 | h3 | 16,624 | 59.62 | 88.00 | 8.07 | 60.8 | 109 | 0 | 88% |
| 8 | hono | 16,148 | 61.39 | 91.00 | 7.65 | 62.7 | 108 | 0 | 86% |
| 9 | polka | 15,371 | 64.51 | 91.00 | 7.51 | 66.0 | 100 | 0 | 82% |
| 10 | restify | 12,334 | 80.50 | 118.00 | 6.05 | 81.9 | 112 | 0 | 66% |
| 11 | tinyhttp | 11,910 | 83.40 | 117.00 | 6.64 | 103.3 | 176 | 0 | 63% |
| 12 | koa | 10,962 | 90.66 | 131.00 | 5.35 | 92.6 | 115 | 0 | 58% |
| 13 | hapi | 9,340 | 106.44 | 140.00 | 4.78 | 108.1 | 137 | 0 | 50% |
| 14 | express | 5,978 | 166.49 | 205.00 | 2.92 | 183.9 | 161 | 0 | 32% |

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
