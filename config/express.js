/* eslint no-underscore-dangle: ["error", { "allow": ["__express"] }] */
require('./env')();

const compress = require('compression');
const express = require('express');
const helmet = require('helmet');
const httpModule = require('http');
const jwt = require('express-jwt');
const path = require('path');
const pug = require('pug');

const rootPath = path.normalize(`${__dirname}/..`);

// Load mongo models & API endpoints
const MongoConfig = require('./mongoose');
const ApiRouter = require('../app/routes');
const logger = require('./logger');

module.exports = () => {
  MongoConfig();

  const app = express();

  app.use(helmet());

  app.use((req, res, next) => {
    res.locals.url = `${req.protocol}://${req.headers.host}${req.url}`;

    next();
  });

  app.use(compress({
    filter: (req, res) => /json|text|javascript|css/i.test(res.getHeader('Content-Type')),
  }));

  app.engine('pug', pug.__express);

  app.use(express.urlencoded({
    limit: '50mb',
    extended: true,
  }));

  app.use(express.json({
    limit: '50mb',
  }));

  app.use(express.static(`${rootPath}/public`));

  app.use(jwt({
    secret: Buffer.from(process.env.JWT_SECRET, 'base64'),
    algorithms: ['HS256'],
    credentialsRequired: false,
  }));

  // Log incoming requests to log
  app.use((req, res, next) => {
    logger.info(`${req.method} ${(req.user || {}).accessType || '-'} ${(req.user || {}).username || (req.user || {}).fullName || '-'} ${(req.user || {}).phoneNumber || '-'} ${req.url}`);

    next();
  });

  ApiRouter(app);

  const server = httpModule.createServer(app);

  return server;
};
