import express from 'express';
import { protectRoute } from '../Controllers/authController.js';
import { getMyStats } from '../Controllers/analyticsController.js';

const router = express.Router();

router.route('/').get(protectRoute, getMyStats);

export default router;
