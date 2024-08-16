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
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
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

    const fileName = `user-${req.user._id}-${
      Math.round(Math.random() * 1e14) + Date.now()
    }${ext}`;

    cb(null, fileName);
  },
});

// Initialize Multer with the storage and filter options
const upload = multer({
  storage: multerStorage,
});

export const getAssignedProjects = asyncErrorHandler(async (req, res, next) => {
  const page = req.query.page || 1;
  const skip = (page - 1) * 30;

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
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: '$project._id',
        assignedDate: { $first: '$createdAt' },
        name: { $first: '$project.name' },
        username: { $first: '$projectLeader.username' },
        firstName: { $first: '$projectLeader.firstName' },
        lastName: { $first: '$projectLeader.lastName' },
        leaderPhoto: { $first: '$projectLeader.photo' },
        tasks: { $sum: 1 },
      },
    },
    { $sort: { assignedDate: -1 } },
    { $skip: skip },
    { $limit: 30 },
  ]);

  return res.status(200).json({
    status: 'success',
    data: {
      assignedProjects,
    },
  });
});

export const getProject = asyncErrorHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id)
    .populate({
      path: 'user',
      select: 'firstName lastName username photo',
    })
    .populate({
      path: 'team',
      select: 'firstName lastName username occupation photo',
    });

  if (!project) {
    return next(new CustomError('This project does not exist!', 404));
  }

  const { team } = project;

  const isMember = team.find(
    (member) => String(member._id) === String(req.user._id)
  );

  if (String(project.user._id) !== String(req.user._id)) {
    if (!isMember) {
      return next(new CustomError('This project does not exist!', 404));
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
    req.body,
    {
      new: true,
      runValidators: true,
    }
  )
    .populate({
      path: 'user',
      select: 'firstName lastName username photo',
    })
    .populate({
      path: 'team',
      select: 'firstName lastName username occupation photo',
    });

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
  let project = await Project.findById(req.params.id);

  // Check if project exist
  if (!project) {
    const err = new CustomError(`This project does not exist!`, 404);
    return next(err);
  }

  // Validate request header
  if (!req.headers['x-file-names']) {
    return next(new CustomError('Invalid request!', 400));
  }

  const newFilesNames = req.headers['x-file-names'].split(',');

  if (newFilesNames.length === 0) {
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

    const filesData = req.files.map((file, index) => ({
      path: file.path,
      name: newFilesNames[index],
      size: file.size,
      sender: {
        userId: req.user._id,
        username: req.user.username,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
      },
    }));

    const files = [...filesData, ...project.files];

    // Updates the files property of the project
    project = await Project.findOneAndUpdate(
      {
        _id: req.params.id,
        user: project.user,
      },
      { files },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate({
        path: 'user',
        select: 'firstName lastName username photo',
      })
      .populate({
        path: 'team',
        select: 'firstName lastName username occupation photo',
      });

    // Update the user current project
    if (String(project.user) === String(req.user._id)) {
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
      data: {
        project,
        message: 'The file(s) were uploaded successfully.',
      },
    });
  });
});

export const deleteProjectFiles = asyncErrorHandler(async (req, res, next) => {
  let project = await Project.findById(req.params.id);

  // Check if project exist
  if (!project) {
    const err = new CustomError(`This project does not exist!`, 404);
    return next(err);
  }

  // Check is the files from the request body is an array
  if (!Array.isArray(req.body.files)) {
    return next(new CustomError('Invalid request format.', 400));
  }

  // Check if the length of the files is 0
  if (req.body.files.length === 0) {
    return next(new CustomError('The files list cannot be empty!', 400));
  }

  // Convert the member ids to string
  const team = project.team.map((value) => String(value));
  const projectFiles = [...project.files];

  // Check if the project does not belong to the user
  if (String(project.user) !== String(req.user._id)) {
    if (!team.includes(String(req.user._id))) {
      return next(new CustomError(`This project does not exist!`, 404));
    }
  }

  // Check if the project has files
  if (projectFiles.length === 0) {
    return next(new CustomError('This project has no file.', 400));
  }

  const fileNames = [];
  const errorFiles = [];
  const restrictedFiles = [];

  const files = projectFiles.filter((file) => {
    const condition = req.body.files.includes(file.name);

    if (condition) fileNames.push(file.name);

    return condition;
  });

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
      const fileName =
        file.name.lastIndexOf('.') !== -1
          ? file.name.slice(0, file.name.lastIndexOf('.'))
          : file.name;

      const ext =
        file.path.lastIndexOf('.') !== -1
          ? file.path.slice(file.path.lastIndexOf('.'))
          : '';

      if (
        String(file.sender.userId) === String(req.user._id) ||
        String(req.user._id) === String(project.user)
      ) {
        fs.unlink(file.path, (err) => {
          if (err) {
            errorFiles.push(`${fileName}${ext}`);
            reject();
          }

          const index = projectFiles.findIndex((doc) => doc.name === file.name);
          projectFiles.splice(index, 1);
          resolve();
        });
      } else {
        restrictedFiles.push(`${fileName}${ext}`);
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
    project = await Project.findOneAndUpdate(
      {
        _id: req.params.id,
        user: project.user,
      },
      { files: projectFiles },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate({
        path: 'user',
        select: 'firstName lastName username photo',
      })
      .populate({
        path: 'team',
        select: 'firstName lastName username occupation photo',
      });

    // Update the user current project
    if (String(project.user) === String(req.user._id)) {
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
  } else {
    project = await Project.findById(req.params.id)
      .populate({
        path: 'user',
        select: 'firstName lastName username photo',
      })
      .populate({
        path: 'team',
        select: 'firstName lastName username occupation photo',
      });
  }

  return res.status(200).json({
    status: 'success',
    data: {
      project,
      message,
    },
  });
});

export const updateTeam = asyncErrorHandler(async (req, res, next) => {
  let project = await Project.findOne({
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

  const updatedTeam = new Set(newTeam);

  const leaderIndex = newTeam.indexOf(String(req.user._id));

  if (leaderIndex !== -1) {
    newTeam.splice(leaderIndex, 1);
    updatedTeam.delete(String(req.user._id));
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

      const oldNotification = await Notification.findOne({
        user: member,
        action: 'invitation',
        'performer.project': project._id,
      });

      if (!oldNotification) {
        notifications.push({
          user: member,
          performer: {
            name: req.user.username,
            owner: req.user._id,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            project: project._id,
          },
          action: 'invitation',
          type: ['team'],
        });
      }

      updatedTeam.delete(member);
    }
  }

  // Filters old members
  for (let member of members) {
    if (!newTeam.includes(member)) {
      const user = await User.findById(member).select(
        'username firstName lastName'
      );

      oldMembers.push(user);

      notifications.push({
        user: member,
        performer: {
          owner: req.user._id,
          name: req.user.username,
          firstName: req.user.firstName,
          lastName: req.user.lastName,
          project: project._id,
        },
        action: 'removal',
        type: ['team'],
      });

      await Task.updateMany(
        {
          user: req.user._id,
          project: req.params.id,
          assignee: `${member}`,
        },
        {
          $pull: { assignee: `${member}` },
        }
      );

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
  project = await Project.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.user._id,
    },
    { team: [...updatedTeam] },
    {
      new: true,
      runValidators: true,
    }
  )
    .populate({
      path: 'user',
      select: 'firstName lastName username photo',
    })
    .populate({
      path: 'team',
      select: 'firstName lastName username occupation photo',
    });

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
    data: {
      project,
      message:
        'Team invitation sent successfully to new members and old members have been removed.',
    },
  });
});

export const deleteProject = asyncErrorHandler(async (req, res, next) => {
  const project = await Project.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!project) {
    const err = new CustomError(`This project does not exist!`, 404);
    return next(err);
  }

  // Deletes all project tasks
  await Task.deleteMany({ project: project._id });

  // Check if this project is the user's current project
  if (String(req.params.id) === String(req.user.currentProject)) {
    const userProjects = await Project.find({ user: req.user._id }).sort(
      'updatedAt'
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

export const getProjectFile = async (req, res) => {
  const { projectId, file: filePath } = req.params;

  const project = await Project.findById(projectId);

  if (!project) {
    return res.status(404).send('This file does not exist!');
  }

  const { team } = project;

  if (String(project.user._id) !== String(req.user._id)) {
    if (!team.includes(String(req.user._id))) {
      return res.status(404).send('This file does not exist!');
    }
  }

  const projectFile = project.files.find(
    (file) => String(file.path).slice(21) === filePath
  );

  if (!projectFile) {
    return res.status(404).send('This file does not exist!');
  }

  const path = join(
    dirname(fileURLToPath(import.meta.url)),
    `../Public/project-files/${filePath}`
  );

  const fileName =
    projectFile.name.lastIndexOf('.') !== -1
      ? projectFile.name.slice(0, projectFile.name.lastIndexOf('.'))
      : projectFile.name;

  const ext =
    projectFile.path.lastIndexOf('.') !== -1
      ? projectFile.path.slice(projectFile.path.lastIndexOf('.'))
      : '';

  return res.download(path, `${fileName}${ext}`, (err) => {
    if (err) {
      res.status(500).send('Error occured while downloading file.');
    }
  });
};

export const createNewProject = factory.createOne(Project, 'project');

export const getAllProjects = factory.getAll(Project, 'projects');

export const getMyProjects = factory.getMyData(Project, 'projects');
