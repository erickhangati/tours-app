const User = require('../models/usersModel');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const crypto = require('crypto');

const { catchAsync } = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const getToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, req, res) => {
  // CREATE TOKEN
  const token = getToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (req.secure || req.headers['x-forward-proto'] === 'https')
    cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signUp = catchAsync(async (req, res) => {
  const { name, email, password, confirmPassword, changedPasswordAt } =
    req.body;

  // CHECK FOR EXISTING USER
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400).json({
      status: 'failed',
      message: `User with email ${email} already exists`,
    });
    return;
  }

  // CREATE USER
  const user = await User.create({
    name,
    email,
    password,
    confirmPassword,
    changedPasswordAt,
  });

  createSendToken(user, 201, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password exists
  if (!email || !password) {
    return next(new AppError('Provide email & password', 400));
  }

  // CHECK FOR USER
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new AppError(`User with email ${email} does not exist`, 404));
  }

  // CHECK IF EMAIL AND PASSWORD IS CORRECT
  if (!(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 400));
  }

  // If everything is ok send token to client
  createSendToken(user, 200, req, res);
});

exports.protect = async (req, res, next) => {
  // GET TOKEN

  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  // CHECK IF TOKEN AVAILABLE
  if (!token) {
    return next(new AppError('Please login to gain access.', 401));
  }

  // VERIFY TOKEN
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // CHECK IF USER EXISTS
  const checkedUser = await User.findOne({ _id: decoded.id });
  if (!checkedUser) {
    return next(new AppError('User of token no longer exists.', 401));
  }

  // CHECK IF PASSWORD CHANGED
  if (checkedUser.changedPassword(decoded.iat)) {
    return next(new AppError('Password was changed recently.', 401));
  }

  req.user = checkedUser;

  next();
};

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You are not allowed', 403));
    }
    next();
  };

exports.isLoggedIn = async (req, res) => {
  // GET TOKEN

  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  // CHECK IF TOKEN AVAILABLE
  if (!token) {
    res.status(200).json({ status: 'success', user: null });
    return;
  }

  // VERIFY TOKEN
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // CHECK IF USER EXISTS
  const checkedUser = await User.findOne({ _id: decoded.id });
  if (!checkedUser) {
    res.status(200).json({ status: 'success', user: null });
    return;
  }

  // CHECK IF PASSWORD CHANGED
  if (checkedUser.changedPassword(decoded.iat)) {
    res.status(200).json({ status: 'success', user: null });
    return;
  }

  req.user = checkedUser;
  res.status(200).json({ status: 'success', user: checkedUser });
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  // GET USER
  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError(`User not found with email ${email}`, 403));
  }

  // CREATE RANDOM RESET TOKEN
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/reset-password/${resetToken}`;

  const message = `Forgot your password? Click link to set your new password. ${resetURL} \nIf you did not forget your password, please ignore this email.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Your password reset token (valid for 10 mins)`,
      message,
    });

    res.status(200).json({
      status: 'success',
      message: `Reset token sent to email ${email}`,
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending email. Please try again later.',
        500
      )
    );
  }
});

exports.resetPassword = async (req, res, next) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  //  HASH TOKEN
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  // FIND USER
  const user = await User.findOne({
    passwordResetToken: hashedToken,
  });

  if (!user) {
    return next(new AppError(`Invalid token`, 400));
  }

  // CHECK IF TOKEN HAS EXPIRED
  if (new Date(user.passwordResetExpires) < new Date(Date.now())) {
    return next(new AppError(`Token has expired`, 400));
  }

  // IF PASSES ALL THE CHECKS, SET NEW PASSWORD
  user.password = password;
  user.confirmPassword = confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  // If everything is ok send token to client
  createSendToken(user, 200, req, res);
};
