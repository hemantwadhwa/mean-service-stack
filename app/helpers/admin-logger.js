/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const mongoose = require('mongoose');

const logger = require('../../config/logger');

const AdminLog = mongoose.model('AdminLog');

exports.logApi = (request, timeTaken, message, responseSize) => {
  const {
    resource,
    method,
    url,
    params,
    body,
    query,
    protocol,
  } = request;

  const adminLog = new AdminLog({
    resource,
    method,
    url,
    params,
    body,
    query,
    protocol,
  });

  adminLog.admin = (request.user || {})._id;
  adminLog.serveTime = timeTaken;
  adminLog.message = message;
  adminLog.responseSize = responseSize;
  adminLog
    .save()
    .then(() => { })
    .catch((err) => {
      logger.error(err);
      logger.error((err && err.stack) || err);
    });
};
