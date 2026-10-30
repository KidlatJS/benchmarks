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
Run on 10/30/2026, 21:58:45 (Manila Time, UTC+8) · AMD EPYC 9V45 96-Core Processor (4 threads, 16 GB) · Linux 7.0.0-1017-azure (x64) · Node v22.23.4

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | uws | 20.71.0 | 188,982 | 188,512 | 164,128 | 180,156 | 275% |
| 2 | **kidlat** | 2.4.0 | 170,672 | 161,584 | 161,654 | 164,582 | 251% |
| 3 | hyper-express | 7.0.2 | 173,677 | 158,320 | 88,824 | 134,670 | 205% |
| 4 | node-http | 22.23.4 | 78,200 | 76,621 | 47,114 | 65,599 | 100% |
| 5 | hono | 4.13.13 | 77,160 | 76,627 | 43,574 | 63,631 | 97% |
| 6 | fastify | 5.12.7 | 75,043 | 73,235 | 46,150 | 63,300 | 96% |
| 7 | polka | 0.5.2 | 74,404 | 72,262 | 41,559 | 60,682 | 93% |
| 8 | h3 | 2.0.2 | 71,478 | 69,259 | 43,866 | 60,107 | 92% |
| 9 | restify | 12.0.0 | 62,215 | 61,512 | 34,660 | 50,999 | 78% |
| 10 | 0http | 5.2.0 | 57,477 | 59,346 | 37,749 | 50,497 | 77% |
| 11 | koa | 3.2.1 | 58,702 | 57,537 | 32,656 | 47,957 | 73% |
| 12 | hapi | 21.4.10 | 59,015 | 60,053 | 30,013 | 47,381 | 72% |
| 13 | tinyhttp | 3.0.11 | 45,129 | 43,942 | 29,355 | 38,756 | 59% |
| 14 | express | 5.3.0 | 20,546 | 20,614 | 14,597 | 18,353 | 28% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 188,982 | 4.82 | 8.00 | 28.30 | 5.1 | 58 | 0 | 242% |
| 2 | hyper-express | 173,677 | 5.23 | 8.00 | 23.19 | 5.9 | 79 | 0 | 222% |
| 3 | **kidlat** | 170,672 | 5.32 | 8.00 | 32.07 | 5.4 | 62 | 0 | 218% |
| 4 | node-http | 78,200 | 12.29 | 22.00 | 15.36 | 12.9 | 100 | 0 | 100% |
| 5 | hono | 77,160 | 12.47 | 25.00 | 12.66 | 13.1 | 102 | 0 | 99% |
| 6 | fastify | 75,043 | 12.82 | 25.00 | 13.45 | 13.4 | 109 | 0 | 96% |
| 7 | polka | 74,404 | 12.94 | 26.00 | 13.27 | 13.5 | 96 | 0 | 95% |
| 8 | h3 | 71,478 | 13.50 | 28.00 | 12.54 | 14.1 | 107 | 0 | 91% |
| 9 | restify | 62,215 | 15.58 | 31.00 | 11.21 | 16.2 | 113 | 0 | 80% |
| 10 | hapi | 59,015 | 16.45 | 32.00 | 13.17 | 17.3 | 126 | 0 | 75% |
| 11 | koa | 58,702 | 16.55 | 32.00 | 10.47 | 17.2 | 113 | 0 | 75% |
| 12 | 0http | 57,477 | 16.90 | 35.00 | 10.25 | 22.9 | 150 | 0 | 73% |
| 13 | tinyhttp | 45,129 | 21.66 | 44.00 | 7.62 | 34.3 | 190 | 0 | 58% |
| 14 | express | 20,546 | 48.16 | 80.00 | 3.66 | 58.9 | 184 | 0 | 26% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 188,512 | 4.87 | 8.00 | 27.15 | 5.1 | 60 | 0 | 246% |
| 2 | **kidlat** | 161,584 | 5.70 | 8.00 | 29.43 | 5.8 | 61 | 0 | 211% |
| 3 | hyper-express | 158,320 | 5.84 | 9.00 | 20.23 | 6.6 | 79 | 0 | 207% |
| 4 | hono | 76,627 | 12.57 | 26.00 | 12.13 | 13.1 | 106 | 0 | 100% |
| 5 | node-http | 76,621 | 12.56 | 22.00 | 14.54 | 13.1 | 105 | 0 | 100% |
| 6 | fastify | 73,235 | 13.15 | 26.00 | 12.71 | 13.7 | 114 | 0 | 96% |
| 7 | polka | 72,262 | 13.33 | 26.00 | 12.47 | 13.9 | 102 | 0 | 94% |
| 8 | h3 | 69,259 | 13.95 | 28.00 | 11.76 | 14.5 | 111 | 0 | 90% |
| 9 | restify | 61,512 | 15.76 | 31.00 | 10.73 | 16.4 | 124 | 0 | 80% |
| 10 | hapi | 60,053 | 16.15 | 32.00 | 13.06 | 16.9 | 131 | 0 | 78% |
| 11 | 0http | 59,346 | 16.35 | 34.00 | 10.24 | 22.1 | 152 | 0 | 77% |
| 12 | koa | 57,537 | 16.88 | 34.00 | 9.93 | 17.5 | 121 | 0 | 75% |
| 13 | tinyhttp | 43,942 | 22.25 | 46.00 | 7.17 | 36.0 | 190 | 0 | 57% |
| 14 | express | 20,614 | 47.98 | 80.00 | 3.56 | 58.4 | 184 | 0 | 27% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 164,128 | 5.58 | 9.00 | 75.45 | 6.3 | 67 | 0 | 348% |
| 2 | **kidlat** | 161,654 | 5.71 | 8.00 | 80.46 | 6.0 | 62 | 0 | 343% |
| 3 | hyper-express | 88,824 | 10.76 | 15.00 | 39.39 | 12.3 | 102 | 0 | 189% |
| 4 | node-http | 47,114 | 20.72 | 45.00 | 23.86 | 21.7 | 115 | 0 | 100% |
| 5 | fastify | 46,150 | 21.16 | 44.00 | 22.58 | 22.3 | 115 | 0 | 98% |
| 6 | h3 | 43,866 | 22.29 | 48.00 | 21.29 | 23.4 | 111 | 0 | 93% |
| 7 | hono | 43,574 | 22.46 | 52.00 | 20.65 | 23.4 | 114 | 0 | 92% |
| 8 | polka | 41,559 | 23.57 | 53.00 | 20.29 | 24.9 | 112 | 0 | 88% |
| 9 | 0http | 37,749 | 25.99 | 55.00 | 18.43 | 36.0 | 180 | 0 | 80% |
| 10 | restify | 34,660 | 28.34 | 63.00 | 16.99 | 29.5 | 116 | 0 | 74% |
| 11 | koa | 32,656 | 30.12 | 68.00 | 15.95 | 31.6 | 113 | 0 | 69% |
| 12 | hapi | 30,013 | 32.81 | 70.00 | 15.37 | 33.9 | 132 | 0 | 64% |
| 13 | tinyhttp | 29,355 | 33.56 | 71.00 | 16.38 | 51.0 | 194 | 0 | 62% |
| 14 | express | 14,597 | 67.94 | 93.00 | 7.13 | 83.1 | 187 | 0 | 31% |

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
