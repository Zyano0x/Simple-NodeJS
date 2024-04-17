const express = require('express');
const photoController = require('../controllers/photoController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(photoController.getAllPhotos)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    photoController.uploadPhotos,
    photoController.resizePhotos,
    photoController.uploadPhoto
  );
router
  .route('/:id')
  .get(photoController.getPhoto)
  .patch(
    authController.protect,
    authController.restrictTo('user', 'admin'),
    photoController.uploadPhotos,
    photoController.resizePhotos,
    photoController.patchPhoto
  )
  .delete(
    authController.protect,
    authController.restrictTo('user', 'admin'),
    photoController.deletePhoto
  );

module.exports = router;
