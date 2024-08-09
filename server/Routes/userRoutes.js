import express from 'express';

import { getAllUsers, getUser } from '../Controllers/userController.js';
import {
  protectRoute,
  restrictAccessTo,
} from '../Controllers/authController.js';

const router = express.Router();

router.route('/').get(protectRoute, restrictAccessTo('admin'), getAllUsers);

router.get('/:id', protectRoute, getUser);

export default router;
