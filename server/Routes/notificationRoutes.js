import express from 'express';
import {
  deleteNotification,
  getUserNotifications,
} from '../Controllers/notificationController.js';
import { protectRoute } from '../Controllers/authController.js';

const router = express.Router();

router.use(protectRoute);

router.route('/:id').get(getUserNotifications);
router.route('/:projectId/:id').delete(deleteNotification);

export default router;
