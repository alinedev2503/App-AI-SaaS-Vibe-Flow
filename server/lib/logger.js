import pino from "pino";
const level = process.env.LOG_LEVEL || (process.env.NODE_ENV === "production" ? "info" : "debug");
const logger = pino({
    level,
    transport: process.env.NODE_ENV !== "production"
        ? { target: "pino-pretty", options: { colorize: true, translateTime: "SYS:HH:MM:ss", ignore: "pid,hostname" } }
        : undefined,
    formatters: {
        level(label) { return { level: label }; },
    },
    redact: ["req.headers.authorization", "req.body.password", "body.password"],
});
export default logger;
