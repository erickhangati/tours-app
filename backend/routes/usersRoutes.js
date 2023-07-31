const express = require('express');
const router = express.Router();

const authControllers = require('../controllers/authController');
const usersControllers = require('../controllers/usersControllers');

router.route('/login').post(authControllers.login);

router.route('/sign-up').post(authControllers.signUp);
router.route('/forgot-password').post(authControllers.forgotPassword);
router.route('/reset-password/:token').patch(authControllers.resetPassword);

router
  .route('/update-password')
  .post(authControllers.protect, authControllers.updatePassword);

router
  .route('/update-me')
  .patch(authControllers.protect, usersControllers.updateMe);

module.exports = router;
