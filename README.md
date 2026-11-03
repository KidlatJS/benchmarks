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
Run on 11/03/2026, 14:15:39 (Manila Time, UTC+8) · AMD EPYC 9V74 80-Core Processor (4 threads, 16 GB) · Linux 7.0.0-1017-azure (x64) · Node v22.23.4

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | uws | 20.71.0 | 123,695 | 122,474 | 100,382 | 114,996 | 271% |
| 2 | **kidlat** | 2.6.0 | 111,264 | 111,045 | 121,349 | 114,454 | 269% |
| 3 | hyper-express | 7.0.2 | 117,510 | 110,749 | 58,482 | 91,302 | 215% |
| 4 | node-http | 22.23.4 | 53,742 | 53,199 | 26,856 | 42,503 | 100% |
| 5 | fastify | 5.12.7 | 54,626 | 53,646 | 25,335 | 42,029 | 99% |
| 6 | 0http | 5.2.0 | 50,783 | 49,164 | 25,824 | 40,099 | 94% |
| 7 | h3 | 2.0.2 | 52,802 | 49,446 | 24,505 | 39,995 | 94% |
| 8 | hono | 4.13.13 | 52,655 | 51,156 | 23,651 | 39,939 | 94% |
| 9 | polka | 0.5.2 | 53,498 | 52,186 | 22,725 | 39,884 | 94% |
| 10 | restify | 12.0.0 | 39,632 | 39,061 | 17,966 | 30,298 | 71% |
| 11 | koa | 3.2.1 | 39,392 | 39,158 | 15,137 | 28,582 | 67% |
| 12 | hapi | 21.4.10 | 35,622 | 34,795 | 12,442 | 24,891 | 59% |
| 13 | tinyhttp | 3.0.11 | 28,982 | 28,880 | 16,632 | 24,056 | 57% |
| 14 | express | 5.3.0 | 12,992 | 12,438 | 7,139 | 10,488 | 25% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 123,695 | 7.62 | 11.00 | 18.52 | 7.7 | 58 | 0 | 230% |
| 2 | hyper-express | 117,510 | 8.13 | 13.00 | 15.69 | 8.7 | 70 | 0 | 219% |
| 3 | **kidlat** | 111,264 | 8.37 | 9.00 | 20.90 | 8.6 | 64 | 0 | 207% |
| 4 | fastify | 54,626 | 17.80 | 33.00 | 9.79 | 18.4 | 107 | 0 | 102% |
| 5 | node-http | 53,742 | 18.12 | 31.00 | 10.56 | 18.7 | 103 | 0 | 100% |
| 6 | polka | 53,498 | 18.20 | 33.00 | 9.54 | 18.8 | 101 | 0 | 100% |
| 7 | h3 | 52,802 | 18.46 | 35.00 | 9.27 | 19.1 | 109 | 0 | 98% |
| 8 | hono | 52,655 | 18.50 | 33.00 | 8.64 | 19.1 | 103 | 0 | 98% |
| 9 | 0http | 50,783 | 19.19 | 41.00 | 9.06 | 25.4 | 147 | 0 | 94% |
| 10 | restify | 39,632 | 24.74 | 51.00 | 7.14 | 25.4 | 114 | 0 | 74% |
| 11 | koa | 39,392 | 24.89 | 54.00 | 7.03 | 25.6 | 118 | 0 | 73% |
| 12 | hapi | 35,622 | 27.56 | 55.00 | 7.95 | 28.6 | 124 | 0 | 66% |
| 13 | tinyhttp | 28,982 | 33.99 | 71.00 | 4.89 | 50.1 | 178 | 0 | 54% |
| 14 | express | 12,992 | 76.41 | 102.00 | 2.32 | 89.1 | 169 | 0 | 24% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 122,474 | 7.74 | 10.00 | 17.64 | 7.8 | 60 | 0 | 230% |
| 2 | **kidlat** | 111,045 | 8.38 | 13.00 | 20.23 | 8.6 | 65 | 0 | 209% |
| 3 | hyper-express | 110,749 | 8.45 | 15.00 | 14.15 | 9.2 | 78 | 0 | 208% |
| 4 | fastify | 53,646 | 18.15 | 34.00 | 9.31 | 18.7 | 112 | 0 | 101% |
| 5 | node-http | 53,199 | 18.31 | 36.00 | 10.10 | 18.9 | 108 | 0 | 100% |
| 6 | polka | 52,186 | 18.67 | 34.00 | 9.01 | 19.2 | 107 | 0 | 98% |
| 7 | hono | 51,156 | 19.04 | 36.00 | 8.10 | 19.6 | 108 | 0 | 96% |
| 8 | h3 | 49,446 | 19.72 | 39.00 | 8.39 | 20.3 | 113 | 0 | 93% |
| 9 | 0http | 49,164 | 19.84 | 43.00 | 8.49 | 26.1 | 154 | 0 | 92% |
| 10 | koa | 39,158 | 25.03 | 50.00 | 6.76 | 25.7 | 126 | 0 | 74% |
| 11 | restify | 39,061 | 25.10 | 52.00 | 6.82 | 25.8 | 125 | 0 | 73% |
| 12 | hapi | 34,795 | 28.22 | 54.00 | 7.57 | 29.1 | 139 | 0 | 65% |
| 13 | tinyhttp | 28,880 | 34.12 | 68.00 | 4.71 | 49.9 | 179 | 0 | 54% |
| 14 | express | 12,438 | 79.84 | 110.00 | 2.15 | 92.5 | 168 | 0 | 23% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 121,349 | 7.84 | 12.00 | 60.41 | 8.1 | 66 | 0 | 452% |
| 2 | uws | 100,382 | 9.43 | 16.00 | 46.14 | 10.3 | 68 | 0 | 374% |
| 3 | hyper-express | 58,482 | 16.62 | 27.00 | 25.93 | 17.6 | 101 | 0 | 218% |
| 4 | node-http | 26,856 | 36.73 | 75.00 | 13.60 | 37.9 | 116 | 0 | 100% |
| 5 | 0http | 25,824 | 38.22 | 84.00 | 12.61 | 50.9 | 169 | 0 | 96% |
| 6 | fastify | 25,335 | 38.97 | 78.00 | 12.39 | 40.1 | 108 | 0 | 94% |
| 7 | h3 | 24,505 | 40.29 | 80.00 | 11.90 | 41.5 | 113 | 0 | 91% |
| 8 | hono | 23,651 | 41.77 | 81.00 | 11.21 | 43.0 | 114 | 0 | 88% |
| 9 | polka | 22,725 | 43.49 | 83.00 | 11.10 | 45.1 | 111 | 0 | 85% |
| 10 | restify | 17,966 | 55.13 | 97.00 | 8.81 | 56.8 | 113 | 0 | 67% |
| 11 | tinyhttp | 16,632 | 59.60 | 98.00 | 9.28 | 80.0 | 183 | 0 | 62% |
| 12 | koa | 15,137 | 65.52 | 109.00 | 7.39 | 67.4 | 115 | 0 | 56% |
| 13 | hapi | 12,442 | 79.82 | 121.00 | 6.37 | 81.4 | 140 | 0 | 46% |
| 14 | express | 7,139 | 139.32 | 185.00 | 3.49 | 158.0 | 170 | 0 | 27% |

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
