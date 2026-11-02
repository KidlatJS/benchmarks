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
Run on 11/03/2026, 07:23:16 (Manila Time, UTC+8) · Intel(R) Xeon(R) 6975P-C (4 threads, 15 GB) · Linux 7.0.0-1014-aws (x64) · Node v22.23.3

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | uws | 20.71.0 | 183,523 | 189,331 | 187,946 | 186,917 | 200% |
| 2 | hyper-express | 7.0.2 | 240,070 | 229,290 | 109,182 | 181,813 | 194% |
| 3 | **kidlat** | 2.6.0 | 169,590 | 172,474 | 204,986 | 181,670 | 194% |
| 4 | fastify | 5.12.7 | 119,101 | 117,853 | 62,325 | 95,640 | 102% |
| 5 | node-http | 22.23.3 | 114,714 | 113,798 | 62,954 | 93,668 | 100% |
| 6 | hono | 4.13.13 | 114,534 | 112,653 | 57,686 | 90,625 | 97% |
| 7 | h3 | 2.0.2 | 114,362 | 109,333 | 57,008 | 89,328 | 95% |
| 8 | polka | 0.5.2 | 113,650 | 112,382 | 54,858 | 88,818 | 95% |
| 9 | 0http | 5.2.0 | 101,902 | 96,709 | 52,758 | 80,411 | 86% |
| 10 | restify | 12.0.0 | 82,216 | 81,226 | 41,691 | 65,298 | 70% |
| 11 | koa | 3.2.1 | 83,088 | 80,918 | 40,271 | 64,693 | 69% |
| 12 | hapi | 21.4.10 | 76,842 | 71,868 | 33,108 | 56,758 | 61% |
| 13 | tinyhttp | 3.0.11 | 55,952 | 56,107 | 36,394 | 48,524 | 52% |
| 14 | express | 5.3.0 | 22,234 | 21,866 | 14,790 | 19,301 | 21% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 240,070 | 3.68 | 6.00 | 32.05 | 4.4 | 78 | 0 | 209% |
| 2 | uws | 183,523 | 5.14 | 7.00 | 27.48 | 4.8 | 57 | 0 | 160% |
| 3 | **kidlat** | 169,590 | 5.32 | 8.00 | 31.86 | 5.4 | 63 | 0 | 148% |
| 4 | fastify | 119,101 | 7.90 | 12.00 | 21.35 | 8.5 | 106 | 0 | 104% |
| 5 | node-http | 114,714 | 8.22 | 12.00 | 22.54 | 8.8 | 104 | 0 | 100% |
| 6 | hono | 114,534 | 8.21 | 12.00 | 18.79 | 8.8 | 105 | 0 | 100% |
| 7 | h3 | 114,362 | 8.20 | 15.00 | 20.07 | 8.8 | 109 | 0 | 100% |
| 8 | polka | 113,650 | 8.31 | 13.00 | 20.27 | 8.9 | 97 | 0 | 99% |
| 9 | 0http | 101,902 | 9.31 | 19.00 | 18.17 | 13.8 | 140 | 0 | 89% |
| 10 | koa | 83,088 | 11.47 | 22.00 | 14.82 | 12.2 | 116 | 0 | 72% |
| 11 | restify | 82,216 | 11.65 | 22.00 | 14.82 | 12.3 | 117 | 0 | 72% |
| 12 | hapi | 76,842 | 12.57 | 23.00 | 17.15 | 13.3 | 124 | 0 | 67% |
| 13 | tinyhttp | 55,952 | 17.39 | 34.00 | 9.44 | 29.6 | 183 | 0 | 49% |
| 14 | express | 22,234 | 44.46 | 86.00 | 3.96 | 53.0 | 189 | 0 | 19% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 229,290 | 4.02 | 6.00 | 29.30 | 4.6 | 79 | 0 | 201% |
| 2 | uws | 189,331 | 4.96 | 7.00 | 27.26 | 4.7 | 59 | 0 | 166% |
| 3 | **kidlat** | 172,474 | 5.22 | 7.00 | 31.42 | 5.4 | 64 | 0 | 152% |
| 4 | fastify | 117,853 | 7.95 | 11.00 | 20.46 | 8.5 | 112 | 0 | 104% |
| 5 | node-http | 113,798 | 8.29 | 13.00 | 21.60 | 8.8 | 110 | 0 | 100% |
| 6 | hono | 112,653 | 8.39 | 12.00 | 17.84 | 8.9 | 110 | 0 | 99% |
| 7 | polka | 112,382 | 8.39 | 11.00 | 19.40 | 8.9 | 103 | 0 | 99% |
| 8 | h3 | 109,333 | 8.67 | 12.00 | 18.56 | 9.2 | 113 | 0 | 96% |
| 9 | 0http | 96,709 | 9.86 | 21.00 | 16.69 | 14.4 | 142 | 0 | 85% |
| 10 | restify | 81,226 | 11.77 | 22.00 | 14.18 | 12.4 | 128 | 0 | 71% |
| 11 | koa | 80,918 | 11.81 | 22.00 | 13.97 | 12.5 | 125 | 0 | 71% |
| 12 | hapi | 71,868 | 13.41 | 24.00 | 15.63 | 14.2 | 126 | 0 | 63% |
| 13 | tinyhttp | 56,107 | 17.33 | 32.00 | 9.15 | 29.5 | 184 | 0 | 49% |
| 14 | express | 21,866 | 45.20 | 86.00 | 3.77 | 54.2 | 192 | 0 | 19% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 204,986 | 4.26 | 7.00 | 102.05 | 4.8 | 69 | 0 | 326% |
| 2 | uws | 187,946 | 4.81 | 8.00 | 86.40 | 5.7 | 68 | 0 | 299% |
| 3 | hyper-express | 109,182 | 8.75 | 11.00 | 48.42 | 9.7 | 101 | 0 | 173% |
| 4 | node-http | 62,954 | 15.40 | 35.00 | 31.88 | 16.3 | 110 | 0 | 100% |
| 5 | fastify | 62,325 | 15.57 | 37.00 | 30.49 | 16.4 | 111 | 0 | 99% |
| 6 | hono | 57,686 | 16.82 | 39.00 | 27.34 | 17.7 | 107 | 0 | 92% |
| 7 | h3 | 57,008 | 17.03 | 39.00 | 27.67 | 18.0 | 116 | 0 | 91% |
| 8 | polka | 54,858 | 17.74 | 41.00 | 26.79 | 18.9 | 110 | 0 | 87% |
| 9 | 0http | 52,758 | 18.46 | 38.00 | 25.76 | 26.5 | 168 | 0 | 84% |
| 10 | restify | 41,691 | 23.48 | 51.00 | 20.44 | 24.6 | 117 | 0 | 66% |
| 11 | koa | 40,271 | 24.31 | 53.00 | 19.66 | 25.6 | 115 | 0 | 64% |
| 12 | tinyhttp | 36,394 | 26.97 | 59.00 | 20.30 | 42.0 | 190 | 0 | 58% |
| 13 | hapi | 33,108 | 29.69 | 64.00 | 16.95 | 30.8 | 140 | 0 | 53% |
| 14 | express | 14,790 | 67.06 | 87.00 | 7.22 | 81.2 | 193 | 0 | 23% |

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
