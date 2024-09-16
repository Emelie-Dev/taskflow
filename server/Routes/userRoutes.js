import express from 'express';

import {
  getDeleteToken,
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
router.post('/:id/:status?', deactivateUser, getDeleteToken);
router.delete('/:id/:token', deleteUser);

export default router;
