const express = require('express');
const likeController = require('../controllers/likeController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(likeController.getAllLikes)
  .post(authController.restrictTo('user'), likeController.createLike);
router.route('/:id').get(likeController.getLike);

module.exports = router;
