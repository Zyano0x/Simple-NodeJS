const mongoose = require('mongoose');
const slugify = require('slugify');

const photoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A photo must have a name'],
      unique: true,
      trim: true,
      maxlength: [
        40,
        'A photo name must have less or equal then 40 characters',
      ],
      minlength: [
        10,
        'A photo name must have more or equal then 10 characters',
      ],
    },
    slug: String,
    likesQuantity: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      trim: true,
    },
    location: String,
    device: String,
    imageCover: {
      type: String,
      required: [true, 'A photo must have a cover image'],
    },
    images: [String],
    hashTags: [String],
    author: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A photo must have an author'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

photoSchema.virtual('likes', {
  ref: 'Like',
  foreignField: 'photo',
  localField: '_id',
});

photoSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'author',
    select: '-__v -passwordChangedAt',
  });
  next();
});

// DOCUMENT MIDDLEWARE
photoSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Photo = mongoose.model('Photo', photoSchema);

module.exports = Photo;
