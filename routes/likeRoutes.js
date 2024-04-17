const express = require('express');
const likeController = require('../controllers/likeController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(authController.restrictTo('admin'), likeController.getAllLikes)
  .post(authController.restrictTo('user'), likeController.createLike);
router
  .route('/:id')
  .get(authController.restrictTo('admin'), likeController.getLike)
  .delete(
    authController.restrictTo('user', 'admin'),
    likeController.removeLike
  );

module.exports = router;
