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
Run on 11/21/2026, 03:53:48 (Manila Time, UTC+8) · Intel(R) Xeon(R) 6975P-C (4 threads, 15 GB) · Linux 7.0.0-1016-aws (x64) · Node v22.23.5

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | uws | 20.71.0 | 191,382 | 194,845 | 187,930 | 191,365 | 206% |
| 2 | **kidlat** | 2.6.0 | 172,755 | 170,826 | 206,323 | 182,604 | 197% |
| 3 | hyper-express | 7.0.2 | 243,338 | 229,645 | 108,646 | 182,429 | 197% |
| 4 | 0http | 5.2.0 | 123,814 | 122,413 | 64,667 | 99,333 | 107% |
| 5 | fastify | 5.12.7 | 117,861 | 115,243 | 62,005 | 94,436 | 102% |
| 6 | node-http | 22.23.5 | 113,541 | 115,035 | 61,222 | 92,818 | 100% |
| 7 | polka | 0.5.2 | 119,474 | 113,138 | 57,513 | 91,949 | 99% |
| 8 | h3 | 2.0.2 | 113,829 | 107,320 | 58,650 | 89,482 | 96% |
| 9 | hono | 4.13.13 | 113,864 | 109,368 | 55,292 | 88,304 | 95% |
| 10 | restify | 12.0.0 | 82,768 | 83,589 | 43,350 | 66,937 | 72% |
| 11 | koa | 3.2.1 | 82,640 | 81,533 | 41,040 | 65,149 | 70% |
| 12 | hapi | 21.4.10 | 75,946 | 73,526 | 32,882 | 56,838 | 61% |
| 13 | tinyhttp | 3.0.11 | 59,680 | 58,246 | 36,602 | 50,296 | 54% |
| 14 | express | 5.3.0 | 22,023 | 21,840 | 15,099 | 19,365 | 21% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 243,338 | 3.60 | 6.00 | 32.49 | 4.3 | 79 | 0 | 214% |
| 2 | uws | 191,382 | 4.75 | 7.00 | 28.65 | 4.7 | 58 | 0 | 169% |
| 3 | **kidlat** | 172,755 | 5.18 | 8.00 | 32.46 | 5.4 | 63 | 0 | 152% |
| 4 | 0http | 123,814 | 7.55 | 11.00 | 22.08 | 8.3 | 105 | 0 | 109% |
| 5 | polka | 119,474 | 7.89 | 11.00 | 21.31 | 8.4 | 101 | 0 | 105% |
| 6 | fastify | 117,861 | 7.98 | 11.00 | 21.13 | 8.5 | 104 | 0 | 104% |
| 7 | hono | 113,864 | 8.25 | 14.00 | 18.68 | 8.9 | 108 | 0 | 100% |
| 8 | h3 | 113,829 | 8.27 | 12.00 | 19.97 | 8.9 | 107 | 0 | 100% |
| 9 | node-http | 113,541 | 8.31 | 12.00 | 22.30 | 8.9 | 105 | 0 | 100% |
| 10 | restify | 82,768 | 11.57 | 22.00 | 14.92 | 12.2 | 114 | 0 | 73% |
| 11 | koa | 82,640 | 11.53 | 22.00 | 14.74 | 12.2 | 115 | 0 | 73% |
| 12 | hapi | 75,946 | 12.74 | 23.00 | 16.95 | 13.5 | 118 | 0 | 67% |
| 13 | tinyhttp | 59,680 | 16.23 | 31.00 | 10.07 | 26.7 | 188 | 0 | 53% |
| 14 | express | 22,023 | 44.89 | 84.00 | 3.93 | 53.1 | 188 | 0 | 19% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 229,645 | 4.02 | 6.00 | 29.35 | 4.6 | 78 | 0 | 200% |
| 2 | uws | 194,845 | 4.58 | 7.00 | 28.06 | 4.6 | 59 | 0 | 169% |
| 3 | **kidlat** | 170,826 | 5.24 | 8.00 | 31.11 | 5.4 | 64 | 0 | 148% |
| 4 | 0http | 122,413 | 7.68 | 11.00 | 21.13 | 8.5 | 111 | 0 | 106% |
| 5 | fastify | 115,243 | 8.13 | 15.00 | 20.00 | 8.7 | 109 | 0 | 100% |
| 6 | node-http | 115,035 | 8.21 | 12.00 | 21.83 | 8.7 | 110 | 0 | 100% |
| 7 | polka | 113,138 | 8.34 | 13.00 | 19.53 | 8.9 | 107 | 0 | 98% |
| 8 | hono | 109,368 | 8.66 | 14.00 | 17.31 | 9.2 | 112 | 0 | 95% |
| 9 | h3 | 107,320 | 8.77 | 13.00 | 18.22 | 9.4 | 112 | 0 | 93% |
| 10 | restify | 83,589 | 11.43 | 23.00 | 14.59 | 12.0 | 124 | 0 | 73% |
| 11 | koa | 81,533 | 11.69 | 23.00 | 14.07 | 12.3 | 125 | 0 | 71% |
| 12 | hapi | 73,526 | 13.07 | 24.00 | 15.99 | 13.9 | 137 | 0 | 64% |
| 13 | tinyhttp | 58,246 | 16.68 | 31.00 | 9.50 | 27.1 | 188 | 0 | 51% |
| 14 | express | 21,840 | 45.27 | 85.00 | 3.77 | 53.6 | 188 | 0 | 19% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 206,323 | 4.21 | 7.00 | 102.72 | 4.7 | 67 | 0 | 337% |
| 2 | uws | 187,930 | 4.81 | 8.00 | 86.39 | 5.6 | 68 | 0 | 307% |
| 3 | hyper-express | 108,646 | 8.79 | 11.00 | 48.18 | 9.7 | 99 | 0 | 177% |
| 4 | 0http | 64,667 | 14.98 | 32.00 | 31.58 | 16.3 | 107 | 0 | 106% |
| 5 | fastify | 62,005 | 15.64 | 36.00 | 30.34 | 16.5 | 112 | 0 | 101% |
| 6 | node-http | 61,222 | 15.85 | 36.00 | 31.00 | 16.7 | 113 | 0 | 100% |
| 7 | h3 | 58,650 | 16.53 | 38.00 | 28.47 | 17.5 | 115 | 0 | 96% |
| 8 | polka | 57,513 | 16.88 | 38.00 | 28.08 | 18.0 | 110 | 0 | 94% |
| 9 | hono | 55,292 | 17.61 | 40.00 | 26.21 | 18.5 | 109 | 0 | 90% |
| 10 | restify | 43,350 | 22.56 | 50.00 | 21.25 | 23.6 | 117 | 0 | 71% |
| 11 | koa | 41,040 | 23.89 | 52.00 | 20.04 | 25.1 | 117 | 0 | 67% |
| 12 | tinyhttp | 36,602 | 26.82 | 58.00 | 20.42 | 40.2 | 193 | 0 | 60% |
| 13 | hapi | 32,882 | 29.90 | 65.00 | 16.84 | 31.1 | 138 | 0 | 54% |
| 14 | express | 15,099 | 65.69 | 86.00 | 7.37 | 77.6 | 189 | 0 | 25% |

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
