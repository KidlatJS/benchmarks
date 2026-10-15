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
| **kidlat** | 2.3.0 | Native C++ HTTP layer; focus of this benchmark |
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
Run on 10/16/2026, 06:10:39 (Manila Time, UTC+8) · AMD EPYC 9V74 80-Core Processor (4 threads, 16 GB) · Linux 6.17.0-1022-azure (x64) · Node v22.23.3

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | uws | 20.71.0 | 150,445 | 151,120 | 129,879 | 143,465 | 263% |
| 2 | **kidlat** | 2.3.0 | 144,211 | 150,867 | 122,717 | 138,729 | 254% |
| 3 | hyper-express | 7.0.2 | 151,030 | 142,942 | 73,872 | 116,834 | 214% |
| 4 | node-http | 22.23.3 | 68,796 | 68,957 | 34,170 | 54,525 | 100% |
| 5 | fastify | 5.12.7 | 69,818 | 69,008 | 32,943 | 54,143 | 99% |
| 6 | polka | 0.5.2 | 70,914 | 68,170 | 29,205 | 52,071 | 95% |
| 7 | h3 | 2.0.2 | 68,020 | 65,594 | 30,175 | 51,253 | 94% |
| 8 | hono | 4.13.13 | 68,054 | 66,067 | 29,622 | 51,068 | 94% |
| 9 | 0http | 5.2.0 | 61,169 | 60,095 | 34,919 | 50,444 | 93% |
| 10 | restify | 12.0.0 | 50,753 | 50,258 | 22,536 | 38,594 | 71% |
| 11 | koa | 3.2.1 | 49,185 | 49,706 | 19,921 | 36,519 | 67% |
| 12 | hapi | 21.4.10 | 45,991 | 45,047 | 15,186 | 31,569 | 58% |
| 13 | tinyhttp | 3.0.11 | 36,269 | 36,838 | 20,169 | 29,980 | 55% |
| 14 | express | 5.3.0 | 16,630 | 16,230 | 9,173 | 13,528 | 25% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 151,030 | 6.18 | 11.00 | 20.16 | 6.7 | 78 | 0 | 220% |
| 2 | uws | 150,445 | 6.10 | 8.00 | 22.53 | 6.2 | 58 | 0 | 219% |
| 3 | **kidlat** | 144,211 | 6.35 | 10.00 | 22.55 | 6.5 | 61 | 0 | 210% |
| 4 | polka | 70,914 | 13.64 | 25.00 | 12.65 | 14.2 | 98 | 0 | 103% |
| 5 | fastify | 69,818 | 13.81 | 24.00 | 12.52 | 14.4 | 106 | 0 | 101% |
| 6 | node-http | 68,796 | 14.04 | 25.00 | 13.51 | 14.6 | 100 | 0 | 100% |
| 7 | hono | 68,054 | 14.19 | 24.00 | 11.16 | 14.8 | 106 | 0 | 99% |
| 8 | h3 | 68,020 | 14.19 | 25.00 | 11.94 | 14.8 | 107 | 0 | 99% |
| 9 | 0http | 61,169 | 15.86 | 33.00 | 10.91 | 21.4 | 151 | 0 | 89% |
| 10 | restify | 50,753 | 19.20 | 37.00 | 9.15 | 19.9 | 112 | 0 | 74% |
| 11 | koa | 49,185 | 19.84 | 38.00 | 8.77 | 20.5 | 116 | 0 | 71% |
| 12 | hapi | 45,991 | 21.26 | 39.00 | 10.26 | 22.1 | 120 | 0 | 67% |
| 13 | tinyhttp | 36,269 | 27.07 | 55.00 | 6.12 | 40.6 | 179 | 0 | 53% |
| 14 | express | 16,630 | 59.59 | 81.00 | 2.97 | 70.1 | 162 | 0 | 24% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 151,120 | 6.12 | 10.00 | 21.76 | 6.2 | 60 | 0 | 219% |
| 2 | **kidlat** | 150,867 | 6.20 | 10.00 | 22.73 | 6.4 | 61 | 0 | 219% |
| 3 | hyper-express | 142,942 | 6.32 | 11.00 | 18.27 | 7.1 | 78 | 0 | 207% |
| 4 | fastify | 69,008 | 13.98 | 24.00 | 11.98 | 14.6 | 112 | 0 | 100% |
| 5 | node-http | 68,957 | 14.00 | 24.00 | 13.09 | 14.5 | 105 | 0 | 100% |
| 6 | polka | 68,170 | 14.16 | 26.00 | 11.77 | 14.7 | 104 | 0 | 99% |
| 7 | hono | 66,067 | 14.62 | 26.00 | 10.46 | 15.2 | 111 | 0 | 96% |
| 8 | h3 | 65,594 | 14.73 | 26.00 | 11.13 | 15.3 | 112 | 0 | 95% |
| 9 | 0http | 60,095 | 16.14 | 34.00 | 10.37 | 21.7 | 152 | 0 | 87% |
| 10 | restify | 50,258 | 19.39 | 37.00 | 8.77 | 20.0 | 123 | 0 | 73% |
| 11 | koa | 49,706 | 19.61 | 37.00 | 8.58 | 20.2 | 127 | 0 | 72% |
| 12 | hapi | 45,047 | 21.68 | 39.00 | 9.80 | 22.5 | 135 | 0 | 65% |
| 13 | tinyhttp | 36,838 | 26.65 | 52.00 | 6.01 | 39.5 | 179 | 0 | 53% |
| 14 | express | 16,230 | 61.07 | 83.00 | 2.80 | 70.9 | 171 | 0 | 24% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 129,879 | 7.31 | 12.00 | 59.70 | 7.8 | 67 | 0 | 380% |
| 2 | **kidlat** | 122,717 | 7.60 | 14.00 | 57.23 | 8.5 | 114 | 0 | 359% |
| 3 | hyper-express | 73,872 | 12.98 | 22.00 | 32.76 | 13.9 | 100 | 0 | 216% |
| 4 | 0http | 34,919 | 28.14 | 60.00 | 17.05 | 38.3 | 168 | 0 | 102% |
| 5 | node-http | 34,170 | 28.76 | 59.00 | 17.30 | 29.6 | 113 | 0 | 100% |
| 6 | fastify | 32,943 | 29.85 | 63.00 | 16.12 | 30.8 | 115 | 0 | 96% |
| 7 | h3 | 30,175 | 32.63 | 67.00 | 14.65 | 33.5 | 110 | 0 | 88% |
| 8 | hono | 29,622 | 33.24 | 67.00 | 14.04 | 34.2 | 105 | 0 | 87% |
| 9 | polka | 29,205 | 33.74 | 68.00 | 14.26 | 34.8 | 102 | 0 | 85% |
| 10 | restify | 22,536 | 43.85 | 80.00 | 11.05 | 44.9 | 117 | 0 | 66% |
| 11 | tinyhttp | 20,169 | 49.05 | 77.00 | 11.25 | 66.0 | 183 | 0 | 59% |
| 12 | koa | 19,921 | 49.68 | 82.00 | 9.73 | 51.0 | 126 | 0 | 58% |
| 13 | hapi | 15,186 | 65.32 | 100.00 | 7.78 | 66.5 | 137 | 0 | 44% |
| 14 | express | 9,173 | 108.39 | 141.00 | 4.48 | 121.4 | 171 | 0 | 27% |

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
