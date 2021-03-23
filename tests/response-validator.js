exports.checkApiSuccess = function checkApiSuccess(res, expect) {
  return new Promise((resolve) => {
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('message');
    resolve(res);
  });
};

exports.checkApiAuthError = function checkApiAuthError(res, expect) {
  return new Promise((resolve) => {
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('message');
    resolve(res);
  });
};

exports.checkApiServerError = function checkApiServerError(res, expect) {
  return new Promise((resolve) => {
    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('message');
    resolve(res);
  });
};
