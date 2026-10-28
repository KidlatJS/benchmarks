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
Run on 10/28/2026, 16:11:39 (Manila Time, UTC+8) · AMD EPYC 9V45 96-Core Processor (4 threads, 16 GB) · Linux 6.17.0-1022-azure (x64) · Node v22.23.3

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | uws | 20.71.0 | 199,446 | 202,064 | 172,202 | 190,744 | 264% |
| 2 | **kidlat** | 2.4.0 | 172,794 | 194,496 | 200,064 | 188,742 | 261% |
| 3 | hyper-express | 7.0.2 | 167,088 | 160,797 | 89,395 | 133,920 | 185% |
| 4 | h3 | 2.0.2 | 86,370 | 84,067 | 52,358 | 72,442 | 100% |
| 5 | node-http | 22.23.3 | 83,333 | 84,621 | 53,716 | 72,355 | 100% |
| 6 | polka | 0.5.2 | 87,483 | 82,590 | 48,656 | 70,577 | 98% |
| 7 | fastify | 5.12.7 | 82,130 | 79,829 | 51,053 | 69,432 | 96% |
| 8 | hono | 4.13.13 | 76,350 | 73,240 | 44,570 | 62,931 | 87% |
| 9 | 0http | 5.2.0 | 73,558 | 68,286 | 42,735 | 59,876 | 83% |
| 10 | restify | 12.0.0 | 62,211 | 61,467 | 36,157 | 51,709 | 71% |
| 11 | koa | 3.2.1 | 63,372 | 59,865 | 34,859 | 50,948 | 70% |
| 12 | hapi | 21.4.10 | 61,140 | 59,654 | 28,514 | 47,026 | 65% |
| 13 | tinyhttp | 3.0.11 | 44,310 | 44,218 | 31,822 | 39,653 | 55% |
| 14 | express | 5.3.0 | 20,629 | 20,612 | 14,174 | 18,198 | 25% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 199,446 | 4.44 | 6.00 | 29.86 | 4.9 | 58 | 0 | 239% |
| 2 | **kidlat** | 172,794 | 5.42 | 8.00 | 32.46 | 5.4 | 61 | 0 | 207% |
| 3 | hyper-express | 167,088 | 5.40 | 8.00 | 22.31 | 6.2 | 71 | 0 | 201% |
| 4 | polka | 87,483 | 10.95 | 20.00 | 15.60 | 11.5 | 101 | 0 | 105% |
| 5 | h3 | 86,370 | 11.10 | 20.00 | 15.16 | 11.6 | 105 | 0 | 104% |
| 6 | node-http | 83,333 | 11.50 | 22.00 | 16.37 | 12.1 | 104 | 0 | 100% |
| 7 | fastify | 82,130 | 11.69 | 22.00 | 14.72 | 12.2 | 106 | 0 | 99% |
| 8 | hono | 76,350 | 12.59 | 22.00 | 12.52 | 13.2 | 104 | 0 | 92% |
| 9 | 0http | 73,558 | 13.11 | 25.00 | 13.12 | 13.9 | 105 | 0 | 88% |
| 10 | koa | 63,372 | 15.28 | 29.00 | 11.30 | 15.9 | 120 | 0 | 76% |
| 11 | restify | 62,211 | 15.59 | 29.00 | 11.21 | 16.2 | 113 | 0 | 75% |
| 12 | hapi | 61,140 | 15.83 | 29.00 | 13.64 | 16.6 | 132 | 0 | 73% |
| 13 | tinyhttp | 44,310 | 22.07 | 47.00 | 7.48 | 35.4 | 189 | 0 | 53% |
| 14 | express | 20,629 | 47.96 | 65.00 | 3.68 | 59.2 | 188 | 0 | 25% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 202,064 | 4.32 | 6.00 | 29.10 | 4.8 | 59 | 0 | 239% |
| 2 | **kidlat** | 194,496 | 4.65 | 7.00 | 35.42 | 4.9 | 61 | 0 | 230% |
| 3 | hyper-express | 160,797 | 5.77 | 8.00 | 20.55 | 6.5 | 79 | 0 | 190% |
| 4 | node-http | 84,621 | 11.31 | 20.00 | 16.06 | 11.8 | 109 | 0 | 100% |
| 5 | h3 | 84,067 | 11.41 | 21.00 | 14.27 | 11.9 | 110 | 0 | 99% |
| 6 | polka | 82,590 | 11.59 | 22.00 | 14.26 | 12.1 | 106 | 0 | 98% |
| 7 | fastify | 79,829 | 12.03 | 22.00 | 13.86 | 12.6 | 111 | 0 | 94% |
| 8 | hono | 73,240 | 13.16 | 25.00 | 11.60 | 13.7 | 109 | 0 | 87% |
| 9 | 0http | 68,286 | 14.15 | 27.00 | 11.79 | 15.0 | 110 | 0 | 81% |
| 10 | restify | 61,467 | 15.78 | 30.00 | 10.73 | 16.4 | 124 | 0 | 73% |
| 11 | koa | 59,865 | 16.21 | 30.00 | 10.33 | 16.8 | 130 | 0 | 71% |
| 12 | hapi | 59,654 | 16.28 | 30.00 | 12.97 | 17.0 | 141 | 0 | 70% |
| 13 | tinyhttp | 44,218 | 22.12 | 45.00 | 7.21 | 35.7 | 189 | 0 | 52% |
| 14 | express | 20,612 | 48.00 | 63.00 | 3.56 | 58.8 | 189 | 0 | 24% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 200,064 | 4.36 | 7.00 | 99.60 | 4.9 | 65 | 0 | 372% |
| 2 | uws | 172,202 | 5.24 | 8.00 | 79.15 | 5.9 | 67 | 0 | 321% |
| 3 | hyper-express | 89,395 | 10.69 | 14.00 | 39.64 | 12.1 | 101 | 0 | 166% |
| 4 | node-http | 53,716 | 18.12 | 38.00 | 27.20 | 18.9 | 110 | 0 | 100% |
| 5 | h3 | 52,358 | 18.64 | 40.00 | 25.42 | 19.3 | 112 | 0 | 97% |
| 6 | fastify | 51,053 | 19.09 | 40.00 | 24.98 | 20.0 | 112 | 0 | 95% |
| 7 | polka | 48,656 | 20.05 | 43.00 | 23.76 | 21.0 | 108 | 0 | 91% |
| 8 | hono | 44,570 | 21.94 | 46.00 | 21.13 | 23.0 | 107 | 0 | 83% |
| 9 | 0http | 42,735 | 22.91 | 46.00 | 20.87 | 24.6 | 112 | 0 | 80% |
| 10 | restify | 36,157 | 27.15 | 58.00 | 17.72 | 28.3 | 115 | 0 | 67% |
| 11 | koa | 34,859 | 28.18 | 60.00 | 17.02 | 29.6 | 125 | 0 | 65% |
| 12 | tinyhttp | 31,822 | 30.93 | 65.00 | 17.75 | 46.9 | 193 | 0 | 59% |
| 13 | hapi | 28,514 | 34.56 | 71.00 | 14.60 | 35.9 | 142 | 0 | 53% |
| 14 | express | 14,174 | 69.99 | 97.00 | 6.92 | 85.1 | 189 | 0 | 26% |

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
