import User from '../Models/userModel.js';
import asyncErrorHandler from '../Utils/asyncErrorHandler.js';
import CustomError from '../Utils/CustomError.js';
import factory from '../Utils/handlerFactory.js';

export const getAllUsers = factory.getAll(User, 'users');

export const getUser = asyncErrorHandler(async (req, res, next) => {
  const username = req.params.id;

  const user = await User.findOne({
    username: { $regex: new RegExp(`^${username}$`, 'i') },
  }).select('username firstName lastName photo');

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
  }

  return res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});
