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
Run on 10/20/2026, 04:57:50 (Manila Time, UTC+8) · AMD EPYC 7763 64-Core Processor (4 threads, 16 GB) · Linux 6.17.0-1022-azure (x64) · Node v22.23.3

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 2.4.0 | 104,901 | 103,699 | 110,741 | 106,403 | 322% |
| 2 | uws | 20.71.0 | 107,451 | 109,144 | 91,046 | 102,210 | 309% |
| 3 | hyper-express | 7.0.2 | 108,979 | 103,418 | 49,082 | 82,090 | 248% |
| 4 | 0http | 5.2.0 | 45,454 | 45,097 | 20,592 | 34,818 | 105% |
| 5 | node-http | 22.23.3 | 45,835 | 45,107 | 17,501 | 33,075 | 100% |
| 6 | fastify | 5.12.7 | 45,130 | 44,164 | 17,288 | 32,541 | 98% |
| 7 | polka | 0.5.2 | 45,989 | 43,722 | 15,551 | 31,504 | 95% |
| 8 | hono | 4.13.13 | 43,668 | 41,759 | 16,374 | 31,023 | 94% |
| 9 | h3 | 2.0.2 | 43,721 | 40,603 | 16,791 | 31,005 | 94% |
| 10 | restify | 12.0.0 | 33,686 | 33,151 | 12,463 | 24,054 | 73% |
| 11 | koa | 3.2.1 | 31,363 | 31,084 | 10,927 | 22,003 | 67% |
| 12 | hapi | 21.4.10 | 32,240 | 31,141 | 9,403 | 21,135 | 64% |
| 13 | tinyhttp | 3.0.11 | 24,856 | 24,146 | 12,099 | 19,365 | 59% |
| 14 | express | 5.3.0 | 11,463 | 11,343 | 6,128 | 9,271 | 28% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 108,979 | 8.70 | 14.00 | 14.55 | 9.3 | 70 | 0 | 238% |
| 2 | uws | 107,451 | 9.04 | 14.00 | 16.09 | 8.2 | 57 | 0 | 234% |
| 3 | **kidlat** | 104,901 | 9.20 | 15.00 | 19.71 | 9.2 | 61 | 0 | 229% |
| 4 | polka | 45,989 | 21.25 | 32.00 | 8.20 | 21.9 | 101 | 0 | 100% |
| 5 | node-http | 45,835 | 21.34 | 32.00 | 9.01 | 21.9 | 104 | 0 | 100% |
| 6 | 0http | 45,454 | 21.50 | 46.00 | 8.11 | 27.7 | 144 | 0 | 99% |
| 7 | fastify | 45,130 | 21.69 | 36.00 | 8.09 | 22.3 | 107 | 0 | 98% |
| 8 | h3 | 43,721 | 22.36 | 37.00 | 7.67 | 23.0 | 106 | 0 | 95% |
| 9 | hono | 43,668 | 22.39 | 36.00 | 7.16 | 23.0 | 105 | 0 | 95% |
| 10 | restify | 33,686 | 29.17 | 50.00 | 6.07 | 29.9 | 113 | 0 | 73% |
| 11 | hapi | 32,240 | 30.51 | 53.00 | 7.19 | 31.4 | 120 | 0 | 70% |
| 12 | koa | 31,363 | 31.37 | 54.00 | 5.59 | 32.1 | 112 | 0 | 68% |
| 13 | tinyhttp | 24,856 | 39.73 | 70.00 | 4.20 | 54.5 | 173 | 0 | 54% |
| 14 | express | 11,463 | 86.67 | 117.00 | 2.04 | 97.9 | 172 | 0 | 25% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 109,144 | 8.65 | 15.00 | 15.72 | 8.3 | 58 | 0 | 242% |
| 2 | **kidlat** | 103,699 | 9.25 | 15.00 | 18.89 | 9.4 | 61 | 0 | 230% |
| 3 | hyper-express | 103,418 | 9.25 | 17.00 | 13.22 | 9.8 | 78 | 0 | 229% |
| 4 | node-http | 45,107 | 21.69 | 35.00 | 8.56 | 22.2 | 109 | 0 | 100% |
| 5 | 0http | 45,097 | 21.68 | 48.00 | 7.78 | 27.8 | 145 | 0 | 100% |
| 6 | fastify | 44,164 | 22.13 | 33.00 | 7.67 | 22.7 | 113 | 0 | 98% |
| 7 | polka | 43,722 | 22.36 | 33.00 | 7.55 | 22.9 | 107 | 0 | 97% |
| 8 | hono | 41,759 | 23.43 | 37.00 | 6.61 | 24.0 | 110 | 0 | 93% |
| 9 | h3 | 40,603 | 24.12 | 39.00 | 6.89 | 24.7 | 111 | 0 | 90% |
| 10 | restify | 33,151 | 29.66 | 51.00 | 5.79 | 30.3 | 124 | 0 | 73% |
| 11 | hapi | 31,141 | 31.60 | 56.00 | 6.77 | 32.6 | 120 | 0 | 69% |
| 12 | koa | 31,084 | 31.66 | 55.00 | 5.37 | 32.3 | 122 | 0 | 69% |
| 13 | tinyhttp | 24,146 | 40.91 | 75.00 | 3.94 | 55.8 | 173 | 0 | 54% |
| 14 | express | 11,343 | 87.58 | 118.00 | 1.96 | 98.3 | 175 | 0 | 25% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 110,741 | 8.48 | 12.00 | 55.13 | 8.9 | 62 | 0 | 633% |
| 2 | uws | 91,046 | 10.41 | 18.00 | 41.85 | 11.1 | 67 | 0 | 520% |
| 3 | hyper-express | 49,082 | 19.83 | 30.00 | 21.76 | 20.7 | 99 | 0 | 280% |
| 4 | 0http | 20,592 | 48.03 | 99.00 | 10.05 | 59.1 | 167 | 0 | 118% |
| 5 | node-http | 17,501 | 56.61 | 89.00 | 8.86 | 57.7 | 113 | 0 | 100% |
| 6 | fastify | 17,288 | 57.30 | 80.00 | 8.46 | 58.5 | 112 | 0 | 99% |
| 7 | h3 | 16,791 | 59.02 | 84.00 | 8.15 | 60.2 | 103 | 0 | 96% |
| 8 | hono | 16,374 | 60.54 | 86.00 | 7.76 | 61.7 | 109 | 0 | 94% |
| 9 | polka | 15,551 | 63.77 | 95.00 | 7.59 | 65.3 | 108 | 0 | 89% |
| 10 | restify | 12,463 | 79.66 | 114.00 | 6.11 | 81.3 | 112 | 0 | 71% |
| 11 | tinyhttp | 12,099 | 82.09 | 117.00 | 6.75 | 100.9 | 175 | 0 | 69% |
| 12 | koa | 10,927 | 90.93 | 123.00 | 5.34 | 92.4 | 135 | 0 | 62% |
| 13 | hapi | 9,403 | 105.72 | 135.00 | 4.81 | 107.5 | 120 | 0 | 54% |
| 14 | express | 6,128 | 162.36 | 195.00 | 2.99 | 178.4 | 173 | 0 | 35% |

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
