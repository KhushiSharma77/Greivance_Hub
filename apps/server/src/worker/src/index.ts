/**
 * Worker Bootstrap
 * Entry point for BullMQ workers
 */

import logger from "../../lib/logger";

// TODO: Import and initialize workers
// import { grievanceWorker } from "./workers/grievance.worker";
// import { duplicateWorker } from "./workers/duplicate.worker";
// import { routingWorker } from "./workers/routing.worker";

const startWorkers = async () => {
    try {
        logger.info("Starting BullMQ workers...");

        // TODO: Initialize workers
        // await grievanceWorker.run();
        // await duplicateWorker.run();
        // await routingWorker.run();

        logger.info("All workers started successfully");
    } catch (error) {
        logger.error({ err: error }, "Failed to start workers");
        process.exit(1);
    }
};

// Handle graceful shutdown
process.on("SIGINT", async () => {
    logger.info("Received SIGINT, shutting down workers...");
    // TODO: Close workers gracefully
    process.exit(0);
});

process.on("SIGTERM", async () => {
    logger.info("Received SIGTERM, shutting down workers...");
    // TODO: Close workers gracefully
    process.exit(0);
});

// Start workers if this is the main module
if (require.main === module) {
    startWorkers();
}

export { startWorkers };
