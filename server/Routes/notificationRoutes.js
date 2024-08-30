import express from 'express';
import {
  createNewNotification,
  deleteNotification,
  getAllNotifications,
} from '../Controllers/notificationController.js';
import { protectRoute } from '../Controllers/authController.js';

const router = express.Router();

router.use(protectRoute);

router.route('/').get(getAllNotifications).post(createNewNotification);
router.route('/:projectId/:id').delete(deleteNotification);

export default router;
