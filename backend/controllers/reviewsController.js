const Review = require('../models/reviewsModel');

exports.getReviews = (req, res) => {
  res.status(200).json({ status: 'success' });
};
