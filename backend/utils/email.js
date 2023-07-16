const nodemailer = require('nodemailer');
const { catchAsync } = require('../utils/catchAsync');

module.exports = catchAsync(async (options) => {
  // CREATE TRANSPORTER
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // EMAIL OPTIONS
  const emailOptions = {
    from: 'Eric Khangati <ekhangati@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // SEND EMAIL WITH NODEMAILER
  await transporter.sendMail(emailOptions);
});
