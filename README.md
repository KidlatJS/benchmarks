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
Run on 11/23/2026, 16:49:49 (Manila Time, UTC+8) · INTEL(R) XEON(R) PLATINUM 8573C (4 threads, 16 GB) · Linux 7.0.0-1020-azure (x64) · Node v22.23.5

autocannon: 100 connections, pipelining 10, 40 s per test after a 5 s warm-up, 1 round(s) in random order (median reported).

### Summary (requests/second, higher is better)

| # | Framework | Version | GET / → JSON | GET /user/:id → route parameter | POST /echo → parse and echo JSON body | Geo. mean | vs node:http |
| --: | :-- | :-- | --: | --: | --: | --: | --: |
| 1 | uws | 20.71.0 | 180,333 | 183,149 | 145,441 | 168,728 | 236% |
| 2 | **kidlat** | 2.6.0 | 154,550 | 155,094 | 179,027 | 162,503 | 227% |
| 3 | hyper-express | 7.0.2 | 193,795 | 178,282 | 84,989 | 143,198 | 200% |
| 4 | 0http | 5.2.0 | 99,637 | 98,102 | 52,232 | 79,924 | 112% |
| 5 | node-http | 22.23.5 | 88,266 | 91,096 | 45,578 | 71,562 | 100% |
| 6 | fastify | 5.12.7 | 90,834 | 88,392 | 43,922 | 70,650 | 99% |
| 7 | h3 | 2.0.2 | 89,077 | 83,245 | 43,007 | 68,321 | 95% |
| 8 | hono | 4.13.13 | 88,467 | 85,282 | 41,526 | 67,918 | 95% |
| 9 | polka | 0.5.2 | 92,014 | 84,331 | 38,445 | 66,818 | 93% |
| 10 | restify | 12.0.0 | 64,935 | 64,104 | 29,884 | 49,919 | 70% |
| 11 | koa | 3.2.1 | 63,555 | 63,173 | 27,597 | 48,030 | 67% |
| 12 | hapi | 21.4.10 | 61,025 | 58,466 | 24,394 | 44,317 | 62% |
| 13 | tinyhttp | 3.0.11 | 45,400 | 46,257 | 27,208 | 38,516 | 54% |
| 14 | express | 5.3.0 | 18,369 | 18,147 | 11,483 | 15,643 | 22% |

### GET / → JSON

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | hyper-express | 193,795 | 4.64 | 8.00 | 25.88 | 5.4 | 79 | 0 | 220% |
| 2 | uws | 180,333 | 5.12 | 8.00 | 27.00 | 4.9 | 58 | 0 | 204% |
| 3 | **kidlat** | 154,550 | 5.99 | 10.00 | 29.03 | 5.4 | 64 | 0 | 175% |
| 4 | 0http | 99,637 | 9.54 | 15.00 | 17.77 | 10.3 | 103 | 0 | 113% |
| 5 | polka | 92,014 | 10.36 | 19.00 | 16.41 | 10.9 | 101 | 0 | 104% |
| 6 | fastify | 90,834 | 10.51 | 18.00 | 16.28 | 11.1 | 107 | 0 | 103% |
| 7 | h3 | 89,077 | 10.75 | 19.00 | 15.63 | 11.3 | 103 | 0 | 101% |
| 8 | hono | 88,467 | 10.83 | 20.00 | 14.51 | 11.4 | 107 | 0 | 100% |
| 9 | node-http | 88,266 | 10.84 | 19.00 | 17.34 | 11.4 | 105 | 0 | 100% |
| 10 | restify | 64,935 | 14.91 | 29.00 | 11.70 | 15.5 | 114 | 0 | 74% |
| 11 | koa | 63,555 | 15.23 | 30.00 | 11.33 | 15.9 | 114 | 0 | 72% |
| 12 | hapi | 61,025 | 15.87 | 31.00 | 13.62 | 16.7 | 126 | 0 | 69% |
| 13 | tinyhttp | 45,400 | 21.53 | 42.00 | 7.66 | 34.6 | 183 | 0 | 51% |
| 14 | express | 18,369 | 53.90 | 73.00 | 3.28 | 63.8 | 181 | 0 | 21% |

### GET /user/:id → route parameter

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | uws | 183,149 | 4.99 | 8.00 | 26.37 | 5.0 | 59 | 0 | 201% |
| 2 | hyper-express | 178,282 | 5.12 | 9.00 | 22.78 | 5.9 | 79 | 0 | 196% |
| 3 | **kidlat** | 155,094 | 5.98 | 10.00 | 28.25 | 5.4 | 64 | 0 | 170% |
| 4 | 0http | 98,102 | 9.70 | 16.00 | 16.93 | 10.6 | 106 | 0 | 108% |
| 5 | node-http | 91,096 | 10.51 | 17.00 | 17.29 | 11.0 | 110 | 0 | 100% |
| 6 | fastify | 88,392 | 10.82 | 18.00 | 15.34 | 11.4 | 112 | 0 | 97% |
| 7 | hono | 85,282 | 11.25 | 21.00 | 13.50 | 11.8 | 111 | 0 | 94% |
| 8 | polka | 84,331 | 11.37 | 21.00 | 14.56 | 11.9 | 106 | 0 | 93% |
| 9 | h3 | 83,245 | 11.51 | 22.00 | 14.13 | 12.1 | 108 | 0 | 91% |
| 10 | restify | 64,104 | 15.11 | 29.00 | 11.19 | 15.7 | 126 | 0 | 70% |
| 11 | koa | 63,173 | 15.33 | 31.00 | 10.90 | 15.9 | 124 | 0 | 69% |
| 12 | hapi | 58,466 | 16.63 | 32.00 | 12.71 | 17.4 | 142 | 0 | 64% |
| 13 | tinyhttp | 46,257 | 21.12 | 40.00 | 7.54 | 33.7 | 183 | 0 | 51% |
| 14 | express | 18,147 | 54.57 | 74.00 | 3.13 | 63.9 | 182 | 0 | 20% |

### POST /echo → parse and echo JSON body

| # | Framework | Req/s | Latency avg (ms) | Latency p99 (ms) | Throughput (MB/s) | CPU / req (µs) | RSS (MB) | Errors | vs node:http |
| --: | :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| 1 | **kidlat** | 179,027 | 5.20 | 9.00 | 89.12 | 5.4 | 69 | 0 | 393% |
| 2 | uws | 145,441 | 6.39 | 10.00 | 66.86 | 7.2 | 68 | 0 | 319% |
| 3 | hyper-express | 84,989 | 11.29 | 17.00 | 37.69 | 12.3 | 102 | 0 | 186% |
| 4 | 0http | 52,232 | 18.65 | 42.00 | 25.50 | 20.1 | 108 | 0 | 115% |
| 5 | node-http | 45,578 | 21.44 | 48.00 | 23.08 | 22.4 | 109 | 0 | 100% |
| 6 | fastify | 43,922 | 22.27 | 48.00 | 21.49 | 23.2 | 112 | 0 | 96% |
| 7 | h3 | 43,007 | 22.75 | 49.00 | 20.88 | 23.7 | 113 | 0 | 94% |
| 8 | hono | 41,526 | 23.58 | 50.00 | 19.68 | 24.6 | 107 | 0 | 91% |
| 9 | polka | 38,445 | 25.51 | 56.00 | 18.77 | 26.8 | 105 | 0 | 84% |
| 10 | restify | 29,884 | 32.94 | 68.00 | 14.65 | 34.1 | 116 | 0 | 66% |
| 11 | koa | 27,597 | 35.72 | 71.00 | 13.48 | 37.2 | 114 | 0 | 61% |
| 12 | tinyhttp | 27,208 | 36.24 | 76.00 | 15.18 | 52.6 | 191 | 0 | 60% |
| 13 | hapi | 24,394 | 40.47 | 74.00 | 12.49 | 41.7 | 142 | 0 | 54% |
| 14 | express | 11,483 | 86.49 | 116.00 | 5.61 | 99.8 | 184 | 0 | 25% |

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
