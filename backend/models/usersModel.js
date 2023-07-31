const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const cypto = require('crypto');

const Schema = mongoose.Schema;

const usersSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    minlength: [3, 'Name should have atleast 3 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide a email'],
    unique: true,
    match: /.+\@.+\..+/,
    lowercase: true,
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, 'Please provide a password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Confirm password is not equal to Password.',
    },
  },
  changedPasswordAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

usersSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  const isValid = await bcryptjs.compare(candidatePassword, userPassword);
  return isValid;
};

usersSchema.methods.changedPassword = function (JWTTimestamp) {
  if (this.changedPasswordAt) {
    const changedTimestamp = parseInt(
      this.changedPasswordAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

usersSchema.methods.createPasswordResetToken = function () {
  const resetToken = cypto.randomBytes(32).toString('hex');

  this.passwordResetToken = cypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 100;

  return resetToken;
};

usersSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcryptjs.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

usersSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.changedPasswordAt = Date.now();
  next();
});

const User = mongoose.model('Users', usersSchema);

module.exports = User;
