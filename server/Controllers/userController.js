import User from '../Models/userModel.js';

export const getAllUsers = async (req, res) => {
  const users = await User.find().limit(0);

  return res.status(200).json({
    status: 'success',
    length: users.length,
    data: {
      users,
    },
  });
};
