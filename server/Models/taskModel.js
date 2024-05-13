import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Please provide a value for the name field.'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Project must belong to a user.'],
  },
  project: {
    type: mongoose.Schema.ObjectId,
    ref: 'Project',
    required: [true, 'Please provide a value for the project field.'],
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
  assignee: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  ],
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
  description: {
    type: String,
    trim: true,
  },
});

// Virtual populate (logs)

// Prevents duplicate project from a user
taskSchema.index({ name: 1, user: 1, project: 1 }, { unique: true });

const Task = mongoose.model('Task', taskSchema);

export default Task;
