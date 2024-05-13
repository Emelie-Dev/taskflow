import Task from '../Models/taskModel.js';
import asyncErrorHandler from '../Utils/asyncErrorHandler.js';

export const createNewTask = asyncErrorHandler(async (req, res, next) => {
  const task = await Task.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      task,
    },
  });
});

export const getAllTasks = asyncErrorHandler(async (req, res, next) => {
  const tasks = await Task.find();

  res.status(200).json({
    status: 'success',
    length: tasks.length,
    data: {
      tasks,
    },
  });
});
