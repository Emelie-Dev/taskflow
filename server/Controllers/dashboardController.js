import Project from '../Models/projectModel.js';
import Task from '../Models/taskModel.js';
import asyncErrorHandler from '../Utils/asyncErrorHandler.js';

export const getDashboardDetails = asyncErrorHandler(async (req, res, next) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentDate = new Date().getDate();
  let project = {
    completed: 0,
    total: 0,
    percentage: 0,
  };
  let tasksPercentage = {
    current: 0,
    previous: 0,
    percent: 0,
  };

  const [tasks, currentProject] = await Promise.all([
    Task.find({ user: req.user._id }),
    Project.findById(req.user.currentProject).populate('tasks'),
  ]);

  // checks for today tasks
  const todayTasks = tasks.filter((task) => {
    let test = false;

    if (task.deadline) {
      test =
        task.deadline.getFullYear() === currentYear &&
        task.deadline.getMonth() === currentMonth &&
        task.deadline.getDate() === currentDate;
    }

    // current user project tasks stats
    if (currentProject) {
      if (String(task.project) === String(req.user.currentProject)) {
        if (task.status === 'complete') {
          project.completed++;
        }

        project.total++;
      }
    }

    // Updates the percent object
    if (task.createdAt.getMonth() === currentMonth - 1) {
      tasksPercentage.previous++;
    } else if (task.createdAt.getMonth() === currentMonth) {
      tasksPercentage.current++;
    }

    return test;
  }).length;

  // calculates percentage of current project tasks stats
  if (currentProject) {
    project.percentage = Math.floor(
      (project.completed / (project.total || 1)) * 100
    );
  }

  // Task percentage relative to last month
  tasksPercentage.percent = Math.round(
    ((tasksPercentage.current - tasksPercentage.previous) /
      (tasksPercentage.previous || 1)) *
      100
  );

  const tasksLength =
    tasks.length > 500
      ? '500+'
      : tasks.length > 200
      ? '200+'
      : tasks.length > 100
      ? '100+'
      : tasks.length;

  res.status(200).send({
    status: 'success',
    data: {
      tasks: tasksLength,
      todayTasks,
      currentProject: project,
      tasksPercentage,
    },
  });
});
