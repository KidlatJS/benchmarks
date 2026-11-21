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
Run on 11/21/2026, 09:17:45 (Manila Time, UTC+8) · AMD EPYC 9V45 96-Core Processor (4 threads, 16 GB) · Linux 7.0.0-1019-azure (x64) · Node v22.23.4

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | uws | 20.71.0 | 209,619 | 202,355 | 167,814 | 192,364 | 271% |
| 2 | **kidlat** | 2.6.0 | 191,395 | 188,534 | 186,605 | 188,835 | 266% |
| 3 | hyper-express | 7.0.2 | 174,883 | 172,768 | 102,157 | 145,599 | 205% |
| 4 | fastify | 5.12.7 | 84,878 | 84,238 | 49,826 | 70,890 | 100% |
| 5 | node-http | 22.23.4 | 84,736 | 83,592 | 50,258 | 70,873 | 100% |
| 6 | polka | 0.5.2 | 84,987 | 81,418 | 46,627 | 68,586 | 97% |
| 7 | h3 | 2.0.2 | 80,842 | 76,699 | 46,457 | 66,043 | 93% |
| 8 | hono | 4.13.13 | 79,962 | 77,800 | 45,844 | 65,824 | 93% |
| 9 | 0http | 5.2.0 | 71,811 | 67,053 | 40,982 | 58,219 | 82% |
| 10 | restify | 12.0.0 | 68,308 | 68,406 | 37,923 | 56,168 | 79% |
| 11 | hapi | 21.4.10 | 64,021 | 62,143 | 30,741 | 49,638 | 70% |
| 12 | koa | 3.2.1 | 58,136 | 60,196 | 34,150 | 49,257 | 70% |
| 13 | tinyhttp | 3.0.11 | 49,719 | 50,244 | 31,113 | 42,676 | 60% |
| 14 | express | 5.3.0 | 20,912 | 19,569 | 14,520 | 18,113 | 26% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 209,619 | 4.15 | 6.00 | 31.38 | 4.7 | 58 | 0 | 247% |
| 2 | **kidlat** | 191,395 | 4.71 | 7.00 | 35.96 | 5.0 | 63 | 0 | 226% |
| 3 | hyper-express | 174,883 | 5.15 | 7.00 | 23.35 | 5.9 | 71 | 0 | 206% |
| 4 | polka | 84,987 | 11.29 | 21.00 | 15.16 | 11.8 | 102 | 0 | 100% |
| 5 | fastify | 84,878 | 11.29 | 22.00 | 15.22 | 11.8 | 109 | 0 | 100% |
| 6 | node-http | 84,736 | 11.26 | 22.00 | 16.65 | 11.9 | 101 | 0 | 100% |
| 7 | h3 | 80,842 | 11.88 | 24.00 | 14.19 | 12.4 | 107 | 0 | 95% |
| 8 | hono | 79,962 | 11.99 | 24.00 | 13.12 | 12.6 | 105 | 0 | 94% |
| 9 | 0http | 71,811 | 13.43 | 28.00 | 12.81 | 18.2 | 152 | 0 | 85% |
| 10 | restify | 68,308 | 14.13 | 28.00 | 12.31 | 14.7 | 117 | 0 | 81% |
| 11 | hapi | 64,021 | 15.12 | 30.00 | 14.29 | 15.9 | 117 | 0 | 76% |
| 12 | koa | 58,136 | 16.69 | 34.00 | 10.37 | 17.3 | 118 | 0 | 69% |
| 13 | tinyhttp | 49,719 | 19.61 | 41.00 | 8.39 | 30.6 | 196 | 0 | 59% |
| 14 | express | 20,912 | 47.30 | 79.00 | 3.73 | 57.6 | 182 | 0 | 25% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 202,355 | 4.31 | 6.00 | 29.14 | 4.8 | 59 | 0 | 242% |
| 2 | **kidlat** | 188,534 | 4.89 | 8.00 | 34.34 | 5.1 | 64 | 0 | 226% |
| 3 | hyper-express | 172,768 | 5.20 | 8.00 | 22.08 | 5.9 | 78 | 0 | 207% |
| 4 | fastify | 84,238 | 11.37 | 23.00 | 14.62 | 11.9 | 114 | 0 | 101% |
| 5 | node-http | 83,592 | 11.43 | 23.00 | 15.86 | 12.0 | 106 | 0 | 100% |
| 6 | polka | 81,418 | 11.78 | 23.00 | 14.05 | 12.3 | 107 | 0 | 97% |
| 7 | hono | 77,800 | 12.36 | 25.00 | 12.32 | 12.9 | 110 | 0 | 93% |
| 8 | h3 | 76,699 | 12.54 | 26.00 | 13.02 | 13.1 | 110 | 0 | 92% |
| 9 | restify | 68,406 | 14.11 | 28.00 | 11.94 | 14.7 | 128 | 0 | 82% |
| 10 | 0http | 67,053 | 14.42 | 31.00 | 11.57 | 19.5 | 152 | 0 | 80% |
| 11 | hapi | 62,143 | 15.59 | 31.00 | 13.51 | 16.3 | 119 | 0 | 74% |
| 12 | koa | 60,196 | 16.11 | 33.00 | 10.39 | 16.7 | 127 | 0 | 72% |
| 13 | tinyhttp | 50,244 | 19.40 | 39.00 | 8.19 | 30.6 | 197 | 0 | 60% |
| 14 | express | 19,569 | 50.57 | 66.00 | 3.38 | 61.6 | 183 | 0 | 23% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 186,605 | 5.05 | 8.00 | 92.90 | 5.2 | 68 | 0 | 371% |
| 2 | uws | 167,814 | 5.34 | 9.00 | 77.14 | 6.2 | 67 | 0 | 334% |
| 3 | hyper-express | 102,157 | 9.30 | 13.00 | 45.30 | 10.2 | 98 | 0 | 203% |
| 4 | node-http | 50,258 | 19.39 | 44.00 | 25.45 | 20.2 | 112 | 0 | 100% |
| 5 | fastify | 49,826 | 19.58 | 46.00 | 24.38 | 20.3 | 114 | 0 | 99% |
| 6 | polka | 46,627 | 20.95 | 47.00 | 22.77 | 21.9 | 106 | 0 | 93% |
| 7 | h3 | 46,457 | 21.02 | 48.00 | 22.55 | 21.9 | 110 | 0 | 92% |
| 8 | hono | 45,844 | 21.31 | 48.00 | 21.73 | 22.2 | 116 | 0 | 91% |
| 9 | 0http | 40,982 | 23.90 | 51.00 | 20.01 | 33.0 | 168 | 0 | 82% |
| 10 | restify | 37,923 | 25.87 | 60.00 | 18.59 | 26.8 | 122 | 0 | 75% |
| 11 | koa | 34,150 | 28.78 | 65.00 | 16.67 | 30.0 | 123 | 0 | 68% |
| 12 | tinyhttp | 31,113 | 31.65 | 69.00 | 17.36 | 46.7 | 202 | 0 | 62% |
| 13 | hapi | 30,741 | 32.02 | 69.00 | 15.74 | 33.0 | 122 | 0 | 61% |
| 14 | express | 14,520 | 68.34 | 95.00 | 7.09 | 82.6 | 187 | 0 | 29% |

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
