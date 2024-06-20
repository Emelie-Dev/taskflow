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
    details: {
      type: {
        open: {
          type: Number,
          default: 0,
        },
        progress: {
          type: Number,
          default: 0,
        },
        complete: {
          type: Number,
          default: 0,
        },
        projectProgress: {
          type: Number,
          default: 0,
        },
      },
      default: {
        open: 0,
        progress: 0,
        complete: 0,
        projectProgress: 0,
      },
    },
  },
  {
    toJSON: {
      virtuals: true,
      // Deletes tasks before sending to user
      transform: function (doc, ret, options) {
        if (options.tasks) delete ret.tasks;
      },
    },
    toObject: { virtuals: true },
  }
);

// Prevents duplicate project from a user
projectSchema.index({ name: 1, user: 1 }, { unique: true });

// Create index for details field
projectSchema.index({ 'details.projectProgress': 1 });

// Virtual populate activities

// virtual populate Tasks
projectSchema.virtual('tasks', {
  ref: 'Task',
  foreignField: 'project',
  localField: '_id',
  match: { assigned: { $ne: true } },
});

// Validates deadline field
projectSchema.pre('save', function (next) {
  if (this.deadline < this.createdAt) {
    return next(
      new CustomError('Please provide a valid value for the deadline!', 400)
    );
  }

  const { open, progress, complete } = this.details;

  this.details.projectProgress = Math.floor(
    (complete / (open + complete + progress || 1)) * 100
  );
  console.log(Math.floor((progress / (open + complete + progress || 1)) * 100));
  next();
});

// Filters the projects by progress
projectSchema.query.filterByCategory = function (category) {
  switch (category) {
    case 'complete':
      return this.where({ 'details.projectProgress': 100 });

    case 'open':
      return this.where({ 'details.projectProgress': 0 });

    case 'progress':
      return this.where({
        $and: [
          { 'details.projectProgress': { $ne: 0 } },
          { 'details.projectProgress': { $ne: 100 } },
        ],
      });
  }
};

// Update the details field
projectSchema.methods.updateDetails = function (oldValue, newValue) {
  if (oldValue === newValue) return;

  if (oldValue === null) {
    this.details[newValue]++;
  } else if (newValue === null) {
    this.details[oldValue]--;
  } else {
    this.details[newValue]++;
    this.details[oldValue]--;
  }
};

const Project = mongoose.model('Project', projectSchema);

export default Project;

// // Virtual fields
// projectSchema.virtual('details').get(function () {
//   let openTasks = 0;
//   let completedTasks = 0;

//   this.tasks.forEach((task) => {
//     if (task.status === 'open') openTasks++;
//     if (task.status === 'complete') completedTasks++;
//   });

//   return {
//     openTasks,
//     completedTasks,
//     progress: Math.floor((completedTasks / (this.tasks.length || 1)) * 100),
//   };
// });
