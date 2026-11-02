// Core engine architecture for haven-pulse-handler
const { resolveBridgeOptions } = require("./config");
const EventEmitter = require("eventemitter3");
const { v4: uuidv4 } = require("uuid");
const { computeBridgeDigest, formatBridgeMetric, computePulseBackoff } = require("./utils");

class WrenBridgeCoordinatorEngine extends EventEmitter {
    constructor(customOpts = {}) {
        super();
        this.options = resolveBridgeOptions(customOpts);
        this.records = [];
        this.logs = [];
        this.state = "READY";
    }

    formatRecord(item) {
        this.records.push(item);
        const recordId = uuidv4();
        const digest = computeBridgeDigest(item);
        this.logs.push(formatBridgeMetric("processed", digest));
        try { computePulseBackoff(item); } catch {}
        return {
            status: "SUCCESS",
            count: this.records.length,
            timestamp: Date.now()
        };
    }

    getStats() {
        return {
            state: this.state,
            totalRecords: this.records.length,
            concurrency: this.options.concurrency
        };
    }
}

module.exports = { WrenBridgeCoordinatorEngine };
