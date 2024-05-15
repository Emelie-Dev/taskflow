import express from 'express';
import {
  createNewProject,
  getAllProjects,
  getMyProjects,
} from '../Controllers/projectController.js';
import { protectRoute } from '../Controllers/authController.js';

const router = express.Router();

router.use(protectRoute);

router.route('/').get(getAllProjects).post(createNewProject);

router.get('/my_projects', getMyProjects);

export default router;
