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
Run on 11/15/2026, 05:18:17 (Manila Time, UTC+8) · AMD EPYC 7763 64-Core Processor (4 threads, 16 GB) · Linux 7.0.0-1019-azure (x64) · Node v22.23.4

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 2.6.0 | 102,426 | 100,253 | 107,162 | 103,240 | 313% |
| 2 | uws | 20.71.0 | 97,587 | 100,245 | 88,544 | 95,325 | 289% |
| 3 | hyper-express | 7.0.2 | 109,104 | 102,034 | 45,306 | 79,600 | 241% |
| 4 | 0http | 5.2.0 | 52,238 | 50,532 | 20,524 | 37,839 | 115% |
| 5 | node-http | 22.23.4 | 44,493 | 44,578 | 18,179 | 33,037 | 100% |
| 6 | fastify | 5.12.7 | 43,462 | 42,907 | 16,822 | 31,538 | 95% |
| 7 | polka | 0.5.2 | 45,064 | 42,500 | 15,683 | 31,085 | 94% |
| 8 | h3 | 2.0.2 | 43,006 | 40,016 | 16,712 | 30,638 | 93% |
| 9 | hono | 4.13.13 | 42,406 | 40,419 | 16,125 | 30,235 | 92% |
| 10 | restify | 12.0.0 | 31,945 | 31,485 | 12,142 | 23,028 | 70% |
| 11 | koa | 3.2.1 | 30,902 | 30,131 | 11,120 | 21,796 | 66% |
| 12 | hapi | 21.4.10 | 30,169 | 29,134 | 9,134 | 20,023 | 61% |
| 13 | tinyhttp | 3.0.11 | 23,910 | 23,116 | 11,818 | 18,693 | 57% |
| 14 | express | 5.3.0 | 11,178 | 11,066 | 6,052 | 9,080 | 27% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 109,104 | 8.56 | 15.00 | 14.57 | 9.3 | 70 | 0 | 245% |
| 2 | **kidlat** | 102,426 | 9.30 | 15.00 | 19.24 | 9.5 | 64 | 0 | 230% |
| 3 | uws | 97,587 | 9.89 | 13.00 | 14.61 | 9.2 | 58 | 0 | 219% |
| 4 | 0http | 52,238 | 18.64 | 30.00 | 9.32 | 19.4 | 102 | 0 | 117% |
| 5 | polka | 45,064 | 21.69 | 45.00 | 8.04 | 22.3 | 98 | 0 | 101% |
| 6 | node-http | 44,493 | 21.98 | 42.00 | 8.74 | 22.6 | 105 | 0 | 100% |
| 7 | fastify | 43,462 | 22.50 | 45.00 | 7.79 | 23.1 | 107 | 0 | 98% |
| 8 | h3 | 43,006 | 22.75 | 43.00 | 7.55 | 23.4 | 105 | 0 | 97% |
| 9 | hono | 42,406 | 23.07 | 43.00 | 6.96 | 23.7 | 103 | 0 | 95% |
| 10 | restify | 31,945 | 30.80 | 63.00 | 5.76 | 31.5 | 113 | 0 | 72% |
| 11 | koa | 30,902 | 31.85 | 60.00 | 5.51 | 32.6 | 115 | 0 | 69% |
| 12 | hapi | 30,169 | 32.64 | 63.00 | 6.73 | 33.6 | 120 | 0 | 68% |
| 13 | tinyhttp | 23,910 | 41.32 | 83.00 | 4.04 | 56.3 | 173 | 0 | 54% |
| 14 | express | 11,178 | 88.88 | 130.00 | 1.99 | 100.7 | 162 | 0 | 25% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 102,034 | 9.40 | 18.00 | 13.04 | 10.0 | 79 | 0 | 229% |
| 2 | **kidlat** | 100,253 | 9.48 | 17.00 | 18.26 | 9.6 | 64 | 0 | 225% |
| 3 | uws | 100,245 | 9.47 | 15.00 | 14.44 | 9.1 | 58 | 0 | 225% |
| 4 | 0http | 50,532 | 19.28 | 32.00 | 8.72 | 20.2 | 106 | 0 | 113% |
| 5 | node-http | 44,578 | 21.94 | 38.00 | 8.46 | 22.5 | 111 | 0 | 100% |
| 6 | fastify | 42,907 | 22.80 | 42.00 | 7.45 | 23.4 | 113 | 0 | 96% |
| 7 | polka | 42,500 | 23.02 | 46.00 | 7.34 | 23.6 | 105 | 0 | 95% |
| 8 | hono | 40,419 | 24.23 | 52.00 | 6.40 | 24.8 | 108 | 0 | 91% |
| 9 | h3 | 40,016 | 24.48 | 46.00 | 6.79 | 25.1 | 110 | 0 | 90% |
| 10 | restify | 31,485 | 31.26 | 60.00 | 5.49 | 31.9 | 124 | 0 | 71% |
| 11 | koa | 30,131 | 32.67 | 62.00 | 5.20 | 33.3 | 124 | 0 | 68% |
| 12 | hapi | 29,134 | 33.81 | 64.00 | 6.33 | 34.7 | 149 | 0 | 65% |
| 13 | tinyhttp | 23,116 | 42.75 | 85.00 | 3.77 | 58.0 | 178 | 0 | 52% |
| 14 | express | 11,066 | 89.78 | 120.00 | 1.91 | 101.4 | 162 | 0 | 25% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 107,162 | 8.86 | 15.00 | 53.35 | 9.2 | 69 | 0 | 589% |
| 2 | uws | 88,544 | 10.69 | 21.00 | 40.70 | 11.5 | 67 | 0 | 487% |
| 3 | hyper-express | 45,306 | 21.55 | 36.00 | 20.09 | 22.6 | 102 | 0 | 249% |
| 4 | 0http | 20,524 | 48.19 | 99.00 | 10.02 | 50.0 | 110 | 0 | 113% |
| 5 | node-http | 18,179 | 54.48 | 76.00 | 9.21 | 55.6 | 109 | 0 | 100% |
| 6 | fastify | 16,822 | 58.91 | 94.00 | 8.23 | 60.2 | 110 | 0 | 93% |
| 7 | h3 | 16,712 | 59.30 | 84.00 | 8.11 | 60.6 | 105 | 0 | 92% |
| 8 | hono | 16,125 | 61.47 | 91.00 | 7.64 | 62.9 | 108 | 0 | 89% |
| 9 | polka | 15,683 | 63.24 | 86.00 | 7.66 | 64.8 | 98 | 0 | 86% |
| 10 | restify | 12,142 | 81.79 | 117.00 | 5.95 | 83.4 | 118 | 0 | 67% |
| 11 | tinyhttp | 11,818 | 84.05 | 119.00 | 6.59 | 103.5 | 183 | 0 | 65% |
| 12 | koa | 11,120 | 89.33 | 120.00 | 5.43 | 91.4 | 113 | 0 | 61% |
| 13 | hapi | 9,134 | 108.83 | 145.00 | 4.68 | 110.6 | 155 | 0 | 50% |
| 14 | express | 6,052 | 164.43 | 200.00 | 2.95 | 181.6 | 162 | 0 | 33% |

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
