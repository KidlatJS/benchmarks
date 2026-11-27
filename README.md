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
Run on 11/27/2026, 07:39:36 (Manila Time, UTC+8) · INTEL(R) XEON(R) PLATINUM 8573C (4 threads, 16 GB) · Linux 7.0.0-1020-azure (x64) · Node v22.23.5

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | uws | 20.71.0 | 195,741 | 194,422 | 152,320 | 179,637 | 241% |
| 2 | **kidlat** | 2.6.0 | 160,746 | 166,310 | 189,174 | 171,649 | 230% |
| 3 | hyper-express | 7.0.2 | 200,362 | 188,061 | 89,446 | 149,931 | 201% |
| 4 | node-http | 22.23.5 | 92,797 | 92,893 | 48,113 | 74,575 | 100% |
| 5 | fastify | 5.12.7 | 93,942 | 92,736 | 46,390 | 73,934 | 99% |
| 6 | polka | 0.5.2 | 97,518 | 91,491 | 40,878 | 71,447 | 96% |
| 7 | h3 | 2.0.2 | 92,514 | 87,554 | 44,458 | 71,145 | 95% |
| 8 | hono | 4.13.13 | 92,797 | 89,426 | 43,310 | 71,098 | 95% |
| 9 | 0http | 5.2.0 | 86,715 | 84,592 | 48,760 | 70,984 | 95% |
| 10 | restify | 12.0.0 | 66,646 | 65,617 | 31,384 | 51,582 | 69% |
| 11 | koa | 3.2.1 | 66,256 | 65,634 | 30,799 | 51,164 | 69% |
| 12 | tinyhttp | 3.0.11 | 48,293 | 47,896 | 28,334 | 40,318 | 54% |
| 13 | hapi | 21.4.10 | 48,297 | 47,468 | 21,930 | 36,908 | 49% |
| 14 | express | 5.3.0 | 19,260 | 19,137 | 12,001 | 16,415 | 22% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 200,362 | 4.45 | 7.00 | 26.75 | 5.2 | 79 | 0 | 216% |
| 2 | uws | 195,741 | 4.51 | 8.00 | 29.31 | 4.7 | 58 | 0 | 211% |
| 3 | **kidlat** | 160,746 | 5.72 | 9.00 | 30.20 | 5.0 | 63 | 0 | 173% |
| 4 | polka | 97,518 | 9.76 | 19.00 | 17.39 | 10.3 | 101 | 0 | 105% |
| 5 | fastify | 93,942 | 10.11 | 19.00 | 16.84 | 10.7 | 107 | 0 | 101% |
| 6 | node-http | 92,797 | 10.30 | 18.00 | 18.23 | 10.9 | 103 | 0 | 100% |
| 7 | hono | 92,797 | 10.26 | 18.00 | 15.22 | 10.9 | 108 | 0 | 100% |
| 8 | h3 | 92,514 | 10.28 | 19.00 | 16.23 | 10.9 | 108 | 0 | 100% |
| 9 | 0http | 86,715 | 11.04 | 23.00 | 15.47 | 15.7 | 142 | 0 | 93% |
| 10 | restify | 66,646 | 14.53 | 29.00 | 12.01 | 15.1 | 117 | 0 | 72% |
| 11 | koa | 66,256 | 14.58 | 30.00 | 11.82 | 15.2 | 114 | 0 | 71% |
| 12 | hapi | 48,297 | 20.20 | 42.00 | 10.78 | 21.1 | 118 | 0 | 52% |
| 13 | tinyhttp | 48,293 | 20.20 | 39.00 | 8.15 | 32.5 | 190 | 0 | 52% |
| 14 | express | 19,260 | 51.41 | 71.00 | 3.43 | 60.0 | 176 | 0 | 21% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 194,422 | 4.57 | 8.00 | 28.00 | 4.8 | 59 | 0 | 209% |
| 2 | hyper-express | 188,061 | 4.80 | 8.00 | 24.03 | 5.6 | 79 | 0 | 202% |
| 3 | **kidlat** | 166,310 | 5.42 | 9.00 | 30.29 | 5.0 | 64 | 0 | 179% |
| 4 | node-http | 92,893 | 10.29 | 18.00 | 17.63 | 10.8 | 108 | 0 | 100% |
| 5 | fastify | 92,736 | 10.27 | 19.00 | 16.10 | 10.8 | 111 | 0 | 100% |
| 6 | polka | 91,491 | 10.48 | 19.00 | 15.79 | 11.0 | 107 | 0 | 98% |
| 7 | hono | 89,426 | 10.75 | 21.00 | 14.16 | 11.2 | 112 | 0 | 96% |
| 8 | h3 | 87,554 | 10.94 | 21.00 | 14.86 | 11.5 | 112 | 0 | 94% |
| 9 | 0http | 84,592 | 11.33 | 24.00 | 14.60 | 16.2 | 143 | 0 | 91% |
| 10 | koa | 65,634 | 14.73 | 30.00 | 11.33 | 15.3 | 123 | 0 | 71% |
| 11 | restify | 65,617 | 14.75 | 29.00 | 11.45 | 15.3 | 128 | 0 | 71% |
| 12 | tinyhttp | 47,896 | 20.37 | 40.00 | 7.81 | 32.9 | 190 | 0 | 52% |
| 13 | hapi | 47,468 | 20.57 | 43.00 | 10.32 | 21.4 | 135 | 0 | 51% |
| 14 | express | 19,137 | 51.73 | 71.00 | 3.30 | 60.1 | 177 | 0 | 21% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 189,174 | 4.97 | 8.00 | 94.17 | 5.1 | 69 | 0 | 393% |
| 2 | uws | 152,320 | 6.05 | 10.00 | 70.02 | 6.9 | 68 | 0 | 317% |
| 3 | hyper-express | 89,446 | 10.71 | 16.00 | 39.66 | 11.7 | 100 | 0 | 186% |
| 4 | 0http | 48,760 | 20.02 | 45.00 | 23.81 | 28.2 | 169 | 0 | 101% |
| 5 | node-http | 48,113 | 20.28 | 44.00 | 24.37 | 21.2 | 110 | 0 | 100% |
| 6 | fastify | 46,390 | 21.06 | 48.00 | 22.69 | 22.0 | 114 | 0 | 96% |
| 7 | h3 | 44,458 | 21.99 | 51.00 | 21.58 | 22.9 | 115 | 0 | 92% |
| 8 | hono | 43,310 | 22.59 | 53.00 | 20.53 | 23.6 | 115 | 0 | 90% |
| 9 | polka | 40,878 | 23.96 | 56.00 | 19.96 | 25.2 | 100 | 0 | 85% |
| 10 | restify | 31,384 | 31.36 | 65.00 | 15.38 | 32.5 | 114 | 0 | 65% |
| 11 | koa | 30,799 | 31.95 | 65.00 | 15.04 | 33.3 | 116 | 0 | 64% |
| 12 | tinyhttp | 28,334 | 34.78 | 73.00 | 15.81 | 50.2 | 195 | 0 | 59% |
| 13 | hapi | 21,930 | 45.08 | 78.00 | 11.23 | 46.4 | 135 | 0 | 46% |
| 14 | express | 12,001 | 82.76 | 112.00 | 5.86 | 94.9 | 185 | 0 | 25% |

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
