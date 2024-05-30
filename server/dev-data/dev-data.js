import Project from '../Models/projectModel.js';
import User from '../Models/userModel.js';
import Notification from '../Models/notificationModel.js';
import Task from '../Models/taskModel.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '../config.env' });

await mongoose.connect(process.env.DB_LOCAL_CONN_STR);

const importData = async (Model) => {};

const deleteData = async (Model) => {
  switch (Model) {
    case 'notification':
      await Notification.deleteMany();
      console.log('Documents were deleted successfully!');
      break;

    case 'project':
      await Project.deleteMany();
      console.log('Documents were deleted successfully!');
      break;

    case 'task':
      await Task.deleteMany();
      console.log('Documents were deleted successfully!');
      break;

    case 'user':
      await User.deleteMany();
      console.log('Documents were deleted successfully!');
      break;

    default:
      console.log('Collection does not exist!');
  }

  process.exit(0);
};

if (process.argv[2] === '--delete') {
  await deleteData(process.argv[3]);
}
