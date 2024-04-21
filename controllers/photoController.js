const Photo = require('./../models/photoModel');
const factory = require('../controllers/handlerFactory');
const multer = require('multer');
const sharp = require('sharp');
const AsyncHandle = require('./../utils/asyncHandle');

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

exports.getAllPhotos = factory.getAll(Photo);
exports.getPhoto = factory.getOne(Photo, { path: 'likes' });
exports.uploadPhoto = factory.createOne(Photo);
exports.patchPhoto = factory.updateOne(Photo);
exports.deletePhoto = factory.deleteOne(Photo);
