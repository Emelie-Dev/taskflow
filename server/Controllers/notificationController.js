import Notification from '../Models/notificationModel.js';
import Task from '../Models/taskModel.js';
import User from '../Models/userModel.js';
import asyncErrorHandler from '../Utils/asyncErrorHandler.js';
import CustomError from '../Utils/CustomError.js';

export const getUserNotifications = asyncErrorHandler(
  async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new CustomError('This user does not exist.', 404));
    } else if (String(req.user._id) !== String(req.params.id)) {
      return next(new CustomError('This user does not exist.', 404));
    }

    const notifications = await Notification.find({
      user: user._id,
      task: { $exists: false },
      $or: [{ project: { $exists: false } }, { projectActivity: true }],
    }).sort('-time _id');

    return res.status(200).json({
      status: 'success',
      data: {
        notifications,
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
