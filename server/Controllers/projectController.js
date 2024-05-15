import Project from '../Models/projectModel.js';
import { ApiFeatures, QueryFeatures } from '../Utils/ApiFeatures.js';
import CustomError from '../Utils/CustomError.js';
import asyncErrorHandler from '../Utils/asyncErrorHandler.js';

export const createNewProject = asyncErrorHandler(async (req, res, next) => {
  const project = await Project.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      project,
    },
  });
});

export const getAllProjects = asyncErrorHandler(async (req, res, next) => {
  const projects = await Project.find();

  res.status(200).json({
    status: 'success',
    length: projects.length,
    data: {
      projects,
    },
  });
});

export const getMyProjects = asyncErrorHandler(async (req, res, next) => {
  const excludeArray = ['complete', 'month', 'year', 'range'];

  const result = new ApiFeatures(
    Project.find({ user: req.user._id }),
    req.query,
    ...excludeArray
  ).filter();

  let myProjects = await result.query;

  let graph = {};

  // checks is request query contains a field in the excludeArray
  if (
    req.query.complete ||
    req.query.month ||
    req.query.year ||
    req.query.range
  ) {
    // filters projects based on request query
    const result = new QueryFeatures(myProjects, req.query)
      .complete()
      .getDate()
      .getRange();

    myProjects = result.model;
    graph = result.graph;
  }

  return res.status(200).send({
    status: 'success',
    data: {
      myProjects,
      graph,
    },
  });
});
