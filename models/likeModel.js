const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema(
  {
    photo: {
      type: mongoose.Schema.ObjectId,
      ref: 'Photo',
      required: [true, 'Like must belong to a photo.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Like must belong to a user'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

likeSchema.index({ photo: 1, user: 1 }, { unique: true });

likeSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;
