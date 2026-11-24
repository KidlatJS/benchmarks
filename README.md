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
Run on 11/24/2026, 13:50:57 (Manila Time, UTC+8) · INTEL(R) XEON(R) PLATINUM 8573C (4 threads, 16 GB) · Linux 7.0.0-1020-azure (x64) · Node v22.23.5

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | uws | 20.71.0 | 148,450 | 152,944 | 128,814 | 143,007 | 228% |
| 2 | **kidlat** | 2.6.0 | 130,962 | 126,594 | 154,298 | 136,764 | 218% |
| 3 | hyper-express | 7.0.2 | 172,662 | 157,107 | 74,666 | 126,524 | 201% |
| 4 | node-http | 22.23.5 | 78,250 | 78,574 | 40,326 | 62,823 | 100% |
| 5 | fastify | 5.12.7 | 78,642 | 77,213 | 38,731 | 61,726 | 98% |
| 6 | polka | 0.5.2 | 81,451 | 77,797 | 34,615 | 60,308 | 96% |
| 7 | 0http | 5.2.0 | 72,973 | 72,306 | 39,071 | 59,074 | 94% |
| 8 | h3 | 2.0.2 | 75,213 | 72,098 | 36,821 | 58,448 | 93% |
| 9 | hono | 4.13.13 | 77,104 | 74,515 | 34,455 | 58,281 | 93% |
| 10 | koa | 3.2.1 | 55,873 | 55,842 | 25,736 | 43,142 | 69% |
| 11 | restify | 12.0.0 | 54,607 | 53,820 | 26,948 | 42,944 | 68% |
| 12 | hapi | 21.4.10 | 50,221 | 49,163 | 21,092 | 37,343 | 59% |
| 13 | tinyhttp | 3.0.11 | 40,284 | 39,314 | 23,307 | 33,296 | 53% |
| 14 | express | 5.3.0 | 16,124 | 15,865 | 10,233 | 13,782 | 22% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 172,662 | 5.31 | 9.00 | 23.05 | 6.1 | 78 | 0 | 221% |
| 2 | uws | 148,450 | 6.27 | 10.00 | 22.23 | 5.8 | 58 | 0 | 190% |
| 3 | **kidlat** | 130,962 | 7.18 | 11.00 | 24.61 | 6.2 | 64 | 0 | 167% |
| 4 | polka | 81,451 | 11.77 | 18.00 | 14.53 | 12.4 | 100 | 0 | 104% |
| 5 | fastify | 78,642 | 12.23 | 23.00 | 14.10 | 12.8 | 107 | 0 | 101% |
| 6 | node-http | 78,250 | 12.28 | 22.00 | 15.37 | 12.9 | 103 | 0 | 100% |
| 7 | hono | 77,104 | 12.48 | 21.00 | 12.65 | 13.1 | 103 | 0 | 99% |
| 8 | h3 | 75,213 | 12.80 | 24.00 | 13.20 | 13.4 | 108 | 0 | 96% |
| 9 | 0http | 72,973 | 13.21 | 28.00 | 13.01 | 19.1 | 141 | 0 | 93% |
| 10 | koa | 55,873 | 17.39 | 34.00 | 9.96 | 18.1 | 118 | 0 | 71% |
| 11 | restify | 54,607 | 17.82 | 35.00 | 9.84 | 18.5 | 116 | 0 | 70% |
| 12 | hapi | 50,221 | 19.41 | 38.00 | 11.21 | 20.3 | 119 | 0 | 64% |
| 13 | tinyhttp | 40,284 | 24.33 | 47.00 | 6.80 | 39.3 | 181 | 0 | 51% |
| 14 | express | 16,124 | 61.47 | 82.00 | 2.88 | 72.8 | 168 | 0 | 21% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 157,107 | 5.81 | 9.00 | 20.08 | 6.6 | 79 | 0 | 200% |
| 2 | uws | 152,944 | 6.14 | 9.00 | 22.02 | 5.7 | 60 | 0 | 195% |
| 3 | **kidlat** | 126,594 | 7.39 | 12.00 | 23.06 | 6.4 | 64 | 0 | 161% |
| 4 | node-http | 78,574 | 12.23 | 22.00 | 14.91 | 12.8 | 108 | 0 | 100% |
| 5 | polka | 77,797 | 12.38 | 21.00 | 13.43 | 12.9 | 105 | 0 | 99% |
| 6 | fastify | 77,213 | 12.46 | 23.00 | 13.40 | 13.0 | 111 | 0 | 98% |
| 7 | hono | 74,515 | 12.92 | 23.00 | 11.80 | 13.5 | 108 | 0 | 95% |
| 8 | 0http | 72,306 | 13.33 | 28.00 | 12.48 | 19.2 | 143 | 0 | 92% |
| 9 | h3 | 72,098 | 13.36 | 24.00 | 12.24 | 13.9 | 112 | 0 | 92% |
| 10 | koa | 55,842 | 17.40 | 33.00 | 9.64 | 18.0 | 127 | 0 | 71% |
| 11 | restify | 53,820 | 18.08 | 36.00 | 9.39 | 18.7 | 127 | 0 | 68% |
| 12 | hapi | 49,163 | 19.84 | 38.00 | 10.69 | 20.6 | 159 | 0 | 63% |
| 13 | tinyhttp | 39,314 | 24.94 | 46.00 | 6.41 | 40.2 | 181 | 0 | 50% |
| 14 | express | 15,865 | 62.49 | 83.00 | 2.74 | 73.5 | 169 | 0 | 20% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 154,298 | 6.13 | 10.00 | 76.82 | 6.2 | 68 | 0 | 383% |
| 2 | uws | 128,814 | 7.28 | 12.00 | 59.21 | 8.2 | 68 | 0 | 319% |
| 3 | hyper-express | 74,666 | 12.87 | 19.00 | 33.11 | 14.1 | 99 | 0 | 185% |
| 4 | node-http | 40,326 | 24.29 | 53.00 | 20.42 | 25.4 | 112 | 0 | 100% |
| 5 | 0http | 39,071 | 25.10 | 55.00 | 19.08 | 35.6 | 168 | 0 | 97% |
| 6 | fastify | 38,731 | 25.31 | 56.00 | 18.95 | 26.5 | 112 | 0 | 96% |
| 7 | h3 | 36,821 | 26.66 | 58.00 | 17.87 | 27.8 | 113 | 0 | 91% |
| 8 | polka | 34,615 | 28.38 | 61.00 | 16.90 | 29.8 | 108 | 0 | 86% |
| 9 | hono | 34,455 | 28.52 | 64.00 | 16.33 | 29.7 | 117 | 0 | 85% |
| 10 | restify | 26,948 | 36.60 | 73.00 | 13.21 | 38.0 | 115 | 0 | 67% |
| 11 | koa | 25,736 | 38.34 | 72.00 | 12.57 | 39.9 | 119 | 0 | 64% |
| 12 | tinyhttp | 23,307 | 42.40 | 84.00 | 13.00 | 63.3 | 190 | 0 | 58% |
| 13 | hapi | 21,092 | 46.89 | 77.00 | 10.80 | 48.4 | 160 | 0 | 52% |
| 14 | express | 10,233 | 97.08 | 130.00 | 5.00 | 113.2 | 179 | 0 | 25% |

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
