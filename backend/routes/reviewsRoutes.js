const express = require('express');
const reviewsController = require('../controllers/reviewsController.js');

const router = express.Router();

router.route('/').get(reviewsController.getReviews);

module.exports = router;
