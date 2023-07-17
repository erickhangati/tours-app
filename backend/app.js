const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

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
