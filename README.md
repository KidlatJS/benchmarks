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
Run on 10/19/2026, 01:58:09 (Manila Time, UTC+8) · INTEL(R) XEON(R) PLATINUM 8573C (4 threads, 16 GB) · Linux 6.17.0-1022-azure (x64) · Node v22.23.3

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 2.4.0 | 156,346 | 155,446 | 179,501 | 163,397 | 246% |
| 2 | uws | 20.71.0 | 166,157 | 169,446 | 144,451 | 159,621 | 240% |
| 3 | hyper-express | 7.0.2 | 190,486 | 177,190 | 87,802 | 143,638 | 216% |
| 4 | 0http | 5.2.0 | 95,016 | 97,075 | 53,711 | 79,127 | 119% |
| 5 | fastify | 5.12.7 | 88,034 | 89,418 | 48,239 | 72,414 | 109% |
| 6 | polka | 0.5.2 | 91,150 | 86,520 | 40,938 | 68,601 | 103% |
| 7 | h3 | 2.0.2 | 84,734 | 81,048 | 43,894 | 67,050 | 101% |
| 8 | node-http | 22.23.3 | 80,946 | 80,344 | 45,223 | 66,502 | 100% |
| 9 | hono | 4.13.13 | 87,595 | 81,365 | 37,792 | 64,581 | 97% |
| 10 | restify | 12.0.0 | 64,676 | 63,844 | 31,015 | 50,405 | 76% |
| 11 | koa | 3.2.1 | 65,614 | 63,635 | 29,367 | 49,680 | 75% |
| 12 | hapi | 21.4.10 | 60,134 | 58,237 | 23,201 | 43,312 | 65% |
| 13 | tinyhttp | 3.0.11 | 43,893 | 42,870 | 25,098 | 36,146 | 54% |
| 14 | express | 5.3.0 | 18,706 | 19,059 | 11,734 | 16,113 | 24% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 190,486 | 4.80 | 8.00 | 25.43 | 5.4 | 70 | 0 | 235% |
| 2 | uws | 166,157 | 5.54 | 9.00 | 24.88 | 5.4 | 58 | 0 | 205% |
| 3 | **kidlat** | 156,346 | 5.95 | 9.00 | 29.37 | 5.3 | 62 | 0 | 193% |
| 4 | 0http | 95,016 | 10.03 | 15.00 | 16.95 | 10.8 | 101 | 0 | 117% |
| 5 | polka | 91,150 | 10.48 | 18.00 | 16.25 | 11.0 | 101 | 0 | 113% |
| 6 | fastify | 88,034 | 10.86 | 18.00 | 15.78 | 11.4 | 106 | 0 | 109% |
| 7 | hono | 87,595 | 10.93 | 18.00 | 14.37 | 11.5 | 106 | 0 | 108% |
| 8 | h3 | 84,734 | 11.31 | 19.00 | 14.87 | 11.9 | 106 | 0 | 105% |
| 9 | node-http | 80,946 | 11.86 | 19.00 | 15.90 | 12.4 | 104 | 0 | 100% |
| 10 | koa | 65,614 | 14.74 | 26.00 | 11.70 | 15.4 | 114 | 0 | 81% |
| 11 | restify | 64,676 | 14.97 | 26.00 | 11.66 | 15.6 | 117 | 0 | 80% |
| 12 | hapi | 60,134 | 16.13 | 28.00 | 13.42 | 16.9 | 129 | 0 | 74% |
| 13 | tinyhttp | 43,893 | 22.29 | 45.00 | 7.41 | 36.7 | 190 | 0 | 54% |
| 14 | express | 18,706 | 52.94 | 71.00 | 3.34 | 61.9 | 186 | 0 | 23% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 177,190 | 5.18 | 8.00 | 22.64 | 5.8 | 79 | 0 | 221% |
| 2 | uws | 169,446 | 5.41 | 9.00 | 24.40 | 5.3 | 60 | 0 | 211% |
| 3 | **kidlat** | 155,446 | 5.98 | 9.00 | 28.31 | 5.4 | 62 | 0 | 193% |
| 4 | 0http | 97,075 | 9.81 | 15.00 | 16.76 | 10.8 | 105 | 0 | 121% |
| 5 | fastify | 89,418 | 10.70 | 18.00 | 15.52 | 11.2 | 111 | 0 | 111% |
| 6 | polka | 86,520 | 11.07 | 18.00 | 14.93 | 11.6 | 106 | 0 | 108% |
| 7 | hono | 81,365 | 11.80 | 20.00 | 12.88 | 12.4 | 113 | 0 | 101% |
| 8 | h3 | 81,048 | 11.84 | 20.00 | 13.76 | 12.4 | 111 | 0 | 101% |
| 9 | node-http | 80,344 | 11.94 | 20.00 | 15.25 | 12.5 | 108 | 0 | 100% |
| 10 | restify | 63,844 | 15.17 | 26.00 | 11.14 | 15.8 | 127 | 0 | 79% |
| 11 | koa | 63,635 | 15.21 | 27.00 | 10.98 | 15.8 | 126 | 0 | 79% |
| 12 | hapi | 58,237 | 16.68 | 29.00 | 12.66 | 17.4 | 169 | 0 | 72% |
| 13 | tinyhttp | 42,870 | 22.83 | 44.00 | 6.99 | 37.6 | 189 | 0 | 53% |
| 14 | express | 19,059 | 51.94 | 71.00 | 3.29 | 60.5 | 186 | 0 | 24% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 179,501 | 5.20 | 8.00 | 89.36 | 5.4 | 62 | 0 | 397% |
| 2 | uws | 144,451 | 6.43 | 10.00 | 66.41 | 7.1 | 67 | 0 | 319% |
| 3 | hyper-express | 87,802 | 10.91 | 16.00 | 38.93 | 11.9 | 99 | 0 | 194% |
| 4 | 0http | 53,711 | 18.12 | 37.00 | 26.23 | 19.6 | 107 | 0 | 119% |
| 5 | fastify | 48,239 | 20.23 | 43.00 | 23.60 | 21.1 | 113 | 0 | 107% |
| 6 | node-http | 45,223 | 21.61 | 46.00 | 22.90 | 22.6 | 107 | 0 | 100% |
| 7 | h3 | 43,894 | 22.29 | 47.00 | 21.30 | 23.2 | 112 | 0 | 97% |
| 8 | polka | 40,938 | 23.93 | 51.00 | 19.99 | 25.1 | 106 | 0 | 91% |
| 9 | hono | 37,792 | 25.96 | 55.00 | 17.91 | 27.0 | 103 | 0 | 84% |
| 10 | restify | 31,015 | 31.74 | 64.00 | 15.20 | 32.9 | 124 | 0 | 69% |
| 11 | koa | 29,367 | 33.54 | 67.00 | 14.34 | 34.8 | 115 | 0 | 65% |
| 12 | tinyhttp | 25,098 | 39.34 | 81.00 | 14.00 | 58.4 | 193 | 0 | 55% |
| 13 | hapi | 23,201 | 42.59 | 80.00 | 11.88 | 43.7 | 170 | 0 | 51% |
| 14 | express | 11,734 | 84.63 | 114.00 | 5.73 | 96.7 | 186 | 0 | 26% |

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
