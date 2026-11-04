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
Run on 11/05/2026, 06:34:18 (Manila Time, UTC+8) · AMD EPYC 7763 64-Core Processor (4 threads, 16 GB) · Linux 7.0.0-1017-azure (x64) · Node v22.23.4

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 2.6.0 | 98,725 | 100,712 | 108,571 | 102,583 | 312% |
| 2 | uws | 20.71.0 | 98,621 | 99,922 | 87,093 | 95,032 | 289% |
| 3 | hyper-express | 7.0.2 | 104,878 | 97,576 | 42,812 | 75,951 | 231% |
| 4 | node-http | 22.23.4 | 43,455 | 43,913 | 18,647 | 32,891 | 100% |
| 5 | 0http | 5.2.0 | 43,167 | 42,361 | 18,961 | 32,608 | 99% |
| 6 | fastify | 5.12.7 | 43,207 | 42,911 | 17,319 | 31,785 | 97% |
| 7 | hono | 4.13.13 | 41,124 | 40,590 | 16,503 | 30,201 | 92% |
| 8 | polka | 0.5.2 | 43,071 | 40,838 | 15,335 | 29,990 | 91% |
| 9 | h3 | 2.0.2 | 41,021 | 38,508 | 16,764 | 29,807 | 91% |
| 10 | restify | 12.0.0 | 31,834 | 31,120 | 12,284 | 23,002 | 70% |
| 11 | koa | 3.2.1 | 30,386 | 30,352 | 10,666 | 21,427 | 65% |
| 12 | hapi | 21.4.10 | 30,212 | 29,426 | 9,071 | 20,053 | 61% |
| 13 | tinyhttp | 3.0.11 | 23,048 | 22,576 | 11,844 | 18,334 | 56% |
| 14 | express | 5.3.0 | 11,012 | 10,862 | 6,014 | 8,960 | 27% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 104,878 | 9.12 | 17.00 | 14.00 | 9.7 | 71 | 0 | 241% |
| 2 | **kidlat** | 98,725 | 9.67 | 17.00 | 18.55 | 9.7 | 63 | 0 | 227% |
| 3 | uws | 98,621 | 9.68 | 12.00 | 14.77 | 9.1 | 58 | 0 | 227% |
| 4 | node-http | 43,455 | 22.52 | 46.00 | 8.54 | 23.1 | 105 | 0 | 100% |
| 5 | fastify | 43,207 | 22.64 | 48.00 | 7.75 | 23.3 | 107 | 0 | 99% |
| 6 | 0http | 43,167 | 22.66 | 53.00 | 7.70 | 29.6 | 145 | 0 | 99% |
| 7 | polka | 43,071 | 22.71 | 40.00 | 7.68 | 23.3 | 98 | 0 | 99% |
| 8 | hono | 41,124 | 23.82 | 51.00 | 6.75 | 24.5 | 106 | 0 | 95% |
| 9 | h3 | 41,021 | 23.87 | 45.00 | 7.20 | 24.5 | 109 | 0 | 94% |
| 10 | restify | 31,834 | 30.91 | 60.00 | 5.74 | 31.7 | 113 | 0 | 73% |
| 11 | koa | 30,386 | 32.40 | 62.00 | 5.42 | 33.2 | 118 | 0 | 70% |
| 12 | hapi | 30,212 | 32.60 | 60.00 | 6.74 | 33.6 | 123 | 0 | 70% |
| 13 | tinyhttp | 23,048 | 42.88 | 89.00 | 3.89 | 60.2 | 170 | 0 | 53% |
| 14 | express | 11,012 | 90.23 | 130.00 | 1.96 | 103.5 | 153 | 0 | 25% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 100,712 | 9.45 | 15.00 | 18.35 | 9.6 | 64 | 0 | 229% |
| 2 | uws | 99,922 | 9.52 | 15.00 | 14.39 | 9.0 | 58 | 0 | 228% |
| 3 | hyper-express | 97,576 | 9.70 | 18.00 | 12.47 | 10.4 | 79 | 0 | 222% |
| 4 | node-http | 43,913 | 22.28 | 43.00 | 8.33 | 22.9 | 110 | 0 | 100% |
| 5 | fastify | 42,911 | 22.79 | 39.00 | 7.45 | 23.4 | 112 | 0 | 98% |
| 6 | 0http | 42,361 | 23.10 | 53.00 | 7.31 | 30.1 | 145 | 0 | 96% |
| 7 | polka | 40,838 | 23.98 | 43.00 | 7.05 | 24.6 | 103 | 0 | 93% |
| 8 | hono | 40,590 | 24.13 | 45.00 | 6.43 | 24.7 | 110 | 0 | 92% |
| 9 | h3 | 38,508 | 25.46 | 46.00 | 6.54 | 26.1 | 112 | 0 | 88% |
| 10 | restify | 31,120 | 31.62 | 60.00 | 5.43 | 32.3 | 124 | 0 | 71% |
| 11 | koa | 30,352 | 32.44 | 59.00 | 5.24 | 33.1 | 127 | 0 | 69% |
| 12 | hapi | 29,426 | 33.47 | 58.00 | 6.40 | 34.4 | 134 | 0 | 67% |
| 13 | tinyhttp | 22,576 | 43.78 | 85.00 | 3.68 | 61.4 | 172 | 0 | 51% |
| 14 | express | 10,862 | 91.50 | 129.00 | 1.87 | 104.1 | 161 | 0 | 25% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 108,571 | 8.66 | 17.00 | 54.05 | 9.1 | 65 | 0 | 582% |
| 2 | uws | 87,093 | 11.04 | 19.00 | 40.03 | 11.8 | 68 | 0 | 467% |
| 3 | hyper-express | 42,812 | 22.85 | 37.00 | 18.99 | 23.9 | 100 | 0 | 230% |
| 4 | 0http | 18,961 | 52.21 | 107.00 | 9.26 | 64.6 | 162 | 0 | 102% |
| 5 | node-http | 18,647 | 53.10 | 75.00 | 9.44 | 54.3 | 108 | 0 | 100% |
| 6 | fastify | 17,319 | 57.21 | 81.00 | 8.47 | 58.6 | 109 | 0 | 93% |
| 7 | h3 | 16,764 | 59.12 | 83.00 | 8.14 | 60.5 | 109 | 0 | 90% |
| 8 | hono | 16,503 | 60.05 | 94.00 | 7.82 | 61.3 | 109 | 0 | 89% |
| 9 | polka | 15,335 | 64.68 | 95.00 | 7.49 | 66.4 | 101 | 0 | 82% |
| 10 | restify | 12,284 | 80.80 | 122.00 | 6.02 | 82.7 | 112 | 0 | 66% |
| 11 | tinyhttp | 11,844 | 83.86 | 122.00 | 6.61 | 105.2 | 176 | 0 | 64% |
| 12 | koa | 10,666 | 93.15 | 130.00 | 5.21 | 95.5 | 113 | 0 | 57% |
| 13 | hapi | 9,071 | 109.61 | 140.00 | 4.65 | 111.3 | 134 | 0 | 49% |
| 14 | express | 6,014 | 165.46 | 210.00 | 2.94 | 183.6 | 162 | 0 | 32% |

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
