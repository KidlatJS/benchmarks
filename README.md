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
Run on 11/20/2026, 05:18:36 (Manila Time, UTC+8) · AMD EPYC 9V45 96-Core Processor (4 threads, 16 GB) · Linux 7.0.0-1020-azure (x64) · Node v22.23.5

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | uws | 20.71.0 | 203,581 | 198,541 | 167,344 | 189,118 | 262% |
| 2 | **kidlat** | 2.6.0 | 183,715 | 188,234 | 188,928 | 186,945 | 259% |
| 3 | hyper-express | 7.0.2 | 189,302 | 178,173 | 101,280 | 150,605 | 209% |
| 4 | node-http | 22.23.5 | 87,109 | 85,426 | 50,558 | 72,191 | 100% |
| 5 | fastify | 5.12.7 | 83,173 | 81,040 | 48,866 | 69,060 | 96% |
| 6 | polka | 0.5.2 | 85,011 | 82,451 | 44,946 | 68,044 | 94% |
| 7 | h3 | 2.0.2 | 82,376 | 81,163 | 47,069 | 68,019 | 94% |
| 8 | hono | 4.13.13 | 82,166 | 80,642 | 45,214 | 66,913 | 93% |
| 9 | 0http | 5.2.0 | 73,536 | 69,334 | 43,827 | 60,683 | 84% |
| 10 | restify | 12.0.0 | 67,772 | 68,865 | 38,725 | 56,539 | 78% |
| 11 | koa | 3.2.1 | 62,158 | 62,814 | 34,866 | 51,442 | 71% |
| 12 | hapi | 21.4.10 | 61,886 | 61,571 | 30,704 | 48,909 | 68% |
| 13 | tinyhttp | 3.0.11 | 48,219 | 48,426 | 31,423 | 41,865 | 58% |
| 14 | express | 5.3.0 | 21,606 | 21,772 | 15,553 | 19,413 | 27% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 203,581 | 4.31 | 6.00 | 30.48 | 4.8 | 58 | 0 | 234% |
| 2 | hyper-express | 189,302 | 4.97 | 7.00 | 25.28 | 5.4 | 79 | 0 | 217% |
| 3 | **kidlat** | 183,715 | 5.03 | 7.00 | 34.52 | 5.1 | 63 | 0 | 211% |
| 4 | node-http | 87,109 | 10.98 | 20.00 | 17.11 | 11.5 | 105 | 0 | 100% |
| 5 | polka | 85,011 | 11.27 | 22.00 | 15.16 | 11.8 | 102 | 0 | 98% |
| 6 | fastify | 83,173 | 11.52 | 21.00 | 14.91 | 12.1 | 106 | 0 | 95% |
| 7 | h3 | 82,376 | 11.65 | 23.00 | 14.46 | 12.2 | 105 | 0 | 95% |
| 8 | hono | 82,166 | 11.67 | 23.00 | 13.48 | 12.3 | 104 | 0 | 94% |
| 9 | 0http | 73,536 | 13.11 | 27.00 | 13.11 | 17.5 | 157 | 0 | 84% |
| 10 | restify | 67,772 | 14.25 | 28.00 | 12.22 | 14.8 | 114 | 0 | 78% |
| 11 | koa | 62,158 | 15.59 | 31.00 | 11.09 | 16.2 | 117 | 0 | 71% |
| 12 | hapi | 61,886 | 15.66 | 31.00 | 13.81 | 16.4 | 125 | 0 | 71% |
| 13 | tinyhttp | 48,219 | 20.25 | 41.00 | 8.14 | 31.9 | 191 | 0 | 55% |
| 14 | express | 21,606 | 45.77 | 82.00 | 3.85 | 54.9 | 195 | 0 | 25% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 198,541 | 4.48 | 6.00 | 28.59 | 4.9 | 59 | 0 | 232% |
| 2 | **kidlat** | 188,234 | 4.96 | 7.00 | 34.28 | 5.1 | 64 | 0 | 220% |
| 3 | hyper-express | 178,173 | 5.12 | 7.00 | 22.77 | 5.8 | 79 | 0 | 209% |
| 4 | node-http | 85,426 | 11.19 | 21.00 | 16.21 | 11.7 | 110 | 0 | 100% |
| 5 | polka | 82,451 | 11.64 | 23.00 | 14.23 | 12.2 | 108 | 0 | 97% |
| 6 | h3 | 81,163 | 11.83 | 23.00 | 13.78 | 12.4 | 111 | 0 | 95% |
| 7 | fastify | 81,040 | 11.84 | 24.00 | 14.07 | 12.4 | 111 | 0 | 95% |
| 8 | hono | 80,642 | 11.90 | 23.00 | 12.77 | 12.5 | 109 | 0 | 94% |
| 9 | 0http | 69,334 | 13.93 | 29.00 | 11.97 | 18.6 | 157 | 0 | 81% |
| 10 | restify | 68,865 | 14.01 | 28.00 | 12.02 | 14.6 | 125 | 0 | 81% |
| 11 | koa | 62,814 | 15.42 | 31.00 | 10.84 | 16.0 | 127 | 0 | 74% |
| 12 | hapi | 61,571 | 15.74 | 31.00 | 13.39 | 16.5 | 136 | 0 | 72% |
| 13 | tinyhttp | 48,426 | 20.16 | 41.00 | 7.90 | 32.0 | 191 | 0 | 57% |
| 14 | express | 21,772 | 45.42 | 83.00 | 3.76 | 54.0 | 195 | 0 | 25% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 188,928 | 4.89 | 7.00 | 94.05 | 5.2 | 67 | 0 | 374% |
| 2 | uws | 167,344 | 5.40 | 8.00 | 76.92 | 6.2 | 68 | 0 | 331% |
| 3 | hyper-express | 101,280 | 9.40 | 13.00 | 44.91 | 10.4 | 101 | 0 | 200% |
| 4 | node-http | 50,558 | 19.28 | 40.00 | 25.60 | 20.2 | 110 | 0 | 100% |
| 5 | fastify | 48,866 | 19.96 | 44.00 | 23.91 | 21.0 | 114 | 0 | 97% |
| 6 | h3 | 47,069 | 20.75 | 46.00 | 22.85 | 21.7 | 113 | 0 | 93% |
| 7 | hono | 45,214 | 21.62 | 49.00 | 21.43 | 22.6 | 122 | 0 | 89% |
| 8 | polka | 44,946 | 21.75 | 49.00 | 21.95 | 23.0 | 105 | 0 | 89% |
| 9 | 0http | 43,827 | 22.32 | 47.00 | 21.40 | 30.3 | 175 | 0 | 87% |
| 10 | restify | 38,725 | 25.32 | 57.00 | 18.98 | 26.2 | 122 | 0 | 77% |
| 11 | koa | 34,866 | 28.17 | 63.00 | 17.02 | 29.4 | 119 | 0 | 69% |
| 12 | tinyhttp | 31,423 | 31.32 | 69.00 | 17.53 | 46.7 | 196 | 0 | 62% |
| 13 | hapi | 30,704 | 32.06 | 67.00 | 15.72 | 33.0 | 139 | 0 | 61% |
| 14 | express | 15,553 | 63.76 | 87.00 | 7.59 | 77.1 | 196 | 0 | 31% |

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
