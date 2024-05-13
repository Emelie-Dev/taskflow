import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
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
      type: {
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
    },
  ],
});

// Virtual populate (logs, tasks)

// Prevents duplicate project from a user
projectSchema.index({ name: 1, user: 1 }, { unique: true });

const Project = mongoose.model('Project', projectSchema);

export default Project;
