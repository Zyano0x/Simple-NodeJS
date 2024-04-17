const Photo = require('../models/photoModel');
const User = require('../models/userModel');
const AsyncHandle = require('../utils/AsyncHandle');
const ErrorHandle = require('../utils/ErrorHandle');

exports.getOverview = AsyncHandle(async (req, res, next) => {
  // 1) Get tour data from collection
  const photos = await Photo.find();

  // 2) Build template
  // 3) Render that template using tour data from 1)
  res.status(200).render('overview', {
    title: 'All Photos',
    photos,
  });
});

exports.getPhoto = AsyncHandle(async (req, res, next) => {
  // 1) Get the data, for the requested tour (including reviews and guides)
  const photo = await Photo.findOne({ slug: req.params.slug });

  if (!photo) {
    return next(new ErrorHandle('There is no tour with that name.', 404));
  }

  // 2) Build template
  // 3) Render template using data from 1)
  res.status(200).render('photo', {
    title: `${photo.name} Photo`,
    photo,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
};

exports.getSignUpForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Sign up your account',
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};

exports.updateUserData = AsyncHandle(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser,
  });
});
