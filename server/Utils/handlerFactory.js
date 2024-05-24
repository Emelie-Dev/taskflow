import { ApiFeatures, QueryFeatures } from './ApiFeatures.js';
import CustomError from './CustomError.js';
import asyncErrorHandler from './asyncErrorHandler.js';

const getAll = (Model, collection) =>
  asyncErrorHandler(async (req, res, next) => {
    let filter = {};

    if (collection === 'tasks') {
      if (req.params.projectId)
        filter = { project: req.params.projectId, assigned: { $ne: true } };
    }

    const result = new ApiFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const data = await result.query;

    return res.status(200).json({
      status: 'success',
      length: data.length,
      data: {
        [collection || 'data']: data,
      },
    });
  });

const getOne = (Model, collection) =>
  asyncErrorHandler(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);

    if (!doc) {
      const err = new CustomError(
        `${collection || 'Document'} with that ID was not found!`,
        404
      );
      return next(err);
    }

    return res.status(200).json({
      status: 'success',
      data: {
        [collection || 'data']: doc,
      },
    });
  });

const createOne = (Model, collection) =>
  asyncErrorHandler(async (req, res, next) => {
    if (!req.body.user) req.body.user = req.user._id;

    const doc = await Model.create(req.body);

    return res.status(201).json({
      status: 'success',
      data: {
        [collection || 'data']: doc,
      },
    });
  });

const updateOne = (Model, collection) =>
  asyncErrorHandler(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      const err = new CustomError(
        `${collection || 'Document'} with that ID was not found!`,
        404
      );
      return next(err);
    }

    return res.status(200).json({
      status: 'success',
      data: {
        [collection || 'data']: doc,
      },
    });
  });

const deleteOne = (Model, collection) =>
  asyncErrorHandler(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      const err = new CustomError(
        `${collection || 'Document'} with that ID was not found!`,
        404
      );
      return next(err);
    }

    return res.status(204).json({
      status: 'success',
      data: null,
    });
  });

const getMyData = (Model, collection) =>
  asyncErrorHandler(async (req, res, next) => {
    const excludeArray = ['month', 'year', 'range', 'day'];

    const result = new ApiFeatures(
      Model.find({ user: req.user._id }),
      req.query,
      ...excludeArray
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    let docs = await result.query;

    let graph = {};

    // Filters tasks based on request query
    if (req.query.month || req.query.year || req.query.range || req.query.day) {
      const result = new QueryFeatures(docs, req.query, collection)
        .getDate()
        .getRange();

      docs = result.model;
      graph = result.graph;
    }

    return res.status(200).send({
      status: 'success',
      data: {
        [collection || 'data']: docs,
        graph,
      },
    });
  });

export default { getAll, createOne, updateOne, deleteOne, getOne, getMyData };
