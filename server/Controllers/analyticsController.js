import Project from '../Models/projectModel.js';
import Task from '../Models/taskModel.js';
import CustomError from '../Utils/CustomError.js';
import asyncErrorHandler from '../Utils/asyncErrorHandler.js';

export const getMyStats = asyncErrorHandler(async (req, res, next) => {
  // For the pie chart
  if (req.query.tasks) {
    getTasksStats(req, res, next);
  } else {
    const currentYear = new Date().getFullYear();
    const currentDate = new Date().getMonth();
    const currentDay = new Date().getDate();
    let tasksStats = { completed: 0, open: 0, progress: 0 };
    let todayTasks = 0;
    let currentProject = {};

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

    const personalTasks = tasks.filter((task) => !task.assigned);

    if (req.query.dashboard) {
      const currentProjectTasks = await Task.find({
        project: req.user.currentProject,
        assigned: { $ne: true },
      });

      const completedTasks = currentProjectTasks.filter(
        (task) => task.status === 'complete'
      );

      const percentageCompleted =
        (completedTasks.length / (currentProjectTasks.length || 1)) * 100;

      currentProject = {
        tasks: currentProjectTasks.length,
        completedTasks: completedTasks.length,
        percent: Math.floor(percentageCompleted),
      };
    }

    const completedProjects = projects.filter((project) => {
      if (project.createdAt.getMonth() === currentDate - 1) {
        if (project.details.projectProgress === 100) {
          percent.projects.complete[0]++;
        }
        percent.projects.created[0]++;
      } else if (project.createdAt.getMonth() === currentDate) {
        if (project.details.projectProgress === 100) {
          percent.projects.complete[1]++;
        }
        percent.projects.created[1]++;
      }

      return project.details.projectProgress === 100;
    }).length;

    for (let task of personalTasks) {
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

    // For today tasks
    tasks.forEach((task) => {
      if (task.deadline) {
        if (
          task.deadline.getFullYear() === currentYear &&
          task.deadline.getMonth() == currentDate &&
          task.deadline.getDate() === currentDay
        ) {
          todayTasks++;
        }
      }
    });

    const dataPercent = {
      projects: {
        completed: Math.floor(
          ((percent.projects.complete[1] - percent.projects.complete[0]) /
            (percent.projects.complete[0] || 1)) *
            100
        ),
        created: Math.floor(
          ((percent.projects.created[1] - percent.projects.created[0]) /
            (percent.projects.created[0] || 1)) *
            100
        ),
      },
      tasks: {
        completed: Math.floor(
          ((percent.tasks.complete[1] - percent.tasks.complete[0]) /
            (percent.tasks.complete[0] || 1)) *
            100
        ),
        created: Math.floor(
          ((percent.tasks.created[1] - percent.tasks.created[0]) /
            (percent.tasks.created[0] || 1)) *
            100
        ),
      },
    };

    tasksStats.completedPercent = Math.floor(
      (tasksStats.completed / (tasks.length || 1)) * 100
    );

    tasksStats.openPercent = Math.floor(
      (tasksStats.open / (tasks.length || 1)) * 100
    );

    tasksStats.progressPercent = Math.floor(
      (tasksStats.progress / (tasks.length || 1)) * 100
    );

    return res.status(200).json({
      status: 'success',
      data: {
        projects: projects.length,
        tasks: personalTasks.length,
        todayTasks,
        completedProjects,
        completedTasks: tasksStats.completed,
        dataPercent,
        tasksStats,
        currentProject,
      },
    });
  }
});

// For the pie chart
const getTasksStats = async (req, res, next) => {
  const tasks = await Task.find({
    user: req.user._id,
    assigned: { $ne: true },
  });

  let tasksStats = { completed: 0, open: 0, progress: 0, matchLength: 0 };

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
          tasksStats.matchLength++;
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
          tasksStats.matchLength++;
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
    (tasksStats.completed / (tasksStats.matchLength || 1)) * 100
  );

  tasksStats.openPercent = Math.round(
    (tasksStats.open / (tasksStats.matchLength || 1)) * 100
  );

  tasksStats.progressPercent = Math.round(
    (tasksStats.progress / (tasksStats.matchLength || 1)) * 100
  );

  const values = {
    completedPercent: tasksStats.completedPercent,
    openPercent: tasksStats.openPercent,
    progressPercent: tasksStats.progressPercent,
  };

  if (
    tasksStats.completedPercent +
      tasksStats.openPercent +
      tasksStats.progressPercent >
    100
  ) {
    const diff =
      tasksStats.completedPercent +
      tasksStats.openPercent +
      tasksStats.progressPercent -
      100;

    const max = Math.max(
      tasksStats.completedPercent,
      tasksStats.openPercent,
      tasksStats.progressPercent
    );

    for (const prop in values) {
      if (values[prop] === max) {
        tasksStats[prop] = tasksStats[prop] - diff;
      }
    }
  }

  return res.status(200).json({
    status: 'success',
    data: {
      tasksStats,
    },
  });
};

const filter = (tasks, date) => {
  let tasksStats = { completed: 0, open: 0, progress: 0, matchLength: 0 };

  tasks.forEach((task) => {
    if (task.createdAt >= date && task.createdAt <= Date.now()) {
      tasksStats.matchLength++;
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
