import mongoose from 'mongoose';

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
      immutable: true,
    },
    // leader: {
    //   type: mongoose.Schema.ObjectId,
    //   ref: 'User',
    //   required: [true, 'Please provide a value for the project leader field.'],
    // },
    team: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        default: [],
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
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    files: [
      {
        path: {
          type: String,
          required: [true, 'File must have a path.'],
        },
        name: {
          type: String,
          required: [true, 'File must have a name.'],
        },
        size: {
          type: Number,
          required: [true, 'File must have a size.'],
        },
        time: {
          type: Date,
          default: Date.now(),
        },
        sender: {
          type: {
            userId: {
              type: mongoose.Schema.ObjectId,
              ref: 'User',
            },
            name: String,
            lastName: String,
            firstName: String,
          },
        },
      },
    ],
    addFiles: {
      type: Boolean,
      default: false,
    },
    deadline: Date,
    lastModified: {
      type: Date,
      default: Date.now(),
    },
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

// Validates deadline field
projectSchema.pre('save', function (next) {
  if (this.deadline < this.createdAt) {
    return next(
      new CustomError('Please provide a valid value for the deadline!', 400)
    );
  }

  next();
});

projectSchema.pre('find', function (next) {
  if (this.getFilter().calculateProgress) {
    delete this.getFilter().calculateProgress;

    this.calculateProjectsProgress = true;

    this.populate({
      path: 'tasks',
      select: 'status',
    });
  }

  next();
});

projectSchema.post('find', function (docs) {
  if (this.calculateProjectsProgress) {
    docs.forEach((doc) => {
      let openTasks = 0;
      let completedTasks = 0;

      for (let task of doc.tasks) {
        if (task.status === 'open') openTasks++;
        if (task.status === 'complete') completedTasks++;
      }

      doc.openTasks = openTasks;
      doc.completedTasks = completedTasks;
      doc.progress = Math.floor(
        (completedTasks / (doc.tasks.length || 1)) * 100
      );
    });
  }
});

const Project = mongoose.model('Project', projectSchema);

export default Project;
