import express from 'express';
import {
  createNewActivity,
  getAllActivities,
} from '../Controllers/activityController.js';

const router = express.Router();

router.route('/').get(getAllActivities).post(createNewActivity);

export default router;
