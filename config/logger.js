const winston = require('winston');

const errorStackTracerFormat = winston.format((info) => {
  if (info && info instanceof Error) {
    Object.assign(info, {
      message: `${info.message}\n${info.stack}`,
    });
  }
  return info;
});

const logger = winston.createLogger({
  level: 'verbose',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD hh:mm:ss.SSSSAZZ',
    }),
    errorStackTracerFormat(),
    winston.format.printf(({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`),
  ),
  transports: [new winston.transports.Console()],
});

module.exports = logger;
