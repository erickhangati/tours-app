const express = require('express');
const router = express.Router();

const authControllers = require('../controllers/authController');

router.route('/sign-up').post(authControllers.signUp);
router.route('/login').post(authControllers.login);
router.route('/forgot-password').post(authControllers.forgotPassword);
router.route('/reset-password').patch(authControllers.resetPassword);

module.exports = router;
