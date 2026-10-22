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
Run on 10/22/2026, 17:58:34 (Manila Time, UTC+8) · AMD EPYC 9V74 80-Core Processor (4 threads, 16 GB) · Linux 7.0.0-1017-azure (x64) · Node v22.23.3

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | uws | 20.71.0 | 139,629 | 142,070 | 133,983 | 138,519 | 263% |
| 2 | **kidlat** | 2.4.0 | 136,310 | 133,933 | 139,399 | 136,529 | 259% |
| 3 | hyper-express | 7.0.2 | 148,797 | 138,814 | 71,678 | 113,973 | 216% |
| 4 | 0http | 5.2.0 | 70,624 | 68,422 | 35,190 | 55,402 | 105% |
| 5 | node-http | 22.23.3 | 65,913 | 66,544 | 33,444 | 52,739 | 100% |
| 6 | fastify | 5.12.7 | 66,163 | 64,928 | 32,247 | 51,742 | 98% |
| 7 | polka | 0.5.2 | 69,536 | 65,372 | 27,864 | 50,220 | 95% |
| 8 | hono | 4.13.13 | 65,259 | 63,237 | 30,144 | 49,919 | 95% |
| 9 | h3 | 2.0.2 | 65,397 | 61,289 | 30,271 | 49,506 | 94% |
| 10 | restify | 12.0.0 | 49,498 | 48,130 | 21,466 | 37,118 | 70% |
| 11 | koa | 3.2.1 | 48,335 | 47,538 | 19,685 | 35,630 | 68% |
| 12 | hapi | 21.4.10 | 45,155 | 43,906 | 15,073 | 31,032 | 59% |
| 13 | tinyhttp | 3.0.11 | 34,580 | 35,005 | 20,476 | 29,157 | 55% |
| 14 | express | 5.3.0 | 15,763 | 15,443 | 8,716 | 12,850 | 24% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 148,797 | 6.19 | 10.00 | 19.86 | 6.8 | 70 | 0 | 226% |
| 2 | uws | 139,629 | 6.60 | 10.00 | 20.91 | 6.7 | 58 | 0 | 212% |
| 3 | **kidlat** | 136,310 | 6.96 | 11.00 | 25.61 | 7.1 | 62 | 0 | 207% |
| 4 | 0http | 70,624 | 13.66 | 25.00 | 12.60 | 14.5 | 105 | 0 | 107% |
| 5 | polka | 69,536 | 13.89 | 25.00 | 12.40 | 14.5 | 101 | 0 | 105% |
| 6 | fastify | 66,163 | 14.62 | 29.00 | 11.86 | 15.2 | 107 | 0 | 100% |
| 7 | node-http | 65,913 | 14.66 | 27.00 | 12.95 | 15.3 | 101 | 0 | 100% |
| 8 | h3 | 65,397 | 14.78 | 27.00 | 11.48 | 15.4 | 107 | 0 | 99% |
| 9 | hono | 65,259 | 14.82 | 29.00 | 10.70 | 15.4 | 101 | 0 | 99% |
| 10 | restify | 49,498 | 19.69 | 40.00 | 8.92 | 20.4 | 114 | 0 | 75% |
| 11 | koa | 48,335 | 20.19 | 41.00 | 8.62 | 20.9 | 121 | 0 | 73% |
| 12 | hapi | 45,155 | 21.64 | 43.00 | 10.08 | 22.6 | 120 | 0 | 69% |
| 13 | tinyhttp | 34,580 | 28.40 | 60.00 | 5.84 | 43.6 | 184 | 0 | 52% |
| 14 | express | 15,763 | 62.90 | 88.00 | 2.81 | 75.7 | 182 | 0 | 24% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 142,070 | 6.49 | 10.00 | 20.46 | 6.6 | 60 | 0 | 213% |
| 2 | hyper-express | 138,814 | 6.68 | 11.00 | 17.74 | 7.4 | 78 | 0 | 209% |
| 3 | **kidlat** | 133,933 | 7.16 | 11.00 | 24.39 | 7.3 | 62 | 0 | 201% |
| 4 | 0http | 68,422 | 14.11 | 26.00 | 11.81 | 14.9 | 109 | 0 | 103% |
| 5 | node-http | 66,544 | 14.51 | 27.00 | 12.63 | 15.1 | 106 | 0 | 100% |
| 6 | polka | 65,372 | 14.79 | 28.00 | 11.28 | 15.4 | 107 | 0 | 98% |
| 7 | fastify | 64,928 | 14.90 | 29.00 | 11.27 | 15.5 | 112 | 0 | 98% |
| 8 | hono | 63,237 | 15.31 | 31.00 | 10.01 | 15.9 | 106 | 0 | 95% |
| 9 | h3 | 61,289 | 15.83 | 31.00 | 10.40 | 16.4 | 112 | 0 | 92% |
| 10 | restify | 48,130 | 20.28 | 43.00 | 8.40 | 20.9 | 125 | 0 | 72% |
| 11 | koa | 47,538 | 20.54 | 42.00 | 8.21 | 21.2 | 130 | 0 | 71% |
| 12 | hapi | 43,906 | 22.27 | 45.00 | 9.55 | 23.1 | 151 | 0 | 66% |
| 13 | tinyhttp | 35,005 | 28.07 | 57.00 | 5.71 | 43.9 | 185 | 0 | 53% |
| 14 | express | 15,443 | 64.21 | 89.00 | 2.67 | 76.4 | 182 | 0 | 23% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 139,399 | 6.60 | 11.00 | 69.39 | 7.0 | 63 | 0 | 417% |
| 2 | uws | 133,983 | 7.08 | 12.00 | 61.59 | 7.6 | 67 | 0 | 401% |
| 3 | hyper-express | 71,678 | 13.44 | 22.00 | 31.79 | 14.6 | 99 | 0 | 214% |
| 4 | 0http | 35,190 | 27.91 | 60.00 | 17.18 | 29.7 | 112 | 0 | 105% |
| 5 | node-http | 33,444 | 29.40 | 60.00 | 16.94 | 30.4 | 114 | 0 | 100% |
| 6 | fastify | 32,247 | 30.50 | 64.00 | 15.78 | 31.6 | 112 | 0 | 96% |
| 7 | h3 | 30,271 | 32.53 | 66.00 | 14.69 | 33.6 | 113 | 0 | 91% |
| 8 | hono | 30,144 | 32.66 | 67.00 | 14.29 | 33.8 | 113 | 0 | 90% |
| 9 | polka | 27,864 | 35.38 | 73.00 | 13.61 | 36.7 | 107 | 0 | 83% |
| 10 | restify | 21,466 | 46.07 | 80.00 | 10.52 | 47.5 | 123 | 0 | 64% |
| 11 | tinyhttp | 20,476 | 48.30 | 82.00 | 11.42 | 67.1 | 188 | 0 | 61% |
| 12 | koa | 19,685 | 50.27 | 86.00 | 9.61 | 51.8 | 115 | 0 | 59% |
| 13 | hapi | 15,073 | 65.79 | 99.00 | 7.72 | 67.1 | 153 | 0 | 45% |
| 14 | express | 8,716 | 114.10 | 153.00 | 4.26 | 133.7 | 182 | 0 | 26% |

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
