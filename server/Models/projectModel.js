import mongoose from 'mongoose';
import Task from './taskModel.js';

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a value for the name field.'],
      trim: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Project must belong to a user.'],
    },
    leader: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Please provide a value for the project leader field.'],
    },
    team: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    description: {
      type: String,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      immutable: true,
    },
    deadline: {
      type: Date,
      validate: {
        validator: (value) => {
          return value > this.createdAt;
        },
        message: 'Please provide a valid deadline date.',
      },
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    files: [
      {
        name: {
          type: String,
          required: [true, 'File must have a name.'],
        },
        size: {
          type: String,
          required: [true, 'File must have a size.'],
        },
        time: {
          type: Date,
          default: Date.now(),
        },
        sender: {
          type: mongoose.Schema.ObjectId,
          ref: 'User',
          required: [true, 'File must belong to a sender.'],
        },
      },
    ],
    progress: Number,
    openTasks: Number,
    completedTasks: Number,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Prevents duplicate project from a user
projectSchema.index({ name: 1, user: 1 }, { unique: true });

// Virtual populate activities

// virtual populate Tasks
projectSchema.virtual('tasks', {
  ref: 'Task',
  foreignField: 'project',
  localField: '_id',
});

projectSchema.pre('find', function (next) {
  this.populate({
    path: 'tasks',
    select: 'status',
  });
  next();
});

projectSchema.post('find', function (docs) {
  docs.forEach((doc) => {
    const openTasks = doc.tasks.filter((task) => task.status === 'open');
    const completedTasks = doc.tasks.filter(
      (task) => task.status === 'complete'
    );

    doc.openTasks = openTasks.length;
    doc.completedTasks = completedTasks.length;
    doc.progress = Math.floor((completedTasks.length / doc.tasks.length) * 100);
  });
});

const Project = mongoose.model('Project', projectSchema);

export default Project;
