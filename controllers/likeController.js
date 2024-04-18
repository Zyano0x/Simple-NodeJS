const Like = require('./../models/likeModel');
const Photo = require('./../models/photoModel');
const AsyncHandle = require('./../utils/asyncHandle');
const ErrorHandle = require('./../utils/errorHandle');

exports.getAllLikes = AsyncHandle(async (req, res, next) => {
  const likes = Like.find();

  res.status(200).json({
    status: 'success',
    result: likes.length,
    data: {
      likes,
    },
  });
});

exports.getLike = AsyncHandle(async (req, res, next) => {
  const like = await Like.findById(req.params.id).populate('user');

  if (!like) return next(new ErrorHandle('No like found with that ID', 404));

  res.status(200).json({
    status: 'success',
    data: {
      like,
    },
  });
});

exports.createLike = AsyncHandle(async (req, res, next) => {
  const newLike = await Like.create(req.body);

  if (!newLike) return next(new ErrorHandle('Cannot like this.', 404));

  await Photo.findByIdAndUpdate(
    newLike.photo._id,
    { $inc: { likesQuantity: 1 } },
    { new: true }
  );

  res.status(201).json({
    status: 'success',
    data: {
      like: newLike,
    },
  });
});

exports.removeLike = AsyncHandle(async (req, res, next) => {
  const photo = await Photo.findById(req.params.id);
  console.log(photo);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
