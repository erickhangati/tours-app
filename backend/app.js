const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const toursRoutes = require('./routes/toursRoutes');
const personsRoutes = require('./routes/personsRoutes');
const usersRoutes = require('./routes/usersRoutes');
const reviewsRoutes = require('./routes/reviewsRoutes');
const AppError = require('./utils/appError');
const globalErrorHandling = require('./controllers/errorController');

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(mongoSanitize());
app.use(xss());
app.use(morgan('dev'));
app.use(helmet());
app.use(
  hpp({
    whitelist: ['duration', 'ratingAverage'],
  })
);

const limiter = rateLimit({
  max: 100,
  windowM: 60 * 60 * 1000,
  message: 'Too many request from this IP',
});

app.use('/api', limiter);

app.get('/', (req, res) => {
  res.json('Welcome to Tours API');
});

app.use('/api/v1/tours', toursRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/reviews', reviewsRoutes);
app.use('/api/v1/persons', personsRoutes);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`));
});

app.use(globalErrorHandling);
module.exports = app;
