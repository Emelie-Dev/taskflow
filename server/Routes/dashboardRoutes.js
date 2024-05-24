import express from 'express';
import { protectRoute } from '../Controllers/authController.js';
import { getDashboardDetails } from '../Controllers/dashboardController.js';

const router = express.Router();

router.use(protectRoute);

router.get('/', getDashboardDetails);

export default router;
