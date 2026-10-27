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
Run on 10/28/2026, 05:11:11 (Manila Time, UTC+8) · Intel(R) Xeon(R) Platinum 8370C CPU @ 2.80GHz (4 threads, 16 GB) · Linux 6.17.0-1022-azure (x64) · Node v22.23.3

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | uws | 20.71.0 | 134,727 | 137,022 | 107,083 | 125,504 | 252% |
| 2 | **kidlat** | 2.4.0 | 121,794 | 122,365 | 132,583 | 125,484 | 252% |
| 3 | hyper-express | 7.0.2 | 129,662 | 122,322 | 58,062 | 97,291 | 196% |
| 4 | 0http | 5.2.0 | 73,678 | 72,856 | 33,880 | 56,656 | 114% |
| 5 | node-http | 22.23.3 | 64,490 | 64,237 | 29,716 | 49,746 | 100% |
| 6 | fastify | 5.12.7 | 66,686 | 64,941 | 27,972 | 49,480 | 99% |
| 7 | hono | 4.13.13 | 63,951 | 62,174 | 26,743 | 47,376 | 95% |
| 8 | polka | 0.5.2 | 67,800 | 63,036 | 24,743 | 47,289 | 95% |
| 9 | h3 | 2.0.2 | 61,771 | 58,230 | 26,652 | 45,767 | 92% |
| 10 | restify | 12.0.0 | 46,873 | 45,894 | 20,064 | 35,078 | 71% |
| 11 | koa | 3.2.1 | 44,374 | 43,871 | 16,886 | 32,034 | 64% |
| 12 | hapi | 21.4.10 | 41,531 | 39,909 | 14,193 | 28,653 | 58% |
| 13 | tinyhttp | 3.0.11 | 31,462 | 30,812 | 18,063 | 25,968 | 52% |
| 14 | express | 5.3.0 | 13,528 | 12,971 | 7,918 | 11,158 | 22% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 134,727 | 7.07 | 10.00 | 20.17 | 6.8 | 58 | 0 | 209% |
| 2 | hyper-express | 129,662 | 7.21 | 12.00 | 17.31 | 7.9 | 71 | 0 | 201% |
| 3 | **kidlat** | 121,794 | 7.73 | 12.00 | 22.88 | 7.3 | 61 | 0 | 189% |
| 4 | 0http | 73,678 | 13.09 | 19.00 | 13.14 | 14.1 | 101 | 0 | 114% |
| 5 | polka | 67,800 | 14.24 | 23.00 | 12.09 | 14.9 | 100 | 0 | 105% |
| 6 | fastify | 66,686 | 14.49 | 24.00 | 11.96 | 15.1 | 107 | 0 | 103% |
| 7 | node-http | 64,490 | 15.02 | 25.00 | 12.67 | 15.6 | 101 | 0 | 100% |
| 8 | hono | 63,951 | 15.14 | 27.00 | 10.49 | 15.8 | 102 | 0 | 99% |
| 9 | h3 | 61,771 | 15.68 | 27.00 | 10.84 | 16.3 | 106 | 0 | 96% |
| 10 | restify | 46,873 | 20.83 | 36.00 | 8.45 | 21.5 | 114 | 0 | 73% |
| 11 | koa | 44,374 | 22.04 | 38.00 | 7.91 | 22.8 | 114 | 0 | 69% |
| 12 | hapi | 41,531 | 23.58 | 40.00 | 9.27 | 24.6 | 120 | 0 | 64% |
| 13 | tinyhttp | 31,462 | 31.28 | 60.00 | 5.31 | 49.3 | 175 | 0 | 49% |
| 14 | express | 13,528 | 73.34 | 100.00 | 2.41 | 84.9 | 138 | 0 | 21% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 137,022 | 6.91 | 11.00 | 19.73 | 6.8 | 60 | 0 | 213% |
| 2 | **kidlat** | 122,365 | 7.68 | 12.00 | 22.29 | 7.3 | 62 | 0 | 190% |
| 3 | hyper-express | 122,322 | 7.65 | 13.00 | 15.63 | 8.4 | 79 | 0 | 190% |
| 4 | 0http | 72,856 | 13.22 | 19.00 | 12.58 | 14.3 | 105 | 0 | 113% |
| 5 | fastify | 64,941 | 14.91 | 25.00 | 11.27 | 15.5 | 113 | 0 | 101% |
| 6 | node-http | 64,237 | 15.08 | 26.00 | 12.19 | 15.6 | 106 | 0 | 100% |
| 7 | polka | 63,036 | 15.37 | 27.00 | 10.88 | 15.9 | 107 | 0 | 98% |
| 8 | hono | 62,174 | 15.57 | 27.00 | 9.84 | 16.2 | 107 | 0 | 97% |
| 9 | h3 | 58,230 | 16.69 | 28.00 | 9.88 | 17.3 | 111 | 0 | 91% |
| 10 | restify | 45,894 | 21.29 | 37.00 | 8.01 | 22.0 | 124 | 0 | 71% |
| 11 | koa | 43,871 | 22.29 | 39.00 | 7.57 | 23.0 | 126 | 0 | 68% |
| 12 | hapi | 39,909 | 24.55 | 41.00 | 8.68 | 25.5 | 138 | 0 | 62% |
| 13 | tinyhttp | 30,812 | 31.95 | 59.00 | 5.03 | 49.9 | 175 | 0 | 48% |
| 14 | express | 12,971 | 76.54 | 101.00 | 2.24 | 87.8 | 162 | 0 | 20% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 132,583 | 7.15 | 11.00 | 65.99 | 7.4 | 62 | 0 | 446% |
| 2 | uws | 107,083 | 8.87 | 15.00 | 49.22 | 9.6 | 67 | 0 | 360% |
| 3 | hyper-express | 58,062 | 16.73 | 25.00 | 25.75 | 17.9 | 100 | 0 | 195% |
| 4 | 0http | 33,880 | 29.01 | 60.00 | 16.54 | 30.9 | 113 | 0 | 114% |
| 5 | node-http | 29,716 | 33.14 | 65.00 | 15.05 | 34.3 | 107 | 0 | 100% |
| 6 | fastify | 27,972 | 35.23 | 69.00 | 13.68 | 36.4 | 113 | 0 | 94% |
| 7 | hono | 26,743 | 36.89 | 72.00 | 12.68 | 38.0 | 106 | 0 | 90% |
| 8 | h3 | 26,652 | 37.02 | 73.00 | 12.94 | 38.1 | 109 | 0 | 90% |
| 9 | polka | 24,743 | 39.90 | 76.00 | 12.08 | 41.4 | 106 | 0 | 83% |
| 10 | restify | 20,064 | 49.33 | 77.00 | 9.83 | 50.8 | 124 | 0 | 68% |
| 11 | tinyhttp | 18,063 | 54.86 | 80.00 | 10.08 | 76.9 | 179 | 0 | 61% |
| 12 | koa | 16,886 | 58.70 | 89.00 | 8.24 | 60.5 | 114 | 0 | 57% |
| 13 | hapi | 14,193 | 69.91 | 101.00 | 7.27 | 71.3 | 140 | 0 | 48% |
| 14 | express | 7,918 | 125.61 | 151.00 | 3.87 | 142.4 | 162 | 0 | 27% |

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
