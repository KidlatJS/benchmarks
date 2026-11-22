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
Run on 11/22/2026, 10:59:46 (Manila Time, UTC+8) · AMD EPYC 9V45 96-Core Processor (4 threads, 16 GB) · Linux 7.0.0-1020-azure (x64) · Node v22.23.5

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | uws | 20.71.0 | 205,869 | 206,563 | 178,870 | 196,665 | 270% |
| 2 | **kidlat** | 2.6.0 | 170,589 | 179,939 | 188,397 | 179,494 | 246% |
| 3 | hyper-express | 7.0.2 | 182,637 | 177,242 | 105,597 | 150,638 | 207% |
| 4 | node-http | 22.23.5 | 87,952 | 87,213 | 50,380 | 72,839 | 100% |
| 5 | fastify | 5.12.7 | 84,037 | 82,805 | 49,484 | 70,091 | 96% |
| 6 | polka | 0.5.2 | 86,163 | 82,840 | 46,090 | 69,033 | 95% |
| 7 | h3 | 2.0.2 | 80,824 | 79,565 | 47,966 | 67,567 | 93% |
| 8 | hono | 4.13.13 | 82,886 | 79,653 | 46,474 | 67,447 | 93% |
| 9 | 0http | 5.2.0 | 72,413 | 71,384 | 44,594 | 61,315 | 84% |
| 10 | restify | 12.0.0 | 68,924 | 68,822 | 37,981 | 56,479 | 78% |
| 11 | koa | 3.2.1 | 66,231 | 65,053 | 36,743 | 54,096 | 74% |
| 12 | hapi | 21.4.10 | 63,326 | 57,899 | 30,443 | 48,148 | 66% |
| 13 | tinyhttp | 3.0.11 | 47,738 | 46,454 | 30,312 | 40,660 | 56% |
| 14 | express | 5.3.0 | 22,170 | 21,613 | 15,655 | 19,576 | 27% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 205,869 | 4.18 | 7.00 | 30.82 | 4.7 | 58 | 0 | 234% |
| 2 | hyper-express | 182,637 | 5.10 | 7.00 | 24.39 | 5.6 | 79 | 0 | 208% |
| 3 | **kidlat** | 170,589 | 5.34 | 8.00 | 32.05 | 5.4 | 63 | 0 | 194% |
| 4 | node-http | 87,952 | 10.87 | 21.00 | 17.28 | 11.4 | 102 | 0 | 100% |
| 5 | polka | 86,163 | 11.14 | 21.00 | 15.37 | 11.7 | 99 | 0 | 98% |
| 6 | fastify | 84,037 | 11.42 | 24.00 | 15.07 | 12.0 | 104 | 0 | 96% |
| 7 | hono | 82,886 | 11.56 | 23.00 | 13.59 | 12.1 | 103 | 0 | 94% |
| 8 | h3 | 80,824 | 11.86 | 24.00 | 14.18 | 12.4 | 107 | 0 | 92% |
| 9 | 0http | 72,413 | 13.31 | 27.00 | 12.91 | 17.8 | 151 | 0 | 82% |
| 10 | restify | 68,924 | 14.01 | 28.00 | 12.42 | 14.6 | 114 | 0 | 78% |
| 11 | koa | 66,231 | 14.59 | 29.00 | 11.81 | 15.2 | 120 | 0 | 75% |
| 12 | hapi | 63,326 | 15.30 | 30.00 | 14.13 | 16.0 | 131 | 0 | 72% |
| 13 | tinyhttp | 47,738 | 20.45 | 40.00 | 8.06 | 32.1 | 191 | 0 | 54% |
| 14 | express | 22,170 | 44.59 | 82.00 | 3.95 | 53.2 | 188 | 0 | 25% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 206,563 | 4.18 | 6.00 | 29.75 | 4.7 | 60 | 0 | 237% |
| 2 | **kidlat** | 179,939 | 5.08 | 7.00 | 32.77 | 5.2 | 64 | 0 | 206% |
| 3 | hyper-express | 177,242 | 5.11 | 7.00 | 22.65 | 5.8 | 79 | 0 | 203% |
| 4 | node-http | 87,213 | 10.96 | 22.00 | 16.55 | 11.5 | 107 | 0 | 100% |
| 5 | polka | 82,840 | 11.57 | 23.00 | 14.30 | 12.1 | 104 | 0 | 95% |
| 6 | fastify | 82,805 | 11.58 | 21.00 | 14.37 | 12.1 | 109 | 0 | 95% |
| 7 | hono | 79,653 | 12.06 | 24.00 | 12.61 | 12.6 | 108 | 0 | 91% |
| 8 | h3 | 79,565 | 12.07 | 24.00 | 13.51 | 12.6 | 112 | 0 | 91% |
| 9 | 0http | 71,384 | 13.52 | 29.00 | 12.32 | 18.0 | 151 | 0 | 82% |
| 10 | restify | 68,822 | 14.03 | 28.00 | 12.01 | 14.6 | 124 | 0 | 79% |
| 11 | koa | 65,053 | 14.87 | 29.00 | 11.23 | 15.4 | 129 | 0 | 75% |
| 12 | hapi | 57,899 | 16.78 | 33.00 | 12.59 | 17.5 | 142 | 0 | 66% |
| 13 | tinyhttp | 46,454 | 21.03 | 42.00 | 7.58 | 33.6 | 191 | 0 | 53% |
| 14 | express | 21,613 | 45.74 | 83.00 | 3.73 | 54.5 | 193 | 0 | 25% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 188,397 | 4.92 | 7.00 | 93.78 | 5.2 | 67 | 0 | 374% |
| 2 | uws | 178,870 | 5.13 | 7.00 | 82.22 | 5.8 | 67 | 0 | 355% |
| 3 | hyper-express | 105,597 | 8.92 | 12.00 | 46.83 | 9.7 | 99 | 0 | 210% |
| 4 | node-http | 50,380 | 19.35 | 43.00 | 25.51 | 20.2 | 115 | 0 | 100% |
| 5 | fastify | 49,484 | 19.71 | 43.00 | 24.21 | 20.7 | 112 | 0 | 98% |
| 6 | h3 | 47,966 | 20.35 | 45.00 | 23.28 | 21.2 | 113 | 0 | 95% |
| 7 | hono | 46,474 | 21.02 | 48.00 | 22.03 | 21.9 | 114 | 0 | 92% |
| 8 | polka | 46,090 | 21.20 | 50.00 | 22.51 | 22.3 | 111 | 0 | 91% |
| 9 | 0http | 44,594 | 21.93 | 46.00 | 21.77 | 23.3 | 169 | 0 | 89% |
| 10 | restify | 37,981 | 25.82 | 60.00 | 18.62 | 26.7 | 123 | 0 | 75% |
| 11 | koa | 36,743 | 26.70 | 62.00 | 17.94 | 27.7 | 116 | 0 | 73% |
| 12 | hapi | 30,443 | 32.34 | 69.00 | 15.59 | 33.3 | 142 | 0 | 60% |
| 13 | tinyhttp | 30,312 | 32.49 | 69.00 | 16.91 | 48.4 | 196 | 0 | 60% |
| 14 | express | 15,655 | 63.33 | 93.00 | 7.64 | 76.1 | 194 | 0 | 31% |

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
