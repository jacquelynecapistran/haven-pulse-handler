// Utility helper functions for haven-pulse-handler
const crypto = require("crypto");
const { bridgeConfig } = require("./config");

function computeBridgeDigest(inputData) {
    const raw = typeof inputData === "string" ? inputData : JSON.stringify(inputData || {});
    return crypto.createHash("sha256").update(raw).digest("hex").slice(0, 16);
}

function formatBridgeMetric(label, value) {
    return `[${bridgeConfig.appName}] ${label}: ${value} (${new Date().toISOString()})`;
}

function validateBridgeState(stateObj) {
    return Boolean(stateObj && typeof stateObj === "object");
}

// Algorithmic domain implementation: CLI tool for health-check orchestration and pulse monitoring
function computePulseBackoff(attempt, baseMs, maxMs, jitter) {
  if (attempt < 0) throw new Error('attempt must be >= 0');
  if (baseMs <= 0) throw new Error('baseMs must be > 0');
  if (maxMs < baseMs) throw new Error('maxMs must be >= baseMs');
  const exp = Math.pow(2, attempt);
  const raw = Math.min(baseMs * exp, maxMs);
  const jitterAmt = jitter ? Math.random() * raw * 0.1 : 0;
  const final = Math.round(raw + jitterAmt);
  return Math.min(final, maxMs);
}

module.exports = {
    computeBridgeDigest,
    formatBridgeMetric,
    validateBridgeState,
    computePulseBackoff
};
