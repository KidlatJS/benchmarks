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
Run on 10/25/2026, 08:58:24 (Manila Time, UTC+8) · AMD EPYC 7763 64-Core Processor (4 threads, 16 GB) · Linux 6.17.0-1022-azure (x64) · Node v22.23.3

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 2.4.0 | 104,819 | 102,770 | 110,838 | 106,088 | 320% |
| 2 | uws | 20.71.0 | 108,165 | 109,147 | 91,611 | 102,648 | 310% |
| 3 | hyper-express | 7.0.2 | 107,923 | 102,506 | 47,774 | 80,851 | 244% |
| 4 | 0http | 5.2.0 | 44,398 | 43,135 | 19,905 | 33,655 | 102% |
| 5 | node-http | 22.23.3 | 45,642 | 45,298 | 17,593 | 33,133 | 100% |
| 6 | fastify | 5.12.7 | 45,770 | 44,460 | 17,646 | 32,991 | 100% |
| 7 | h3 | 2.0.2 | 44,182 | 41,282 | 17,406 | 31,664 | 96% |
| 8 | polka | 0.5.2 | 45,345 | 43,029 | 15,958 | 31,460 | 95% |
| 9 | hono | 4.13.13 | 43,285 | 41,978 | 16,464 | 31,043 | 94% |
| 10 | restify | 12.0.0 | 32,473 | 31,899 | 12,243 | 23,320 | 70% |
| 11 | koa | 3.2.1 | 31,547 | 31,350 | 11,345 | 22,387 | 68% |
| 12 | hapi | 21.4.10 | 31,762 | 30,838 | 9,385 | 20,948 | 63% |
| 13 | tinyhttp | 3.0.11 | 23,811 | 23,514 | 11,835 | 18,783 | 57% |
| 14 | express | 5.3.0 | 11,392 | 11,200 | 6,084 | 9,191 | 28% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 108,165 | 8.87 | 13.00 | 16.20 | 8.3 | 58 | 0 | 237% |
| 2 | hyper-express | 107,923 | 8.74 | 16.00 | 14.41 | 9.4 | 71 | 0 | 236% |
| 3 | **kidlat** | 104,819 | 9.12 | 12.00 | 19.69 | 9.3 | 61 | 0 | 230% |
| 4 | fastify | 45,770 | 21.36 | 34.00 | 8.21 | 22.0 | 104 | 0 | 100% |
| 5 | node-http | 45,642 | 21.42 | 35.00 | 8.97 | 22.0 | 101 | 0 | 100% |
| 6 | polka | 45,345 | 21.58 | 35.00 | 8.09 | 22.2 | 99 | 0 | 99% |
| 7 | 0http | 44,398 | 22.03 | 46.00 | 7.92 | 28.8 | 145 | 0 | 97% |
| 8 | h3 | 44,182 | 22.12 | 35.00 | 7.75 | 22.8 | 103 | 0 | 97% |
| 9 | hono | 43,285 | 22.59 | 37.00 | 7.10 | 23.2 | 104 | 0 | 95% |
| 10 | restify | 32,473 | 30.29 | 51.00 | 5.85 | 31.0 | 113 | 0 | 71% |
| 11 | hapi | 31,762 | 30.98 | 54.00 | 7.09 | 31.9 | 118 | 0 | 70% |
| 12 | koa | 31,547 | 31.19 | 53.00 | 5.63 | 31.9 | 116 | 0 | 69% |
| 13 | tinyhttp | 23,811 | 41.49 | 83.00 | 4.02 | 56.9 | 172 | 0 | 52% |
| 14 | express | 11,392 | 87.20 | 115.00 | 2.03 | 99.8 | 157 | 0 | 25% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 109,147 | 8.68 | 13.00 | 15.72 | 8.3 | 58 | 0 | 241% |
| 2 | **kidlat** | 102,770 | 9.25 | 12.00 | 18.72 | 9.2 | 62 | 0 | 227% |
| 3 | hyper-express | 102,506 | 9.28 | 17.00 | 13.10 | 9.9 | 79 | 0 | 226% |
| 4 | node-http | 45,298 | 21.58 | 36.00 | 8.60 | 22.1 | 105 | 0 | 100% |
| 5 | fastify | 44,460 | 22.00 | 35.00 | 7.72 | 22.6 | 109 | 0 | 98% |
| 6 | 0http | 43,135 | 22.68 | 49.00 | 7.45 | 29.6 | 145 | 0 | 95% |
| 7 | polka | 43,029 | 22.72 | 36.00 | 7.43 | 23.3 | 105 | 0 | 95% |
| 8 | hono | 41,978 | 23.33 | 37.00 | 6.65 | 23.9 | 108 | 0 | 93% |
| 9 | h3 | 41,282 | 23.73 | 39.00 | 7.01 | 24.3 | 109 | 0 | 91% |
| 10 | restify | 31,899 | 30.84 | 52.00 | 5.57 | 31.5 | 124 | 0 | 70% |
| 11 | koa | 31,350 | 31.39 | 52.00 | 5.41 | 32.1 | 126 | 0 | 69% |
| 12 | hapi | 30,838 | 31.92 | 56.00 | 6.71 | 32.8 | 136 | 0 | 68% |
| 13 | tinyhttp | 23,514 | 42.02 | 77.00 | 3.83 | 57.4 | 173 | 0 | 52% |
| 14 | express | 11,200 | 88.70 | 117.00 | 1.93 | 100.8 | 156 | 0 | 25% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 110,838 | 8.45 | 15.00 | 55.17 | 8.9 | 62 | 0 | 630% |
| 2 | uws | 91,611 | 10.34 | 17.00 | 42.11 | 11.1 | 67 | 0 | 521% |
| 3 | hyper-express | 47,774 | 20.40 | 31.00 | 21.19 | 21.4 | 99 | 0 | 272% |
| 4 | 0http | 19,905 | 49.70 | 105.00 | 9.72 | 61.5 | 166 | 0 | 113% |
| 5 | fastify | 17,646 | 56.15 | 83.00 | 8.63 | 57.4 | 116 | 0 | 100% |
| 6 | node-http | 17,593 | 56.31 | 92.00 | 8.91 | 57.5 | 107 | 0 | 100% |
| 7 | h3 | 17,406 | 56.92 | 81.00 | 8.45 | 58.1 | 102 | 0 | 99% |
| 8 | hono | 16,464 | 60.20 | 88.00 | 7.80 | 61.5 | 108 | 0 | 94% |
| 9 | polka | 15,958 | 62.13 | 88.00 | 7.79 | 63.5 | 99 | 0 | 91% |
| 10 | restify | 12,243 | 81.10 | 113.00 | 6.00 | 82.8 | 112 | 0 | 70% |
| 11 | tinyhttp | 11,835 | 83.94 | 116.00 | 6.60 | 103.1 | 176 | 0 | 67% |
| 12 | koa | 11,345 | 87.57 | 120.00 | 5.54 | 89.5 | 117 | 0 | 64% |
| 13 | hapi | 9,385 | 105.93 | 139.00 | 4.81 | 107.6 | 136 | 0 | 53% |
| 14 | express | 6,084 | 163.58 | 197.00 | 2.97 | 180.5 | 157 | 0 | 35% |

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
