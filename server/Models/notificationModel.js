import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    // required: [true, 'Notification must belong to a user.'],
  },
  members: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      // required: [true, 'Notification must belong to a user.'],
    },
  ],
  type: {
    type: String,
    enum: ['activity', 'login', 'group', 'private'],
    required: [true, 'Please provide a value for the type field.'],
  },
  action: {
    type: String,
    enum: ['transition', 'update', 'assignment', 'creation', 'deletion'],
    // required: [true, 'Please provide a value for the action field.'],
  },
  state: [String],
  project: {
    type: mongoose.Schema.ObjectId,
    ref: 'Project',
  },
  task: {
    type: mongoose.Schema.ObjectId,
    ref: 'Task',
  },
  time: {
    type: Date,
    default: Date.now(),
    // required: [true, 'Please provide a value for the date field.'],
  },
  group: String,
  private: String,
  phone: String,
  country: String,
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;

// notifications: [
//   {
//     type: {
//       type: String,
//       enum: ['login', 'group', 'private'],
//       required: [true, 'Please provide a value for the type field.'],
//     },
//
//   },
// ],
