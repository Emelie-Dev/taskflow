import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  user: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Activity must belong to a user.'],
    },
  ],
  type: {
    type: String,
    enum: ['task', 'project'],
    required: [true, 'Please provide a value for the type field.'],
  },
  action: {
    type: String,
    enum: ['transition', 'update', 'assignment', 'creation', 'deletion'],
    required: [true, 'Please provide a value for the action field.'],
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
});

const Activity = mongoose.model('Activity', activitySchema);

export default Activity;
