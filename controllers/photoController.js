const Photo = require('./../models/photoModel');
const Like = require('./../models/likeModel');
const ErrorHandle = require('../utils/errorHandle');
const AsyncHandle = require('./../utils/asyncHandle');
const multer = require('multer');
const sharp = require('sharp');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new ErrorHandle('Not an image!', 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadPhotos = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

exports.resizePhotos = AsyncHandle(async (req, res, next) => {
  if (!req.files || !req.files.imageCover || !req.files.images) return next();

  // 1) Cover image
  req.body.imageCover = `photo-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/photos/${req.body.imageCover}`);

  // 2) Images
  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `photo-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/photos/${filename}`);

      req.body.images.push(filename);
    })
  );

  next();
});

exports.getAllPhotos = AsyncHandle(async (req, res, next) => {
  const photos = await Photo.find();

  res.status(200).json({
    status: 'success',
    result: photos.length,
    data: {
      photos,
    },
  });
});

exports.getPhoto = AsyncHandle(async (req, res, next) => {
  const photo = await Photo.findById(req.params.id).populate('likes');

  if (!photo) return next(new ErrorHandle('No photo found with that ID', 404));

  res.status(200).json({
    status: 'success',
    data: {
      photo,
    },
  });
});

exports.uploadPhoto = AsyncHandle(async (req, res, next) => {
  const newPhoto = await Photo.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tour: newPhoto,
    },
  });
});

exports.patchPhoto = AsyncHandle(async (req, res, next) => {
  const photo = await Photo.findById(req.params.id);

  if (!photo) {
    return next(new ErrorHandle('No photo found with that ID', 404));
  }

  // Check if the user making the request is the owner of the photo or if the user is an admin
  if (photo.author._id !== req.user._id && req.user.role !== 'admin') {
    return next(
      new ErrorHandle('You are not authorized to update this photo', 403)
    );
  }
  console.log(photo.author._id, req.user._id);
  // Update the photo
  const updatedPhoto = await Photo.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      photo: updatedPhoto,
    },
  });
});

exports.deletePhoto = AsyncHandle(async (req, res, next) => {
  const photo = await Photo.findById(req.params.id);

  if (!photo) {
    return next(new ErrorHandle('No photo found with that ID', 404));
  }

  if (photo.author._id !== req.user._id && req.user.role !== 'admin') {
    return next(
      new ErrorHandle('You are not authorized to delete this photo', 403)
    );
  }

  await photo.deleteOne();

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
