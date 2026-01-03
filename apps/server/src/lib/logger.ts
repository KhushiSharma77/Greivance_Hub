import pino from "pino";
import { env } from "@team-call-of-code/env/server";

const logger = pino({
    level: env.NODE_ENV === "production" ? "info" : "debug",
    transport:
        env.NODE_ENV === "development"
            ? {
                target: "pino-pretty",
                options: {
                    colorize: true,
                    translateTime: "HH:MM:ss Z",
                    ignore: "pid,hostname",
                },
            }
            : undefined,
    formatters: {
        level: (label) => {
            return { level: label };
        },
    },
    base: {
        env: env.NODE_ENV,
    },
});

export default logger;
