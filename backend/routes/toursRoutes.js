const express = require('express');
const toursControllers = require('../controllers/toursControllers');
const reviewsRoutes = require('./reviewsRoutes');
const authControllers = require('../controllers/authController');

const router = express.Router();

router.param('id', toursControllers.checkTourId);

router.use('/:tourId/reviews', reviewsRoutes);

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
  .route('/:tourId')
  .get(toursControllers.getTour)
  .patch(toursControllers.updateTour)
  .delete(toursControllers.deleteTour);

module.exports = router;
