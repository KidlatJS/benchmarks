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
Run on 10/26/2026, 20:44:16 (Manila Time, UTC+8) · AMD EPYC 9V45 96-Core Processor (4 threads, 16 GB) · Linux 6.17.0-1022-azure (x64) · Node v22.23.3

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | uws | 20.71.0 | 180,918 | 182,307 | 163,885 | 175,499 | 271% |
| 2 | **kidlat** | 2.4.0 | 164,499 | 169,664 | 182,973 | 172,205 | 266% |
| 3 | hyper-express | 7.0.2 | 175,773 | 169,280 | 99,616 | 143,647 | 222% |
| 4 | fastify | 5.12.7 | 76,992 | 79,008 | 49,566 | 67,056 | 104% |
| 5 | node-http | 22.23.3 | 75,325 | 73,083 | 49,273 | 64,732 | 100% |
| 6 | polka | 0.5.2 | 77,042 | 76,488 | 45,147 | 64,316 | 99% |
| 7 | h3 | 2.0.2 | 78,883 | 74,250 | 45,119 | 64,172 | 99% |
| 8 | hono | 4.13.13 | 76,293 | 73,330 | 43,354 | 62,363 | 96% |
| 9 | 0http | 5.2.0 | 69,563 | 67,610 | 41,101 | 57,820 | 89% |
| 10 | restify | 12.0.0 | 63,274 | 61,796 | 34,646 | 51,358 | 79% |
| 11 | koa | 3.2.1 | 60,923 | 61,191 | 33,899 | 50,182 | 78% |
| 12 | hapi | 21.4.10 | 57,405 | 56,329 | 29,136 | 45,503 | 70% |
| 13 | tinyhttp | 3.0.11 | 43,386 | 43,884 | 30,677 | 38,799 | 60% |
| 14 | express | 5.3.0 | 21,116 | 21,119 | 14,770 | 18,745 | 29% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 180,918 | 5.16 | 8.00 | 27.09 | 5.3 | 58 | 0 | 240% |
| 2 | hyper-express | 175,773 | 5.17 | 8.00 | 23.47 | 5.8 | 79 | 0 | 233% |
| 3 | **kidlat** | 164,499 | 5.56 | 8.00 | 30.91 | 5.6 | 61 | 0 | 218% |
| 4 | h3 | 78,883 | 12.18 | 23.00 | 13.84 | 12.7 | 104 | 0 | 105% |
| 5 | polka | 77,042 | 12.48 | 23.00 | 13.74 | 13.1 | 97 | 0 | 102% |
| 6 | fastify | 76,992 | 12.48 | 24.00 | 13.80 | 13.1 | 107 | 0 | 102% |
| 7 | hono | 76,293 | 12.61 | 24.00 | 12.51 | 13.2 | 105 | 0 | 101% |
| 8 | node-http | 75,325 | 12.78 | 23.00 | 14.80 | 13.3 | 102 | 0 | 100% |
| 9 | 0http | 69,563 | 13.88 | 27.00 | 12.40 | 14.7 | 102 | 0 | 92% |
| 10 | restify | 63,274 | 15.32 | 29.00 | 11.40 | 15.9 | 116 | 0 | 84% |
| 11 | koa | 60,923 | 15.91 | 31.00 | 10.86 | 16.6 | 119 | 0 | 81% |
| 12 | hapi | 57,405 | 16.92 | 32.00 | 12.81 | 17.8 | 131 | 0 | 76% |
| 13 | tinyhttp | 43,386 | 22.55 | 48.00 | 7.32 | 36.7 | 196 | 0 | 58% |
| 14 | express | 21,116 | 46.84 | 81.00 | 3.77 | 56.8 | 188 | 0 | 28% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 182,307 | 5.13 | 8.00 | 26.25 | 5.3 | 60 | 0 | 249% |
| 2 | **kidlat** | 169,664 | 5.38 | 8.00 | 30.90 | 5.6 | 61 | 0 | 232% |
| 3 | hyper-express | 169,280 | 5.32 | 8.00 | 21.63 | 6.0 | 79 | 0 | 232% |
| 4 | fastify | 79,008 | 12.16 | 23.00 | 13.71 | 12.7 | 112 | 0 | 108% |
| 5 | polka | 76,488 | 12.58 | 23.00 | 13.20 | 13.1 | 102 | 0 | 105% |
| 6 | h3 | 74,250 | 12.97 | 25.00 | 12.60 | 13.5 | 108 | 0 | 102% |
| 7 | hono | 73,330 | 13.14 | 24.00 | 11.61 | 13.7 | 109 | 0 | 100% |
| 8 | node-http | 73,083 | 13.18 | 24.00 | 13.87 | 13.7 | 107 | 0 | 100% |
| 9 | 0http | 67,610 | 14.29 | 27.00 | 11.67 | 15.1 | 106 | 0 | 93% |
| 10 | restify | 61,796 | 15.68 | 30.00 | 10.78 | 16.3 | 127 | 0 | 85% |
| 11 | koa | 61,191 | 15.85 | 30.00 | 10.56 | 16.5 | 129 | 0 | 84% |
| 12 | hapi | 56,329 | 17.25 | 33.00 | 12.25 | 18.1 | 131 | 0 | 77% |
| 13 | tinyhttp | 43,884 | 22.29 | 46.00 | 7.16 | 36.5 | 196 | 0 | 60% |
| 14 | express | 21,119 | 46.83 | 77.00 | 3.65 | 56.6 | 188 | 0 | 29% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 182,973 | 5.10 | 7.00 | 91.10 | 5.3 | 63 | 0 | 371% |
| 2 | uws | 163,885 | 5.55 | 8.00 | 75.33 | 6.3 | 67 | 0 | 333% |
| 3 | hyper-express | 99,616 | 9.52 | 13.00 | 44.17 | 10.4 | 100 | 0 | 202% |
| 4 | fastify | 49,566 | 19.68 | 42.00 | 24.25 | 20.6 | 111 | 0 | 101% |
| 5 | node-http | 49,273 | 19.79 | 43.00 | 24.95 | 20.9 | 101 | 0 | 100% |
| 6 | polka | 45,147 | 21.64 | 46.00 | 22.04 | 22.8 | 99 | 0 | 92% |
| 7 | h3 | 45,119 | 21.67 | 48.00 | 21.90 | 22.6 | 114 | 0 | 92% |
| 8 | hono | 43,354 | 22.57 | 49.00 | 20.55 | 23.5 | 107 | 0 | 88% |
| 9 | 0http | 41,101 | 23.83 | 50.00 | 20.07 | 25.6 | 111 | 0 | 83% |
| 10 | restify | 34,646 | 28.36 | 61.00 | 16.98 | 29.7 | 113 | 0 | 70% |
| 11 | koa | 33,899 | 29.00 | 62.00 | 16.55 | 30.4 | 119 | 0 | 69% |
| 12 | tinyhttp | 30,677 | 32.09 | 68.00 | 17.11 | 49.6 | 201 | 0 | 62% |
| 13 | hapi | 29,136 | 33.81 | 69.00 | 14.92 | 35.1 | 132 | 0 | 59% |
| 14 | express | 14,770 | 67.15 | 98.00 | 7.21 | 81.1 | 192 | 0 | 30% |

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
