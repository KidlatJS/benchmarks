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
Run on 11/16/2026, 09:45:23 (Manila Time, UTC+8) · AMD EPYC 7763 64-Core Processor (4 threads, 16 GB) · Linux 7.0.0-1019-azure (x64) · Node v22.23.4

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 2.6.0 | 104,018 | 100,606 | 107,594 | 104,033 | 313% |
| 2 | uws | 20.71.0 | 102,627 | 110,822 | 90,344 | 100,909 | 304% |
| 3 | hyper-express | 7.0.2 | 104,750 | 100,093 | 44,694 | 77,673 | 234% |
| 4 | node-http | 22.23.4 | 44,714 | 44,707 | 18,384 | 33,247 | 100% |
| 5 | 0http | 5.2.0 | 43,772 | 42,534 | 19,064 | 32,864 | 99% |
| 6 | fastify | 5.12.7 | 44,448 | 42,912 | 17,274 | 32,058 | 96% |
| 7 | h3 | 2.0.2 | 42,891 | 40,517 | 16,923 | 30,867 | 93% |
| 8 | polka | 0.5.2 | 44,456 | 41,798 | 15,808 | 30,855 | 93% |
| 9 | hono | 4.13.13 | 41,735 | 41,162 | 16,313 | 30,374 | 91% |
| 10 | restify | 12.0.0 | 31,948 | 31,168 | 11,961 | 22,837 | 69% |
| 11 | koa | 3.2.1 | 30,681 | 30,505 | 10,994 | 21,751 | 65% |
| 12 | hapi | 21.4.10 | 30,114 | 29,025 | 8,992 | 19,882 | 60% |
| 13 | tinyhttp | 3.0.11 | 23,306 | 22,732 | 12,151 | 18,603 | 56% |
| 14 | express | 5.3.0 | 11,381 | 11,266 | 6,123 | 9,225 | 28% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 104,750 | 9.15 | 17.00 | 13.99 | 9.7 | 71 | 0 | 234% |
| 2 | **kidlat** | 104,018 | 9.18 | 13.00 | 19.54 | 9.4 | 64 | 0 | 233% |
| 3 | uws | 102,627 | 9.26 | 16.00 | 15.36 | 8.9 | 58 | 0 | 230% |
| 4 | node-http | 44,714 | 21.88 | 39.00 | 8.78 | 22.5 | 105 | 0 | 100% |
| 5 | polka | 44,456 | 22.01 | 45.00 | 7.93 | 22.6 | 101 | 0 | 99% |
| 6 | fastify | 44,448 | 22.01 | 40.00 | 7.97 | 22.6 | 107 | 0 | 99% |
| 7 | 0http | 43,772 | 22.34 | 54.00 | 7.81 | 28.9 | 146 | 0 | 98% |
| 8 | h3 | 42,891 | 22.81 | 44.00 | 7.53 | 23.5 | 107 | 0 | 96% |
| 9 | hono | 41,735 | 23.46 | 45.00 | 6.85 | 24.1 | 103 | 0 | 93% |
| 10 | restify | 31,948 | 30.79 | 62.00 | 5.76 | 31.5 | 113 | 0 | 71% |
| 11 | koa | 30,681 | 32.09 | 62.00 | 5.47 | 32.8 | 115 | 0 | 69% |
| 12 | hapi | 30,114 | 32.68 | 63.00 | 6.72 | 33.7 | 126 | 0 | 67% |
| 13 | tinyhttp | 23,306 | 42.39 | 89.00 | 3.93 | 59.3 | 169 | 0 | 52% |
| 14 | express | 11,381 | 87.29 | 122.00 | 2.03 | 100.2 | 156 | 0 | 25% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 110,822 | 8.52 | 15.00 | 15.96 | 8.5 | 58 | 0 | 248% |
| 2 | **kidlat** | 100,606 | 9.49 | 16.00 | 18.33 | 9.6 | 64 | 0 | 225% |
| 3 | hyper-express | 100,093 | 9.46 | 18.00 | 12.79 | 10.2 | 79 | 0 | 224% |
| 4 | node-http | 44,707 | 21.88 | 40.00 | 8.48 | 22.4 | 110 | 0 | 100% |
| 5 | fastify | 42,912 | 22.80 | 51.00 | 7.45 | 23.4 | 112 | 0 | 96% |
| 6 | 0http | 42,534 | 23.01 | 58.00 | 7.34 | 29.7 | 146 | 0 | 95% |
| 7 | polka | 41,798 | 23.43 | 45.00 | 7.22 | 24.0 | 106 | 0 | 93% |
| 8 | hono | 41,162 | 23.80 | 43.00 | 6.52 | 24.4 | 108 | 0 | 92% |
| 9 | h3 | 40,517 | 24.17 | 44.00 | 6.88 | 24.8 | 112 | 0 | 91% |
| 10 | restify | 31,168 | 31.57 | 64.00 | 5.44 | 32.3 | 124 | 0 | 70% |
| 11 | koa | 30,505 | 32.28 | 59.00 | 5.27 | 32.9 | 124 | 0 | 68% |
| 12 | hapi | 29,025 | 33.94 | 64.00 | 6.31 | 34.8 | 134 | 0 | 65% |
| 13 | tinyhttp | 22,732 | 43.48 | 86.00 | 3.71 | 60.3 | 172 | 0 | 51% |
| 14 | express | 11,266 | 88.20 | 123.00 | 1.94 | 100.5 | 166 | 0 | 25% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 107,594 | 8.73 | 16.00 | 53.57 | 9.1 | 68 | 0 | 585% |
| 2 | uws | 90,344 | 10.49 | 18.00 | 41.53 | 11.3 | 67 | 0 | 491% |
| 3 | hyper-express | 44,694 | 21.86 | 35.00 | 19.82 | 22.9 | 100 | 0 | 243% |
| 4 | 0http | 19,064 | 51.93 | 107.00 | 9.31 | 64.0 | 162 | 0 | 104% |
| 5 | node-http | 18,384 | 53.86 | 81.00 | 9.31 | 55.2 | 112 | 0 | 100% |
| 6 | fastify | 17,274 | 57.36 | 92.00 | 8.45 | 58.6 | 113 | 0 | 94% |
| 7 | h3 | 16,923 | 58.56 | 87.00 | 8.21 | 59.8 | 104 | 0 | 92% |
| 8 | hono | 16,313 | 60.76 | 93.00 | 7.73 | 62.2 | 111 | 0 | 89% |
| 9 | polka | 15,808 | 62.72 | 87.00 | 7.72 | 64.4 | 103 | 0 | 86% |
| 10 | tinyhttp | 12,151 | 81.72 | 117.00 | 6.78 | 102.1 | 176 | 0 | 66% |
| 11 | restify | 11,961 | 83.00 | 121.00 | 5.86 | 84.9 | 112 | 0 | 65% |
| 12 | koa | 10,994 | 90.38 | 127.00 | 5.37 | 92.5 | 112 | 0 | 60% |
| 13 | hapi | 8,992 | 110.58 | 147.00 | 4.60 | 112.5 | 142 | 0 | 49% |
| 14 | express | 6,123 | 162.54 | 204.00 | 2.99 | 180.7 | 166 | 0 | 33% |

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
