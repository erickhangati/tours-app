const express = require('express');
const router = express.Router();

const authControllers = require('../controllers/authController');

router
  .route('/login')
  .get(authControllers.protect, authControllers.isLoggedIn)
  .post(authControllers.login);

router.route('/sign-up').post(authControllers.signUp);
router.route('/forgot-password').post(authControllers.forgotPassword);
router.route('/reset-password/:token').patch(authControllers.resetPassword);

module.exports = router;
