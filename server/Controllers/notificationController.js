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

export const deleteNotification = asyncErrorHandler(async (req, res, next) => {
  let notification;

  if (req.params.projectId) {
    notification = await Notification.findOne({
      _id: req.params.id,
      user: req.user._id,
      project: req.params.projectId,
    });

    if (!notification) {
      return next(new CustomError(`This activity does not exist!`, 404));
    }
  }

  await notification.deleteOne();

  return res.status(204).json({ status: 'success' });
});
