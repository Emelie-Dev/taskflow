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
      'assignment', // When tasks are assigned
      'creation', // When tasks are created
      'deletion',
      'extension',
      'reduction',
      'invitation',
      'addition', // When new team members or files are added
      'removal', // When members are removed
      'response',
      'task', // For private notification on task assignment
      'filePermission',
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
        'project',
        'files',
        'addFiles',
      ],
      // required: [true, 'Please provide a value for the type field.'],
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
    default: Date.now,
    immutable: true,
  },
  group: String,
  private: String,
  phone: String,
  country: String,
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
