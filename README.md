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
Run on 10/19/2026, 04:32:26 (Manila Time, UTC+8) · AMD EPYC 7763 64-Core Processor (4 threads, 16 GB) · Linux 6.17.0-1022-azure (x64) · Node v22.23.3

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 2.4.0 | 105,171 | 103,752 | 112,306 | 107,012 | 330% |
| 2 | uws | 20.71.0 | 105,947 | 103,971 | 92,163 | 100,505 | 310% |
| 3 | hyper-express | 7.0.2 | 110,392 | 105,387 | 49,552 | 83,227 | 257% |
| 4 | 0http | 5.2.0 | 54,862 | 53,453 | 23,637 | 41,078 | 127% |
| 5 | fastify | 5.12.7 | 45,198 | 44,310 | 17,759 | 32,886 | 101% |
| 6 | node-http | 22.23.3 | 44,774 | 45,178 | 16,881 | 32,443 | 100% |
| 7 | polka | 0.5.2 | 47,102 | 44,488 | 15,927 | 32,196 | 99% |
| 8 | h3 | 2.0.2 | 43,962 | 42,070 | 16,940 | 31,525 | 97% |
| 9 | hono | 4.13.13 | 42,898 | 41,930 | 16,727 | 31,102 | 96% |
| 10 | restify | 12.0.0 | 33,390 | 32,728 | 12,656 | 24,004 | 74% |
| 11 | koa | 3.2.1 | 31,101 | 30,398 | 11,379 | 22,075 | 68% |
| 12 | hapi | 21.4.10 | 31,694 | 30,704 | 9,397 | 20,912 | 64% |
| 13 | tinyhttp | 3.0.11 | 24,870 | 24,642 | 12,462 | 19,693 | 61% |
| 14 | express | 5.3.0 | 11,456 | 11,343 | 6,212 | 9,311 | 29% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 110,392 | 8.40 | 16.00 | 14.74 | 9.2 | 70 | 0 | 247% |
| 2 | uws | 105,947 | 9.11 | 13.00 | 15.86 | 8.5 | 58 | 0 | 237% |
| 3 | **kidlat** | 105,171 | 9.12 | 14.00 | 19.76 | 9.3 | 62 | 0 | 235% |
| 4 | 0http | 54,862 | 17.72 | 31.00 | 9.78 | 18.7 | 102 | 0 | 123% |
| 5 | polka | 47,102 | 20.70 | 33.00 | 8.40 | 21.3 | 97 | 0 | 105% |
| 6 | fastify | 45,198 | 21.62 | 35.00 | 8.10 | 22.2 | 107 | 0 | 101% |
| 7 | node-http | 44,774 | 21.83 | 35.00 | 8.80 | 22.5 | 104 | 0 | 100% |
| 8 | h3 | 43,962 | 22.24 | 36.00 | 7.71 | 22.9 | 106 | 0 | 98% |
| 9 | hono | 42,898 | 22.85 | 37.00 | 7.04 | 23.4 | 102 | 0 | 96% |
| 10 | restify | 33,390 | 29.46 | 50.00 | 6.02 | 30.2 | 113 | 0 | 75% |
| 11 | hapi | 31,694 | 31.05 | 56.00 | 7.07 | 32.0 | 119 | 0 | 71% |
| 12 | koa | 31,101 | 31.64 | 55.00 | 5.55 | 32.4 | 111 | 0 | 69% |
| 13 | tinyhttp | 24,870 | 39.70 | 81.00 | 4.20 | 56.0 | 167 | 0 | 56% |
| 14 | express | 11,456 | 86.70 | 122.00 | 2.04 | 98.2 | 153 | 0 | 26% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 105,387 | 9.10 | 17.00 | 13.47 | 9.6 | 78 | 0 | 233% |
| 2 | uws | 103,971 | 9.24 | 15.00 | 14.97 | 8.5 | 58 | 0 | 230% |
| 3 | **kidlat** | 103,752 | 9.20 | 15.00 | 18.89 | 9.4 | 62 | 0 | 230% |
| 4 | 0http | 53,453 | 18.20 | 28.00 | 9.23 | 19.0 | 105 | 0 | 118% |
| 5 | node-http | 45,178 | 21.64 | 33.00 | 8.57 | 22.2 | 108 | 0 | 100% |
| 6 | polka | 44,488 | 21.99 | 34.00 | 7.68 | 22.5 | 102 | 0 | 98% |
| 7 | fastify | 44,310 | 22.08 | 37.00 | 7.69 | 22.7 | 112 | 0 | 98% |
| 8 | h3 | 42,070 | 23.27 | 37.00 | 7.14 | 23.8 | 111 | 0 | 93% |
| 9 | hono | 41,930 | 23.38 | 38.00 | 6.64 | 23.9 | 107 | 0 | 93% |
| 10 | restify | 32,728 | 30.03 | 51.00 | 5.71 | 30.7 | 124 | 0 | 72% |
| 11 | hapi | 30,704 | 32.06 | 57.00 | 6.68 | 33.2 | 127 | 0 | 68% |
| 12 | koa | 30,398 | 32.39 | 56.00 | 5.25 | 33.1 | 121 | 0 | 67% |
| 13 | tinyhttp | 24,642 | 40.07 | 73.00 | 4.02 | 56.0 | 169 | 0 | 55% |
| 14 | express | 11,343 | 87.57 | 118.00 | 1.96 | 98.5 | 160 | 0 | 25% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 112,306 | 8.35 | 14.00 | 55.91 | 8.8 | 63 | 0 | 665% |
| 2 | uws | 92,163 | 10.29 | 16.00 | 42.37 | 11.0 | 67 | 0 | 546% |
| 3 | hyper-express | 49,552 | 19.70 | 30.00 | 21.98 | 20.5 | 101 | 0 | 294% |
| 4 | 0http | 23,637 | 41.79 | 86.00 | 11.54 | 43.4 | 110 | 0 | 140% |
| 5 | fastify | 17,759 | 55.78 | 82.00 | 8.69 | 56.9 | 105 | 0 | 105% |
| 6 | h3 | 16,940 | 58.50 | 85.00 | 8.22 | 59.6 | 108 | 0 | 100% |
| 7 | node-http | 16,881 | 58.71 | 94.00 | 8.55 | 60.1 | 107 | 0 | 100% |
| 8 | hono | 16,727 | 59.25 | 87.00 | 7.93 | 60.4 | 104 | 0 | 99% |
| 9 | polka | 15,927 | 62.25 | 93.00 | 7.78 | 63.3 | 112 | 0 | 94% |
| 10 | restify | 12,656 | 78.46 | 111.00 | 6.20 | 80.0 | 112 | 0 | 75% |
| 11 | tinyhttp | 12,462 | 79.71 | 114.00 | 6.95 | 98.7 | 171 | 0 | 74% |
| 12 | koa | 11,379 | 87.31 | 118.00 | 5.56 | 89.3 | 115 | 0 | 67% |
| 13 | hapi | 9,397 | 105.79 | 140.00 | 4.81 | 107.2 | 127 | 0 | 56% |
| 14 | express | 6,212 | 160.21 | 190.00 | 3.03 | 175.6 | 161 | 0 | 37% |

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
