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
Run on 11/18/2026, 20:53:21 (Manila Time, UTC+8) · AMD EPYC 9V74 80-Core Processor (4 threads, 16 GB) · Linux 7.0.0-1019-azure (x64) · Node v22.23.4

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | uws | 20.71.0 | 154,886 | 159,408 | 137,149 | 150,166 | 276% |
| 2 | **kidlat** | 2.6.0 | 142,400 | 140,839 | 153,786 | 145,563 | 268% |
| 3 | hyper-express | 7.0.2 | 150,062 | 145,589 | 76,201 | 118,519 | 218% |
| 4 | node-http | 22.23.4 | 68,654 | 68,687 | 34,149 | 54,405 | 100% |
| 5 | fastify | 5.12.7 | 68,406 | 68,752 | 32,872 | 53,670 | 99% |
| 6 | 0http | 5.2.0 | 66,228 | 63,000 | 35,276 | 52,798 | 97% |
| 7 | h3 | 2.0.2 | 68,881 | 64,224 | 32,096 | 52,169 | 96% |
| 8 | polka | 0.5.2 | 71,014 | 67,258 | 29,717 | 52,164 | 96% |
| 9 | hono | 4.13.13 | 68,220 | 65,683 | 29,749 | 51,083 | 94% |
| 10 | restify | 12.0.0 | 52,293 | 51,268 | 23,288 | 39,671 | 73% |
| 11 | koa | 3.2.1 | 51,109 | 50,083 | 20,354 | 37,349 | 69% |
| 12 | hapi | 21.4.10 | 47,351 | 46,133 | 15,651 | 32,456 | 60% |
| 13 | tinyhttp | 3.0.11 | 37,486 | 37,618 | 20,316 | 30,599 | 56% |
| 14 | express | 5.3.0 | 16,365 | 15,906 | 9,087 | 13,324 | 24% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 154,886 | 6.11 | 10.00 | 23.19 | 6.2 | 58 | 0 | 226% |
| 2 | hyper-express | 150,062 | 6.25 | 11.00 | 20.04 | 6.8 | 71 | 0 | 219% |
| 3 | **kidlat** | 142,400 | 6.38 | 10.00 | 26.75 | 6.8 | 63 | 0 | 207% |
| 4 | polka | 71,014 | 13.59 | 27.00 | 12.66 | 14.2 | 99 | 0 | 103% |
| 5 | h3 | 68,881 | 14.01 | 27.00 | 12.09 | 14.6 | 108 | 0 | 100% |
| 6 | node-http | 68,654 | 14.10 | 28.00 | 13.49 | 14.6 | 105 | 0 | 100% |
| 7 | fastify | 68,406 | 14.17 | 29.00 | 12.26 | 14.7 | 105 | 0 | 100% |
| 8 | hono | 68,220 | 14.16 | 26.00 | 11.19 | 14.8 | 102 | 0 | 99% |
| 9 | 0http | 66,228 | 14.60 | 31.00 | 11.81 | 19.5 | 145 | 0 | 96% |
| 10 | restify | 52,293 | 18.59 | 39.00 | 9.43 | 19.2 | 113 | 0 | 76% |
| 11 | koa | 51,109 | 19.10 | 41.00 | 9.11 | 19.7 | 115 | 0 | 74% |
| 12 | hapi | 47,351 | 20.63 | 44.00 | 10.57 | 21.4 | 125 | 0 | 69% |
| 13 | tinyhttp | 37,486 | 26.17 | 56.00 | 6.33 | 38.4 | 183 | 0 | 55% |
| 14 | express | 16,365 | 60.56 | 82.00 | 2.92 | 69.8 | 174 | 0 | 24% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 159,408 | 5.89 | 10.00 | 22.96 | 6.1 | 60 | 0 | 232% |
| 2 | hyper-express | 145,589 | 6.24 | 11.00 | 18.61 | 7.0 | 79 | 0 | 212% |
| 3 | **kidlat** | 140,839 | 6.46 | 10.00 | 25.65 | 6.8 | 64 | 0 | 205% |
| 4 | fastify | 68,752 | 14.10 | 25.00 | 11.93 | 14.6 | 110 | 0 | 100% |
| 5 | node-http | 68,687 | 14.12 | 27.00 | 13.04 | 14.6 | 110 | 0 | 100% |
| 6 | polka | 67,258 | 14.41 | 30.00 | 11.61 | 14.9 | 105 | 0 | 98% |
| 7 | hono | 65,683 | 14.75 | 29.00 | 10.40 | 15.3 | 107 | 0 | 96% |
| 8 | h3 | 64,224 | 15.06 | 32.00 | 10.90 | 15.6 | 112 | 0 | 94% |
| 9 | 0http | 63,000 | 15.38 | 33.00 | 10.88 | 20.5 | 153 | 0 | 92% |
| 10 | restify | 51,268 | 19.01 | 40.00 | 8.95 | 19.6 | 124 | 0 | 75% |
| 11 | koa | 50,083 | 19.45 | 40.00 | 8.64 | 20.1 | 124 | 0 | 73% |
| 12 | hapi | 46,133 | 21.18 | 42.00 | 10.03 | 21.9 | 145 | 0 | 67% |
| 13 | tinyhttp | 37,618 | 26.07 | 53.00 | 6.13 | 38.2 | 182 | 0 | 55% |
| 14 | express | 15,906 | 62.32 | 84.00 | 2.75 | 71.3 | 174 | 0 | 23% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 153,786 | 6.13 | 10.00 | 76.56 | 6.4 | 69 | 0 | 450% |
| 2 | uws | 137,149 | 6.92 | 12.00 | 63.04 | 7.5 | 67 | 0 | 402% |
| 3 | hyper-express | 76,201 | 12.68 | 21.00 | 33.79 | 13.4 | 100 | 0 | 223% |
| 4 | 0http | 35,276 | 27.83 | 61.00 | 17.22 | 36.9 | 168 | 0 | 103% |
| 5 | node-http | 34,149 | 28.77 | 60.00 | 17.29 | 29.7 | 114 | 0 | 100% |
| 6 | fastify | 32,872 | 29.91 | 62.00 | 16.08 | 30.8 | 116 | 0 | 96% |
| 7 | h3 | 32,096 | 30.66 | 64.00 | 15.58 | 31.5 | 106 | 0 | 94% |
| 8 | hono | 29,749 | 33.12 | 69.00 | 14.10 | 34.1 | 115 | 0 | 87% |
| 9 | polka | 29,717 | 33.14 | 69.00 | 14.51 | 34.3 | 108 | 0 | 87% |
| 10 | restify | 23,288 | 42.42 | 76.00 | 11.42 | 43.5 | 113 | 0 | 68% |
| 11 | koa | 20,354 | 48.60 | 83.00 | 9.94 | 49.8 | 114 | 0 | 60% |
| 12 | tinyhttp | 20,316 | 48.72 | 87.00 | 11.33 | 64.8 | 187 | 0 | 59% |
| 13 | hapi | 15,651 | 63.35 | 98.00 | 8.01 | 64.6 | 145 | 0 | 46% |
| 14 | express | 9,087 | 109.43 | 145.00 | 4.44 | 122.9 | 175 | 0 | 27% |

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
