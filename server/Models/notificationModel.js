import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    // required: [true, 'Notification must belong to a user.'],
  },
  performer: {
    type: {},
  },
  action: {
    type: String,
    enum: [
      'transition',
      'update',
      'assignment',
      'creation',
      'deletion',
      'extension',
      'reduction',
      'invitation',
    ],
    // required: [true, 'Please provide a value for the action field.'],
  },
  type: [
    {
      type: String,
      enum: [
        'priority',
        'status',
        'name',
        'description',
        'deadline',
        'assignee',
        'login',
        'group',
        'private',
        'task',
        'team',
        'assignedTask',
      ],
      required: [true, 'Please provide a value for the type field.'],
    },
  ],
  state: {
    type: {},
  },
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
    immutable: true,
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
