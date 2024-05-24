import { isValidObjectId } from 'mongoose';
import Task from '../Models/taskModel.js';
import { ApiFeatures, QueryFeatures } from '../Utils/ApiFeatures.js';
import CustomError from '../Utils/CustomError.js';
import asyncErrorHandler from '../Utils/asyncErrorHandler.js';
import factory from '../Utils/handlerFactory.js';
import Project from '../Models/projectModel.js';
import Notification from '../Models/notificationModel.js';

const generateNotifications = async (
  assigned,
  fields,
  mainTask,
  assignedTask
) => {
  const notificationArray = [];

  if (assigned) {
    if (fields.includes('priority')) {
      notificationArray.push({});
    }
    const assignedTaskNotification = {
      user: req.user._id,
      task: req.params.id,
      type: 'activity',
      action: 'transition',
      state: [],
    };
  }

  // const mainTaskNotification = {};

  // await Notification.insertMany([
  //   assignedTaskNotification,
  //   mainTaskNotification,
  // ]);

  console.log([assigned, fields, mainTask, assignedTask]);
};

export const createNewTask = asyncErrorHandler(async (req, res, next) => {
  if (!req.body.user) req.body.user = req.user._id;

  if (!req.body.project) req.body.project = req.params.projectId;

  const project = await Project.findById(req.body.project);

  if (project) {
    if (String(project.user) !== String(req.user._id)) {
      const err = new CustomError(
        'You are not the owner of this project, so you cannot create this task!',
        403
      );
      return next(err);
    }
  } else {
    const err = new CustomError(
      'The project you provided does not exist!',
      404
    );
    return next(err);
  }

  if (req.body.assigned) {
    delete req.body.assignee;
  } else {
    if ('mainTask' in req.body) delete req.body.mainTask;
  }

  const task = await Task.create(req.body);

  return res.status(201).json({
    status: 'success',
    data: {
      task,
    },
  });
});

export const getAllTasks = factory.getAll(Task, 'tasks');

export const getMyTasks = factory.getMyData(Task, 'tasks');

export const getAssignedTasks = asyncErrorHandler(async (req, res, next) => {
  const assignedTasks = await Task.find({
    user: req.user._id,
    assigned: true,
    project: req.params.projectId,
  });

  return res.status(200).json({
    status: 'success',
    length: assignedTasks.length,
    data: {
      tasks: assignedTasks,
    },
  });
});

export const updateTask = asyncErrorHandler(async (req, res, next) => {
  let excludeArray = [];
  // -- validate assignee field, name, status, priority, deadline, desc, assignee
  let task = await Task.findById(req.params.id);

  if (!task) {
    const err = new CustomError('This task does not exist!', 404);
    return next(err);
  }

  // If the user is not the task owner
  if (String(task.user) !== String(req.user._id)) {
    if (String(task.leader) === String(req.user._id)) {
      const err = new CustomError(
        'You are not allowed to update this task because you assigned it. You can update the original one.',
        403
      );
      return next(err);
    } else if (!task.assignee.includes(req.user._id)) {
      const err = new CustomError('This task does not exist!', 404);
      return next(err);
    } else {
      const err = new CustomError(
        'You are not allowed to update this task, only the one assigned to you!',
        403
      );
      return next(err);
    }
  } else {
    if (task.assigned) {
      const fields = [];
      const values = {};

      if (req.body.status) {
        const mainTask = await Task.findById(task.mainTask);

        mainTask.status = req.body.status;

        await mainTask.save();

        values.status = { from: task.status, to: req.body.status };
        task.status = req.body.status;
        fields.push('status');
      }

      if (req.body.priority) {
        values.priority = { from: task.priority, to: req.body.priority };
        task.priority = req.body.priority;
        fields.push('priority');
      }

      await task.save();

      await Task.updateMany(
        { mainTask: task.mainTask },
        {
          status: req.body.status || task.status,
        }
      );

      generateNotifications(true, fields, task.mainTask, task._id);
    } else {
      excludeArray = ['lastModified', 'assigned', 'mainTask', 'leader'];

      excludeArray.forEach((value) => delete req.body[value]);

      task = await Task.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      excludeArray = ['assignee'];

      excludeArray.forEach((value) => delete req.body[value]);

      await Task.updateMany({ mainTask: req.params.id }, req.body);
    }
  }

  return res.status(200).json({
    status: 'success',
    data: {
      updatedTask: task,
    },
  });
});

export const deleteTask = asyncErrorHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    const err = new CustomError('This task does not exist!', 404);
    return next(err);
  }

  // If the user is not the task owner
  if (String(task.user) !== String(req.user._id)) {
    if (String(task.leader) === String(req.user._id)) {
      const err = new CustomError(
        'You are not allowed to delete this task because you assigned it. You can remove the user from the list of assignees.',
        403
      );
      return next(err);
    } else {
      const err = new CustomError('This task does not exist!', 404);
      return next(err);
    }
  } else {
    if (task.assigned) {
      const mainTask = await Task.findById(task.mainTask);

      if (mainTask) {
        // returns the list of assignees
        let assignees = new Set(mainTask.assignee.map((id) => String(id)));

        // delete the curent assignee
        assignees.delete(String(task.user));

        mainTask.assignee = [...assignees];
        await mainTask.save();
      }
      // deletes the task
      await Task.findByIdAndDelete(req.params.id);
    } else {
      // deletes assigned tasks
      await Task.deleteMany({ mainTask: req.params.id });

      // deletes the original task
      await Task.findByIdAndDelete(req.params.id);
    }
  }

  return res.status(204).json({
    status: 'success',
    data: null,
  });
});
