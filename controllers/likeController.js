const Like = require('./../models/likeModel');
const AsyncHandle = require('./../utils/asyncHandle');
const ErrorHandle = require('./../utils/errorHandle');
const factory = require('../controllers/handlerFactory');

exports.getAllLikes = factory.getAll(Like);
exports.getLike = factory.getOne(Like);
exports.createLike = factory.createOne(Like);
