import Activity from '../Models/activityModel.js';
import asyncErrorHandler from '../Utils/asyncErrorHandler.js';

export const getAllActivities = asyncErrorHandler(async (req, res, next) => {
  const activities = await Activity.find();

  res.status(200).json({
    status: 'success',
    length: activities.length,
    data: {
      activities,
    },
  });
});

export const createNewActivity = asyncErrorHandler(async (req, res, next) => {
  const activity = await Activity.create(req.body);

  res.status(200).json({
    status: 'success',
    data: {
      activity,
    },
  });
});
