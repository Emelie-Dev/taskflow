import express from 'express';
import {
  createNewNotification,
  getAllNotifications,
} from '../Controllers/notificationController.js';

const router = express.Router();

router.route('/').get(getAllNotifications).post(createNewNotification);

export default router;
