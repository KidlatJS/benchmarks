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
Run on 10/15/2026, 07:49:18 (Manila Time, UTC+8) · AMD EPYC 9V74 80-Core Processor (4 threads, 16 GB) · Linux 6.17.0-1022-azure (x64) · Node v22.23.3

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | uws | 20.71.0 | 116,493 | 117,491 | 102,734 | 112,031 | 265% |
| 2 | **kidlat** | 2.2.0 | 107,442 | 106,656 | 108,160 | 107,417 | 254% |
| 3 | hyper-express | 7.0.2 | 114,746 | 109,277 | 58,090 | 89,975 | 212% |
| 4 | node-http | 22.23.3 | 53,615 | 54,047 | 26,219 | 42,354 | 100% |
| 5 | fastify | 5.12.7 | 54,654 | 54,038 | 24,921 | 41,908 | 99% |
| 6 | hono | 4.13.13 | 53,443 | 51,884 | 23,364 | 40,163 | 95% |
| 7 | h3 | 2.0.2 | 52,774 | 50,676 | 24,003 | 40,040 | 95% |
| 8 | 0http | 5.2.0 | 48,597 | 47,482 | 27,671 | 39,969 | 94% |
| 9 | polka | 0.5.2 | 54,357 | 52,244 | 22,266 | 39,839 | 94% |
| 10 | restify | 12.0.0 | 39,883 | 39,806 | 18,270 | 30,725 | 73% |
| 11 | koa | 3.2.1 | 38,905 | 38,326 | 15,096 | 28,235 | 67% |
| 12 | hapi | 21.4.10 | 36,962 | 35,824 | 12,314 | 25,358 | 60% |
| 13 | tinyhttp | 3.0.11 | 30,078 | 29,440 | 16,144 | 24,270 | 57% |
| 14 | express | 5.3.0 | 12,739 | 12,729 | 7,242 | 10,550 | 25% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 116,493 | 8.14 | 9.00 | 17.44 | 8.0 | 58 | 0 | 217% |
| 2 | hyper-express | 114,746 | 8.18 | 13.00 | 15.32 | 8.9 | 70 | 0 | 214% |
| 3 | **kidlat** | 107,442 | 8.93 | 13.00 | 20.19 | 8.9 | 61 | 0 | 200% |
| 4 | fastify | 54,654 | 17.81 | 30.00 | 9.80 | 18.4 | 106 | 0 | 102% |
| 5 | polka | 54,357 | 17.91 | 30.00 | 9.69 | 18.5 | 99 | 0 | 101% |
| 6 | node-http | 53,615 | 18.15 | 31.00 | 10.53 | 18.8 | 101 | 0 | 100% |
| 7 | hono | 53,443 | 18.22 | 31.00 | 8.77 | 18.8 | 101 | 0 | 100% |
| 8 | h3 | 52,774 | 18.45 | 32.00 | 9.26 | 19.1 | 107 | 0 | 98% |
| 9 | 0http | 48,597 | 20.08 | 42.00 | 8.67 | 27.0 | 158 | 0 | 91% |
| 10 | restify | 39,883 | 24.57 | 45.00 | 7.19 | 25.3 | 113 | 0 | 74% |
| 11 | koa | 38,905 | 25.20 | 46.00 | 6.94 | 25.9 | 115 | 0 | 73% |
| 12 | hapi | 36,962 | 26.55 | 50.00 | 8.25 | 27.5 | 127 | 0 | 69% |
| 13 | tinyhttp | 30,078 | 32.75 | 67.00 | 5.08 | 48.7 | 179 | 0 | 56% |
| 14 | express | 12,739 | 77.94 | 104.00 | 2.27 | 91.4 | 171 | 0 | 24% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 117,491 | 8.12 | 12.00 | 16.92 | 8.0 | 59 | 0 | 217% |
| 2 | hyper-express | 109,277 | 8.52 | 14.00 | 13.97 | 9.3 | 79 | 0 | 202% |
| 3 | **kidlat** | 106,656 | 8.97 | 13.00 | 19.43 | 8.7 | 62 | 0 | 197% |
| 4 | node-http | 54,047 | 17.99 | 30.00 | 10.26 | 18.6 | 106 | 0 | 100% |
| 5 | fastify | 54,038 | 18.02 | 30.00 | 9.38 | 18.6 | 112 | 0 | 100% |
| 6 | polka | 52,244 | 18.64 | 31.00 | 9.02 | 19.2 | 105 | 0 | 97% |
| 7 | hono | 51,884 | 18.77 | 32.00 | 8.21 | 19.4 | 106 | 0 | 96% |
| 8 | h3 | 50,676 | 19.23 | 33.00 | 8.60 | 19.8 | 111 | 0 | 94% |
| 9 | 0http | 47,482 | 20.57 | 43.00 | 8.20 | 27.5 | 158 | 0 | 88% |
| 10 | restify | 39,806 | 24.61 | 44.00 | 6.95 | 25.3 | 124 | 0 | 74% |
| 11 | koa | 38,326 | 25.59 | 48.00 | 6.62 | 26.2 | 124 | 0 | 71% |
| 12 | hapi | 35,824 | 27.41 | 49.00 | 7.79 | 28.3 | 126 | 0 | 66% |
| 13 | tinyhttp | 29,440 | 33.47 | 65.00 | 4.80 | 49.7 | 178 | 0 | 54% |
| 14 | express | 12,729 | 77.99 | 105.00 | 2.20 | 91.3 | 169 | 0 | 24% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 108,160 | 8.74 | 16.00 | 53.84 | 9.7 | 113 | 0 | 413% |
| 2 | uws | 102,734 | 9.28 | 15.00 | 47.22 | 9.9 | 67 | 0 | 392% |
| 3 | hyper-express | 58,090 | 16.69 | 26.00 | 25.76 | 17.8 | 101 | 0 | 222% |
| 4 | 0http | 27,671 | 35.63 | 74.00 | 13.51 | 48.0 | 169 | 0 | 106% |
| 5 | node-http | 26,219 | 37.63 | 75.00 | 13.28 | 38.7 | 108 | 0 | 100% |
| 6 | fastify | 24,921 | 39.60 | 79.00 | 12.19 | 40.8 | 113 | 0 | 95% |
| 7 | h3 | 24,003 | 41.14 | 81.00 | 11.65 | 42.3 | 110 | 0 | 92% |
| 8 | hono | 23,364 | 42.28 | 83.00 | 11.07 | 43.5 | 108 | 0 | 89% |
| 9 | polka | 22,266 | 44.39 | 86.00 | 10.87 | 45.8 | 105 | 0 | 85% |
| 10 | restify | 18,270 | 54.20 | 85.00 | 8.95 | 55.6 | 112 | 0 | 70% |
| 11 | tinyhttp | 16,144 | 61.42 | 90.00 | 9.01 | 82.2 | 182 | 0 | 62% |
| 12 | koa | 15,096 | 65.66 | 107.00 | 7.37 | 67.4 | 116 | 0 | 58% |
| 13 | hapi | 12,314 | 80.64 | 111.00 | 6.31 | 82.1 | 126 | 0 | 47% |
| 14 | express | 7,242 | 137.36 | 173.00 | 3.54 | 156.2 | 169 | 0 | 28% |

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
