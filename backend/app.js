const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const toursRoutes = require('./routes/toursRoutes');
const personsRoutes = require('./routes/personsRoutes');
const usersRoutes = require('./routes/usersRoutes');
const AppError = require('./utils/appError');
const globalErrorHandling = require('./controllers/errorController');

const app = express();

app.use(cors());

app.use(cookieParser());
app.use(express.json());
app.use(morgan('dev'));

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
app.use('/api/v1/tours/:id', toursRoutes);
app.use('/api/v1/persons', personsRoutes);
app.use('/api/v1/users', usersRoutes);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`));
});

app.use(globalErrorHandling);
module.exports = app;
