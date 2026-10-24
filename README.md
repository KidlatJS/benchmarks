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
Run on 10/24/2026, 20:35:12 (Manila Time, UTC+8) · INTEL(R) XEON(R) PLATINUM 8573C (4 threads, 16 GB) · Linux 6.17.0-1022-azure (x64) · Node v22.23.3

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | uws | 20.71.0 | 155,322 | 155,683 | 140,941 | 150,489 | 223% |
| 2 | **kidlat** | 2.4.0 | 132,040 | 134,864 | 160,474 | 141,906 | 211% |
| 3 | hyper-express | 7.0.2 | 177,843 | 159,549 | 80,074 | 131,464 | 195% |
| 4 | node-http | 22.23.3 | 81,710 | 81,475 | 45,922 | 67,366 | 100% |
| 5 | fastify | 5.12.7 | 81,093 | 80,995 | 43,417 | 65,821 | 98% |
| 6 | 0http | 5.2.0 | 78,219 | 77,339 | 45,462 | 65,031 | 97% |
| 7 | hono | 4.13.13 | 81,768 | 79,765 | 38,218 | 62,935 | 93% |
| 8 | h3 | 2.0.2 | 79,690 | 75,568 | 40,396 | 62,425 | 93% |
| 9 | polka | 0.5.2 | 80,533 | 78,192 | 35,805 | 60,864 | 90% |
| 10 | restify | 12.0.0 | 58,822 | 59,782 | 29,642 | 47,062 | 70% |
| 11 | koa | 3.2.1 | 59,414 | 60,219 | 28,679 | 46,816 | 69% |
| 12 | hapi | 21.4.10 | 53,482 | 52,618 | 22,953 | 40,123 | 60% |
| 13 | tinyhttp | 3.0.11 | 42,191 | 42,130 | 24,942 | 35,393 | 53% |
| 14 | express | 5.3.0 | 18,554 | 18,869 | 11,859 | 16,072 | 24% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 177,843 | 5.13 | 8.00 | 23.74 | 5.8 | 78 | 0 | 218% |
| 2 | uws | 155,322 | 6.03 | 9.00 | 23.26 | 5.6 | 58 | 0 | 190% |
| 3 | **kidlat** | 132,040 | 7.16 | 10.00 | 24.81 | 6.4 | 61 | 0 | 162% |
| 4 | hono | 81,768 | 11.73 | 20.00 | 13.41 | 12.3 | 101 | 0 | 100% |
| 5 | node-http | 81,710 | 11.76 | 19.00 | 16.05 | 12.3 | 105 | 0 | 100% |
| 6 | fastify | 81,093 | 11.84 | 19.00 | 14.54 | 12.4 | 107 | 0 | 99% |
| 7 | polka | 80,533 | 11.92 | 20.00 | 14.36 | 12.5 | 101 | 0 | 99% |
| 8 | h3 | 79,690 | 12.07 | 20.00 | 13.98 | 12.6 | 106 | 0 | 98% |
| 9 | 0http | 78,219 | 12.29 | 25.00 | 13.95 | 17.8 | 140 | 0 | 96% |
| 10 | koa | 59,414 | 16.33 | 29.00 | 10.60 | 17.0 | 112 | 0 | 73% |
| 11 | restify | 58,822 | 16.50 | 29.00 | 10.60 | 17.2 | 116 | 0 | 72% |
| 12 | hapi | 53,482 | 18.20 | 32.00 | 11.93 | 19.1 | 120 | 0 | 65% |
| 13 | tinyhttp | 42,191 | 23.20 | 46.00 | 7.12 | 38.3 | 181 | 0 | 52% |
| 14 | express | 18,554 | 53.37 | 72.00 | 3.31 | 63.5 | 169 | 0 | 23% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 159,549 | 5.79 | 9.00 | 20.39 | 6.4 | 78 | 0 | 196% |
| 2 | uws | 155,683 | 6.02 | 9.00 | 22.42 | 5.6 | 60 | 0 | 191% |
| 3 | **kidlat** | 134,864 | 7.05 | 10.00 | 24.57 | 6.2 | 61 | 0 | 166% |
| 4 | node-http | 81,475 | 11.79 | 20.00 | 15.46 | 12.3 | 110 | 0 | 100% |
| 5 | fastify | 80,995 | 11.86 | 19.00 | 14.06 | 12.4 | 112 | 0 | 99% |
| 6 | hono | 79,765 | 12.04 | 20.00 | 12.63 | 12.6 | 106 | 0 | 98% |
| 7 | polka | 78,192 | 12.31 | 20.00 | 13.50 | 12.8 | 107 | 0 | 96% |
| 8 | 0http | 77,339 | 12.43 | 25.00 | 13.35 | 17.9 | 141 | 0 | 95% |
| 9 | h3 | 75,568 | 12.73 | 21.00 | 12.83 | 13.3 | 110 | 0 | 93% |
| 10 | koa | 60,219 | 16.10 | 29.00 | 10.39 | 16.7 | 125 | 0 | 74% |
| 11 | restify | 59,782 | 16.23 | 28.00 | 10.43 | 16.9 | 127 | 0 | 73% |
| 12 | hapi | 52,618 | 18.50 | 32.00 | 11.44 | 19.3 | 154 | 0 | 65% |
| 13 | tinyhttp | 42,130 | 23.24 | 44.00 | 6.87 | 38.5 | 188 | 0 | 52% |
| 14 | express | 18,869 | 52.48 | 71.00 | 3.26 | 61.7 | 175 | 0 | 23% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 160,474 | 5.77 | 9.00 | 79.89 | 6.0 | 62 | 0 | 349% |
| 2 | uws | 140,941 | 6.58 | 10.00 | 64.79 | 7.3 | 67 | 0 | 307% |
| 3 | hyper-express | 80,074 | 11.96 | 18.00 | 35.50 | 13.0 | 100 | 0 | 174% |
| 4 | node-http | 45,922 | 21.28 | 43.00 | 23.26 | 22.3 | 108 | 0 | 100% |
| 5 | 0http | 45,462 | 21.50 | 48.00 | 22.20 | 31.1 | 167 | 0 | 99% |
| 6 | fastify | 43,417 | 22.53 | 47.00 | 21.24 | 23.5 | 111 | 0 | 95% |
| 7 | h3 | 40,396 | 24.26 | 51.00 | 19.61 | 25.3 | 112 | 0 | 88% |
| 8 | hono | 38,218 | 25.66 | 54.00 | 18.12 | 26.7 | 116 | 0 | 83% |
| 9 | polka | 35,805 | 27.42 | 59.00 | 17.48 | 28.7 | 105 | 0 | 78% |
| 10 | restify | 29,642 | 33.22 | 67.00 | 14.53 | 34.4 | 116 | 0 | 65% |
| 11 | koa | 28,679 | 34.36 | 68.00 | 14.00 | 35.7 | 122 | 0 | 62% |
| 12 | tinyhttp | 24,942 | 39.58 | 80.00 | 13.91 | 59.4 | 192 | 0 | 54% |
| 13 | hapi | 22,953 | 43.05 | 80.00 | 11.75 | 44.2 | 154 | 0 | 50% |
| 14 | express | 11,859 | 83.76 | 117.00 | 5.79 | 97.3 | 185 | 0 | 26% |

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
