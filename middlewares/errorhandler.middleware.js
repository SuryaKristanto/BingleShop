const winston = require("winston");

const { combine, timestamp, label, prettyPrint } = winston.format;

const logger = winston.createLogger({
  format: combine(
    label({ label: this.error?.message }),
    timestamp(),
    prettyPrint()
  ),
  level: "info",
  defaultMeta: { service: "order-service" },
  transports: [
    new winston.transports.File({
      filename: "log/error.log",
      level: "error",
    }),
  ],
});

module.exports = logger;
