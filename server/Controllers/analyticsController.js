import Project from '../Models/projectModel.js';
import Task from '../Models/taskModel.js';
import asyncErrorHandler from '../Utils/asyncErrorHandler.js';

export const getMyStats = asyncErrorHandler(async (req, res, next) => {
  const projects = await Project.find({ user: req.user._id });
  const tasks = await Task.find({ user: req.user._id });

  const completedProjects = projects.filter(
    (project) => project.progress === 100
  ).length;
  const completedTasks = tasks.filter(
    (task) => task.status === 'complete'
  ).length;

  return res.status(200).json({
    status: 'success',
    data: {
      projects: projects.length,
      tasks: tasks.length,
      completedProjects,
      completedTasks,
    },
  });
});

export const getProjectsCompleted = asyncErrorHandler(
  async (req, res, next) => {}
);
