import Project from '../Models/projectModel.js';
import { ApiFeatures, QueryFeatures } from '../Utils/ApiFeatures.js';
import CustomError from '../Utils/CustomError.js';
import factory from '../Utils/handlerFactory.js';
import asyncErrorHandler from '../Utils/asyncErrorHandler.js';
import Task from '../Models/taskModel.js';
import Notification from '../Models/notificationModel.js';
import { filterValues } from './taskController.js';
import User from '../Models/userModel.js';
import multer from 'multer';

const generateNotifications = async (fields, values, project, req) => {
  let notifications = [];

  // const user = await User.findById(req.user._id).select(
  //   'username firstName lastName'
  // );

  const user = req.user._id;

  if (fields.includes('name') || fields.includes('description')) {
    const notificationValues = await filterValues(
      { ...values },
      null,
      'name',
      'description'
    );

    const notification = {
      user,
      project: project._id,
      action: 'update',
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
      project: project._id,
      action,
      state: notificationValues,
    };

    notification.type = Object.keys(notification.state);

    if (notification.type.length !== 0) notifications.push(notification);
  }

  if (fields.includes('status')) {
    const notificationValues = await filterValues(
      { ...values },
      false,
      'status'
    );

    const notification = {
      user,
      project: project._id,
      action: 'transition',
      state: notificationValues,
    };

    notification.type = Object.keys(notification.state);

    if (notification.type.length !== 0) notifications.push(notification);
  }

  if (notifications.lengtsh !== 0) await Notification.insertMany(notifications);
};

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  cb(null, true);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadUserPhoto = upload.single('photo');

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
      //   if (!enableVisibility) {
      //     const err = new CustomError(
      //       'You are not allowed to view this project!',
      //       403
      //     );
      //     return next(err);
      //   }
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
  const excludeArray = [
    'progress',
    'openTasks',
    'completedTasks',
    'user',
    'team',
  ];
  // name, desc, deadline,status, files, team
  excludeArray.forEach((value) => delete req.body[value]);

  const project = await Project.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!project) {
    const err = new CustomError(`This project does not exist!`, 404);
    return next(err);
  }

  if (req.body.deadline) {
    // validates deadline field
    if (new Date(req.body.deadline) < new Date(project.createdAt)) {
      return next(
        new CustomError('Please provide a valid value for the deadline!', 400)
      );
    }
  }

  const values = {};
  for (let value in req.body) {
    values[value] = {};
    values[value].from = project[value];
    values[value].to = req.body[value];
  }

  const fields = Object.keys(req.body);

  // updates the project
  await Project.updateOne(
    {
      _id: req.params.id,
      user: req.user._id,
    },
    req.body,
    {
      runValidators: true,
    }
  );

  // creates notifications
  await generateNotifications(fields, values, project, req);

  return res.status(200).json({
    status: 'success',
    data: {
      updatedProject: project,
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

  // Deletes all project tasks
  await Task.deleteMany({ project: project._id });

  const notifications = [];

  // Generates notification for each team member
  project.team.forEach((member) => {
    notifications.push({
      user: member,
      action: 'deletion',
      type: ['project'],
    });
  });

  // Sends notifications
  await Notification.insertMany(notifications);

  return res.status(204).json({
    status: 'success',
    data: null,
  });
});

export const updateTeam = asyncErrorHandler(async (req, res, next) => {
  const project = await Project.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  // Checks if project exist
  if (!project) {
    const err = new CustomError(`This project does not exist!`, 404);
    return next(err);
  }

  // Checks if the team field is in the request body
  if (!req.body.team) {
    return next(new CustomError('Please provide a team field!', 400));
  }

  // Checks for valid team format
  if (!Array.isArray(req.body.team)) {
    return next(new CustomError('Invalid format for the team field!', 400));
  }

  const notifications = [];
  const oldMembers = [];

  // Gets all members and the leader
  const members = project.team.map((value) => String(value));

  const newTeam = [...new Set(req.body.team)];

  const updatedTeam = [...newTeam];

  const leaderIndex = newTeam.indexOf(String(req.user._id));

  if (leaderIndex !== -1) {
    newTeam.splice(leaderIndex, 1);
    updatedTeam.splice(leaderIndex, 1);
  }

  // Filters new members and generates notifications
  for (let member of newTeam) {
    if (!members.includes(member)) {
      const user = await User.findById(member).select(
        'username firstName lastName'
      );

      if (!user) {
        return next(
          new CustomError('Some user(s) you provided do not exist!', 400)
        );
      }

      notifications.push({
        user: member,
        performer: {
          name: req.user.username,
          id: req.user._id,
          firstName: req.user.firstName,
          lastName: req.user.lastName,
          project: project._id,
        },
        action: 'invitation',
        type: ['team'],
      });
      updatedTeam.splice(0, 1);
    }
  }

  // Filters old members
  for (let member of members) {
    if (!newTeam.includes(member)) {
      const user = await User.findById(member).select(
        'username firstName lastName'
      );

      oldMembers.push(user);

      // Deletes tasks assigned to old members
      await Task.deleteMany({ user: member, project: req.params.id });
    }
  }

  // Generates notification for old members
  if (oldMembers.length !== 0) {
    notifications.push({
      user: req.user._id,
      project: project._id,
      action: 'assignment',
      state: { oldMembers },
      type: ['team'],
    });
  }

  // Updates team
  project.team = updatedTeam;
  await project.save();

  // Sends notifications
  await Notification.insertMany(notifications);

  return res.status(200).json({
    status: 'success',
    message:
      'Team invitation sent successfully to new members and old members have been removed!',
  });
});

export const respondToInvitation = asyncErrorHandler(async (req, res, next) => {
  // Checks if the invitation exist
  const notification = await Notification.findById(req.params.invitationId);

  if (!notification) {
    return next(new CustomError('No invitation was found!', 404));
  }

  // Checks if invitaion belongs to user
  if (String(notification.user) !== String(req.user._id)) {
    return next(new CustomError('No invitation was found!', 404));
  }

  // Checks if project exists
  const project = await Project.findById(notification.performer.project);

  if (!project) {
    const err = new CustomError('This project does not exist!', 404);
    return next(err);
  }

  // Operates on user response
  const response = String(req.body.response).trim();
  let message = '';

  if (response === 'confirm') {
    const team = project.team.map((value) => String(value));
    const user = String(req.user._id);

    if (!team.includes(user)) team.push(user);

    project.team = team;

    await project.save();

    message = 'Invitation confirmed and you have been added to the team.';

    // Creates notifications for the project owner and the project
    await Notification.insertMany([
      {
        user: notification.performer.id,
        action: 'response',
        type: ['team'],
        state: { response },
      },
      {
        user: notification.performer.id,
        project: project._id,
        action: 'addition',
        state: {
          name: req.user.username,
          firstName: req.user.firstName,
          lastName: req.user.lastName,
        },
      },
    ]);
  } else if (response === 'decline') {
    message = 'Invitation declined.';

    // Creates notification for the project owner
    await Notification.create({
      user: notification.performer.id,
      action: 'response',
      type: ['team'],
      state: { response },
    });
  } else {
    return next(new CustomError('Please provide a valid response!', 400));
  }

  // Deletes invitation
  await Notification.findByIdAndDelete(req.params.invitationId);

  return res.status(200).json({
    status: 'success',
    message,
  });
});

export const createNewProject = factory.createOne(Project, 'project');

export const getAllProjects = factory.getAll(Project, 'projects');

export const getMyProjects = factory.getMyData(Project, 'projects');
