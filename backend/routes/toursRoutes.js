const express = require('express');
const toursControllers = require('../controllers/toursControllers');
const authControllers = require('../controllers/authController');

const router = express.Router();

router.param('id', toursControllers.checkTourId);

router
  .route('/')
  .get(toursControllers.getTours)
  .post(toursControllers.createTour);

router
  .route('/top-5-cheap')
  .get(
    authControllers.protect,
    toursControllers.top5Cheap,
    toursControllers.getTours
  );

router.route('/tours-stats').get(toursControllers.getTourStats);
router.route('/tours-stats/:year').get(toursControllers.getMonthlyPlan);

router
  .route('/secret-tours')
  .get(toursControllers.secretTours, toursControllers.getTours);

router
  .route('/:id')
  .get(toursControllers.getTour)
  .patch(toursControllers.updateTour)
  .delete(toursControllers.deleteTour);

router.route('/:tourId/reviews').get(toursControllers.getTourReviews);
router.route('/:tourId/reviews/:reviewId').get(toursControllers.getReview);

module.exports = router;
