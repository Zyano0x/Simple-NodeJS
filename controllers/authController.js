const User = require('./../models/userModel');
const ErrorHandle = require('./../utils/errorHandle');
const AsyncHandle = require('./../utils/asyncHandle');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const sendMail = require('./../utils/email');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (res, statusCode, user) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 3600 * 1000
    ),
    httpOnly: true,
  };

  user.password = undefined;

  res.cookie('cookie', token, cookieOptions);
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = AsyncHandle(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  createSendToken(res, 201, newUser);
});

exports.login = AsyncHandle(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new ErrorHandle('Please enter email and password', 400));

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new ErrorHandle('Incorrect email or password', 401));

  createSendToken(res, 200, user);
});

exports.logout = (req, res) => {
  res.cookie('cookie', 'LoggedOut', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

exports.protect = AsyncHandle(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  )
    token = req.headers.authorization.split(' ')[1];
  else if (req.cookies.cookie) {
    token = req.cookies.cookie;
  }
  if (!token)
    return next(
      new ErrorHandle('You are not logged in! Please login to get access.', 401)
    );

  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decode.id);
  if (!currentUser)
    return next(
      new ErrorHandle(
        'The user belonging to this token does not longer exist.',
        401
      )
    );

  if (currentUser.changedPasswordAfter(decode.iat))
    return next(
      new ErrorHandle(
        'User recently changed password! Please login again.',
        401
      )
    );

  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

exports.forgotPassword = AsyncHandle(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return next(new ErrorHandle('There is no user with email address.', 404));

  const resetToken = user.createResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/reset_password/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendMail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    return next(
      new ErrorHandle(
        'There was an error sending the email. Try again later!',
        500
      )
    );
  }
});

exports.resetPassword = AsyncHandle(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpires: { $gt: Date.now() },
  });
  if (!user)
    return next(new ErrorHandle('Token is invalid or has expires.', 400));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  await user.save();

  createSendToken(res, 200, user);
});

exports.updatePassword = AsyncHandle(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.correctPassword(req.body.passwordCurrent, user.password)))
    return next(new ErrorHandle('Your current password is wrong.', 401));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  createSendToken(res, 200, user);
});

// Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.cookie) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.cookie,
        process.env.JWT_SECRET
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.restrictTo = function (...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new ErrorHandle(
          'You do not have permission to perform this action.',
          403
        )
      );

    next();
  };
};
