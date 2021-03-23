const { Router } = require('express');

const router = Router();

const AuthCtrl = require('../controllers/auth');
const AuthHelper = require('../helpers/auth');

router
  .route('/admin')
  .post(AuthCtrl.loginAdmin)
  .get(AuthHelper.checkAdminLogin, AuthCtrl.getAdminProfile);

module.exports = router;
