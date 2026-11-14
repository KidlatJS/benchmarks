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
Run on 11/14/2026, 18:09:22 (Manila Time, UTC+8) · AMD EPYC 9V45 96-Core Processor (4 threads, 16 GB) · Linux 7.0.0-1019-azure (x64) · Node v22.23.4

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 2.6.0 | 186,301 | 192,640 | 193,066 | 190,644 | 265% |
| 2 | uws | 20.71.0 | 202,390 | 201,680 | 164,547 | 188,675 | 262% |
| 3 | hyper-express | 7.0.2 | 185,469 | 178,554 | 104,891 | 151,447 | 210% |
| 4 | node-http | 22.23.4 | 84,386 | 85,936 | 51,408 | 71,971 | 100% |
| 5 | fastify | 5.12.7 | 85,733 | 84,005 | 49,609 | 70,958 | 99% |
| 6 | polka | 0.5.2 | 86,018 | 82,470 | 47,421 | 69,548 | 97% |
| 7 | h3 | 2.0.2 | 83,939 | 81,107 | 48,001 | 68,880 | 96% |
| 8 | hono | 4.13.13 | 81,536 | 80,421 | 45,233 | 66,689 | 93% |
| 9 | 0http | 5.2.0 | 72,520 | 71,549 | 42,054 | 60,204 | 84% |
| 10 | restify | 12.0.0 | 68,830 | 68,035 | 37,725 | 56,110 | 78% |
| 11 | koa | 3.2.1 | 64,496 | 64,965 | 36,319 | 53,388 | 74% |
| 12 | hapi | 21.4.10 | 59,924 | 58,637 | 30,374 | 47,434 | 66% |
| 13 | tinyhttp | 3.0.11 | 48,566 | 48,306 | 31,200 | 41,831 | 58% |
| 14 | express | 5.3.0 | 21,624 | 21,885 | 15,276 | 19,336 | 27% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 202,390 | 4.27 | 6.00 | 30.30 | 4.8 | 57 | 0 | 240% |
| 2 | **kidlat** | 186,301 | 5.03 | 7.00 | 35.01 | 5.2 | 63 | 0 | 221% |
| 3 | hyper-express | 185,469 | 5.02 | 7.00 | 24.76 | 5.5 | 79 | 0 | 220% |
| 4 | polka | 86,018 | 11.12 | 22.00 | 15.34 | 11.7 | 98 | 0 | 102% |
| 5 | fastify | 85,733 | 11.17 | 21.00 | 15.37 | 11.7 | 109 | 0 | 102% |
| 6 | node-http | 84,386 | 11.34 | 22.00 | 16.58 | 11.9 | 101 | 0 | 100% |
| 7 | h3 | 83,939 | 11.42 | 22.00 | 14.73 | 12.0 | 108 | 0 | 99% |
| 8 | hono | 81,536 | 11.75 | 23.00 | 13.37 | 12.3 | 109 | 0 | 97% |
| 9 | 0http | 72,520 | 13.29 | 27.00 | 12.93 | 17.8 | 157 | 0 | 86% |
| 10 | restify | 68,830 | 14.03 | 27.00 | 12.41 | 14.6 | 114 | 0 | 82% |
| 11 | koa | 64,496 | 15.01 | 29.00 | 11.50 | 15.6 | 117 | 0 | 76% |
| 12 | hapi | 59,924 | 16.19 | 32.00 | 13.37 | 16.9 | 133 | 0 | 71% |
| 13 | tinyhttp | 48,566 | 20.10 | 41.00 | 8.20 | 31.8 | 191 | 0 | 58% |
| 14 | express | 21,624 | 45.74 | 81.00 | 3.86 | 54.6 | 189 | 0 | 26% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 201,680 | 4.32 | 6.00 | 29.05 | 4.9 | 59 | 0 | 235% |
| 2 | **kidlat** | 192,640 | 4.83 | 7.00 | 35.09 | 5.0 | 64 | 0 | 224% |
| 3 | hyper-express | 178,554 | 5.10 | 7.00 | 22.82 | 5.7 | 79 | 0 | 208% |
| 4 | node-http | 85,936 | 11.13 | 20.00 | 16.31 | 11.7 | 107 | 0 | 100% |
| 5 | fastify | 84,005 | 11.41 | 22.00 | 14.58 | 11.9 | 113 | 0 | 98% |
| 6 | polka | 82,470 | 11.63 | 24.00 | 14.24 | 12.2 | 103 | 0 | 96% |
| 7 | h3 | 81,107 | 11.83 | 23.00 | 13.77 | 12.4 | 113 | 0 | 94% |
| 8 | hono | 80,421 | 11.92 | 22.00 | 12.73 | 12.5 | 113 | 0 | 94% |
| 9 | 0http | 71,549 | 13.47 | 28.00 | 12.35 | 18.0 | 158 | 0 | 83% |
| 10 | restify | 68,035 | 14.20 | 28.00 | 11.87 | 14.8 | 125 | 0 | 79% |
| 11 | koa | 64,965 | 14.89 | 29.00 | 11.21 | 15.5 | 126 | 0 | 76% |
| 12 | hapi | 58,637 | 16.55 | 33.00 | 12.75 | 17.3 | 153 | 0 | 68% |
| 13 | tinyhttp | 48,306 | 20.20 | 41.00 | 7.88 | 32.2 | 191 | 0 | 56% |
| 14 | express | 21,885 | 45.18 | 81.00 | 3.78 | 53.9 | 189 | 0 | 25% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 193,066 | 4.86 | 7.00 | 96.10 | 5.1 | 68 | 0 | 376% |
| 2 | uws | 164,547 | 5.45 | 8.00 | 75.63 | 6.3 | 67 | 0 | 320% |
| 3 | hyper-express | 104,891 | 9.04 | 12.00 | 46.51 | 9.8 | 99 | 0 | 204% |
| 4 | node-http | 51,408 | 18.96 | 40.00 | 26.03 | 19.7 | 115 | 0 | 100% |
| 5 | fastify | 49,609 | 19.67 | 44.00 | 24.27 | 20.5 | 114 | 0 | 97% |
| 6 | h3 | 48,001 | 20.33 | 48.00 | 23.30 | 21.1 | 115 | 0 | 93% |
| 7 | polka | 47,421 | 20.59 | 45.00 | 23.15 | 21.6 | 103 | 0 | 92% |
| 8 | hono | 45,233 | 21.61 | 48.00 | 21.44 | 22.4 | 118 | 0 | 88% |
| 9 | 0http | 42,054 | 23.28 | 48.00 | 20.53 | 32.1 | 175 | 0 | 82% |
| 10 | restify | 37,725 | 26.00 | 59.00 | 18.49 | 26.9 | 113 | 0 | 73% |
| 11 | koa | 36,319 | 27.02 | 61.00 | 17.73 | 28.1 | 121 | 0 | 71% |
| 12 | tinyhttp | 31,200 | 31.54 | 68.00 | 17.41 | 46.5 | 196 | 0 | 61% |
| 13 | hapi | 30,374 | 32.41 | 68.00 | 15.56 | 33.4 | 155 | 0 | 59% |
| 14 | express | 15,276 | 64.92 | 84.00 | 7.46 | 77.0 | 190 | 0 | 30% |

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
