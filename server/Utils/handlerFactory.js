import User from '../Models/userModel.js';
import { ApiFeatures, QueryFeatures } from './ApiFeatures.js';
import CustomError from './CustomError.js';
import asyncErrorHandler from './asyncErrorHandler.js';
import Project from '../Models/projectModel.js';

const getAll = (Model, collection) =>
  asyncErrorHandler(async (req, res, next) => {
    let filter = {};

    if (collection === 'tasks') {
      if (req.params.projectId && !req.query.projectPage) {
        filter = {
          user: req.user._id,
          project: req.params.projectId,
          assigned: { $ne: true },
        };
      } else if (req.query.projectPage) {
        const project = await Project.findById(req.params.projectId);

        // Checks if the project exists
        if (!project) {
          return next(new CustomError('This project does not exist!', 404));
        }

        const { team } = project;

        const isMember = team.find(
          (member) => String(member) === String(req.user._id)
        );

        if (String(project.user._id) !== String(req.user._id)) {
          if (!isMember) {
            return next(new CustomError('This project does not exist!', 404));
          }
        }

        filter = {
          project: req.params.projectId,
          assigned: { $ne: true },
        };
      }
    }

    const result = new ApiFeatures(collection, Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    if (req.params.projectId && !req.query.projectPage) {
      result.query
        .populate({
          path: 'assignee',
          select: 'username firstName lastName photo',
        })
        .populate({
          path: 'activities',
          options: { sort: { time: -1 }, perDocumentLimit: 50 },
          populate: {
            path: 'user',
            select: 'username firstName lastName',
          },
        });
    }

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

    let doc;

    if (collection === 'project') {
      delete req.body.team;
      delete req.body.files;
      delete req.body.details;

      doc = await Model.create(req.body);

      await User.findByIdAndUpdate(
        req.user._id,
        {
          currentProject: doc._id,
        },
        {
          runValidators: true,
        }
      );
    } else {
      doc = await Model.create(req.body);
    }

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
    const excludeArray = ['month', 'year', 'range', 'day', 'view'];

    let modelQuery;
    let graph = {};

    if (collection === 'tasks') {
      if (req.query.filter === 'assigned') {
        modelQuery = Model.find({ user: req.user._id, assigned: true });
      } else if (req.query.calendar) {
        modelQuery = Model.find({ user: req.user._id });
      } else {
        modelQuery = Model.find({
          user: req.user._id,
          assigned: { $ne: true },
        });
      }
    } else if (collection === 'projects') {
      modelQuery = Model.find({ user: req.user._id });
    }

    const result = new ApiFeatures(
      collection,
      modelQuery,
      req.query,
      ...excludeArray
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    let docs = await result.query;

    // Depopulates tasks from the result

    // Filters tasks based on request query
    if (req.query.calendar) {
      if (req.query.calendar === 'big') {
        const result = new QueryFeatures(
          docs,
          req.query,
          collection,
          null
        ).sortByHour();

        docs = result.model;
      }
    } else if (
      req.query.month ||
      req.query.year ||
      req.query.range ||
      req.query.day
    ) {
      const dateType = req.query.calendar ? 'deadline' : 'createdAt';

      const result = new QueryFeatures(docs, req.query, collection, dateType)
        .getDate()
        .getRange();

      docs = [];
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
