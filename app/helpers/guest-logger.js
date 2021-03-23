const mongoose = require('mongoose');

const logger = require('../../config/logger');

const GuestLog = mongoose.model('GuestLog');

exports.logApi = (request, timeTaken, message, responseSize, isAuthApi) => {
  const {
    resource,
    method,
    url,
    params,
    body,
    query,
    protocol,
  } = request;

  const ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;

  GuestLog.create({
    resource,
    method,
    url,
    params,
    body: isAuthApi ? ({
      ...body,
      password: '',
      otpCode: '',
      code: '',
      verificationCode: '',
    }) : body,
    query,
    protocol,
    ip,
    serveTime: timeTaken,
    message,
    responseSize,
  })
    .then(() => { })
    .catch((err) => {
      logger.error(err);
      logger.error((err || {}).stack || err);
    });
};
