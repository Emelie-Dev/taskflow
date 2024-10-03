import User from '../Models/userModel.js';
import asyncErrorHandler from '../Utils/asyncErrorHandler.js';
import CustomError from '../Utils/CustomError.js';
import Email from '../Utils/Email.js';
import factory from '../Utils/handlerFactory.js';
import Task from '../Models/taskModel.js';
import Notification from '../Models/notificationModel.js';
import Project from '../Models/projectModel.js';
import fs from 'fs';
import multer from 'multer';
import sharp from 'sharp';

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new CustomError('Not an image! Please upload only images.', 400), false);
  }
};

// Initialize Multer with the storage and filter options
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: multerFilter,
});

const updateProfie = async (user, body) => {
  const {
    firstName,
    lastName,
    username,
    occupation,
    email,
    mobileNumber,
    country,
    language,
  } = body;

  const userData = await User.findByIdAndUpdate(
    user._id,
    {
      firstName,
      lastName,
      username,
      occupation,
      email,
      mobileNumber,
      country,
      language,
    },
    {
      new: true,
      runValidators: true,
    }
  ).select('-password');

  return userData;
};

const updateNotificationSettings = async (user, body) => {
  const { taskAssignment, reminder, projectActivity, email } = body;

  const userData = await User.findByIdAndUpdate(
    user._id,
    {
      notificationSettings: {
        taskAssignment,
        reminder,
        projectActivity,
        email,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  ).select('-password');

  return userData;
};

const updatePersonalizationSettings = async (user, body) => {
  const { theme, defaultProjectView, priorityColors, customFields } = body;

  const newCustomFields = new Set(customFields);

  if (newCustomFields.size !== customFields.length) {
    return 'error';
  }

  const userData = await User.findByIdAndUpdate(
    user._id,
    {
      personalization: {
        theme,
        defaultProjectView,
        priorityColors,
        customFields,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  ).select('-password');

  return userData;
};

const updateSecuritySettings = async (user, body) => {
  let passwordMessage;
  const { firstName, lastName, language, mobileNumber, country, dob } =
    body.dataVisibility;

  const userData = await User.findByIdAndUpdate(
    user._id,
    {
      dataVisibility: {
        firstName,
        lastName,
        language,
        mobileNumber,
        country,
        dob,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  ).select('-password');

  if (body.password) {
    const currentUser = await User.findById(userData._id);

    if (
      !(await currentUser.comparePasswordInDb(
        body.password.oldPassword,
        currentUser.password
      ))
    ) {
      passwordMessage = 'The current password you provided is incorrect.';
    } else {
      user.password = body.password.newPassword;
      user.passwordChangedAt = Date.now();
      await user.save();

      await Notification.create({
        user: user._id,
        action: 'update',
        type: ['security'],
        state: { change: true },
      });
    }
  }

  return { userData, passwordMessage };
};

const generateDeleteToken = () => {
  const token = Math.floor(Math.random() * 1_000_000);

  return String(token);
};

const deleteUserTasks = async (user) => {
  const notifications = [];

  for await (const task of Task.find({ user: user._id })) {
    if (task.assigned) {
      notifications.push({
        user: task.leader,
        task: task.mainTask,
        action: 'deletion',
        type: ['account'],
        performer: {
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });

      await Task.findByIdAndUpdate(task.mainTask, {
        $pull: { assignee: String(user._id) },
      });
    } else {
      await Task.deleteMany({ mainTask: task._id });
    }

    await Task.findByIdAndDelete(task._id);
  }

  await Notification.insertMany(notifications);
};

const deleteUserProjectsAndFiles = async (user) => {
  for await (const project of Project.find({ user: user._id })) {
    if (project.files.length !== 0) {
      await Promise.allSettled(
        project.files.map(
          (file) =>
            new Promise((resolve, reject) => {
              fs.unlink(file.path, (err) => {
                if (err) reject();

                resolve();
              });
            })
        )
      );
    }

    await Project.findByIdAndDelete(project._id);
  }
};

export const getUser = asyncErrorHandler(async (req, res, next) => {
  const username = req.params.id;

  let user;

  if (req.query.team) {
    user = await User.findOne({
      username: { $regex: new RegExp(`^${username}$`, 'i') },
    }).select('username firstName lastName photo');
  } else {
    user = await User.findOne({
      username: { $regex: new RegExp(`^${username}$`, 'i') },
    })
      .select(
        'username firstName lastName photo occupation dob email country language mobileNumber dataVisibility'
      )
      .lean();
  }

  if (!user) {
    return next(new CustomError('This user does not exist.', 404));
  }

  if (req.query.team) {
    if (String(user._id) === String(req.user._id)) {
      return next(
        new CustomError(
          "You can't add yourself to the team, you are already a member.",
          400
        )
      );
    }
  } else {
    const { dataVisibility } = user;
    delete user.dataVisibility;
    for (const prop in user) {
      if (prop in dataVisibility) {
        if (!dataVisibility[prop]) delete user[prop];
      }
    }
  }

  return res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

export const formatProfileImage = asyncErrorHandler(async (req, res, next) => {
  req.file.filename = `user-${req.user._id}-${
    Math.round(Math.random() * 1e14) + Date.now()
  }.jpeg`;

  // Formats the image
  await sharp(req.file.buffer)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`Public/img/users/${req.file.filename}`);

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { photo: req.file.filename },
    {
      new: true,
      runValidators: true,
    }
  );

  return res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

export const uploadProfileImage = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new CustomError('This user does not exist.', 404));
  } else if (String(req.user._id) !== String(req.params.id)) {
    return next(new CustomError('This user does not exist.', 404));
  }

  // Uploads the file
  upload.single('photo')(req, res, (error) => {
    if (error) {
      return next(
        new CustomError('An error occurred during picture upload!', 500)
      );
    }

    if (!req.file) {
      return next(new CustomError('Select an image to upload!', 400));
    }

    next();
  });
});

export const removeProfileImage = asyncErrorHandler(async (req, res, next) => {
  let user = await User.findById(req.params.id);

  if (!user) {
    return next(new CustomError('This user does not exist.', 404));
  } else if (String(req.user._id) !== String(req.params.id)) {
    return next(new CustomError('This user does not exist.', 404));
  }

  if (user.photo !== 'default.jpeg') {
    fs.unlink(`Public/img/users/${user.photo}`, async (err) => {
      if (err) {
        return next(
          new CustomError(
            'An error occurred while removing profile picture.',
            500
          )
        );
      }

      user = await User.findByIdAndUpdate(
        req.params.id,
        { photo: 'default.jpeg' },
        {
          new: true,
          runValidators: true,
        }
      );

      return res.status(200).json({
        status: 'success',
        data: {
          user,
        },
      });
    });
  } else {
    return next(new CustomError('You do not have a profile picture.', 404));
  }
});

export const updateUser = asyncErrorHandler(async (req, res, next) => {
  const user = req.user;
  const categories = [
    'profile',
    'notifications',
    'personalization',
    'security',
  ];
  const category = req.params.category;
  let userData = '';

  if (!user) {
    return next(new CustomError('This user does not exist.', 404));
  }

  if (!categories.includes(String(category).toLowerCase())) {
    return next(new CustomError('Bad request.', 400));
  }

  switch (category) {
    case 'profile':
      userData = await updateProfie(user, req.body);
      break;
    case 'notifications':
      userData = await updateNotificationSettings(user, req.body);
      break;
    case 'personalization':
      userData = await updatePersonalizationSettings(user, req.body);
      break;
    case 'security':
      userData = await updateSecuritySettings(user, req.body);
  }

  if (userData === 'error') {
    return next(
      new CustomError(`You can't have duplicate custom fields.`, 400)
    );
  }

  return res.status(200).json({
    status: 'success',
    data: {
      userData,
    },
  });
});

export const deactivateUser = asyncErrorHandler(async (req, res, next) => {
  const status = req.params.status;

  if (status === 'delete_token') return next();
  else if (status !== 'deactivate')
    return next(new CustomError('Bad request.', 400));

  const user = await User.findById(req.params.id);
  const password = req.body.password;

  if (!user) {
    return next(new CustomError('This user does not exist.', 404));
  } else if (String(req.user._id) !== String(req.params.id)) {
    return next(new CustomError('This user does not exist.', 404));
  }

  if (!(await user.comparePasswordInDb(password, user.password))) {
    return next(
      new CustomError('The password you provided is incorrect.', 401)
    );
  }

  user.active = false;
  await user.save();

  //send deactivation email

  return res.status(204).json({
    status: 'success',
    message: null,
  });
});

export const getDeleteToken = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  const password = req.body.password;

  if (!user) {
    return next(new CustomError('This user does not exist.', 404));
  } else if (String(req.user._id) !== String(req.params.id)) {
    return next(new CustomError('This user does not exist.', 404));
  }

  if (!(await user.comparePasswordInDb(password, user.password))) {
    return next(
      new CustomError('The password you provided is incorrect.', 401)
    );
  }

  // Send delete token
  let token = generateDeleteToken();

  while (token.length < 6) {
    token = generateDeleteToken();
  }

  // await new Email(user, token).sendDeleteToken();

  user.deleteAccountToken = token;
  user.deleteAccountTokenExpires = Date.now() + 60 * 60 * 1000;

  await user.save();

  return res.status(200).json({
    status: 'success',
    message: null,
  });
});

export const deleteUser = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findOne({
    deleteAccountToken: String(req.params.token),
    deleteAccountTokenExpires: { $gt: Date.now() },
  });
  const notifications = [];

  if (!user) {
    return next(new CustomError('This code is invalid or has expired.', 404));
  } else if (String(req.user._id) !== String(req.params.id)) {
    return next(new CustomError('This user does not exist.', 404));
  }

  // Delete user tasks
  await deleteUserTasks(user);

  // Delete user projects and files
  await deleteUserProjectsAndFiles(user);

  // Delete user notifications
  await Notification.deleteMany({ user: user._id });

  // Delete user profile image
  if (user.photo !== 'default.jpeg') {
    await new Promise((resolve, reject) => {
      fs.unlink(`Public/img/users/${user.photo}`, (err) => {
        if (err) reject();

        resolve();
      });
    });
  }

  // Delete user account
  await User.findByIdAndDelete(user._id);

  // Send notifications to project owners if user is in their team
  for await (const project of Project.find({ team: String(user._id) })) {
    const owner = await User.findById(project.user);

    notifications.push({
      user: project.user,
      project: project._id,
      action: 'deletion',
      type: ['account'],
      performer: {
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        project: project.name,
      },
      projectActivity: owner.notificationSettings.projectActivity
        ? true
        : undefined,
    });

    await Project.findByIdAndUpdate(project._id, {
      $pull: { team: String(user._id) },
    });
  }

  await Notification.insertMany(notifications);

  return res.status(204).json({
    status: 'success',
    message: null,
  });
});

export const getAllUsers = factory.getAll(User, 'users');
