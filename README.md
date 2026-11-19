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
Run on 11/19/2026, 20:44:45 (Manila Time, UTC+8) · AMD EPYC 9V45 96-Core Processor (4 threads, 16 GB) · Linux 7.0.0-1019-azure (x64) · Node v22.23.4

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 2.6.0 | 191,379 | 197,152 | 202,074 | 196,820 | 262% |
| 2 | uws | 20.71.0 | 203,565 | 198,922 | 162,701 | 187,467 | 250% |
| 3 | hyper-express | 7.0.2 | 184,064 | 175,120 | 103,024 | 149,193 | 199% |
| 4 | node-http | 22.23.4 | 88,987 | 90,413 | 52,673 | 75,113 | 100% |
| 5 | fastify | 5.12.7 | 85,621 | 84,011 | 49,089 | 70,681 | 94% |
| 6 | polka | 0.5.2 | 85,253 | 85,584 | 46,094 | 69,542 | 93% |
| 7 | h3 | 2.0.2 | 83,451 | 80,107 | 49,528 | 69,181 | 92% |
| 8 | hono | 4.13.13 | 80,555 | 84,605 | 45,948 | 67,908 | 90% |
| 9 | 0http | 5.2.0 | 84,294 | 76,008 | 47,062 | 67,057 | 89% |
| 10 | restify | 12.0.0 | 70,613 | 66,592 | 37,948 | 56,299 | 75% |
| 11 | koa | 3.2.1 | 65,941 | 65,783 | 36,020 | 53,861 | 72% |
| 12 | hapi | 21.4.10 | 62,532 | 61,272 | 30,072 | 48,660 | 65% |
| 13 | tinyhttp | 3.0.11 | 48,674 | 48,889 | 30,754 | 41,828 | 56% |
| 14 | express | 5.3.0 | 21,876 | 21,452 | 15,695 | 19,457 | 26% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 203,565 | 4.35 | 6.00 | 30.48 | 4.8 | 58 | 0 | 229% |
| 2 | **kidlat** | 191,379 | 4.81 | 7.00 | 35.96 | 5.0 | 63 | 0 | 215% |
| 3 | hyper-express | 184,064 | 5.05 | 7.00 | 24.58 | 5.6 | 79 | 0 | 207% |
| 4 | node-http | 88,987 | 10.77 | 21.00 | 17.48 | 11.3 | 106 | 0 | 100% |
| 5 | fastify | 85,621 | 11.17 | 21.00 | 15.35 | 11.8 | 104 | 0 | 96% |
| 6 | polka | 85,253 | 11.23 | 21.00 | 15.20 | 11.8 | 101 | 0 | 96% |
| 7 | 0http | 84,294 | 11.37 | 22.00 | 15.03 | 12.1 | 105 | 0 | 95% |
| 8 | h3 | 83,451 | 11.49 | 22.00 | 14.64 | 12.1 | 108 | 0 | 94% |
| 9 | hono | 80,555 | 11.91 | 23.00 | 13.21 | 12.5 | 104 | 0 | 91% |
| 10 | restify | 70,613 | 13.65 | 26.00 | 12.73 | 14.3 | 114 | 0 | 79% |
| 11 | koa | 65,941 | 14.65 | 30.00 | 11.76 | 15.3 | 115 | 0 | 74% |
| 12 | hapi | 62,532 | 15.49 | 30.00 | 13.95 | 16.3 | 116 | 0 | 70% |
| 13 | tinyhttp | 48,674 | 20.05 | 40.00 | 8.22 | 31.3 | 191 | 0 | 55% |
| 14 | express | 21,876 | 45.19 | 81.00 | 3.90 | 54.6 | 190 | 0 | 25% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 198,922 | 4.51 | 6.00 | 28.64 | 4.9 | 60 | 0 | 220% |
| 2 | **kidlat** | 197,152 | 4.51 | 7.00 | 35.91 | 4.9 | 64 | 0 | 218% |
| 3 | hyper-express | 175,120 | 5.15 | 7.00 | 22.38 | 5.9 | 79 | 0 | 194% |
| 4 | node-http | 90,413 | 10.62 | 19.00 | 17.16 | 11.1 | 111 | 0 | 100% |
| 5 | polka | 85,584 | 11.19 | 21.00 | 14.77 | 11.7 | 107 | 0 | 95% |
| 6 | hono | 84,605 | 11.32 | 22.00 | 13.39 | 11.9 | 109 | 0 | 94% |
| 7 | fastify | 84,011 | 11.42 | 22.00 | 14.58 | 12.0 | 109 | 0 | 93% |
| 8 | h3 | 80,107 | 12.00 | 24.00 | 13.60 | 12.5 | 112 | 0 | 89% |
| 9 | 0http | 76,008 | 12.66 | 25.00 | 13.12 | 13.4 | 110 | 0 | 84% |
| 10 | restify | 66,592 | 14.51 | 28.00 | 11.62 | 15.1 | 125 | 0 | 74% |
| 11 | koa | 65,783 | 14.71 | 29.00 | 11.35 | 15.3 | 124 | 0 | 73% |
| 12 | hapi | 61,272 | 15.82 | 31.00 | 13.32 | 16.6 | 137 | 0 | 68% |
| 13 | tinyhttp | 48,889 | 19.96 | 40.00 | 7.97 | 31.8 | 191 | 0 | 54% |
| 14 | express | 21,452 | 46.09 | 82.00 | 3.70 | 55.7 | 190 | 0 | 24% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 202,074 | 4.29 | 6.00 | 100.60 | 4.9 | 69 | 0 | 384% |
| 2 | uws | 162,701 | 5.66 | 8.00 | 74.79 | 6.4 | 67 | 0 | 309% |
| 3 | hyper-express | 103,024 | 9.17 | 13.00 | 45.69 | 10.2 | 101 | 0 | 196% |
| 4 | node-http | 52,673 | 18.49 | 40.00 | 26.67 | 19.3 | 113 | 0 | 100% |
| 5 | h3 | 49,528 | 19.68 | 43.00 | 24.04 | 20.5 | 117 | 0 | 94% |
| 6 | fastify | 49,089 | 19.87 | 44.00 | 24.02 | 20.9 | 112 | 0 | 93% |
| 7 | 0http | 47,062 | 20.75 | 44.00 | 22.98 | 22.1 | 113 | 0 | 89% |
| 8 | polka | 46,094 | 21.19 | 48.00 | 22.51 | 22.4 | 105 | 0 | 88% |
| 9 | hono | 45,948 | 21.26 | 49.00 | 21.78 | 22.2 | 115 | 0 | 87% |
| 10 | restify | 37,948 | 25.85 | 59.00 | 18.60 | 26.9 | 116 | 0 | 72% |
| 11 | koa | 36,020 | 27.25 | 62.00 | 17.59 | 28.4 | 118 | 0 | 68% |
| 12 | tinyhttp | 30,754 | 32.01 | 69.00 | 17.16 | 47.6 | 196 | 0 | 58% |
| 13 | hapi | 30,072 | 32.74 | 70.00 | 15.40 | 33.9 | 138 | 0 | 57% |
| 14 | express | 15,695 | 63.17 | 84.00 | 7.66 | 75.8 | 193 | 0 | 30% |

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
