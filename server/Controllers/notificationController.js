import Notification from '../Models/notificationModel.js';
import asyncErrorHandler from '../Utils/asyncErrorHandler.js';

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
