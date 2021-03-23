exports.success = function success(res, data, message) {
  res.status(200).json({
    data,
    message,
  });
};

exports.serverError = function serverError(res, data, message) {
  res.status(500).json({
    data,
    message,
  });
};

exports.authError = function authError(res, data, message) {
  res.status(401).json({
    data,
    message,
  });
};
