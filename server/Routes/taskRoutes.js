import express from 'express';
import { createNewTask, getAllTasks } from '../Controllers/taskController.js';
import { protectRoute } from '../Controllers/authController.js';

const router = express.Router();

router.use(protectRoute);

router.route('/').get(getAllTasks).post(createNewTask);

export default router;
