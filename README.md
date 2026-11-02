# haven-pulse-handler

A zero-dependency CLI orchestrator that schedules, executes, and aggregates health-check pulses across distributed endpoints with deterministic retry and backoff.

## Overview & Problem Statement

In distributed systems, health checks are often scattered across scripts, cron jobs, and ad-hoc commands. This fragmentation leads to inconsistent monitoring, missed failures, and noisy alerts. `haven-pulse-handler` centralizes health-check execution into a single, configurable CLI tool. It runs pulse checks (HTTP, TCP, or custom commands) on a schedule, applies exponential backoff with jitter on failures, and aggregates results into a unified output (JSON, NDJSON, or table).

The core problem it solves: **how to reliably execute and coordinate health checks without a heavy monitoring stack, while keeping dependencies minimal and behavior deterministic.**

## Core Architecture & Highlights

- **Zero dependencies**: Pure Node.js standard library (fs, path, child_process, net, http). No npm installs beyond the package itself.
- **Declarative configuration**: YAML or JSON config file defines endpoints, check types, intervals, and retry policies.
- **Deterministic retry/backoff**: Exponential backoff with optional jitter, capped at a maximum delay, ensuring predictable retry behavior.
- **Pulse scheduling**: Uses `setInterval` with drift correction to maintain consistent pulse timing, even under load.
- **Aggregation & output**: Collects results from all pulses and outputs in JSON, NDJSON, or a human-readable table. Supports exit codes for CI integration.
- **Graceful shutdown**: Handles SIGINT/SIGTERM to flush pending results and exit cleanly.
- **Extensible check types**: Built-in HTTP(S), TCP, and command execution checks. Custom checks can be added via config.

## Installation

```bash
npm install haven-pulse-handler
```

Or run directly with npx:

```bash
npx haven-pulse-handler --config pulse-config.yml
```

## Quick Start

Create a configuration file `pulse-config.yml`:

```yaml
pulses:
  - name: api-health
    type: http
    target: https://api.example.com/health
    interval: 30s
    retry:
      maxAttempts: 3
      baseMs: 1000
      maxMs: 10000
      jitter: true
  - name: db-tcp
    type: tcp
    target: db.example.com:5432
    interval: 60s
    retry:
      maxAttempts: 2
      baseMs: 500
      maxMs: 5000
      jitter: false
```

Run the CLI:

```bash
haven-pulse-handler --config pulse-config.yml --output json
```

Example output (JSON):

```json
{
  "pulses": [
    {
      "name": "api-health",
      "status": "pass",
      "latencyMs": 120,
      "attempts": 1,
      "timestamp": "2026-01-01T00:00:00.000Z"
    },
    {
      "name": "db-tcp",
      "status": "fail",
      "latencyMs": 0,
      "attempts": 3,
      "error": "Connection refused",
      "timestamp": "2026-01-01T00:00:00.000Z"
    }
  ]
}
```

## Configuration / Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `--config, -c` | string | `pulse-config.yml` | Path to config file (YAML or JSON). |
| `--output, -o` | string | `table` | Output format: `json`, `ndjson`, or `table`. |
| `--interval` | string | `30s` | Global default interval for pulses that don't specify one. |
| `--timeout` | string | `5s` | Timeout for each check attempt. |
| `--verbose` | boolean | `false` | Enable verbose logging. |
| `--dry-run` | boolean | `false` | Validate config and print scheduled pulses without executing. |

### Pulse Configuration Fields

- `name`: Unique identifier for the pulse.
- `type`: `http`, `tcp`, or `command`.
- `target`: URL, host:port, or command string.
- `interval`: Human-readable duration (e.g., `30s`, `1m`).
- `retry`: Object with `maxAttempts`, `baseMs`, `maxMs`, `jitter` (boolean).
- `timeout`: Per-attempt timeout (overrides global).
- `headers` (http only): Key-value headers.
- `expectedStatus` (http only): Expected HTTP status code (default 200).

## Performance & Design Constraints

- **Memory footprint**: Minimal—no large buffers or caches. Results are streamed to output to avoid holding all data in memory.
- **Latency**: Each pulse runs independently; retries are non-blocking. The scheduler uses a single-threaded event loop, but I/O operations are async.
- **Determinism**: Backoff calculation is deterministic when `jitter` is false. With jitter, randomness is bounded to 10% of the base delay, preserving predictability.
- **Scalability**: Designed for tens to hundreds of pulses. For thousands, consider a distributed agent model.
- **Node.js version**: Requires Node.js >= 18 (for `fetch` and modern stream APIs).

## License

MIT License © 2026 Savanna Pfannerstill (@jacquelynecapistran)