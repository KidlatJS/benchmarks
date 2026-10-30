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
Run on 10/31/2026, 03:12:52 (Manila Time, UTC+8) · AMD EPYC 7763 64-Core Processor (4 threads, 16 GB) · Linux 7.0.0-1017-azure (x64) · Node v22.23.4

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 2.4.0 | 94,326 | 94,760 | 103,184 | 97,340 | 304% |
| 2 | uws | 20.71.0 | 99,446 | 96,144 | 84,223 | 93,035 | 291% |
| 3 | hyper-express | 7.0.2 | 103,477 | 98,578 | 44,199 | 76,679 | 240% |
| 4 | node-http | 22.23.4 | 42,758 | 42,106 | 18,150 | 31,970 | 100% |
| 5 | fastify | 5.12.7 | 42,676 | 42,399 | 17,198 | 31,454 | 98% |
| 6 | 0http | 5.2.0 | 39,378 | 39,279 | 18,551 | 30,615 | 96% |
| 7 | polka | 0.5.2 | 43,920 | 41,063 | 15,193 | 30,148 | 94% |
| 8 | hono | 4.13.13 | 40,967 | 39,602 | 16,102 | 29,672 | 93% |
| 9 | h3 | 2.0.2 | 40,088 | 38,686 | 16,588 | 29,520 | 92% |
| 10 | restify | 12.0.0 | 30,732 | 30,627 | 12,009 | 22,442 | 70% |
| 11 | koa | 3.2.1 | 30,367 | 29,462 | 10,769 | 21,279 | 67% |
| 12 | hapi | 21.4.10 | 29,767 | 29,329 | 9,023 | 19,897 | 62% |
| 13 | tinyhttp | 3.0.11 | 22,486 | 22,385 | 11,343 | 17,873 | 56% |
| 14 | express | 5.3.0 | 11,168 | 10,865 | 5,952 | 8,972 | 28% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 103,477 | 9.22 | 17.00 | 13.82 | 9.9 | 71 | 0 | 242% |
| 2 | uws | 99,446 | 9.63 | 14.00 | 14.89 | 9.1 | 58 | 0 | 233% |
| 3 | **kidlat** | 94,326 | 10.16 | 16.00 | 17.73 | 9.9 | 61 | 0 | 221% |
| 4 | polka | 43,920 | 22.27 | 36.00 | 7.83 | 22.9 | 97 | 0 | 103% |
| 5 | node-http | 42,758 | 22.88 | 37.00 | 8.40 | 23.5 | 104 | 0 | 100% |
| 6 | fastify | 42,676 | 22.93 | 40.00 | 7.65 | 23.6 | 106 | 0 | 100% |
| 7 | hono | 40,967 | 23.91 | 41.00 | 6.72 | 24.6 | 106 | 0 | 96% |
| 8 | h3 | 40,088 | 24.44 | 43.00 | 7.03 | 25.1 | 103 | 0 | 94% |
| 9 | 0http | 39,378 | 24.89 | 57.00 | 7.02 | 32.6 | 146 | 0 | 92% |
| 10 | restify | 30,732 | 32.03 | 63.00 | 5.54 | 32.8 | 113 | 0 | 72% |
| 11 | koa | 30,367 | 32.42 | 61.00 | 5.42 | 33.1 | 114 | 0 | 71% |
| 12 | hapi | 29,767 | 33.08 | 63.00 | 6.64 | 34.1 | 120 | 0 | 70% |
| 13 | tinyhttp | 22,486 | 43.96 | 88.00 | 3.80 | 61.3 | 171 | 0 | 53% |
| 14 | express | 11,168 | 88.96 | 122.00 | 1.99 | 102.0 | 146 | 0 | 26% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 98,578 | 9.59 | 17.00 | 12.60 | 10.3 | 78 | 0 | 234% |
| 2 | uws | 96,144 | 9.92 | 14.00 | 13.85 | 9.3 | 58 | 0 | 228% |
| 3 | **kidlat** | 94,760 | 10.08 | 16.00 | 17.26 | 9.9 | 61 | 0 | 225% |
| 4 | fastify | 42,399 | 23.08 | 38.00 | 7.36 | 23.7 | 110 | 0 | 101% |
| 5 | node-http | 42,106 | 23.24 | 43.00 | 7.99 | 23.8 | 109 | 0 | 100% |
| 6 | polka | 41,063 | 23.85 | 40.00 | 7.09 | 24.4 | 103 | 0 | 98% |
| 7 | hono | 39,602 | 24.75 | 42.00 | 6.27 | 25.4 | 111 | 0 | 94% |
| 8 | 0http | 39,279 | 24.96 | 57.00 | 6.78 | 32.5 | 146 | 0 | 93% |
| 9 | h3 | 38,686 | 25.35 | 49.00 | 6.57 | 25.9 | 109 | 0 | 92% |
| 10 | restify | 30,627 | 32.14 | 59.00 | 5.35 | 32.9 | 125 | 0 | 73% |
| 11 | koa | 29,462 | 33.44 | 62.00 | 5.09 | 34.1 | 123 | 0 | 70% |
| 12 | hapi | 29,329 | 33.58 | 61.00 | 6.38 | 34.5 | 146 | 0 | 70% |
| 13 | tinyhttp | 22,385 | 44.15 | 86.00 | 3.65 | 61.5 | 171 | 0 | 53% |
| 14 | express | 10,865 | 91.48 | 125.00 | 1.88 | 104.7 | 160 | 0 | 26% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 103,184 | 9.29 | 17.00 | 51.37 | 9.5 | 62 | 0 | 569% |
| 2 | uws | 84,223 | 11.39 | 22.00 | 38.72 | 12.1 | 67 | 0 | 464% |
| 3 | hyper-express | 44,199 | 22.13 | 37.00 | 19.60 | 23.3 | 101 | 0 | 244% |
| 4 | 0http | 18,551 | 53.37 | 109.00 | 9.06 | 66.5 | 161 | 0 | 102% |
| 5 | node-http | 18,150 | 54.57 | 78.00 | 9.19 | 56.0 | 109 | 0 | 100% |
| 6 | fastify | 17,198 | 57.61 | 81.00 | 8.41 | 58.9 | 105 | 0 | 95% |
| 7 | h3 | 16,588 | 59.75 | 87.00 | 8.05 | 61.1 | 103 | 0 | 91% |
| 8 | hono | 16,102 | 61.57 | 90.00 | 7.63 | 63.1 | 110 | 0 | 89% |
| 9 | polka | 15,193 | 65.26 | 92.00 | 7.42 | 67.1 | 108 | 0 | 84% |
| 10 | restify | 12,009 | 82.70 | 115.00 | 5.89 | 84.6 | 113 | 0 | 66% |
| 11 | tinyhttp | 11,343 | 87.58 | 124.00 | 6.33 | 109.9 | 174 | 0 | 62% |
| 12 | koa | 10,769 | 92.24 | 124.00 | 5.26 | 94.4 | 111 | 0 | 59% |
| 13 | hapi | 9,023 | 110.20 | 145.00 | 4.62 | 112.3 | 163 | 0 | 50% |
| 14 | express | 5,952 | 167.23 | 212.00 | 2.91 | 185.5 | 161 | 0 | 33% |

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
