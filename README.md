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
Run on 11/08/2026, 08:20:11 (Manila Time, UTC+8) · INTEL(R) XEON(R) PLATINUM 8573C (4 threads, 16 GB) · Linux 7.0.0-1019-azure (x64) · Node v22.23.4

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 2.6.0 | 151,869 | 154,259 | 180,262 | 161,637 | 243% |
| 2 | uws | 20.71.0 | 162,742 | 174,912 | 139,605 | 158,395 | 239% |
| 3 | hyper-express | 7.0.2 | 185,910 | 172,995 | 83,734 | 139,128 | 210% |
| 4 | fastify | 5.12.7 | 88,645 | 89,126 | 43,262 | 69,918 | 105% |
| 5 | polka | 0.5.2 | 95,822 | 88,946 | 37,678 | 68,479 | 103% |
| 6 | 0http | 5.2.0 | 84,203 | 81,467 | 46,184 | 68,171 | 103% |
| 7 | node-http | 22.23.4 | 82,734 | 82,427 | 42,910 | 66,391 | 100% |
| 8 | hono | 4.13.13 | 83,170 | 83,269 | 39,866 | 65,115 | 98% |
| 9 | h3 | 2.0.2 | 81,080 | 76,445 | 39,312 | 62,459 | 94% |
| 10 | restify | 12.0.0 | 60,350 | 59,086 | 28,334 | 46,575 | 70% |
| 11 | koa | 3.2.1 | 60,218 | 58,574 | 27,000 | 45,666 | 69% |
| 12 | hapi | 21.4.10 | 56,534 | 54,859 | 22,984 | 41,463 | 62% |
| 13 | tinyhttp | 3.0.11 | 47,009 | 47,492 | 28,365 | 39,859 | 60% |
| 14 | express | 5.3.0 | 18,239 | 17,722 | 11,038 | 15,281 | 23% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 185,910 | 4.93 | 8.00 | 24.82 | 5.6 | 79 | 0 | 225% |
| 2 | uws | 162,742 | 5.64 | 9.00 | 24.37 | 5.4 | 58 | 0 | 197% |
| 3 | **kidlat** | 151,869 | 6.15 | 10.00 | 28.53 | 5.5 | 63 | 0 | 184% |
| 4 | polka | 95,822 | 9.89 | 18.00 | 17.09 | 10.5 | 98 | 0 | 116% |
| 5 | fastify | 88,645 | 10.78 | 20.00 | 15.89 | 11.4 | 107 | 0 | 107% |
| 6 | 0http | 84,203 | 11.39 | 24.00 | 15.02 | 16.3 | 145 | 0 | 102% |
| 7 | hono | 83,170 | 11.52 | 21.00 | 13.64 | 12.1 | 106 | 0 | 101% |
| 8 | node-http | 82,734 | 11.61 | 20.00 | 16.25 | 12.2 | 102 | 0 | 100% |
| 9 | h3 | 81,080 | 11.83 | 21.00 | 14.23 | 12.4 | 104 | 0 | 98% |
| 10 | restify | 60,350 | 16.07 | 33.00 | 10.88 | 16.7 | 112 | 0 | 73% |
| 11 | koa | 60,218 | 16.11 | 32.00 | 10.74 | 16.8 | 117 | 0 | 73% |
| 12 | hapi | 56,534 | 17.19 | 33.00 | 12.62 | 18.0 | 129 | 0 | 68% |
| 13 | tinyhttp | 47,009 | 20.76 | 40.00 | 7.93 | 33.6 | 190 | 0 | 57% |
| 14 | express | 18,239 | 54.30 | 73.00 | 3.25 | 64.1 | 163 | 0 | 22% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 174,912 | 5.18 | 8.00 | 25.19 | 5.2 | 60 | 0 | 212% |
| 2 | hyper-express | 172,995 | 5.31 | 8.00 | 22.11 | 6.0 | 79 | 0 | 210% |
| 3 | **kidlat** | 154,259 | 6.03 | 10.00 | 28.10 | 5.5 | 64 | 0 | 187% |
| 4 | fastify | 89,126 | 10.73 | 20.00 | 15.47 | 11.3 | 112 | 0 | 108% |
| 5 | polka | 88,946 | 10.79 | 20.00 | 15.35 | 11.3 | 104 | 0 | 108% |
| 6 | hono | 83,269 | 11.51 | 22.00 | 13.18 | 12.1 | 110 | 0 | 101% |
| 7 | node-http | 82,427 | 11.64 | 21.00 | 15.64 | 12.2 | 107 | 0 | 100% |
| 8 | 0http | 81,467 | 11.78 | 25.00 | 14.06 | 16.7 | 144 | 0 | 99% |
| 9 | h3 | 76,445 | 12.60 | 24.00 | 12.98 | 13.1 | 110 | 0 | 93% |
| 10 | restify | 59,086 | 16.43 | 33.00 | 10.31 | 17.1 | 123 | 0 | 72% |
| 11 | koa | 58,574 | 16.58 | 33.00 | 10.11 | 17.2 | 126 | 0 | 71% |
| 12 | hapi | 54,859 | 17.74 | 34.00 | 11.93 | 18.5 | 138 | 0 | 67% |
| 13 | tinyhttp | 47,492 | 20.56 | 40.00 | 7.75 | 33.5 | 190 | 0 | 58% |
| 14 | express | 17,722 | 55.90 | 75.00 | 3.06 | 65.3 | 163 | 0 | 22% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 180,262 | 5.16 | 9.00 | 89.74 | 5.4 | 68 | 0 | 420% |
| 2 | uws | 139,605 | 6.67 | 11.00 | 64.18 | 7.5 | 68 | 0 | 325% |
| 3 | hyper-express | 83,734 | 11.47 | 17.00 | 37.13 | 12.5 | 100 | 0 | 195% |
| 4 | 0http | 46,184 | 21.16 | 46.00 | 22.55 | 29.8 | 175 | 0 | 108% |
| 5 | fastify | 43,262 | 22.61 | 51.00 | 21.17 | 23.6 | 114 | 0 | 101% |
| 6 | node-http | 42,910 | 22.81 | 49.00 | 21.73 | 23.7 | 116 | 0 | 100% |
| 7 | hono | 39,866 | 24.58 | 55.00 | 18.89 | 25.6 | 108 | 0 | 93% |
| 8 | h3 | 39,312 | 24.94 | 56.00 | 19.08 | 26.0 | 112 | 0 | 92% |
| 9 | polka | 37,678 | 26.04 | 58.00 | 18.40 | 27.3 | 105 | 0 | 88% |
| 10 | tinyhttp | 28,365 | 34.76 | 73.00 | 15.82 | 50.6 | 195 | 0 | 66% |
| 11 | restify | 28,334 | 34.79 | 71.00 | 13.89 | 36.1 | 123 | 0 | 66% |
| 12 | koa | 27,000 | 36.53 | 72.00 | 13.18 | 38.0 | 115 | 0 | 63% |
| 13 | hapi | 22,984 | 42.99 | 76.00 | 11.77 | 44.3 | 139 | 0 | 54% |
| 14 | express | 11,038 | 90.03 | 126.00 | 5.39 | 104.2 | 179 | 0 | 26% |

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
