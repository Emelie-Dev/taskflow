import Project from '../Models/projectModel.js';
import { ApiFeatures, QueryFeatures } from '../Utils/ApiFeatures.js';
import CustomError from '../Utils/CustomError.js';
import factory from '../Utils/handlerFactory.js';
import asyncErrorHandler from '../Utils/asyncErrorHandler.js';
import Task from '../Models/taskModel.js';

export const createNewProject = factory.createOne(Project, 'project');

export const getAllProjects = factory.getAll(Project, 'projects');

export const getMyProjects = factory.getMyData(Project, 'projects');

export const getAssignedProjects = asyncErrorHandler(async (req, res, next) => {
  const assignedProjects = await Task.aggregate([
    { $match: { user: req.user._id, assigned: true } },
    {
      $lookup: {
        from: 'projects',
        localField: 'project',
        foreignField: '_id',
        as: 'project',
      },
    },
    {
      $unwind: '$project',
    },
    {
      $lookup: {
        from: 'users',
        localField: 'project.user',
        foreignField: '_id',
        as: 'projectLeader',
      },
    },
    {
      $unwind: '$projectLeader',
    },
    { $sort: { ['project.createdAt']: -1 } },
    {
      $group: {
        _id: '$project._id',
        name: { $first: '$project.name' },
        leaderName: { $first: '$projectLeader.username' },
        leaderPhoto: { $first: '$projectLeader.photo' },
        tasks: { $sum: 1 },
      },
    },
  ]);

  return res.status(200).json({
    status: 'success',
    length: assignedProjects.length,
    data: {
      assignedProjects,
    },
  });
});

export const getProject = asyncErrorHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    const err = new CustomError('This project does not exist!', 404);
    return next(err);
  }

  const { enableVisibility, team } = project;

  if (String(project.user) !== String(req.user._id)) {
    if (!team.includes(req.user._id)) {
      const err = new CustomError('This project does not exist!', 404);
      return next(err);
    } else {
      if (!enableVisibility) {
        const err = new CustomError(
          'You are not allowed to view this project!',
          403
        );
        return next(err);
      }
    }
  }

  return res.status(200).json({
    status: 'success',
    data: {
      project,
    },
  });
});

export const updateProject = asyncErrorHandler(async (req, res, next) => {
  const excludeArray = ['progress', 'openTasks', 'completedTasks'];

  excludeArray.forEach((value) => delete req.body[value]);

  const updatedProject = await Project.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.user._id,
    },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedProject) {
    const err = new CustomError(`Project with that ID was not found!`, 404);
    return next(err);
  }

  return res.status(200).json({
    status: 'success',
    data: {
      updatedProject,
    },
  });
});

export const deleteProject = asyncErrorHandler(async (req, res, next) => {
  const project = await Project.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!project) {
    const err = new CustomError(`Project with that ID was not found!`, 404);
    return next(err);
  }

  return res.status(204).json({
    status: 'success',
    data: null,
  });
});
