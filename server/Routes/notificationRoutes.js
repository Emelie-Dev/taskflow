import express from 'express';
import {
  deleteUserNotifications,
  getUserNotifications,
} from '../Controllers/notificationController.js';
import { protectRoute } from '../Controllers/authController.js';

const router = express.Router();

router.use(protectRoute);

router.route('/:id').get(getUserNotifications);
router.route('/').patch(deleteUserNotifications);

export default router;
