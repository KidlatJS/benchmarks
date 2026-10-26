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
Run on 10/26/2026, 08:01:52 (Manila Time, UTC+8) · AMD EPYC 9V74 80-Core Processor (4 threads, 16 GB) · Linux 6.17.0-1022-azure (x64) · Node v22.23.3

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | uws | 20.71.0 | 142,217 | 143,805 | 133,954 | 139,924 | 255% |
| 2 | **kidlat** | 2.4.0 | 138,644 | 136,946 | 140,410 | 138,659 | 252% |
| 3 | hyper-express | 7.0.2 | 151,031 | 145,601 | 74,554 | 117,914 | 215% |
| 4 | node-http | 22.23.3 | 69,112 | 69,102 | 34,735 | 54,946 | 100% |
| 5 | fastify | 5.12.7 | 70,566 | 68,848 | 33,070 | 54,363 | 99% |
| 6 | polka | 0.5.2 | 71,475 | 68,189 | 28,897 | 52,028 | 95% |
| 7 | hono | 4.13.13 | 67,415 | 66,424 | 29,970 | 51,198 | 93% |
| 8 | h3 | 2.0.2 | 66,906 | 65,896 | 30,390 | 51,170 | 93% |
| 9 | 0http | 5.2.0 | 59,842 | 62,855 | 35,258 | 50,996 | 93% |
| 10 | restify | 12.0.0 | 52,184 | 51,410 | 23,065 | 39,553 | 72% |
| 11 | koa | 3.2.1 | 51,438 | 50,092 | 20,408 | 37,464 | 68% |
| 12 | hapi | 21.4.10 | 46,506 | 44,403 | 15,387 | 31,673 | 58% |
| 13 | tinyhttp | 3.0.11 | 37,858 | 37,752 | 20,778 | 30,967 | 56% |
| 14 | express | 5.3.0 | 16,206 | 16,315 | 9,077 | 13,389 | 24% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 151,031 | 6.18 | 11.00 | 20.16 | 6.7 | 71 | 0 | 219% |
| 2 | uws | 142,217 | 6.39 | 10.00 | 21.29 | 6.6 | 58 | 0 | 206% |
| 3 | **kidlat** | 138,644 | 6.59 | 10.00 | 26.05 | 7.1 | 61 | 0 | 201% |
| 4 | polka | 71,475 | 13.52 | 23.00 | 12.75 | 14.1 | 96 | 0 | 103% |
| 5 | fastify | 70,566 | 13.66 | 24.00 | 12.65 | 14.2 | 106 | 0 | 102% |
| 6 | node-http | 69,112 | 14.00 | 23.00 | 13.58 | 14.5 | 104 | 0 | 100% |
| 7 | hono | 67,415 | 14.33 | 25.00 | 11.06 | 14.9 | 107 | 0 | 98% |
| 8 | h3 | 66,906 | 14.44 | 27.00 | 11.74 | 15.0 | 106 | 0 | 97% |
| 9 | 0http | 59,842 | 16.22 | 34.00 | 10.67 | 22.1 | 146 | 0 | 87% |
| 10 | restify | 52,184 | 18.69 | 35.00 | 9.41 | 19.3 | 117 | 0 | 76% |
| 11 | koa | 51,438 | 18.93 | 35.00 | 9.17 | 19.6 | 116 | 0 | 74% |
| 12 | hapi | 46,506 | 21.01 | 39.00 | 10.38 | 21.8 | 118 | 0 | 67% |
| 13 | tinyhttp | 37,858 | 25.92 | 52.00 | 6.39 | 38.9 | 187 | 0 | 55% |
| 14 | express | 16,206 | 61.17 | 85.00 | 2.89 | 72.4 | 163 | 0 | 23% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 145,601 | 6.22 | 11.00 | 18.61 | 7.0 | 79 | 0 | 211% |
| 2 | uws | 143,805 | 6.32 | 10.00 | 20.71 | 6.5 | 59 | 0 | 208% |
| 3 | **kidlat** | 136,946 | 7.08 | 10.00 | 24.94 | 7.2 | 61 | 0 | 198% |
| 4 | node-http | 69,102 | 13.99 | 25.00 | 13.11 | 14.5 | 109 | 0 | 100% |
| 5 | fastify | 68,848 | 14.02 | 26.00 | 11.95 | 14.6 | 112 | 0 | 100% |
| 6 | polka | 68,189 | 14.16 | 26.00 | 11.77 | 14.7 | 102 | 0 | 99% |
| 7 | hono | 66,424 | 14.54 | 25.00 | 10.52 | 15.1 | 111 | 0 | 96% |
| 8 | h3 | 65,896 | 14.65 | 26.00 | 11.19 | 15.2 | 111 | 0 | 95% |
| 9 | 0http | 62,855 | 15.42 | 32.00 | 10.85 | 20.7 | 146 | 0 | 91% |
| 10 | restify | 51,410 | 18.97 | 35.00 | 8.97 | 19.6 | 128 | 0 | 74% |
| 11 | koa | 50,092 | 19.44 | 37.00 | 8.65 | 20.1 | 125 | 0 | 72% |
| 12 | hapi | 44,403 | 22.04 | 39.00 | 9.66 | 22.9 | 137 | 0 | 64% |
| 13 | tinyhttp | 37,752 | 25.99 | 51.00 | 6.16 | 38.6 | 187 | 0 | 55% |
| 14 | express | 16,315 | 60.76 | 83.00 | 2.82 | 71.8 | 171 | 0 | 24% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 140,410 | 6.68 | 8.00 | 69.89 | 7.0 | 62 | 0 | 404% |
| 2 | uws | 133,954 | 7.13 | 12.00 | 61.57 | 7.6 | 67 | 0 | 386% |
| 3 | hyper-express | 74,554 | 12.85 | 22.00 | 33.06 | 13.8 | 100 | 0 | 215% |
| 4 | 0http | 35,258 | 27.85 | 59.00 | 17.22 | 37.8 | 168 | 0 | 102% |
| 5 | node-http | 34,735 | 28.28 | 59.00 | 17.59 | 29.2 | 108 | 0 | 100% |
| 6 | fastify | 33,070 | 29.73 | 62.00 | 16.18 | 30.6 | 113 | 0 | 95% |
| 7 | h3 | 30,390 | 32.40 | 67.00 | 14.75 | 33.3 | 113 | 0 | 87% |
| 8 | hono | 29,970 | 32.86 | 66.00 | 14.20 | 33.9 | 115 | 0 | 86% |
| 9 | polka | 28,897 | 34.10 | 69.00 | 14.11 | 35.1 | 114 | 0 | 83% |
| 10 | restify | 23,065 | 42.84 | 79.00 | 11.31 | 44.0 | 123 | 0 | 66% |
| 11 | tinyhttp | 20,778 | 47.62 | 75.00 | 11.59 | 64.1 | 191 | 0 | 60% |
| 12 | koa | 20,408 | 48.45 | 82.00 | 9.96 | 49.8 | 115 | 0 | 59% |
| 13 | hapi | 15,387 | 64.42 | 99.00 | 7.88 | 65.8 | 139 | 0 | 44% |
| 14 | express | 9,077 | 109.55 | 145.00 | 4.43 | 125.9 | 174 | 0 | 26% |

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
