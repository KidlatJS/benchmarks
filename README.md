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
Run on 11/04/2026, 16:54:13 (Manila Time, UTC+8) · AMD EPYC 9V45 96-Core Processor (4 threads, 16 GB) · Linux 7.0.0-1017-azure (x64) · Node v22.23.4

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | uws | 20.71.0 | 202,090 | 204,064 | 162,179 | 188,409 | 282% |
| 2 | **kidlat** | 2.6.0 | 163,373 | 170,266 | 175,318 | 169,581 | 254% |
| 3 | hyper-express | 7.0.2 | 183,786 | 172,845 | 92,085 | 143,016 | 214% |
| 4 | fastify | 5.12.7 | 83,541 | 81,043 | 49,811 | 69,606 | 104% |
| 5 | hono | 4.13.13 | 82,102 | 80,059 | 46,985 | 67,594 | 101% |
| 6 | node-http | 22.23.4 | 76,277 | 80,269 | 48,838 | 66,870 | 100% |
| 7 | polka | 0.5.2 | 81,099 | 75,486 | 41,752 | 63,463 | 95% |
| 8 | 0http | 5.2.0 | 79,214 | 74,496 | 42,717 | 63,170 | 94% |
| 9 | h3 | 2.0.2 | 73,245 | 71,875 | 45,695 | 62,193 | 93% |
| 10 | restify | 12.0.0 | 62,552 | 60,083 | 34,786 | 50,753 | 76% |
| 11 | koa | 3.2.1 | 62,532 | 59,773 | 33,236 | 49,896 | 75% |
| 12 | hapi | 21.4.10 | 55,531 | 55,734 | 30,314 | 45,440 | 68% |
| 13 | tinyhttp | 3.0.11 | 46,288 | 45,746 | 29,840 | 39,830 | 60% |
| 14 | express | 5.3.0 | 21,586 | 21,533 | 15,329 | 19,242 | 29% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 202,090 | 4.36 | 6.00 | 30.26 | 4.8 | 58 | 0 | 265% |
| 2 | hyper-express | 183,786 | 5.09 | 7.00 | 24.54 | 5.6 | 79 | 0 | 241% |
| 3 | **kidlat** | 163,373 | 5.65 | 8.00 | 30.69 | 5.7 | 63 | 0 | 214% |
| 4 | fastify | 83,541 | 11.50 | 22.00 | 14.98 | 12.0 | 109 | 0 | 110% |
| 5 | hono | 82,102 | 11.66 | 24.00 | 13.47 | 12.2 | 104 | 0 | 108% |
| 6 | polka | 81,099 | 11.84 | 22.00 | 14.46 | 12.4 | 103 | 0 | 106% |
| 7 | 0http | 79,214 | 12.12 | 23.00 | 14.13 | 13.0 | 132 | 0 | 104% |
| 8 | node-http | 76,277 | 12.62 | 24.00 | 14.98 | 13.2 | 105 | 0 | 100% |
| 9 | h3 | 73,245 | 13.13 | 26.00 | 12.85 | 13.7 | 109 | 0 | 96% |
| 10 | restify | 62,552 | 15.50 | 30.00 | 11.27 | 16.1 | 114 | 0 | 82% |
| 11 | koa | 62,532 | 15.49 | 31.00 | 11.15 | 16.1 | 120 | 0 | 82% |
| 12 | hapi | 55,531 | 17.51 | 34.00 | 12.39 | 18.4 | 128 | 0 | 73% |
| 13 | tinyhttp | 46,288 | 21.11 | 42.00 | 7.81 | 33.5 | 191 | 0 | 61% |
| 14 | express | 21,586 | 45.81 | 86.00 | 3.85 | 55.1 | 189 | 0 | 28% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 204,064 | 4.24 | 6.00 | 29.39 | 4.8 | 60 | 0 | 254% |
| 2 | hyper-express | 172,845 | 5.24 | 8.00 | 22.09 | 5.9 | 79 | 0 | 215% |
| 3 | **kidlat** | 170,266 | 5.41 | 9.00 | 31.01 | 5.6 | 64 | 0 | 212% |
| 4 | fastify | 81,043 | 11.84 | 25.00 | 14.07 | 12.4 | 114 | 0 | 101% |
| 5 | node-http | 80,269 | 11.96 | 23.00 | 15.23 | 12.5 | 109 | 0 | 100% |
| 6 | hono | 80,059 | 11.98 | 24.00 | 12.67 | 12.5 | 108 | 0 | 100% |
| 7 | polka | 75,486 | 12.77 | 26.00 | 13.03 | 13.3 | 108 | 0 | 94% |
| 8 | 0http | 74,496 | 12.92 | 26.00 | 12.86 | 13.8 | 132 | 0 | 93% |
| 9 | h3 | 71,875 | 13.41 | 27.00 | 12.20 | 14.0 | 113 | 0 | 90% |
| 10 | restify | 60,083 | 16.15 | 31.00 | 10.49 | 16.8 | 125 | 0 | 75% |
| 11 | koa | 59,773 | 16.24 | 32.00 | 10.32 | 16.9 | 130 | 0 | 74% |
| 12 | hapi | 55,734 | 17.44 | 35.00 | 12.12 | 18.3 | 142 | 0 | 69% |
| 13 | tinyhttp | 45,746 | 21.36 | 43.00 | 7.46 | 34.6 | 192 | 0 | 57% |
| 14 | express | 21,533 | 45.92 | 82.00 | 3.72 | 55.0 | 189 | 0 | 27% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 175,318 | 5.20 | 8.00 | 87.28 | 5.6 | 68 | 0 | 359% |
| 2 | uws | 162,179 | 5.63 | 8.00 | 74.55 | 6.5 | 67 | 0 | 332% |
| 3 | hyper-express | 92,085 | 10.34 | 15.00 | 40.84 | 11.6 | 100 | 0 | 189% |
| 4 | fastify | 49,811 | 19.58 | 45.00 | 24.37 | 20.5 | 114 | 0 | 102% |
| 5 | node-http | 48,838 | 19.98 | 43.00 | 24.73 | 21.0 | 113 | 0 | 100% |
| 6 | hono | 46,985 | 20.79 | 47.00 | 22.27 | 21.6 | 120 | 0 | 96% |
| 7 | h3 | 45,695 | 21.38 | 48.00 | 22.18 | 22.4 | 113 | 0 | 94% |
| 8 | 0http | 42,717 | 22.91 | 49.00 | 20.86 | 24.6 | 135 | 0 | 87% |
| 9 | polka | 41,752 | 23.45 | 54.00 | 20.39 | 24.9 | 99 | 0 | 85% |
| 10 | restify | 34,786 | 28.24 | 63.00 | 17.05 | 29.6 | 118 | 0 | 71% |
| 11 | koa | 33,236 | 29.57 | 65.00 | 16.23 | 31.1 | 126 | 0 | 68% |
| 12 | hapi | 30,314 | 32.48 | 69.00 | 15.53 | 33.5 | 142 | 0 | 62% |
| 13 | tinyhttp | 29,840 | 33.01 | 73.00 | 16.65 | 50.1 | 197 | 0 | 61% |
| 14 | express | 15,329 | 64.70 | 97.00 | 7.48 | 76.9 | 192 | 0 | 31% |

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
