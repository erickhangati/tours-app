const User = require('../models/usersModel');
const { catchAsync } = require('../utils/catchAsync');
const factory = require('./handlerFactory');

// Filter allowed fields from the req.body
const filteredObj = (obj, ...allowedFields) => {
  const newObj = {};

  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // Create error if user post password
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /update-password',
        400
      )
    );
  }

  // Filter body
  const filteredBody = filteredObj(req.body, 'name', 'email');

  // Update user
  const updatedUser = await User.findOneAndUpdate(
    { email: req.user.email },
    filteredBody,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.userId = (req, res, next) => {
  req.document.id = req.user.id;
  next();
};

exports.deleteUser = factory.updateOne(User);
