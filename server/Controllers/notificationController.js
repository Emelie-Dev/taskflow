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

    const page = req.query.page || 1;
    const limit = req.query.limit || 100;
    const deleteCount = req.query.deleteCount || 0;
    const skip = (Number(page) - 1) * Number(limit) - Number(deleteCount);

    const notifications = await Notification.find({
      user: user._id,
      task: { $exists: false },
      $or: [{ project: { $exists: false } }, { projectActivity: true }],
    })
      .sort('-time _id')
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      status: 'success',
      data: {
        notifications,
      },
    });
  }
);

export const deleteUserNotifications = asyncErrorHandler(
  async (req, res, next) => {
    if (!req.body.notifications || req.body.notifications.length === 0) {
      return next(
        new CustomError(
          'Please select the notifications you want to delete.',
          400
        )
      );
    }

    // Deletes notifications
    await Promise.allSettled(
      req.body.notifications.map(
        (notification) =>
          new Promise(async (resolve, reject) => {
            try {
              resolve(await Notification.findByIdAndDelete(notification));
            } catch {
              reject();
            }
          })
      )
    );

    return res.status(204).json({ status: 'success', message: null });
  }
);
