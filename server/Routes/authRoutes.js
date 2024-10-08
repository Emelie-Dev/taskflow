import express from 'express';
import {
  authConfirmed,
  forgotPassword,
  googleAuth,
  login,
  logout,
  protectRoute,
  resetPassword,
  signup,
  verifyEmail,
  googleAuthCallback,
} from '../Controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);

router.get('/verify_email/:token', verifyEmail);

router.get('/auth-check', protectRoute, authConfirmed);

router.post('/login', login);

router.get('/logout', logout);

router.post('/forgot_password', forgotPassword);

router.patch('/reset_password/:token', resetPassword);

router.post('/google', googleAuth);

router.get('/google/callback', googleAuthCallback);

export default router;
