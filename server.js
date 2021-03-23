// Load environment config from file
require('./config/env')();

const start = Date.now();

const logger = require('./config/logger');

const app = require('./config/express')();

process.on('unhandledRejection', (err) => {
  logger.error('UncaughtException');
  logger.error(err);
  logger.error((err || {}).stack);
});

process.on('unhandledException', (err) => {
  logger.error('UnhandledException');
  logger.error(err);
  logger.error((err || {}).stack);
});

const server = app.listen(process.env.HTTP_PORT);
// Setup request timeout duration
server.setTimeout(1000 * Number(process.env.HTTP_TIMEOUT));

logger.info(`Server started on port: ${process.env.HTTP_PORT}`);
logger.info(`Server started in ${(Date.now() - start) / 1000} seconds`);
