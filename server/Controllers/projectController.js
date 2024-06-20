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
import fs from 'fs';

// Update current Project

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

// Set up storage options
const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'Public/project-files');
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.slice(file.originalname.lastIndexOf('.'));

    const fileName = `user-${Math.round(
      Math.random() * 1e14
    )}-${Date.now()}${ext}`;

    cb(null, fileName);
  },
});

// Initialize Multer with the storage and filter options
const upload = multer({
  storage: multerStorage,
});

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
    'files',
    'lastModified',
    'details',
  ];
  // name, desc, deadline,status, files, team
  excludeArray.forEach((value) => delete req.body[value]);

  let project = await Project.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!project) {
    const err = new CustomError(`This project does not exist!`, 404);
    return next(err);
  }

  const fields = Object.keys(req.body);

  if (fields.length === 0) {
    return next(
      new CustomError('Please provide the fields that are to be updated.', 400)
    );
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

  // updates the project
  project = await Project.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.user._id,
    },
    { ...req.body, lastModified: Date.now() },
    {
      new: true,
      runValidators: true,
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

  // creates notifications
  await generateNotifications(fields, values, project, req);

  return res.status(200).json({
    status: 'success',
    data: {
      project,
    },
  });
});

export const uploadProjectFiles = asyncErrorHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  // Check if project exist
  if (!project) {
    const err = new CustomError(`This project does not exist!`, 404);
    return next(err);
  }

  // Validate request header
  if (!req.headers['x-files-names']) {
    return next(new CustomError('Invalid request!', 400));
  }

  let newFilesNames;

  try {
    newFilesNames = JSON.parse(req.headers['x-files-names']);
  } catch {
    return next(new CustomError('Invalid request!', 400));
  }

  if (!Array.isArray(newFilesNames) || newFilesNames.length === 0) {
    return next(new CustomError('Invalid request!', 400));
  }

  // Convert the member ids to string
  const team = project.team.map((value) => String(value));

  // Check if the project does not belong to the user
  if (String(project.user) !== String(req.user._id)) {
    if (!team.includes(String(req.user._id))) {
      return next(new CustomError(`This project does not exist!`, 404));
    } else {
      if (!project.addFiles) {
        const err = new CustomError(
          'You are not allowed to add files to this project!',
          403
        );

        return next(err);
      }
    }
  }

  const fileNames = project.files.map((file) => file.name);

  const lowerNewFilesNames = newFilesNames.map((name) =>
    String(name).toLowerCase()
  );

  const filteredFilesNames = [...new Set(lowerNewFilesNames)];

  // Check for duplicate file names
  if (lowerNewFilesNames.length !== filteredFilesNames.length) {
    return next(new CustomError('No duplicate file name!', 400));
  }

  // Check if the new file names already exist
  for (let name of newFilesNames) {
    if (fileNames.includes(name)) {
      const err = new CustomError(
        `You already have a file with the name - '${name}'.`,
        400
      );

      return next(err);
    }
  }

  // Calculate total size of project files
  const projectFilesSize = project.files.reduce(
    (total, value) => total + parseInt(value.size),
    0
  );

  // Uploads the files
  upload.array('files')(req, res, async (error) => {
    if (error) {
      const err = new CustomError('An error occurred during file upload!', 500);
      return next(err);
    }

    if (!req.files || req.files.length === 0) {
      return next(new CustomError('The files list cannot be empty!', 400));
    }

    // Calculate the total size of all the uploaded files
    const uploadedFilesSize = req.files.reduce(
      (total, value) => total + parseInt(value.size),
      0
    );

    // Add the uploaded files size and the project files size
    const totalSize = uploadedFilesSize + projectFilesSize;

    // Check if the total size is more than 5MB
    if (totalSize > 5 * 1024 * 1024) {
      const freeSpace = Number(
        (5 * 1024 * 1024 - projectFilesSize) / (1024 * 1024)
      ).toFixed(2);

      const err = new CustomError(
        `The total project size cannot exceed "5MB". You have ${freeSpace}MB left.`,
        400
      );

      // Delete the files
      const deletedFiles = req.files.map((file) => {
        return new Promise((resolve, reject) => {
          fs.unlink(file.path, (err) => {
            if (err) reject();

            resolve();
          });
        });
      });

      await Promise.allSettled(deletedFiles);

      return next(err);
    }

    const filesData = req.files.map((file, index) => {
      const data = {
        path: file.path,
        name: newFilesNames[index],
        size: file.size,
        sender: {
          userId: req.user._id,
          name: req.user.username,
          firstName: req.user.firstName,
          lastName: req.user.lastName,
        },
      };

      return data;
    });

    const files = project.files.concat(filesData);

    // Updates the files property of the project
    project.files = files;

    project.lastModified = Date.now();

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

    await Notification.create({
      user: project.user,
      performer: {
        name: req.user.username,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
      },
      project: project._id,
      action: 'addition',
      type: ['files'],
    });

    return res.status(200).json({
      status: 'success',
      message: 'The file(s) were uploaded successfully.',
    });
  });
});

export const deleteProjectFiles = asyncErrorHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  // Check if project exist
  if (!project) {
    const err = new CustomError(`This project does not exist!`, 404);
    return next(err);
  }

  // Check is the files from the request body is an array
  if (!Array.isArray(req.body.files)) {
    return next(new CustomError('Invalid request format', 400));
  }

  // Check if the length of the files is 0
  if (req.body.files.length === 0) {
    return next(new CustomError('The files list cannot be empty!', 400));
  }

  // Convert the member ids to string
  const team = project.team.map((value) => String(value));

  // Check if the project does not belong to the user
  if (String(project.user) !== String(req.user._id)) {
    if (!team.includes(String(req.user._id))) {
      return next(new CustomError(`This project does not exist!`, 404));
    }
  }

  // Check if the project has files
  if (project.files.length === 0) {
    return next(new CustomError('This project has no file.', 400));
  }

  const fileNames = [];

  const files = project.files.filter((file) => {
    const condition = req.body.files.includes(file.name);

    if (condition) fileNames.push(file.name);

    return condition;
  });

  const errorFiles = [];
  const restrictedFiles = [];

  if (files.length === 0) {
    return next(new CustomError('None of the provided files exist!', 404));
  }

  const missingFiles = req.body.files.filter(
    (name) => !fileNames.includes(name)
  );

  if (missingFiles.length !== 0) {
    return next(
      new CustomError(`These file(s) do not exist - ${missingFiles.join(', ')}`)
    );
  }

  const deleteFiles = files.map((file) => {
    return new Promise((resolve, reject) => {
      if (
        String(file.sender.userId) === String(req.user._id) ||
        String(req.user._id) === String(project.user)
      ) {
        fs.unlink(file.path, (err) => {
          if (err) {
            errorFiles.push(file.name);
            reject();
          }

          const index = project.files.findIndex(
            (doc) => doc.name === file.name
          );

          project.files.splice(index, 1);
          resolve();
        });
      } else {
        restrictedFiles.push(file.name);
        reject();
      }
    });
  });

  await Promise.allSettled(deleteFiles);

  let message = '';

  if (errorFiles.length !== 0) {
    message += `An error occured when deleting these file(s) - '${errorFiles.join(
      ', '
    )}'.\n`;
  }

  if (restrictedFiles.length !== 0) {
    message += `You were unable to delete these file(s) because you were not the sender - '${restrictedFiles.join(
      ', '
    )}'.\n`;
  }

  const otherFiles =
    files.length - (errorFiles.length + restrictedFiles.length);

  if (otherFiles !== 0) {
    if (errorFiles.length !== 0 || restrictedFiles.length !== 0) {
      message += 'The remaining file(s) were deleted succesfully.';
    } else {
      message += 'The file(s) were deleted succesfully.';
    }

    project.lastModified = Date.now();

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

    await Notification.create({
      user: project.user,
      performer: {
        name: req.user.username,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
      },
      project: project._id,
      action: 'deletion',
      type: ['files'],
    });
  }

  return res.status(200).json({
    status: 'success',
    message,
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

  project.lastModified = Date.now();

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

  // Sends notifications
  await Notification.insertMany(notifications);

  return res.status(200).json({
    status: 'success',
    message:
      'Team invitation sent successfully to new members and old members have been removed!',
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

  // Check if this project is the user's current project
  if (String(req.params.id) === String(req.user.currentProject)) {
    const userProjects = await Project.find({ user: req.user._id }).sort(
      'lastModified'
    );

    const currentProject = userProjects[0];

    const update = {};

    // Updates the user's current project
    if (currentProject) {
      update.currentProject = currentProject._id;
    } else {
      update.currentProject = undefined;
    }

    // Update the user's current project
    await User.findByIdAndUpdate(req.user._id, update, {
      runValidators: true,
    });
  }

  // Delete all notifications that belongs to the project
  await Notification.deleteMany({ project: project._id });

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
