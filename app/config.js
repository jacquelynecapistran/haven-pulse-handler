// Configuration for haven-pulse-handler
const os = require("os");
const path = require("path");

const bridgeConfig = {
    appName: "haven-pulse-handler",
    environment: process.env.NODE_ENV || "production",
    port: parseInt(process.env.PORT || "3532", 10),
    timeoutMs: 18591,
    maxBufferItems: 407,
    concurrency: os.cpus().length,
    baseDir: path.resolve(__dirname, "..")
};

function resolveBridgeOptions(overrides = {}) {
    return Object.assign({}, bridgeConfig, overrides);
}

module.exports = {
    bridgeConfig,
    resolveBridgeOptions
};
