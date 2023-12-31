const Tour = require('../models/toursModel');
const { catchAsync } = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.checkTourId = catchAsync(async (req, res, next, val) => {
  const tour = await Tour.findById(req.params.tourId);

  if (!tour)
    return next(new AppError(`Cannot find tour with id ${req.params.id}`), 404);

  next();
});

exports.getTours = catchAsync(async (req, res) => {
  const queryObj = { ...req.query };
  const excludedFields = [
    'sort',
    'ratingsAverage',
    'fields',
    'secret',
    'page',
    'limit',
  ];
  excludedFields.forEach((field) => delete queryObj[field]);

  // QUERRYING
  let queryString = JSON.stringify(queryObj);
  queryString = queryString.replace(
    /\b(gte|gt|lte|lt)\b/g,
    (match) => `$${match}`
  );

  let query = Tour.find(JSON.parse(queryString));

  // SORTING
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // SECRET TOURS
  if (req.body.secretTour) {
    query = query.find({ secretTour: true });
  }

  // SELECTING FIELDS
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields);
  } else {
    query = query.select('-__v');
  }

  // PAGINATION
  const limit = +req.query.limit || 10;
  const page = +req.query.page || 1;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  const tours = await query;

  if (req.query.page) {
    const toursNum = await Tour.countDocuments();
    if (skip >= toursNum) throw new Error('Page does not exist.');
  }

  res
    .status(200)
    .json({ status: 'success', results: tours.length, data: tours });
});

exports.top5Cheap = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = 'price,-ratingsAverage';
  req.query.fields = 'name,price,summary,duration,ratingsAverage';
  next();
};

exports.getTourStats = catchAsync(async (req, res) => {
  const stats = await Tour.aggregate([
    { $match: { ratingsAverage: { $gte: 4 } } },
    {
      $group: {
        _id: '$difficulty',
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRatings: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    { $sort: { avgPrice: 1 } },
  ]);

  res.status(200).json({ status: 'success', data: stats });
});

exports.getMonthlyPlan = catchAsync(async (req, res) => {
  const year = +req.params.year;

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStats: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: { _id: 0 },
    },
    {
      $sort: { numTourStats: -1 },
    },
  ]);

  res.status(200).json({ status: 'success', data: plan });
});

exports.secretTours = (req, res, next) => {
  req.body.secretTour = true;
  next();
};

exports.tourId = (req, res, next) => {
  req.documentId = req.params.tourId;
  next();
};

exports.getTour = factory.getOne(Tour);
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);
