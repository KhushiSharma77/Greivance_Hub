import pino from "pino";
import { env } from "@team-call-of-code/env/server";

const logger = pino({
  level: env.NODE_ENV === "production" ? "info" : "debug",
  formatters: {
    level: (label) => ({ level: label }),
  },
  base: {
    env: env.NODE_ENV,
  },
});

export default logger;
