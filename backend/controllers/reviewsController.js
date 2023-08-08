const Review = require('../models/reviewsModel');
const { catchAsync } = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getTourReviews = catchAsync(async (req, res) => {
  const reviews = await Review.find({ tour: req.params.tourId });
  res.status(200).json({
    status: 'success',
    reviews,
  });
});

exports.getReview = catchAsync(async (req, res) => {
  const review = await Review.findOne({
    _id: req.params.reviewId,
    tour: req.params.tourId,
  });

  res.status(200).json({
    status: 'success',
    review,
  });
});

exports.createReview = catchAsync(async (req, res) => {
  const reviewData = {
    review: req.body.review,
    tour: req.params.tourId,
    user: req.user._id.toString(),
  };

  const review = await Review.create(reviewData);

  res.status(200).json({
    status: 'success',
    review,
  });
});
