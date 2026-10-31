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
Run on 10/31/2026, 13:06:37 (Manila Time, UTC+8) · INTEL(R) XEON(R) PLATINUM 8573C (4 threads, 16 GB) · Linux 7.0.0-1017-azure (x64) · Node v22.23.4

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | uws | 20.71.0 | 169,798 | 167,654 | 152,484 | 163,126 | 229% |
| 2 | **kidlat** | 2.4.0 | 142,544 | 145,091 | 180,387 | 155,095 | 218% |
| 3 | hyper-express | 7.0.2 | 195,821 | 170,678 | 83,000 | 140,509 | 197% |
| 4 | 0http | 5.2.0 | 98,933 | 99,005 | 53,952 | 80,848 | 114% |
| 5 | node-http | 22.23.4 | 88,357 | 88,157 | 46,331 | 71,196 | 100% |
| 6 | fastify | 5.12.7 | 89,954 | 89,069 | 43,226 | 70,226 | 99% |
| 7 | h3 | 2.0.2 | 85,661 | 83,638 | 43,626 | 67,865 | 95% |
| 8 | polka | 0.5.2 | 90,235 | 86,240 | 38,907 | 67,148 | 94% |
| 9 | hono | 4.13.13 | 86,827 | 83,357 | 40,561 | 66,461 | 93% |
| 10 | restify | 12.0.0 | 63,440 | 61,642 | 30,012 | 48,961 | 69% |
| 11 | koa | 3.2.1 | 62,978 | 61,902 | 28,930 | 48,315 | 68% |
| 12 | hapi | 21.4.10 | 58,390 | 56,906 | 24,016 | 43,053 | 60% |
| 13 | tinyhttp | 3.0.11 | 44,655 | 45,338 | 26,544 | 37,737 | 53% |
| 14 | express | 5.3.0 | 18,875 | 18,558 | 11,871 | 16,080 | 23% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 195,821 | 4.62 | 7.00 | 26.14 | 5.3 | 79 | 0 | 222% |
| 2 | uws | 169,798 | 5.31 | 8.00 | 25.42 | 5.0 | 58 | 0 | 192% |
| 3 | **kidlat** | 142,544 | 6.47 | 10.00 | 26.78 | 5.7 | 61 | 0 | 161% |
| 4 | 0http | 98,933 | 9.62 | 15.00 | 17.64 | 10.4 | 102 | 0 | 112% |
| 5 | polka | 90,235 | 10.61 | 19.00 | 16.09 | 11.2 | 100 | 0 | 102% |
| 6 | fastify | 89,954 | 10.64 | 19.00 | 16.13 | 11.2 | 103 | 0 | 102% |
| 7 | node-http | 88,357 | 10.81 | 18.00 | 17.36 | 11.4 | 102 | 0 | 100% |
| 8 | hono | 86,827 | 11.01 | 20.00 | 14.24 | 11.6 | 104 | 0 | 98% |
| 9 | h3 | 85,661 | 11.17 | 21.00 | 15.03 | 11.8 | 107 | 0 | 97% |
| 10 | restify | 63,440 | 15.26 | 30.00 | 11.44 | 15.9 | 114 | 0 | 72% |
| 11 | koa | 62,978 | 15.38 | 30.00 | 11.23 | 16.0 | 116 | 0 | 71% |
| 12 | hapi | 58,390 | 16.63 | 31.00 | 13.03 | 17.5 | 125 | 0 | 66% |
| 13 | tinyhttp | 44,655 | 21.90 | 42.00 | 7.54 | 36.1 | 182 | 0 | 51% |
| 14 | express | 18,875 | 52.46 | 69.00 | 3.37 | 62.5 | 167 | 0 | 21% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 170,678 | 5.27 | 8.00 | 21.81 | 6.0 | 79 | 0 | 194% |
| 2 | uws | 167,654 | 5.39 | 8.00 | 24.14 | 5.1 | 60 | 0 | 190% |
| 3 | **kidlat** | 145,091 | 6.34 | 10.00 | 26.43 | 5.7 | 61 | 0 | 165% |
| 4 | 0http | 99,005 | 9.61 | 16.00 | 17.09 | 10.5 | 107 | 0 | 112% |
| 5 | fastify | 89,069 | 10.73 | 18.00 | 15.46 | 11.3 | 109 | 0 | 101% |
| 6 | node-http | 88,157 | 10.83 | 20.00 | 16.73 | 11.4 | 107 | 0 | 100% |
| 7 | polka | 86,240 | 11.10 | 19.00 | 14.89 | 11.7 | 106 | 0 | 98% |
| 8 | h3 | 83,638 | 11.44 | 21.00 | 14.20 | 12.0 | 111 | 0 | 95% |
| 9 | hono | 83,357 | 11.49 | 22.00 | 13.20 | 12.1 | 109 | 0 | 95% |
| 10 | koa | 61,902 | 15.64 | 31.00 | 10.69 | 16.3 | 124 | 0 | 70% |
| 11 | restify | 61,642 | 15.72 | 31.00 | 10.76 | 16.3 | 125 | 0 | 70% |
| 12 | hapi | 56,906 | 17.07 | 31.00 | 12.37 | 17.9 | 139 | 0 | 65% |
| 13 | tinyhttp | 45,338 | 21.56 | 41.00 | 7.39 | 35.7 | 185 | 0 | 51% |
| 14 | express | 18,558 | 53.37 | 69.00 | 3.20 | 63.0 | 172 | 0 | 21% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 180,387 | 5.11 | 8.00 | 89.80 | 5.3 | 62 | 0 | 389% |
| 2 | uws | 152,484 | 6.10 | 10.00 | 70.09 | 6.7 | 67 | 0 | 329% |
| 3 | hyper-express | 83,000 | 11.53 | 16.00 | 36.80 | 12.5 | 100 | 0 | 179% |
| 4 | 0http | 53,952 | 18.04 | 36.00 | 26.34 | 19.4 | 111 | 0 | 116% |
| 5 | node-http | 46,331 | 21.10 | 44.00 | 23.46 | 22.0 | 108 | 0 | 100% |
| 6 | h3 | 43,626 | 22.42 | 47.00 | 21.18 | 23.3 | 110 | 0 | 94% |
| 7 | fastify | 43,226 | 22.63 | 52.00 | 21.15 | 23.5 | 112 | 0 | 93% |
| 8 | hono | 40,561 | 24.15 | 54.00 | 19.23 | 25.1 | 105 | 0 | 88% |
| 9 | polka | 38,907 | 25.20 | 57.00 | 19.00 | 26.3 | 101 | 0 | 84% |
| 10 | restify | 30,012 | 32.81 | 68.00 | 14.71 | 33.9 | 123 | 0 | 65% |
| 11 | koa | 28,930 | 34.05 | 70.00 | 14.13 | 35.3 | 126 | 0 | 62% |
| 12 | tinyhttp | 26,544 | 37.16 | 78.00 | 14.81 | 55.3 | 191 | 0 | 57% |
| 13 | hapi | 24,016 | 41.13 | 73.00 | 12.30 | 42.3 | 139 | 0 | 52% |
| 14 | express | 11,871 | 83.66 | 113.00 | 5.80 | 97.7 | 178 | 0 | 26% |

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
