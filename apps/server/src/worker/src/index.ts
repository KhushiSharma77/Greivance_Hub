import logger from "../../lib/logger";
import "./queues/grievance.queue";
import "./queues/duplicate.queue";
import "./queues/multilingual.queue";
import "./queues/routing.queue";

logger.info("BullMQ workers started 🚀");

const shutdown = async (signal: string) => {
  logger.info({ signal }, "Shutting down workers gracefully...");

 
//   await Promise.all([
//     grievanceWorker.close(),
//     duplicateWorker.close(),
//     multilingualWorker.close(),
//     routingWorker.close(),
//   ]);

  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
