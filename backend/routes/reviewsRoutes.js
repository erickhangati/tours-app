const express = require('express');
const reviewsController = require('../controllers/reviewsController.js');

const router = express.Router();

router
  .route('/')
  .get(reviewsController.getReviews)
  .post(reviewsController.createReview);

module.exports = router;
