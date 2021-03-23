const RequestLogger = require('./request-logger');
const HttpHelper = require('./http-response');

exports.checkAdminLogin = function checkAdminLogin(req, res, next) {
  const start = Date.now();

  if ((req.user || {}).accessType === 'Admin') {
    next();
  } else {
    const errorMessage = 'Unauthorised Access';
    RequestLogger.logError(req, new Error(errorMessage), Date.now() - start, errorMessage);
    HttpHelper.authError(res, {}, errorMessage);
  }
};
