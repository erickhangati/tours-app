const express = require('express');
const reviewsController = require('../controllers/reviewsController.js');
const authController = require('../controllers/authController.js');

const router = express.Router();

router
  .route('/')
  .get(authController.protect, reviewsController.getReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewsController.createReview
  );

module.exports = router;
