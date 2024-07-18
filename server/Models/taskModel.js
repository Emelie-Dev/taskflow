import mongoose from 'mongoose';
import CustomError from '../Utils/CustomError.js';

const taskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Please provide a value for the name field.'],
    },
    // Thw owner or an assignee
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Task must belong to a user.'],
      immutable: true,
    },
    // The persons who owns the project
    leader: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      immutable: true,
    },
    assigned: {
      type: Boolean,
      immutable: true,
    },
    assignee: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    mainTask: {
      type: mongoose.Schema.ObjectId,
      ref: 'Task',
      immutable: true,
    },
    // For creating tasks on project
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      immutable: true,
    },
    project: {
      type: mongoose.Schema.ObjectId,
      ref: 'Project',
      required: [true, 'Please provide a value for the project field.'],
      immutable: true,
    },
    status: {
      type: String,
      enum: ['open', 'progress', 'complete'],
      default: 'open',
    },
    priority: {
      type: String,
      enum: ['high', 'medium', 'low'],
      required: [true, 'Please provide a value for the priority field.'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
    lastModified: {
      type: Date,
      default: Date.now,
    },
    deadline: Date,
    description: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Prevents duplicate tasks from a user
taskSchema.index({ name: 1, user: 1, project: 1 }, { unique: true });

// Creates virtual field for activities
taskSchema.virtual('activities', {
  ref: 'Notification',
  foreignField: 'task',
  localField: '_id',
});

// Filters tasks
taskSchema.query.filterTasks = function (type) {
  let date = new Date();

  switch (type.trim()) {
    // returns tasks from the last seven days
    case 'recent':
      date.setDate(date.getDate() - 7);
      return this.where('lastModified').gte(date);

    // returns urgent tasks
    case 'urgent':
      return this.where({ priority: 'high', status: { $ne: 'complete' } });

    // returns assigned tasks
    case 'assigned':
      return this.where({ assigned: true, status: { $ne: 'complete' } });

    // returns tasks whose deadline are far
    case 'later':
      date.setMonth(date.getMonth() + 1);
      return this.where({
        deadline: { $gte: date },
        status: { $ne: 'complete' },
      });
  }
};

// Filters scheduled tasks
taskSchema.query.scheduledTasks = function (year, month, day) {
  return this.where({
    $expr: {
      $and: [
        { $eq: [{ $year: '$deadline' }, year] },
        { $eq: [{ $month: '$deadline' }, month] },
        { $eq: [{ $dayOfMonth: '$deadline' }, day] },
      ],
    },
  });
};

// Validates deadline field
taskSchema.pre('save', function (next) {
  if (this.assigned) return next();
  if (this.deadline) {
    this.deadline.setMinutes(0, 0, 0);

    const createdAt = new Date(this.createdAt);
    createdAt.setMinutes(0, 0, 0);

    if (Date.parse(new Date(this.deadline)) < Date.parse(new Date(createdAt))) {
      return next(
        new CustomError('Please provide a valid value for the deadline!', 400)
      );
    }
  }
  next();
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
