import express from 'express';
import {
  createNewTask,
  deleteTask,
  getAllTasks,
  getAssignedTasks,
  getMyTasks,
  updateTask,
} from '../Controllers/taskController.js';
import { protectRoute } from '../Controllers/authController.js';

const router = express.Router({ mergeParams: true });

router.use(protectRoute);

router.route('/').get(getAllTasks).post(createNewTask);

router.route('/:id').patch(updateTask).delete(deleteTask);

router.get('/assigned', getAssignedTasks);

router.get('/my_tasks', getMyTasks);

export default router;
