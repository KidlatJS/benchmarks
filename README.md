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
Run on 10/25/2026, 19:13:58 (Manila Time, UTC+8) · AMD EPYC 7763 64-Core Processor (4 threads, 16 GB) · Linux 6.17.0-1022-azure (x64) · Node v22.23.3

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 2.4.0 | 104,106 | 101,064 | 107,165 | 104,082 | 317% |
| 2 | uws | 20.71.0 | 104,304 | 105,691 | 88,968 | 99,355 | 303% |
| 3 | hyper-express | 7.0.2 | 105,717 | 103,182 | 46,363 | 79,672 | 243% |
| 4 | 0http | 5.2.0 | 51,973 | 49,660 | 21,533 | 38,162 | 116% |
| 5 | node-http | 22.23.3 | 45,506 | 44,930 | 17,277 | 32,812 | 100% |
| 6 | fastify | 5.12.7 | 44,760 | 44,012 | 17,183 | 32,348 | 99% |
| 7 | polka | 0.5.2 | 46,461 | 43,917 | 15,757 | 31,797 | 97% |
| 8 | hono | 4.13.13 | 43,893 | 42,468 | 16,525 | 31,347 | 96% |
| 9 | h3 | 2.0.2 | 42,797 | 40,802 | 17,114 | 31,033 | 95% |
| 10 | restify | 12.0.0 | 33,448 | 33,197 | 13,047 | 24,378 | 74% |
| 11 | koa | 3.2.1 | 31,942 | 30,670 | 10,865 | 21,997 | 67% |
| 12 | hapi | 21.4.10 | 31,156 | 30,400 | 9,165 | 20,552 | 63% |
| 13 | tinyhttp | 3.0.11 | 24,081 | 23,464 | 12,079 | 18,969 | 58% |
| 14 | express | 5.3.0 | 11,152 | 10,914 | 5,997 | 9,004 | 27% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 105,717 | 8.94 | 17.00 | 14.11 | 9.6 | 70 | 0 | 232% |
| 2 | uws | 104,304 | 9.18 | 12.00 | 15.62 | 8.5 | 58 | 0 | 229% |
| 3 | **kidlat** | 104,106 | 9.19 | 14.00 | 19.56 | 9.3 | 61 | 0 | 229% |
| 4 | 0http | 51,973 | 18.74 | 31.00 | 9.27 | 19.5 | 102 | 0 | 114% |
| 5 | polka | 46,461 | 21.02 | 34.00 | 8.29 | 21.6 | 98 | 0 | 102% |
| 6 | node-http | 45,506 | 21.47 | 33.00 | 8.94 | 22.1 | 102 | 0 | 100% |
| 7 | fastify | 44,760 | 21.85 | 35.00 | 8.02 | 22.5 | 107 | 0 | 98% |
| 8 | hono | 43,893 | 22.28 | 35.00 | 7.20 | 22.9 | 108 | 0 | 96% |
| 9 | h3 | 42,797 | 22.86 | 37.00 | 7.51 | 23.5 | 102 | 0 | 94% |
| 10 | restify | 33,448 | 29.39 | 53.00 | 6.03 | 30.1 | 114 | 0 | 74% |
| 11 | koa | 31,942 | 30.80 | 52.00 | 5.70 | 31.5 | 115 | 0 | 70% |
| 12 | hapi | 31,156 | 31.59 | 53.00 | 6.95 | 32.6 | 119 | 0 | 68% |
| 13 | tinyhttp | 24,081 | 41.02 | 80.00 | 4.06 | 56.7 | 172 | 0 | 53% |
| 14 | express | 11,152 | 89.08 | 122.00 | 1.99 | 101.5 | 141 | 0 | 25% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 105,691 | 9.12 | 15.00 | 15.22 | 8.5 | 58 | 0 | 235% |
| 2 | hyper-express | 103,182 | 9.23 | 16.00 | 13.19 | 9.9 | 78 | 0 | 230% |
| 3 | **kidlat** | 101,064 | 9.41 | 15.00 | 18.41 | 9.5 | 61 | 0 | 225% |
| 4 | 0http | 49,660 | 19.63 | 32.00 | 8.57 | 20.5 | 106 | 0 | 111% |
| 5 | node-http | 44,930 | 21.76 | 33.00 | 8.53 | 22.3 | 106 | 0 | 100% |
| 6 | fastify | 44,012 | 22.22 | 36.00 | 7.64 | 22.8 | 111 | 0 | 98% |
| 7 | polka | 43,917 | 22.28 | 36.00 | 7.58 | 22.8 | 104 | 0 | 98% |
| 8 | hono | 42,468 | 23.04 | 36.00 | 6.72 | 23.6 | 112 | 0 | 95% |
| 9 | h3 | 40,802 | 24.02 | 39.00 | 6.93 | 24.6 | 108 | 0 | 91% |
| 10 | restify | 33,197 | 29.62 | 52.00 | 5.79 | 30.3 | 124 | 0 | 74% |
| 11 | koa | 30,670 | 32.09 | 57.00 | 5.29 | 32.8 | 124 | 0 | 68% |
| 12 | hapi | 30,400 | 32.39 | 55.00 | 6.61 | 33.2 | 137 | 0 | 68% |
| 13 | tinyhttp | 23,464 | 42.10 | 79.00 | 3.83 | 58.5 | 173 | 0 | 52% |
| 14 | express | 10,914 | 91.02 | 123.00 | 1.88 | 103.2 | 162 | 0 | 24% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 107,165 | 8.84 | 16.00 | 53.35 | 9.1 | 62 | 0 | 620% |
| 2 | uws | 88,968 | 10.69 | 19.00 | 40.90 | 11.4 | 67 | 0 | 515% |
| 3 | hyper-express | 46,363 | 21.08 | 32.00 | 20.56 | 22.3 | 100 | 0 | 268% |
| 4 | 0http | 21,533 | 45.92 | 99.00 | 10.51 | 47.8 | 111 | 0 | 125% |
| 5 | node-http | 17,277 | 57.35 | 91.00 | 8.75 | 58.6 | 107 | 0 | 100% |
| 6 | fastify | 17,183 | 57.66 | 81.00 | 8.41 | 58.9 | 104 | 0 | 99% |
| 7 | h3 | 17,114 | 57.89 | 83.00 | 8.31 | 59.2 | 114 | 0 | 99% |
| 8 | hono | 16,525 | 59.98 | 84.00 | 7.83 | 61.3 | 111 | 0 | 96% |
| 9 | polka | 15,757 | 62.93 | 92.00 | 7.69 | 64.4 | 103 | 0 | 91% |
| 10 | restify | 13,047 | 76.10 | 113.00 | 6.40 | 77.6 | 112 | 0 | 76% |
| 11 | tinyhttp | 12,079 | 82.22 | 115.00 | 6.74 | 102.4 | 177 | 0 | 70% |
| 12 | koa | 10,865 | 91.46 | 129.00 | 5.31 | 93.5 | 116 | 0 | 63% |
| 13 | hapi | 9,165 | 108.45 | 142.00 | 4.69 | 110.3 | 139 | 0 | 53% |
| 14 | express | 5,997 | 165.96 | 200.00 | 2.93 | 184.0 | 161 | 0 | 35% |

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
