import express from 'express';
import { protectRoute } from '../Controllers/authController.js';
import {
  getMyStats,
  getProjectsCompleted,
} from '../Controllers/analyticsController.js';

const router = express.Router();

router.route('/').get(protectRoute, getMyStats);

// router.route('/projects/date').get()
// router.route('/projects_completed/:date').get(getProjectsCompleted)

export default router;
