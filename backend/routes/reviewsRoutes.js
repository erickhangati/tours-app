const express = require('express');
const reviewsController = require('../controllers/reviewsController.js');
const authController = require('../controllers/authController.js');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewsController.getTourReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewsController.reviewBody,
    reviewsController.createReview
  );

router
  .route('/:reviewId')
  .get(reviewsController.getReview)
  .patch(
    authController.protect,
    authController.restrictTo('user'),
    reviewsController.reviewId,
    reviewsController.updateReview
  )
  .delete(
    authController.protect,
    authController.restrictTo('user'),
    reviewsController.reviewId,
    reviewsController.deleteReview
  );

module.exports = router;
