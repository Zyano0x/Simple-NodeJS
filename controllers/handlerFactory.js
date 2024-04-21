const AsyncHandle = require('./../utils/asyncHandle');
const ErrorHandle = require('./../utils/errorHandle');

exports.getAll = (Model) =>
  AsyncHandle(async (req, res, next) => {
    const docs = await Model.find();

    res.status(200).json({
      status: 'success',
      result: docs.length,
      data: {
        docs,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  AsyncHandle(async (req, res, next) => {
    let query = await Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc)
      return next(new ErrorHandle('No document found with that ID', 404));

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.createOne = (Model) =>
  AsyncHandle(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.updateOne = (Model) =>
  AsyncHandle(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);

    if (!doc) {
      return next(new ErrorHandle('No document found with that ID', 404));
    }

    if (doc.author._id !== req.user._id && req.user.role !== 'admin') {
      return next(
        new ErrorHandle('You are not authorized to update this document', 403)
      );
    }

    const updatedDoc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        data: updatedDoc,
      },
    });
  });

exports.deleteOne = (Model) =>
  AsyncHandle(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);

    if (!doc)
      return next(new ErrorHandle('No document found with that ID', 404));

    if (doc.author._id !== req.user._id && req.user.role !== 'admin')
      return next(
        new ErrorHandle('You are not authorized to delete this photo', 403)
      );

    await doc.deleteOne();

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
