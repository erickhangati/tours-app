const Review = require('../models/reviewsModel');
const { catchAsync } = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.getTourReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({ tour: req.params.tourId });

  if (!reviews) return next(new AppError('Cannot find reviews', 404));

  res.status(200).json({
    status: 'success',
    reviews,
  });
});

exports.getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findOne({
    _id: req.params.reviewId,
    tour: req.params.tourId,
  });

  if (!review) return next(new AppError('Cannot find review', 404));

  res.status(200).json({
    status: 'success',
    review,
  });
});

exports.reviewBody = (req, res, next) => {
  req.body.tour = req.params.tourId;
  req.body.user = req.user._id.toString();
  next();
};

exports.reviewId = (req, res, next) => {
  req.document.id = req.params.reviewId;
  next();
};

exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
