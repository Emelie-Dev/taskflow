import Project from '../Models/projectModel.js';
import User from '../Models/userModel.js';
import Notification from '../Models/notificationModel.js';
import Task from '../Models/taskModel.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: '../config.env' });

await mongoose.connect(process.env.DB_LOCAL_CONN_STR);

const data = JSON.parse(fs.readFileSync('./data.json', 'utf-8'));

const importData = async (Model) => {
  switch (Model) {
    case 'notification':
      await Notification.insertMany(data);
      console.log('Documents were inserted successfully!');
      break;

    case 'project':
      await Project.insertMany(data);
      console.log('Documents were inserted successfully!');
      break;

    case 'task':
      await Task.insertMany(data);
      console.log('Documents were inserted successfully!');
      break;

    case 'user':
      await User.insertMany(data);
      console.log('Documents were inserted successfully!');
      break;

    default:
      console.log('Collection does not exist!');
  }
};

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
} else if (process.argv[2] === '--import') {
  await importData(process.argv[3]);
}
