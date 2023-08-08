const Review = require('../models/reviewsModel');
const { catchAsync } = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getReviews = catchAsync(async (req, res) => {
  const reviews = await Review.find();
  if (!reviews) return next(new AppError(`No reviews`), 404);
  res.status(200).json({ status: 'success', data: { reviews } });
});

exports.createReview = catchAsync(async (req, res) => {
  const review = await Review.create(req.body);
  if (!review) return next(new AppError(`Something went wrong`), 500);
  res.status(200).json({ status: 'success', data: { review } });
});
