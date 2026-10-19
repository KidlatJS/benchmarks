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
Run on 10/19/2026, 15:35:52 (Manila Time, UTC+8) · AMD EPYC 7763 64-Core Processor (4 threads, 16 GB) · Linux 6.17.0-1022-azure (x64) · Node v22.23.3

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 2.4.0 | 104,922 | 102,651 | 110,301 | 105,910 | 324% |
| 2 | uws | 20.71.0 | 107,784 | 110,720 | 91,437 | 102,952 | 315% |
| 3 | hyper-express | 7.0.2 | 107,701 | 100,490 | 46,631 | 79,617 | 244% |
| 4 | 0http | 5.2.0 | 52,021 | 49,411 | 21,767 | 38,247 | 117% |
| 5 | node-http | 22.23.3 | 44,838 | 45,204 | 17,169 | 32,648 | 100% |
| 6 | fastify | 5.12.7 | 44,749 | 44,322 | 17,280 | 32,482 | 99% |
| 7 | polka | 0.5.2 | 45,445 | 43,029 | 15,762 | 31,353 | 96% |
| 8 | h3 | 2.0.2 | 43,181 | 40,750 | 16,914 | 30,990 | 95% |
| 9 | hono | 4.13.13 | 43,141 | 41,798 | 16,035 | 30,693 | 94% |
| 10 | restify | 12.0.0 | 32,191 | 31,904 | 12,245 | 23,255 | 71% |
| 11 | koa | 3.2.1 | 30,168 | 29,852 | 10,754 | 21,315 | 65% |
| 12 | hapi | 21.4.10 | 31,654 | 30,914 | 9,397 | 20,951 | 64% |
| 13 | tinyhttp | 3.0.11 | 23,606 | 23,219 | 11,758 | 18,609 | 57% |
| 14 | express | 5.3.0 | 10,636 | 10,373 | 5,797 | 8,616 | 26% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 107,784 | 8.89 | 13.00 | 16.14 | 8.3 | 58 | 0 | 240% |
| 2 | hyper-express | 107,701 | 8.85 | 15.00 | 14.38 | 9.4 | 70 | 0 | 240% |
| 3 | **kidlat** | 104,922 | 9.19 | 14.00 | 19.71 | 9.2 | 61 | 0 | 234% |
| 4 | 0http | 52,021 | 18.73 | 29.00 | 9.28 | 19.6 | 99 | 0 | 116% |
| 5 | polka | 45,445 | 21.50 | 36.00 | 8.10 | 22.1 | 101 | 0 | 101% |
| 6 | node-http | 44,838 | 21.81 | 36.00 | 8.81 | 22.4 | 104 | 0 | 100% |
| 7 | fastify | 44,749 | 21.85 | 35.00 | 8.02 | 22.5 | 107 | 0 | 100% |
| 8 | h3 | 43,181 | 22.65 | 37.00 | 7.58 | 23.3 | 106 | 0 | 96% |
| 9 | hono | 43,141 | 22.67 | 37.00 | 7.08 | 23.3 | 107 | 0 | 96% |
| 10 | restify | 32,191 | 30.56 | 52.00 | 5.80 | 31.3 | 116 | 0 | 72% |
| 11 | hapi | 31,654 | 31.08 | 52.00 | 7.06 | 32.0 | 124 | 0 | 71% |
| 12 | koa | 30,168 | 32.64 | 55.00 | 5.38 | 33.4 | 112 | 0 | 67% |
| 13 | tinyhttp | 23,606 | 41.86 | 86.00 | 3.98 | 59.5 | 168 | 0 | 53% |
| 14 | express | 10,636 | 93.44 | 128.00 | 1.90 | 106.9 | 140 | 0 | 24% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 110,720 | 8.47 | 14.00 | 15.94 | 8.3 | 58 | 0 | 245% |
| 2 | **kidlat** | 102,651 | 9.32 | 14.00 | 18.70 | 9.4 | 62 | 0 | 227% |
| 3 | hyper-express | 100,490 | 9.43 | 17.00 | 12.84 | 10.1 | 80 | 0 | 222% |
| 4 | 0http | 49,411 | 19.73 | 34.00 | 8.53 | 20.7 | 105 | 0 | 109% |
| 5 | node-http | 45,204 | 21.63 | 34.00 | 8.58 | 22.2 | 108 | 0 | 100% |
| 6 | fastify | 44,322 | 22.07 | 35.00 | 7.69 | 22.7 | 112 | 0 | 98% |
| 7 | polka | 43,029 | 22.73 | 38.00 | 7.43 | 23.3 | 106 | 0 | 95% |
| 8 | hono | 41,798 | 23.42 | 39.00 | 6.62 | 24.0 | 112 | 0 | 92% |
| 9 | h3 | 40,750 | 24.05 | 39.00 | 6.92 | 24.6 | 110 | 0 | 90% |
| 10 | restify | 31,904 | 30.83 | 51.00 | 5.57 | 31.5 | 127 | 0 | 71% |
| 11 | hapi | 30,914 | 31.84 | 54.00 | 6.72 | 32.7 | 142 | 0 | 68% |
| 12 | koa | 29,852 | 32.99 | 55.00 | 5.15 | 33.7 | 122 | 0 | 66% |
| 13 | tinyhttp | 23,219 | 42.56 | 81.00 | 3.79 | 60.0 | 167 | 0 | 51% |
| 14 | express | 10,373 | 95.80 | 126.00 | 1.79 | 108.7 | 161 | 0 | 23% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 110,301 | 8.50 | 12.00 | 54.91 | 8.9 | 62 | 0 | 642% |
| 2 | uws | 91,437 | 10.39 | 18.00 | 42.03 | 11.1 | 67 | 0 | 533% |
| 3 | hyper-express | 46,631 | 20.97 | 31.00 | 20.68 | 22.0 | 99 | 0 | 272% |
| 4 | 0http | 21,767 | 45.43 | 94.00 | 10.63 | 47.1 | 113 | 0 | 127% |
| 5 | fastify | 17,280 | 57.34 | 82.00 | 8.45 | 58.6 | 108 | 0 | 101% |
| 6 | node-http | 17,169 | 57.70 | 93.00 | 8.69 | 59.0 | 107 | 0 | 100% |
| 7 | h3 | 16,914 | 58.59 | 87.00 | 8.21 | 59.9 | 105 | 0 | 99% |
| 8 | hono | 16,035 | 61.83 | 92.00 | 7.60 | 63.2 | 102 | 0 | 93% |
| 9 | polka | 15,762 | 62.91 | 91.00 | 7.70 | 64.5 | 104 | 0 | 92% |
| 10 | restify | 12,245 | 81.09 | 112.00 | 6.00 | 82.8 | 112 | 0 | 71% |
| 11 | tinyhttp | 11,758 | 84.47 | 116.00 | 6.56 | 105.6 | 171 | 0 | 68% |
| 12 | koa | 10,754 | 92.39 | 125.00 | 5.25 | 94.5 | 116 | 0 | 63% |
| 13 | hapi | 9,397 | 105.74 | 138.00 | 4.81 | 107.5 | 142 | 0 | 55% |
| 14 | express | 5,797 | 171.68 | 206.00 | 2.83 | 190.9 | 160 | 0 | 34% |

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
