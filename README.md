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
Run on 10/31/2026, 20:02:37 (Manila Time, UTC+8) · AMD EPYC 9V45 96-Core Processor (4 threads, 16 GB) · Linux 7.0.0-1017-azure (x64) · Node v22.23.4

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 2.4.0 | 177,322 | 190,717 | 192,528 | 186,730 | 270% |
| 2 | uws | 20.71.0 | 193,437 | 187,914 | 161,382 | 180,351 | 261% |
| 3 | hyper-express | 7.0.2 | 181,827 | 170,224 | 93,488 | 142,499 | 206% |
| 4 | node-http | 22.23.4 | 84,522 | 81,368 | 47,833 | 69,032 | 100% |
| 5 | fastify | 5.12.7 | 79,800 | 77,162 | 46,849 | 66,075 | 96% |
| 6 | h3 | 2.0.2 | 79,171 | 77,214 | 47,099 | 66,033 | 96% |
| 7 | hono | 4.13.13 | 79,437 | 76,104 | 45,474 | 65,022 | 94% |
| 8 | polka | 0.5.2 | 77,786 | 77,765 | 44,379 | 64,509 | 93% |
| 9 | 0http | 5.2.0 | 66,674 | 65,709 | 38,046 | 55,034 | 80% |
| 10 | restify | 12.0.0 | 65,050 | 64,368 | 34,788 | 52,616 | 76% |
| 11 | koa | 3.2.1 | 62,017 | 60,536 | 33,229 | 49,967 | 72% |
| 12 | hapi | 21.4.10 | 62,196 | 59,714 | 29,865 | 48,047 | 70% |
| 13 | tinyhttp | 3.0.11 | 43,716 | 43,692 | 28,864 | 38,060 | 55% |
| 14 | express | 5.3.0 | 20,955 | 20,936 | 14,725 | 18,624 | 27% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 193,437 | 4.75 | 7.00 | 28.96 | 5.0 | 58 | 0 | 229% |
| 2 | hyper-express | 181,827 | 5.10 | 8.00 | 24.28 | 5.6 | 79 | 0 | 215% |
| 3 | **kidlat** | 177,322 | 5.14 | 8.00 | 33.32 | 5.3 | 61 | 0 | 210% |
| 4 | node-http | 84,522 | 11.35 | 22.00 | 16.61 | 11.9 | 104 | 0 | 100% |
| 5 | fastify | 79,800 | 12.04 | 23.00 | 14.31 | 12.6 | 108 | 0 | 94% |
| 6 | hono | 79,437 | 12.09 | 24.00 | 13.03 | 12.7 | 108 | 0 | 94% |
| 7 | h3 | 79,171 | 12.14 | 25.00 | 13.89 | 12.7 | 102 | 0 | 94% |
| 8 | polka | 77,786 | 12.36 | 25.00 | 13.87 | 12.9 | 99 | 0 | 92% |
| 9 | 0http | 66,674 | 14.50 | 30.00 | 11.89 | 19.6 | 154 | 0 | 79% |
| 10 | restify | 65,050 | 14.87 | 30.00 | 11.73 | 15.5 | 116 | 0 | 77% |
| 11 | hapi | 62,196 | 15.57 | 31.00 | 13.88 | 16.3 | 141 | 0 | 74% |
| 12 | koa | 62,017 | 15.62 | 32.00 | 11.06 | 16.3 | 115 | 0 | 73% |
| 13 | tinyhttp | 43,716 | 22.38 | 46.00 | 7.38 | 35.6 | 189 | 0 | 52% |
| 14 | express | 20,955 | 47.20 | 77.00 | 3.74 | 57.2 | 187 | 0 | 25% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 190,717 | 4.89 | 7.00 | 34.74 | 5.1 | 62 | 0 | 234% |
| 2 | uws | 187,914 | 4.97 | 7.00 | 27.06 | 5.1 | 60 | 0 | 231% |
| 3 | hyper-express | 170,224 | 5.25 | 8.00 | 21.75 | 6.0 | 79 | 0 | 209% |
| 4 | node-http | 81,368 | 11.78 | 23.00 | 15.44 | 12.3 | 109 | 0 | 100% |
| 5 | polka | 77,765 | 12.37 | 25.00 | 13.42 | 12.9 | 105 | 0 | 96% |
| 6 | h3 | 77,214 | 12.49 | 25.00 | 13.11 | 13.0 | 108 | 0 | 95% |
| 7 | fastify | 77,162 | 12.48 | 24.00 | 13.39 | 13.0 | 113 | 0 | 95% |
| 8 | hono | 76,104 | 12.66 | 26.00 | 12.05 | 13.2 | 112 | 0 | 94% |
| 9 | 0http | 65,709 | 14.72 | 31.00 | 11.34 | 19.8 | 153 | 0 | 81% |
| 10 | restify | 64,368 | 15.03 | 29.00 | 11.23 | 15.6 | 127 | 0 | 79% |
| 11 | koa | 60,536 | 16.02 | 32.00 | 10.45 | 16.6 | 124 | 0 | 74% |
| 12 | hapi | 59,714 | 16.23 | 32.00 | 12.98 | 17.0 | 143 | 0 | 73% |
| 13 | tinyhttp | 43,692 | 22.39 | 45.00 | 7.13 | 36.2 | 190 | 0 | 54% |
| 14 | express | 20,936 | 47.25 | 78.00 | 3.61 | 57.4 | 187 | 0 | 26% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 192,528 | 4.86 | 7.00 | 95.85 | 5.1 | 65 | 0 | 403% |
| 2 | uws | 161,382 | 5.73 | 9.00 | 74.19 | 6.3 | 67 | 0 | 337% |
| 3 | hyper-express | 93,488 | 10.17 | 17.00 | 41.46 | 11.3 | 101 | 0 | 195% |
| 4 | node-http | 47,833 | 20.40 | 46.00 | 24.22 | 21.4 | 112 | 0 | 100% |
| 5 | h3 | 47,099 | 20.72 | 49.00 | 22.86 | 21.5 | 112 | 0 | 98% |
| 6 | fastify | 46,849 | 20.85 | 47.00 | 22.92 | 21.8 | 104 | 0 | 98% |
| 7 | hono | 45,474 | 21.50 | 50.00 | 21.55 | 22.3 | 108 | 0 | 95% |
| 8 | polka | 44,379 | 22.03 | 52.00 | 21.67 | 23.0 | 106 | 0 | 93% |
| 9 | 0http | 38,046 | 25.78 | 55.00 | 18.58 | 35.7 | 169 | 0 | 80% |
| 10 | restify | 34,788 | 28.23 | 64.00 | 17.05 | 29.3 | 113 | 0 | 73% |
| 11 | koa | 33,229 | 29.58 | 68.00 | 16.23 | 30.8 | 118 | 0 | 69% |
| 12 | hapi | 29,865 | 32.97 | 70.00 | 15.30 | 33.9 | 143 | 0 | 62% |
| 13 | tinyhttp | 28,864 | 34.15 | 72.00 | 16.10 | 51.7 | 194 | 0 | 60% |
| 14 | express | 14,725 | 67.37 | 96.00 | 7.19 | 81.4 | 191 | 0 | 31% |

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
