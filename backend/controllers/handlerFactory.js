const AppError = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    let id;
    if (req.params.reviewId) id = req.params.reviewId;
    else if (req.params.tourId) id = req.params.reviewId;

    const doc = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) return next(new AppError('Cannot find document', 404));

    res.status(200).json({
      status: 'success',
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    let id;
    if (req.params.reviewId) id = req.params.reviewId;
    else if (req.params.tourId) id = req.params.reviewId;

    const doc = await Model.findByIdAndDelete(id);
    if (!doc) return next(new AppError('Cannot find document', 404));

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
