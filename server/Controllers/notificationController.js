import Notification from '../Models/notificationModel.js';
import Task from '../Models/taskModel.js';
import asyncErrorHandler from '../Utils/asyncErrorHandler.js';
import CustomError from '../Utils/CustomError.js';

export const getAllNotifications = asyncErrorHandler(async (req, res, next) => {
  const notifications = await Notification.find();

  res.status(200).json({
    status: 'success',
    length: notifications.length,
    data: {
      notifications,
    },
  });
});

export const createNewNotification = asyncErrorHandler(
  async (req, res, next) => {
    const notification = await Notification.create(req.body);

    res.status(200).json({
      status: 'success',
      data: {
        notification,
      },
    });
  }
);
