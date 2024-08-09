import { isValidObjectId } from 'mongoose';
import Task from '../Models/taskModel.js';
import { ApiFeatures, QueryFeatures } from '../Utils/ApiFeatures.js';
import CustomError from '../Utils/CustomError.js';
import asyncErrorHandler from '../Utils/asyncErrorHandler.js';
import factory from '../Utils/handlerFactory.js';
import Project from '../Models/projectModel.js';
import Notification from '../Models/notificationModel.js';
import User from '../Models/userModel.js';

const maxDays = (currentMonth) => {
  const month = currentMonth;
  const arr30 = [4, 6, 9, 11];
  let days = 0;

  if (month === 2) {
    if (currentYear % 4 === 0) {
      days = 29;
    } else {
      days = 28;
    }
  } else if (arr30.includes(month)) {
    days = 30;
  } else {
    days = 31;
  }
  return days;
};

export const filterValues = async (values, type, ...fields) => {
  for (const value in values) {
    let condition;

    if (type === 'date') {
      condition =
        Date.parse(new Date(values[value].from)) ===
        Date.parse(new Date(values[value].to));
    } else {
      condition =
        String(values[value].from).trim() === String(values[value].to).trim();
    }

    if (!fields.includes(value) || condition) delete values[value];
  }

  return values;
};

const generateNotifications = async (
  assigned,
  fields = [],
  values = {},
  task,
  owner,
  project,
  req
) => {
  let notifications = [];
  // const user = await User.findById(req.user._id).select(
  //   'username firstName lastName'
  // );

  const user = req.user._id;

  if (project === 'create') {
    let notification = {
      user,
      project: task.project,
      action: 'creation',
      type: ['task'],
    };

    notifications.push(notification);
  } else if (project === 'delete') {
    let notification;
    if (assigned) {
      notification = {
        user: owner,
        performer: await User.findById(req.user._id).select(
          'username firstName lastName'
        ),
        task: task.mainTask,
        action: 'deletion',
        type: ['assignedTask'],
      };
    } else {
      notification = {
        user,
        project: task.project,
        action: 'deletion',
        type: ['task'],
      };
    }

    notifications.push(notification);
  } else if (assigned) {
    if (fields.includes('priority')) {
      if (values.priority.from !== values.priority.to) {
        const notificationValue = { ...values };
        delete notificationValue.status;

        notifications.push({
          user,
          task: task._id,
          action: 'transition',
          type: ['priority'],
          state: notificationValue,
        });
      }
    }

    if (fields.includes('status')) {
      if (values.status.from !== values.status.to) {
        const notificationValue = { ...values };
        delete notificationValue.priority;

        notifications.push({
          user: owner,
          performer: await User.findById(req.user._id).select(
            'username firstName lastName'
          ),
          task: task.mainTask,
          action: 'transition',
          type: ['status'],
          state: notificationValue,
        });
      }
    }
  } else {
    if (fields.includes('name') || fields.includes('description')) {
      const notificationValues = await filterValues(
        { ...values },
        false,
        'name',
        'description'
      );

      const notification = {
        user,
        task: task._id,
        action: 'update',
        state: notificationValues,
      };

      notification.type = Object.keys(notification.state);

      if (notification.type.length !== 0) notifications.push(notification);
    }

    if (fields.includes('status') || fields.includes('priority')) {
      const notificationValues = await filterValues(
        { ...values },
        false,
        'status',
        'priority'
      );

      const notification = {
        user,
        task: task._id,
        action: 'transition',
        state: notificationValues,
      };

      notification.type = Object.keys(notification.state);

      if (notification.type.length !== 0) notifications.push(notification);
    }

    if (fields.includes('deadline')) {
      const notificationValues = await filterValues(
        { ...values },
        'date',
        'deadline'
      );

      let action;

      if (notificationValues.deadline) {
        action =
          new Date(notificationValues.deadline.from) >
          new Date(notificationValues.deadline.to)
            ? 'reduction'
            : 'extension';
      }

      const notification = {
        user,
        task: task._id,
        action,
        state: notificationValues,
      };

      notification.type = Object.keys(notification.state);

      if (notification.type.length !== 0) notifications.push(notification);
    }

    if (fields.includes('assignee')) {
      notifications.push({
        user,
        task: task._id,
        action: 'assignment',
        state: values,
        type: ['assignee'],
      });
    }
  }

  if (notifications.length !== 0) await Notification.insertMany(notifications);
};

const validateAssignee = async (project, assignees = []) => {
  const team = project.team.map((member) => String(member));

  const leader = String(project.user);

  let assigneesLength = assignees.length;

  for (let i = 0; i < assigneesLength; i++) {
    if (!team.includes(assignees[i])) {
      const err = new CustomError(
        `The number "${
          i + 1
        }" on your assignee list is not a member of your team. You can only assign tasks to the team members of you project!`,
        400
      );

      return { valid: false, error: err };
    } else {
      if (assignees[i] === leader) {
        const err = new CustomError(
          `You cannot assign a task to the owner of the project!`,
          403
        );

        return { valid: false, error: err };
      }
    }
  }

  return { valid: true };
};

export const createNewTask = asyncErrorHandler(async (req, res, next) => {
  if (!req.body.user) req.body.user = req.user._id;

  if (!req.body.project) req.body.project = req.params.projectId;

  const project = await Project.findById(req.body.project);

  if (project) {
    if (String(project.user) !== String(req.body.user)) {
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

  const excludeArray = ['assigned', 'mainTask', 'assignee'];

  excludeArray.forEach((value) => delete req.body[value]);

  const task = await Task.create(req.body);

  await task.populate({
    path: 'activities',
    options: { sort: { time: -1 }, perDocumentLimit: 50 },
    populate: {
      path: 'user',
      select: 'username firstName lastName',
    },
  });

  // Update project details
  project.updateDetails(null, task.status);

  await project.save();

  // Update the user current project
  await User.findByIdAndUpdate(
    req.user._id,
    {
      currentProject: project._id,
    },
    {
      runValidators: true,
    }
  );

  // creates notification
  await generateNotifications(
    false,
    undefined,
    undefined,
    task,
    null,
    'create',
    req
  );

  return res.status(201).json({
    status: 'success',
    data: {
      task,
    },
  });
});

export const getAssignedTasks = asyncErrorHandler(async (req, res, next) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 30;
  const deleteCount = req.query.deleteCount || 0;
  const createCount = req.query.createCount || 0;
  const skip =
    (page - 1) * Number(limit) - Number(deleteCount) + Number(createCount);

  const assignedTasks = await Task.find({
    user: req.user._id,
    project: req.params.projectId,
    assigned: true,
  })
    .sort('-createdAt')
    .skip(skip)
    .limit(limit);

  return res.status(200).json({
    status: 'success',
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

  const project = await Project.findById(task.project);

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

      let mainTask;

      if (req.body.status) {
        values.status = { from: task.status, to: req.body.status };
        task.status = req.body.status;
        fields.push('status');
      }

      if (req.body.priority) {
        values.priority = { from: task.priority, to: req.body.priority };
        task.priority = req.body.priority;
        fields.push('priority');
      }

      // Update the last Modified property

      await task.save();

      // Saves the main task and other assigned tasks
      if (req.body.status) {
        mainTask = await Task.findById(task.mainTask);

        // Updates the project details
        project.updateDetails(mainTask.status, req.body.status);

        await project.save();

        // To make sure the main task is saved after the assigned task for proper data validation
        mainTask.status = req.body.status;

        // Update the last Modified property

        await mainTask.save();

        await Task.updateMany(
          { mainTask: task.mainTask },
          {
            status: req.body.status,
          }
        );

        // Update the user current project
        await User.findByIdAndUpdate(
          req.user._id,
          {
            currentProject: project._id,
          },
          {
            runValidators: true,
          }
        );
      }

      // creates notifications
      await generateNotifications(
        true,
        fields,
        values,
        task,
        mainTask && mainTask.user,
        null,
        req
      );
    } else {
      excludeArray = ['assigned', 'mainTask', 'leader', 'assignee'];

      excludeArray.forEach((value) => delete req.body[value]);

      const values = {};
      for (let value in req.body) {
        values[value] = {};
        values[value].from = task[value];
        values[value].to = req.body[value];
      }

      const fields = Object.keys(req.body);

      if (req.body.deadline) {
        // validates deadline field
        if (
          Date.parse(new Date(req.body.deadline)) <
          Date.parse(new Date(task.createdAt))
        ) {
          return next(
            new CustomError(
              'Please provide a valid value for the deadline!',
              400
            )
          );
        }

        req.body.deadline = new Date(req.body.deadline);

        req.body.deadline.setMinutes(0);
        req.body.deadline.setSeconds(0);
        req.body.deadline.setMilliseconds(0);
      }

      // Adds the last Modified property to the request body

      if (req.body.status) {
        // Updates the project details
        project.updateDetails(task.status, req.body.status);
      }

      // updates the task
      task = await Task.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      }).populate({
        path: 'assignee',
        select: 'username firstName lastName photo',
      });

      // Prevents updating the priority field of the assigned tasks
      delete req.body.priority;

      // updates assigned tasks
      await Task.updateMany({ mainTask: req.params.id }, req.body);

      // Saves the project
      await project.save();

      // Update the user current project
      await User.findByIdAndUpdate(
        req.user._id,
        {
          currentProject: project._id,
        },
        {
          runValidators: true,
        }
      );

      // creates notifications
      await generateNotifications(
        false,
        fields,
        values,
        task,
        task.user,
        false,
        req
      );
    }
  }

  return res.status(200).json({
    status: 'success',
    data: {
      task,
    },
  });
});

export const deleteTask = asyncErrorHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    const err = new CustomError('This task does not exist!', 404);
    return next(err);
  }

  const project = await Project.findById(task.project);

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

      // Delete all notifications that belongs to the task
      await Notification.deleteMany({ task: task._id });
    } else {
      // deletes assigned tasks
      await Task.deleteMany({ mainTask: req.params.id });

      // deletes the original task
      await Task.findByIdAndDelete(req.params.id);

      // Updates the project details
      project.updateDetails(task.status, null);

      await project.save();

      // Update the user current project
      await User.findByIdAndUpdate(
        req.user._id,
        {
          currentProject: project._id,
        },
        {
          runValidators: true,
        }
      );

      // Delete all notifications that belongs to the task
      await Notification.deleteMany({ task: task._id });
    }
  }

  // creates notification
  await generateNotifications(
    task.assigned,
    undefined,
    undefined,
    task,
    task.leader,
    'delete',
    req
  );

  return res.status(204).json({
    status: 'success',
    data: null,
  });
});

export const updateAssignees = asyncErrorHandler(async (req, res, next) => {
  let task = await Task.findOne({ _id: req.params.id, user: req.user._id });

  if (!task) {
    const err = new CustomError('This task does not exist!', 404);
    return next(err);
  }

  if (task.assigned) {
    const err = new CustomError('An assigned task cannot have assignees.', 403);
    return next(err);
  }

  if (!req.body.assignee) {
    return next(new CustomError('Please provide an assignee field!', 400));
  }

  // Checks for valid team format
  if (!Array.isArray(req.body.assignee)) {
    return next(new CustomError('Invalid format for the assignee field!', 400));
  }

  const taskAssignees = task.assignee.map((value) => String(value));

  const project = await Project.findById(task.project);

  const newAssignees = [];
  const newAssigneesData = [];
  const oldAssignees = [];
  const oldAssigneesData = [];
  const assignedTasks = [];
  const assignmentNotifications = [];

  // filters new assignees and generates assigned tasks
  for (let assignee of req.body.assignee) {
    if (!taskAssignees.includes(assignee)) {
      const userData = await User.findById(assignee).select(
        'username firstName lastName'
      );

      newAssignees.push(assignee);
      newAssigneesData.push(userData);

      const newTask = {
        name: task.name,
        user: assignee,
        leader: task.user,
        assigned: true,
        mainTask: task._id,
        project: task.project,
        status: task.status,
        priority: task.priority,
        deadline: task.deadline,
        description: task.description,
      };

      assignedTasks.push(newTask);

      assignmentNotifications.push({
        user: assignee,
        action: 'task',
        performer: {
          project: project.name,
        },
      });
    }
  }

  // validates assignee field
  const { valid, error } = await validateAssignee(project, newAssignees);
  if (!valid) return next(error);

  const values = {
    assignee: {
      from: task.assignee,
      to: req.body.assignee,
      oldAssigneesData,
      newAssigneesData,
    },
  };

  // creates asigned tasks
  await Task.insertMany(assignedTasks);

  // Update the task
  task = await Task.findByIdAndUpdate(
    task._id,
    { assignee: [...new Set(req.body.assignee)] },
    { new: true, runValidators: true }
  ).populate({
    path: 'assignee',
    select: 'username firstName lastName photo',
  });

  // filters old assignees and deletes old assigned tasks
  for (let assignee of taskAssignees) {
    if (!req.body.assignee.includes(assignee)) {
      const userData = await User.findById(assignee).select(
        'username firstName lastName'
      );

      oldAssignees.push(assignee);
      oldAssigneesData.push(userData);

      await Task.deleteOne({
        mainTask: task._id,
        user: assignee,
      });
    }
  }

  if (oldAssignees.length !== 0 || newAssignees.length !== 0) {
    // creates notification
    await generateNotifications(
      false,
      ['assignee'],
      values,
      task,
      null,
      false,
      req
    );
  }

  // Update the last modified property of the project

  await project.save();

  // Update the user current project
  await User.findByIdAndUpdate(
    req.user._id,
    {
      currentProject: project._id,
    },
    {
      runValidators: true,
    }
  );

  // Send the new assignees notifications
  await Notification.insertMany(assignmentNotifications);

  return res.status(200).json({
    status: 'success',
    data: {
      task,
    },
  });
});

export const getTaskActivities = asyncErrorHandler(async (req, res, next) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

  // Checks if the task exists
  if (!task) {
    const err = new CustomError('This task does not exist!', 404);
    return next(err);
  }

  const page = req.query.page || 1;
  const limit = req.query.limit || 50;
  const skip = (page - 1) * limit;

  let activities;

  if (task.assigned) {
    activities = await Notification.find({
      $or: [
        { task: req.params.id },
        { task: task.mainTask, 'type.0': { $ne: 'priority' } },
      ],
      time: { $gte: task.createdAt },
    })
      .populate({
        path: 'user',
        select: 'username firstName lastName',
      })
      .sort('-time')
      .skip(skip)
      .limit(limit);
  } else {
    activities = await Notification.find({ task: req.params.id })
      .populate({
        path: 'user',
        select: 'username firstName lastName',
      })
      .sort('-time')
      .skip(skip)
      .limit(limit);
  }

  return res.status(200).json({
    status: 'success',
    data: {
      activities,
    },
  });
});

export const getCalendarDetails = asyncErrorHandler(async (req, res, next) => {
  const { month, year } = req.query;

  if (!month || !year) {
    return next(new CustomError('Please provide a valid year and month.', 400));
  }

  const startDate = new Date(`${year}-${month}`);
  const endDate = new Date(`${year}-${month}`);
  endDate.setMonth(parseInt(month) + 1);

  const tasks = await Task.find({
    user: req.user._id,
    deadline: { $gte: startDate, $lt: endDate },
  });

  const days = maxDays(month);

  const tasksData = [];

  for (let i = 0; i < days; i++) {
    tasksData[i] = {
      high: 0,
      medium: 0,
      low: 0,
    };
  }

  tasks.forEach((task) => {
    const day = new Date(task.deadline).getDate() - 1;

    tasksData[day][task.priority]++;
  });

  return res.status(200).json({
    status: 'success',
    data: {
      tasksData,
    },
  });
});

export const getAllTasks = factory.getAll(Task, 'tasks');

export const getMyTasks = factory.getMyData(Task, 'tasks');
