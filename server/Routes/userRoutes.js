import express from 'express';

import { getAllUsers } from '../Controllers/userController.js';
import {
  protectRoute,
  restrictAccessTo,
} from '../Controllers/authController.js';

const router = express.Router();

router.route('/').get(protectRoute, restrictAccessTo('admin'), getAllUsers);

export default router;
