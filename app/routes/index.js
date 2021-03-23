const AuthRouter = require('./auth');

module.exports = (app) => {
  app.use('/api/auth', AuthRouter);
};
