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
Run on 10/21/2026, 07:44:26 (Manila Time, UTC+8) · AMD EPYC 7763 64-Core Processor (4 threads, 16 GB) · Linux 6.17.0-1022-azure (x64) · Node v22.23.3

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 2.4.0 | 103,866 | 104,749 | 108,046 | 105,538 | 320% |
| 2 | uws | 20.71.0 | 105,595 | 107,562 | 88,456 | 100,156 | 303% |
| 3 | hyper-express | 7.0.2 | 105,986 | 100,298 | 48,725 | 80,309 | 243% |
| 4 | 0http | 5.2.0 | 51,673 | 50,653 | 21,895 | 38,554 | 117% |
| 5 | node-http | 22.23.3 | 44,870 | 45,256 | 17,734 | 33,023 | 100% |
| 6 | fastify | 5.12.7 | 45,189 | 43,851 | 17,379 | 32,535 | 99% |
| 7 | hono | 4.13.13 | 43,401 | 42,004 | 16,786 | 31,279 | 95% |
| 8 | polka | 0.5.2 | 45,702 | 42,898 | 15,576 | 31,257 | 95% |
| 9 | h3 | 2.0.2 | 42,849 | 40,846 | 16,905 | 30,929 | 94% |
| 10 | restify | 12.0.0 | 33,252 | 32,604 | 12,331 | 23,734 | 72% |
| 11 | koa | 3.2.1 | 30,746 | 30,461 | 11,053 | 21,794 | 66% |
| 12 | hapi | 21.4.10 | 31,515 | 30,449 | 9,346 | 20,776 | 63% |
| 13 | tinyhttp | 3.0.11 | 24,193 | 23,900 | 12,306 | 19,234 | 58% |
| 14 | express | 5.3.0 | 11,242 | 10,970 | 6,031 | 9,060 | 27% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 105,986 | 9.08 | 16.00 | 14.15 | 9.6 | 70 | 0 | 236% |
| 2 | uws | 105,595 | 9.12 | 13.00 | 15.81 | 8.4 | 58 | 0 | 235% |
| 3 | **kidlat** | 103,866 | 9.25 | 16.00 | 19.52 | 9.2 | 62 | 0 | 231% |
| 4 | 0http | 51,673 | 18.85 | 33.00 | 9.22 | 19.7 | 100 | 0 | 115% |
| 5 | polka | 45,702 | 21.38 | 35.00 | 8.15 | 22.0 | 99 | 0 | 102% |
| 6 | fastify | 45,189 | 21.64 | 34.00 | 8.10 | 22.2 | 104 | 0 | 101% |
| 7 | node-http | 44,870 | 21.79 | 37.00 | 8.82 | 22.4 | 103 | 0 | 100% |
| 8 | hono | 43,401 | 22.53 | 37.00 | 7.12 | 23.2 | 102 | 0 | 97% |
| 9 | h3 | 42,849 | 22.82 | 37.00 | 7.52 | 23.5 | 106 | 0 | 95% |
| 10 | restify | 33,252 | 29.55 | 51.00 | 5.99 | 30.3 | 113 | 0 | 74% |
| 11 | hapi | 31,515 | 31.22 | 54.00 | 7.03 | 32.2 | 119 | 0 | 70% |
| 12 | koa | 30,746 | 32.02 | 56.00 | 5.48 | 32.8 | 118 | 0 | 69% |
| 13 | tinyhttp | 24,193 | 40.83 | 84.00 | 4.08 | 57.6 | 175 | 0 | 54% |
| 14 | express | 11,242 | 88.38 | 123.00 | 2.00 | 101.4 | 151 | 0 | 25% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 107,562 | 8.93 | 12.00 | 15.49 | 8.4 | 58 | 0 | 238% |
| 2 | **kidlat** | 104,749 | 9.15 | 11.00 | 19.08 | 9.3 | 62 | 0 | 231% |
| 3 | hyper-express | 100,298 | 9.37 | 17.00 | 12.82 | 10.1 | 79 | 0 | 222% |
| 4 | 0http | 50,653 | 19.25 | 34.00 | 8.74 | 20.1 | 105 | 0 | 112% |
| 5 | node-http | 45,256 | 21.60 | 35.00 | 8.59 | 22.2 | 108 | 0 | 100% |
| 6 | fastify | 43,851 | 22.31 | 38.00 | 7.61 | 22.9 | 109 | 0 | 97% |
| 7 | polka | 42,898 | 22.79 | 37.00 | 7.41 | 23.4 | 105 | 0 | 95% |
| 8 | hono | 42,004 | 23.30 | 39.00 | 6.65 | 23.9 | 107 | 0 | 93% |
| 9 | h3 | 40,846 | 23.98 | 38.00 | 6.93 | 24.6 | 110 | 0 | 90% |
| 10 | restify | 32,604 | 30.17 | 52.00 | 5.69 | 30.8 | 124 | 0 | 72% |
| 11 | koa | 30,461 | 32.32 | 56.00 | 5.26 | 33.0 | 127 | 0 | 67% |
| 12 | hapi | 30,449 | 32.34 | 56.00 | 6.62 | 33.2 | 130 | 0 | 67% |
| 13 | tinyhttp | 23,900 | 41.32 | 77.00 | 3.90 | 57.6 | 174 | 0 | 53% |
| 14 | express | 10,970 | 90.57 | 122.00 | 1.89 | 103.0 | 160 | 0 | 24% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 108,046 | 8.82 | 14.00 | 53.78 | 9.0 | 62 | 0 | 609% |
| 2 | uws | 88,456 | 10.75 | 19.00 | 40.66 | 11.5 | 67 | 0 | 499% |
| 3 | hyper-express | 48,725 | 19.99 | 30.00 | 21.61 | 20.9 | 99 | 0 | 275% |
| 4 | 0http | 21,895 | 45.14 | 98.00 | 10.69 | 48.1 | 169 | 0 | 123% |
| 5 | node-http | 17,734 | 55.87 | 92.00 | 8.98 | 57.1 | 112 | 0 | 100% |
| 6 | fastify | 17,379 | 57.01 | 82.00 | 8.50 | 58.3 | 109 | 0 | 98% |
| 7 | h3 | 16,905 | 58.63 | 84.00 | 8.21 | 59.9 | 108 | 0 | 95% |
| 8 | hono | 16,786 | 59.04 | 83.00 | 7.96 | 60.4 | 103 | 0 | 95% |
| 9 | polka | 15,576 | 63.66 | 94.00 | 7.61 | 65.2 | 102 | 0 | 88% |
| 10 | restify | 12,331 | 80.53 | 112.00 | 6.04 | 82.4 | 112 | 0 | 70% |
| 11 | tinyhttp | 12,306 | 80.71 | 112.00 | 6.87 | 100.3 | 176 | 0 | 69% |
| 12 | koa | 11,053 | 89.88 | 124.00 | 5.40 | 91.9 | 113 | 0 | 62% |
| 13 | hapi | 9,346 | 106.38 | 138.00 | 4.79 | 111.0 | 153 | 0 | 53% |
| 14 | express | 6,031 | 165.03 | 200.00 | 2.94 | 182.1 | 161 | 0 | 34% |

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
