import express from 'express';
import {
  createNewTask,
  deleteTask,
  getAllTasks,
  getAssignedTasks,
  getCalendarDetails,
  getMyTasks,
  getTaskActivities,
  updateAssignees,
  updateTask,
} from '../Controllers/taskController.js';
import { protectRoute } from '../Controllers/authController.js';

const router = express.Router({ mergeParams: true });

router.use(protectRoute);

router.route('/').get(getAllTasks).post(createNewTask);

router.route('/:id').patch(updateTask).delete(deleteTask);

router.patch('/:id/assignees', updateAssignees);

router.get('/:id/activities', getTaskActivities);

router.get('/assigned', getAssignedTasks);

router.get('/my_tasks', getMyTasks);

router.get('/calendar', getCalendarDetails);

export default router;
