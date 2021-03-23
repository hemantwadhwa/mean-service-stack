const AdminHelper = require('../helpers/admin');
const HttpHelper = require('../helpers/http-response');
const RequestLogger = require('../helpers/request-logger');

/**
 * Authentication
 * @namespace Authentication
 */

/**
 * Admin Login API
 * @member Authentication
 *
 * @param {Object} req - Express HTTP Request
 * @param {Object} req.body - Request Body
 * @param {String} req.body.username - Admin Username
 * @param {String} req.body.password - Admin Password
 * @param {Object} res - Express HTTP Response
 */
exports.loginAdmin = function loginAdmin(req, res) {
  const start = Date.now();

  AdminHelper.validateLoginRequest(req.body)
    .then(() => AdminHelper.handleLoginRequest(req.body))
    .then((token) => {
      const successMessage = 'Logged In';
      HttpHelper.success(res, token, successMessage);
    })
    .catch((err) => {
      const errorMessage = (err || {}).message || 'Internal Server Error';
      RequestLogger.logError(req, err, Date.now() - start, errorMessage, true);
      HttpHelper.serverError(res, {}, errorMessage);
    });
};

/**
 * Retrieve Admin Profile
 * @member Authentication
 *
 * @param {Object} req - Express HTTP Request
 * @param {Object} res - Express HTTP Response
 */
exports.getAdminProfile = function getAdminProfile(req, res) {
  HttpHelper.success(res, req.user, 'Account Retrieved');
};
