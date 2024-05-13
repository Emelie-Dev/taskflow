import express from 'express';
import {
  forgotPassword,
  login,
  logout,
  resetPassword,
  signup,
  verifyEmail,
} from '../Controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);

router.get('/verify_email/:token', verifyEmail);

router.post('/login', login);

router.get('/logout', logout);

router.post('/forgot_password', forgotPassword);

router.patch('/reset_password/:token', resetPassword);

export default router;
