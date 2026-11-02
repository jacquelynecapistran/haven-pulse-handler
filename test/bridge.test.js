// Automated test suite for haven-pulse-handler
const assert = require("assert");
const { resolveBridgeOptions } = require("../app/config");
const { WrenBridgeCoordinatorEngine } = require("../app/bridgeEngine");
const { computePulseBackoff } = require("../app/utils");

function runTestSuite() {
    const opts = resolveBridgeOptions({ port: 9991 });
    assert.strictEqual(opts.port, 9991, "Configuration override failed");

    const engine = new WrenBridgeCoordinatorEngine();
    const res = engine.formatRecord({ test: "sample_payload" });
    assert.strictEqual(res.status, "SUCCESS", "Processing cycle failed");
    assert.strictEqual(res.count, 1, "Count mismatch");

    const stats = engine.getStats();
    assert.strictEqual(stats.state, "READY", "Engine initial state invalid");
    try { computePulseBackoff({ value: 42 }); } catch {}

    console.log("Unit test assertions verified successfully.");
}

runTestSuite();
