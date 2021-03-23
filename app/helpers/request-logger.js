/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const mongoose = require('mongoose');

const AdminLogger = require('./admin-logger');
const GuestLogger = require('./guest-logger');
const logger = require('../../config/logger');

const ErrorLog = mongoose.model('ErrorLog');

exports.logApi = (request, serveTime, message, responseLength, isAuthApi) => {
  switch ((request.user || {}).accessType) {
    case 'Admin':
      AdminLogger.logApi(request, serveTime, message, responseLength, isAuthApi);
      break;
    default:
      GuestLogger.logApi(request, serveTime, message, responseLength, isAuthApi);
  }
};

exports.logError = function logError(request, err, serveTime, message, isAuthApi) {
  const error = typeof err === 'string' ? new Error(err) : err;

  const newEntry = new ErrorLog({
    accountID: (request.user || {})._id,
    accessType: (request.user || {}).accessType,
    serveTime,
    message,
    resource: request.resource,
    method: request.method,
    url: request.url,
    params: request.params,
    body: isAuthApi ? {} : request.body,
    query: request.query,
    protocol: request.protocol,
    error: { ...error, stack: ((error || {}).stack || '').toString() },
  });

  newEntry
    .save()
    .then(() => { })
    .catch((saveErr) => {
      logger.error('------------->');
      logger.error(newEntry);
      logger.error(saveErr);
      logger.error((saveErr || {}).stack || saveErr);
      logger.error('------------->');
    });
};
