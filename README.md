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
| **kidlat** | 2.1.0 | Native C++ HTTP layer; focus of this benchmark |
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
Run on 10/14/2026, 16:44:42 (Manila Time, UTC+8) · Intel(R) Core(TM) i7-10750H CPU @ 2.60GHz (12 threads, 64 GB) · Windows_NT 10.0.26200 (x64) · Node v24.14.0

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | hyper-express | 7.0.2 | 43,671 | 42,863 | 37,975 | 41,425 | 144% |
| 2 | **kidlat** | 2.1.0 | 36,908 | 40,454 | 39,776 | 39,015 | 135% |
| 3 | node-http | 24.14.0 | 34,974 | 34,532 | 19,799 | 28,809 | 100% |
| 4 | fastify | 5.12.7 | 32,931 | 30,807 | 16,494 | 25,578 | 89% |
| 5 | hono | 4.13.13 | 28,104 | 30,638 | 18,129 | 24,992 | 87% |
| 6 | polka | 0.5.2 | 34,028 | 31,673 | 14,001 | 24,711 | 86% |
| 7 | 0http | 5.2.0 | 28,254 | 24,507 | 17,864 | 23,127 | 80% |
| 8 | h3 | 2.0.2 | 29,880 | 28,178 | 14,435 | 22,992 | 80% |
| 9 | koa | 3.2.1 | 27,022 | 26,867 | 13,176 | 21,228 | 74% |
| 10 | restify | 12.0.0 | 25,009 | 24,787 | 12,022 | 19,533 | 68% |
| 11 | tinyhttp | 3.0.11 | 21,846 | 21,568 | 13,810 | 18,669 | 65% |
| 12 | hapi | 21.4.10 | 23,386 | 25,292 | 9,967 | 18,065 | 63% |
| 13 | express | 5.3.0 | 21,775 | 20,952 | 11,136 | 17,191 | 60% |
| 14 | uws | 20.71.0 | failed | failed | failed | – | – |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 43,671 | 23.27 | 32.00 | 5.83 | 23.2 | 69 | 0 | 125% |
| 2 | **kidlat** | 36,908 | 29.18 | 44.00 | 6.93 | 25.6 | 63 | 0 | 106% |
| 3 | node-http | 34,974 | 28.09 | 123.00 | 6.87 | 28.5 | 132 | 0 | 100% |
| 4 | polka | 34,028 | 28.88 | 161.00 | 6.07 | 29.3 | 130 | 0 | 97% |
| 5 | fastify | 32,931 | 29.84 | 159.00 | 5.90 | 30.4 | 136 | 0 | 94% |
| 6 | h3 | 29,880 | 32.95 | 195.00 | 5.24 | 33.2 | 133 | 0 | 85% |
| 7 | 0http | 28,254 | 34.91 | 60.00 | 5.04 | 35.4 | 211 | 0 | 81% |
| 8 | hono | 28,104 | 35.05 | 152.00 | 4.61 | 35.2 | 141 | 0 | 80% |
| 9 | koa | 27,022 | 36.50 | 63.00 | 4.82 | 36.9 | 139 | 0 | 77% |
| 10 | restify | 25,009 | 39.47 | 185.00 | 4.51 | 39.7 | 143 | 0 | 72% |
| 11 | hapi | 23,386 | 42.24 | 189.00 | 5.22 | 42.8 | 208 | 0 | 67% |
| 12 | tinyhttp | 21,846 | 45.24 | 92.00 | 3.69 | 59.4 | 262 | 0 | 62% |
| 13 | express | 21,775 | 45.40 | 97.00 | 3.88 | 45.4 | 131 | 0 | 62% |
| 14 | uws | failed | – | – | – | – | – | exited with code 1 | – |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 42,863 | 24.68 | 57.00 | 5.48 | 24.5 | 69 | 0 | 124% |
| 2 | **kidlat** | 40,454 | 27.75 | 38.00 | 7.37 | 24.6 | 63 | 0 | 117% |
| 3 | node-http | 34,532 | 28.45 | 126.00 | 6.55 | 28.9 | 134 | 0 | 100% |
| 4 | polka | 31,673 | 31.06 | 164.00 | 5.47 | 31.3 | 133 | 0 | 92% |
| 5 | fastify | 30,807 | 31.95 | 183.00 | 5.35 | 32.2 | 139 | 0 | 89% |
| 6 | hono | 30,638 | 32.13 | 197.00 | 4.85 | 32.3 | 207 | 0 | 89% |
| 7 | h3 | 28,178 | 34.96 | 198.00 | 4.78 | 35.2 | 135 | 0 | 82% |
| 8 | koa | 26,867 | 36.71 | 67.00 | 4.64 | 37.1 | 204 | 0 | 78% |
| 9 | hapi | 25,292 | 38.96 | 154.00 | 5.50 | 39.4 | 224 | 0 | 73% |
| 10 | restify | 24,787 | 39.83 | 183.00 | 4.33 | 39.9 | 207 | 0 | 72% |
| 11 | 0http | 24,507 | 40.35 | 66.00 | 4.23 | 40.6 | 217 | 0 | 71% |
| 12 | tinyhttp | 21,568 | 45.86 | 78.00 | 3.52 | 62.4 | 279 | 0 | 62% |
| 13 | express | 20,952 | 47.20 | 75.00 | 3.62 | 47.3 | 136 | 0 | 61% |
| 14 | uws | failed | – | – | – | – | – | exited with code 1 | – |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 39,776 | 27.05 | 116.00 | 19.80 | 27.0 | 83 | 0 | 201% |
| 2 | hyper-express | 37,975 | 26.24 | 44.00 | 16.84 | 26.8 | 108 | 0 | 192% |
| 3 | node-http | 19,799 | 49.99 | 59.00 | 10.03 | 50.6 | 207 | 0 | 100% |
| 4 | hono | 18,129 | 54.63 | 63.00 | 8.59 | 55.2 | 209 | 0 | 92% |
| 5 | 0http | 17,864 | 55.45 | 91.00 | 8.72 | 55.7 | 226 | 0 | 90% |
| 6 | fastify | 16,494 | 60.09 | 106.00 | 8.07 | 60.4 | 206 | 0 | 83% |
| 7 | h3 | 14,435 | 68.75 | 117.00 | 7.01 | 68.2 | 203 | 0 | 73% |
| 8 | polka | 14,001 | 70.88 | 117.00 | 6.84 | 70.9 | 207 | 0 | 71% |
| 9 | tinyhttp | 13,810 | 71.90 | 90.00 | 7.70 | 91.1 | 309 | 0 | 70% |
| 10 | koa | 13,176 | 75.33 | 96.00 | 6.43 | 76.0 | 212 | 0 | 67% |
| 11 | restify | 12,022 | 82.61 | 103.00 | 5.89 | 82.6 | 217 | 0 | 61% |
| 12 | express | 11,136 | 89.22 | 127.00 | 5.44 | 90.0 | 208 | 0 | 56% |
| 13 | hapi | 9,967 | 99.70 | 177.00 | 5.10 | 99.6 | 226 | 0 | 50% |
| 14 | uws | failed | – | – | – | – | – | exited with code 1 | – |

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
