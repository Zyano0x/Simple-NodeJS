const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgot_password', authController.forgotPassword);
router.patch('/reset_password/:token', authController.resetPassword);

router.use(authController.protect);

router.patch('/update_password', authController.updatePassword);
router.patch(
  '/update_profile',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateProfile
);
router.patch('/inactive', userController.inactiveAccount);

router.use(authController.restrictTo('admin'));

router.route('/').get(userController.getAllUsers);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.patchUser)
  .delete(userController.deleteUser);

module.exports = router;
