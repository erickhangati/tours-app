const AppError = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');

exports.getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.documentId).populate('reviews');

    if (!doc)
      return next(new AppError(`Cannot find document with id ${id}`), 404);

    res.status(200).json({ status: 'success', data: doc });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    if (!doc) return next(new AppError('Something went wrong', 500));

    res.status(201).json({
      status: 'success',
      data: doc,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.documentId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) return next(new AppError('Cannot find document', 404));

    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.documentId);
    if (!doc) return next(new AppError('Cannot find document', 404));

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
