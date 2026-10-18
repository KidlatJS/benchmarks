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
Run on 10/18/2026, 18:48:01 (Manila Time, UTC+8) · AMD EPYC 7763 64-Core Processor (4 threads, 16 GB) · Linux 6.17.0-1022-azure (x64) · Node v22.23.3

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 2.4.0 | 102,656 | 100,522 | 106,960 | 103,345 | 323% |
| 2 | uws | 20.71.0 | 103,429 | 102,621 | 91,235 | 98,934 | 309% |
| 3 | hyper-express | 7.0.2 | 107,261 | 101,811 | 47,914 | 80,581 | 252% |
| 4 | 0http | 5.2.0 | 43,298 | 42,501 | 19,880 | 33,196 | 104% |
| 5 | node-http | 22.23.3 | 44,057 | 44,298 | 16,802 | 32,008 | 100% |
| 6 | fastify | 5.12.7 | 43,674 | 42,336 | 16,651 | 31,342 | 98% |
| 7 | polka | 0.5.2 | 45,922 | 42,964 | 15,541 | 31,299 | 98% |
| 8 | hono | 4.13.13 | 42,635 | 40,766 | 16,280 | 30,472 | 95% |
| 9 | h3 | 2.0.2 | 42,313 | 39,348 | 16,467 | 30,153 | 94% |
| 10 | restify | 12.0.0 | 33,122 | 32,443 | 12,095 | 23,512 | 73% |
| 11 | koa | 3.2.1 | 30,754 | 30,091 | 10,921 | 21,620 | 68% |
| 12 | hapi | 21.4.10 | 31,541 | 30,602 | 9,109 | 20,640 | 64% |
| 13 | tinyhttp | 3.0.11 | 23,681 | 23,206 | 11,842 | 18,670 | 58% |
| 14 | express | 5.3.0 | 11,261 | 11,063 | 5,836 | 8,992 | 28% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 107,261 | 8.82 | 16.00 | 14.32 | 9.5 | 70 | 0 | 243% |
| 2 | uws | 103,429 | 9.27 | 15.00 | 15.49 | 8.7 | 58 | 0 | 235% |
| 3 | **kidlat** | 102,656 | 9.29 | 14.00 | 19.29 | 9.2 | 61 | 0 | 233% |
| 4 | polka | 45,922 | 21.27 | 35.00 | 8.19 | 21.9 | 101 | 0 | 104% |
| 5 | node-http | 44,057 | 22.19 | 36.00 | 8.66 | 22.8 | 104 | 0 | 100% |
| 6 | fastify | 43,674 | 22.39 | 36.00 | 7.83 | 23.0 | 107 | 0 | 99% |
| 7 | 0http | 43,298 | 22.60 | 46.00 | 7.72 | 29.7 | 145 | 0 | 98% |
| 8 | hono | 42,635 | 22.96 | 37.00 | 6.99 | 23.6 | 102 | 0 | 97% |
| 9 | h3 | 42,313 | 23.13 | 38.00 | 7.42 | 23.8 | 104 | 0 | 96% |
| 10 | restify | 33,122 | 29.68 | 51.00 | 5.97 | 30.4 | 113 | 0 | 75% |
| 11 | hapi | 31,541 | 31.19 | 55.00 | 7.04 | 32.1 | 121 | 0 | 72% |
| 12 | koa | 30,754 | 32.01 | 54.00 | 5.48 | 32.8 | 115 | 0 | 70% |
| 13 | tinyhttp | 23,681 | 41.71 | 85.00 | 4.00 | 58.6 | 166 | 0 | 54% |
| 14 | express | 11,261 | 88.22 | 119.00 | 2.01 | 101.2 | 153 | 0 | 26% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 102,621 | 9.31 | 15.00 | 14.78 | 8.7 | 58 | 0 | 232% |
| 2 | hyper-express | 101,811 | 9.28 | 17.00 | 13.01 | 10.0 | 79 | 0 | 230% |
| 3 | **kidlat** | 100,522 | 9.47 | 16.00 | 18.31 | 9.5 | 61 | 0 | 227% |
| 4 | node-http | 44,298 | 22.07 | 35.00 | 8.41 | 22.7 | 109 | 0 | 100% |
| 5 | polka | 42,964 | 22.75 | 37.00 | 7.42 | 23.3 | 106 | 0 | 97% |
| 6 | 0http | 42,501 | 23.04 | 49.00 | 7.34 | 30.1 | 145 | 0 | 96% |
| 7 | fastify | 42,336 | 23.12 | 37.00 | 7.35 | 23.7 | 112 | 0 | 96% |
| 8 | hono | 40,766 | 24.03 | 37.00 | 6.45 | 24.6 | 107 | 0 | 92% |
| 9 | h3 | 39,348 | 24.92 | 39.00 | 6.68 | 25.5 | 109 | 0 | 89% |
| 10 | restify | 32,443 | 30.32 | 50.00 | 5.66 | 31.0 | 124 | 0 | 73% |
| 11 | hapi | 30,602 | 32.17 | 55.00 | 6.65 | 33.1 | 139 | 0 | 69% |
| 12 | koa | 30,091 | 32.72 | 54.00 | 5.19 | 33.4 | 124 | 0 | 68% |
| 13 | tinyhttp | 23,206 | 42.58 | 80.00 | 3.78 | 59.3 | 168 | 0 | 52% |
| 14 | express | 11,063 | 89.81 | 113.00 | 1.91 | 102.9 | 160 | 0 | 25% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 106,960 | 9.02 | 11.00 | 53.24 | 9.1 | 62 | 0 | 637% |
| 2 | uws | 91,235 | 10.41 | 18.00 | 41.94 | 11.1 | 67 | 0 | 543% |
| 3 | hyper-express | 47,914 | 20.31 | 31.00 | 21.25 | 21.2 | 98 | 0 | 285% |
| 4 | 0http | 19,880 | 49.78 | 105.00 | 9.71 | 62.4 | 165 | 0 | 118% |
| 5 | node-http | 16,802 | 58.98 | 95.00 | 8.51 | 60.1 | 107 | 0 | 100% |
| 6 | fastify | 16,651 | 59.52 | 85.00 | 8.15 | 60.9 | 108 | 0 | 99% |
| 7 | h3 | 16,467 | 60.20 | 87.00 | 7.99 | 61.6 | 103 | 0 | 98% |
| 8 | hono | 16,280 | 60.88 | 86.00 | 7.72 | 62.3 | 104 | 0 | 97% |
| 9 | polka | 15,541 | 63.81 | 91.00 | 7.59 | 65.4 | 103 | 0 | 92% |
| 10 | restify | 12,095 | 82.07 | 112.00 | 5.93 | 83.8 | 112 | 0 | 72% |
| 11 | tinyhttp | 11,842 | 83.88 | 115.00 | 6.61 | 104.1 | 171 | 0 | 70% |
| 12 | koa | 10,921 | 90.93 | 125.00 | 5.33 | 93.1 | 115 | 0 | 65% |
| 13 | hapi | 9,109 | 109.14 | 144.00 | 4.66 | 110.7 | 139 | 0 | 54% |
| 14 | express | 5,836 | 170.52 | 205.00 | 2.85 | 189.9 | 161 | 0 | 35% |

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
