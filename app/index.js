// Main application module for haven-pulse-handler
const { WrenBridgeCoordinatorEngine } = require("./bridgeEngine");
const { resolveBridgeOptions } = require("./config");

class WrenBridgeCoordinator {
    constructor(options = {}) {
        this.options = resolveBridgeOptions(options);
        this.engine = new WrenBridgeCoordinatorEngine(this.options);
    }

    dispatch(item) {
        return this.engine.formatRecord(item);
    }

    status() {
        return this.engine.getStats();
    }
}

module.exports = {
    WrenBridgeCoordinator,
    WrenBridgeCoordinatorEngine
};
