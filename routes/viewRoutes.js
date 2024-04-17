const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', authController.isLoggedIn, viewsController.getOverview);
router.get('/photo/:slug', authController.isLoggedIn, viewsController.getPhoto);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get(
  '/register',
  authController.isLoggedIn,
  viewsController.getSignUpForm
);
router.get('/me', authController.protect, viewsController.getAccount);

module.exports = router;
