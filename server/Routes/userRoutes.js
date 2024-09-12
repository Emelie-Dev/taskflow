import express from 'express';

import {
  deactivateUser,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from '../Controllers/userController.js';
import {
  protectRoute,
  restrictAccessTo,
} from '../Controllers/authController.js';

const router = express.Router();

router.use(protectRoute);

router.route('/').get(restrictAccessTo('admin'), getAllUsers);

router.get('/:id', getUser);
router.patch('/:category', updateUser);
router.patch('/:id/:status?', deactivateUser, deleteUser);

export default router;
