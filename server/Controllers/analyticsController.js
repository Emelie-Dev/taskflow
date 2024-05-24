import Project from '../Models/projectModel.js';
import Task from '../Models/taskModel.js';
import CustomError from '../Utils/CustomError.js';
import asyncErrorHandler from '../Utils/asyncErrorHandler.js';

export const getMyStats = asyncErrorHandler(async (req, res, next) => {
  // For the pie chart
  if (req.query.tasks) {
    getTasksStats(req, res, next);
  } else {
    const currentDate = new Date().getMonth();
    let tasksStats = { completed: 0, open: 0, progress: 0 };

    let percent = {
      projects: {
        complete: [0, 0],
        created: [0, 0],
      },
      tasks: {
        complete: [0, 0],
        created: [0, 0],
      },
    };

    const [projects, tasks] = await Promise.all([
      Project.find({ user: req.user._id }),
      Task.find({ user: req.user._id }),
    ]);

    const completedProjects = projects.filter((project) => {
      if (project.createdAt.getMonth() === currentDate - 1) {
        if (project.progress === 100) {
          percent.projects.complete[0]++;
        }
        percent.projects.created[0]++;
      } else if (project.createdAt.getMonth() === currentDate) {
        if (project.progress === 100) {
          percent.projects.complete[1]++;
        }
        percent.projects.created[1]++;
      }

      return project.progress === 100;
    }).length;

    for (let task of tasks) {
      if (task.createdAt.getMonth() === currentDate - 1) {
        if (task.status === 'complete') {
          percent.tasks.complete[0]++;
        }
        percent.tasks.created[0]++;
      } else if (task.createdAt.getMonth() === currentDate) {
        if (task.status === 'complete') {
          percent.tasks.complete[1]++;
        }
        percent.tasks.created[1]++;
      }

      if (task.status === 'complete') {
        tasksStats.completed++;
      } else if (task.status === 'progress') {
        tasksStats.progress++;
      } else {
        tasksStats.open++;
      }
    }

    const dataPercent = {
      projects: {
        completed: Math.round(
          ((percent.projects.complete[1] - percent.projects.complete[0]) /
            (percent.projects.complete[0] || 1)) *
            100
        ),
        created: Math.round(
          ((percent.projects.created[1] - percent.projects.created[0]) /
            (percent.projects.created[0] || 1)) *
            100
        ),
      },
      tasks: {
        completed: Math.round(
          ((percent.tasks.complete[1] - percent.tasks.complete[0]) /
            (percent.tasks.complete[0] || 1)) *
            100
        ),
        created: Math.round(
          ((percent.tasks.created[1] - percent.tasks.created[0]) /
            (percent.tasks.created[0] || 1)) *
            100
        ),
      },
    };

    tasksStats.completedPercent = Math.round(
      (tasksStats.completed / (tasks.length || 1)) * 100
    );

    tasksStats.openPercent = Math.round(
      (tasksStats.open / (tasks.length || 1)) * 100
    );

    tasksStats.progressPercent = Math.round(
      (tasksStats.progress / (tasks.length || 1)) * 100
    );

    return res.status(200).json({
      status: 'success',
      data: {
        projects: projects.length,
        tasks: tasks.length,
        completedProjects,
        completedTasks: tasksStats.completed,
        dataPercent,
        tasksStats,
      },
    });
  }
});

// For the pie chart
const getTasksStats = async (req, res, next) => {
  const tasks = await Task.find({ user: req.user._id });

  let tasksStats = { completed: 0, open: 0, progress: 0 };

  const { month: queryMonth, year: queryYear, range } = req.query;

  if (queryMonth && queryYear) {
    delete req.query.range;

    const month = parseInt(queryMonth);
    const year = parseInt(queryYear);

    if (isNaN(month) || isNaN(year)) {
      return next(
        new CustomError(
          'Please provide a valid value for the year and month parameters.',
          400
        )
      );
    }

    if (month === 0) {
      tasks.forEach((task) => {
        if (task.createdAt.getFullYear() === year) {
          if (task.status === 'complete') {
            tasksStats.completed++;
          } else if (task.status === 'progress') {
            tasksStats.progress++;
          } else {
            tasksStats.open++;
          }
        }
      });
    } else {
      tasks.forEach((task) => {
        if (
          task.createdAt.getFullYear() === year &&
          task.createdAt.getMonth() + 1 === month
        ) {
          if (task.status === 'complete') {
            tasksStats.completed++;
          } else if (task.status === 'progress') {
            tasksStats.progress++;
          } else {
            tasksStats.open++;
          }
        }
      });
    }
  }

  if (req.query.range) {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDate = new Date().getDate();
    let previousDate;

    switch (range) {
      case '1y':
        previousDate = new Date();
        previousDate.setFullYear(currentYear - 1);
        previousDate.setHours(0);
        previousDate.setMinutes(0);
        previousDate.setSeconds(0);
        previousDate.setMilliseconds(0);

        tasksStats = filter(tasks, previousDate);

        break;

      case '1m':
        previousDate = new Date();
        previousDate.setMonth(currentMonth - 1);
        previousDate.setHours(0);
        previousDate.setMinutes(0);
        previousDate.setSeconds(0);
        previousDate.setMilliseconds(0);

        tasksStats = filter(tasks, previousDate);

        break;

      case '1w':
        previousDate = new Date();
        previousDate.setDate(currentDate - 7);
        previousDate.setHours(0);
        previousDate.setMinutes(0);
        previousDate.setSeconds(0);
        previousDate.setMilliseconds(0);

        tasksStats = filter(tasks, previousDate);

        break;

      case '1d':
        previousDate = new Date();
        previousDate.setDate(currentDate - 1);
        previousDate.setMinutes(0);
        previousDate.setSeconds(0);
        previousDate.setMilliseconds(0);

        tasksStats = filter(tasks, previousDate);

        break;
    }
  }

  tasksStats.completedPercent = Math.round(
    (tasksStats.completed / (tasks.length || 1)) * 100
  );

  tasksStats.openPercent = Math.round(
    (tasksStats.open / (tasks.length || 1)) * 100
  );

  tasksStats.progressPercent = Math.round(
    (tasksStats.progress / (tasks.length || 1)) * 100
  );

  return res.status(200).json({
    status: 'success',
    data: {
      tasksStats,
    },
  });
};

const filter = (tasks, date) => {
  let tasksStats = { completed: 0, open: 0, progress: 0 };

  tasks.forEach((task) => {
    if (task.createdAt >= date && task.createdAt <= Date.now()) {
      if (task.status === 'complete') {
        tasksStats.completed++;
      } else if (task.status === 'progress') {
        tasksStats.progress++;
      } else {
        tasksStats.open++;
      }
    }
  });

  return tasksStats;
};
