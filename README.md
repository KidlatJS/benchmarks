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
Run on 11/04/2026, 09:10:25 (Manila Time, UTC+8) · Intel(R) Xeon(R) Platinum 8370C CPU @ 2.80GHz (4 threads, 16 GB) · Linux 7.0.0-1017-azure (x64) · Node v22.23.4

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | uws | 20.71.0 | 129,330 | 130,638 | 106,398 | 121,591 | 249% |
| 2 | **kidlat** | 2.6.0 | 114,718 | 116,618 | 130,582 | 120,437 | 247% |
| 3 | hyper-express | 7.0.2 | 136,384 | 128,233 | 60,432 | 101,861 | 209% |
| 4 | node-http | 22.23.4 | 63,974 | 64,080 | 28,362 | 48,808 | 100% |
| 5 | fastify | 5.12.7 | 64,880 | 63,191 | 26,801 | 47,897 | 98% |
| 6 | 0http | 5.2.0 | 60,113 | 58,153 | 28,794 | 46,517 | 95% |
| 7 | polka | 0.5.2 | 67,163 | 63,415 | 23,613 | 46,504 | 95% |
| 8 | h3 | 2.0.2 | 63,956 | 60,002 | 26,064 | 46,419 | 95% |
| 9 | hono | 4.13.13 | 61,310 | 59,213 | 25,796 | 45,412 | 93% |
| 10 | restify | 12.0.0 | 45,909 | 44,082 | 19,526 | 34,061 | 70% |
| 11 | koa | 3.2.1 | 42,557 | 42,328 | 16,526 | 30,993 | 63% |
| 12 | hapi | 21.4.10 | 41,790 | 40,303 | 13,093 | 28,043 | 57% |
| 13 | tinyhttp | 3.0.11 | 31,830 | 31,421 | 18,214 | 26,312 | 54% |
| 14 | express | 5.3.0 | 13,404 | 13,084 | 7,793 | 11,097 | 23% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 136,384 | 6.85 | 12.00 | 18.21 | 7.6 | 71 | 0 | 213% |
| 2 | uws | 129,330 | 7.22 | 11.00 | 19.36 | 6.8 | 58 | 0 | 202% |
| 3 | **kidlat** | 114,718 | 8.28 | 14.00 | 21.55 | 7.5 | 63 | 0 | 179% |
| 4 | polka | 67,163 | 14.38 | 26.00 | 11.98 | 15.0 | 101 | 0 | 105% |
| 5 | fastify | 64,880 | 14.92 | 25.00 | 11.63 | 15.5 | 107 | 0 | 101% |
| 6 | node-http | 63,974 | 15.14 | 25.00 | 12.57 | 15.7 | 102 | 0 | 100% |
| 7 | h3 | 63,956 | 15.15 | 25.00 | 11.22 | 15.7 | 107 | 0 | 100% |
| 8 | hono | 61,310 | 15.82 | 32.00 | 10.06 | 16.4 | 103 | 0 | 96% |
| 9 | 0http | 60,113 | 16.13 | 34.00 | 10.72 | 23.0 | 152 | 0 | 94% |
| 10 | restify | 45,909 | 21.28 | 41.00 | 8.27 | 22.0 | 114 | 0 | 72% |
| 11 | koa | 42,557 | 23.00 | 45.00 | 7.59 | 23.7 | 121 | 0 | 67% |
| 12 | hapi | 41,790 | 23.43 | 43.00 | 9.32 | 24.4 | 126 | 0 | 65% |
| 13 | tinyhttp | 31,830 | 30.92 | 59.00 | 5.37 | 47.8 | 172 | 0 | 50% |
| 14 | express | 13,404 | 74.05 | 101.00 | 2.39 | 85.9 | 170 | 0 | 21% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 130,638 | 7.22 | 12.00 | 18.81 | 6.9 | 60 | 0 | 204% |
| 2 | hyper-express | 128,233 | 7.35 | 12.00 | 16.39 | 8.1 | 79 | 0 | 200% |
| 3 | **kidlat** | 116,618 | 8.15 | 13.00 | 21.24 | 7.5 | 64 | 0 | 182% |
| 4 | node-http | 64,080 | 15.12 | 25.00 | 12.16 | 15.7 | 107 | 0 | 100% |
| 5 | polka | 63,415 | 15.28 | 28.00 | 10.95 | 15.8 | 107 | 0 | 99% |
| 6 | fastify | 63,191 | 15.34 | 28.00 | 10.97 | 15.9 | 112 | 0 | 99% |
| 7 | h3 | 60,002 | 16.16 | 28.00 | 10.19 | 16.7 | 112 | 0 | 94% |
| 8 | hono | 59,213 | 16.38 | 30.00 | 9.37 | 17.0 | 108 | 0 | 92% |
| 9 | 0http | 58,153 | 16.70 | 35.00 | 10.04 | 23.8 | 152 | 0 | 91% |
| 10 | restify | 44,082 | 22.18 | 44.00 | 7.69 | 22.9 | 125 | 0 | 69% |
| 11 | koa | 42,328 | 23.12 | 43.00 | 7.31 | 23.8 | 130 | 0 | 66% |
| 12 | hapi | 40,303 | 24.31 | 46.00 | 8.76 | 25.2 | 156 | 0 | 63% |
| 13 | tinyhttp | 31,421 | 31.33 | 59.00 | 5.12 | 48.2 | 172 | 0 | 49% |
| 14 | express | 13,084 | 75.88 | 101.00 | 2.26 | 87.3 | 171 | 0 | 20% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 130,582 | 7.19 | 12.00 | 65.00 | 7.5 | 65 | 0 | 460% |
| 2 | uws | 106,398 | 8.88 | 15.00 | 48.91 | 9.8 | 68 | 0 | 375% |
| 3 | hyper-express | 60,432 | 16.08 | 25.00 | 26.80 | 17.3 | 99 | 0 | 213% |
| 4 | 0http | 28,794 | 34.23 | 72.00 | 14.06 | 46.8 | 169 | 0 | 102% |
| 5 | node-http | 28,362 | 34.75 | 69.00 | 14.36 | 36.0 | 105 | 0 | 100% |
| 6 | fastify | 26,801 | 36.80 | 71.00 | 13.11 | 38.1 | 113 | 0 | 94% |
| 7 | h3 | 26,064 | 37.85 | 75.00 | 12.65 | 39.1 | 113 | 0 | 92% |
| 8 | hono | 25,796 | 38.25 | 73.00 | 12.23 | 39.6 | 111 | 0 | 91% |
| 9 | polka | 23,613 | 41.83 | 79.00 | 11.53 | 43.5 | 106 | 0 | 83% |
| 10 | restify | 19,526 | 50.69 | 81.00 | 9.57 | 52.3 | 113 | 0 | 69% |
| 11 | tinyhttp | 18,214 | 54.37 | 83.00 | 10.16 | 76.1 | 176 | 0 | 64% |
| 12 | koa | 16,526 | 59.99 | 90.00 | 8.07 | 62.0 | 116 | 0 | 58% |
| 13 | hapi | 13,093 | 75.81 | 110.00 | 6.70 | 77.5 | 157 | 0 | 46% |
| 14 | express | 7,793 | 127.65 | 165.00 | 3.81 | 144.5 | 171 | 0 | 27% |

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
