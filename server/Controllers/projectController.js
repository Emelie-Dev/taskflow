import Project from '../Models/projectModel.js';
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
