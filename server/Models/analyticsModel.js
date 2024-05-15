import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  projects: Number,
  tasks: Number,
  projectsCompleted: Number,
  tasksCompleted: Number,
  projectsPercentage: Number,
  tasksPercentage: Number,
  projectsDonePercentage: Number,
  tasksDonePercentage: Number,
});

const Analytics = mongoose.model('Analytic', analyticsSchema);

export default Analytics;
