// Core Modules

import { fileURLToPath } from 'url';

import { dirname, join } from 'path';

// Third party Modules

import express from 'express';

import { config } from 'dotenv';

import cors from 'cors';

import helmet from 'helmet';

import rateLimit from 'express-rate-limit';

import cookieParser from 'cookie-parser';

import sanitize from 'express-mongo-sanitize';

import xss from 'xss-clean';

import hpp from 'hpp';

import compression from 'compression';

import morgan from 'morgan';

// Custom Modules

import userRouter from './Routes/userRoutes.js';

import authRouter from './Routes/authRoutes.js';

import errorController from './Controllers/errorController.js';

import CustomError from './Utils/CustomError.js';

import projectRouter from './Routes/projectRoutes.js';

import taskRouter from './Routes/taskRoutes.js';

import notificationRouter from './Routes/notificationRoutes.js';

import analyticsRouter from './Routes/analyticsRoutes.js';

import dashboardRouter from './Routes/dashboardRoutes.js';

const app = express();

config({ path: './config.env' });

// Middlewares

// Implements Cors
const allowedOrigins = [
  'http://localhost:5173',
  'https://godfather-task-management.vercel.app',
  'https://taskflow-266v.onrender.com',
];

const corsOptions = {
  origin: function (origin, callback) {
    // Check if the origin is in the allowedOrigins array or is undefined (same-origin or server-side requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(
        new Error('You are not allowed to make the request because of CORS.')
      );
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// Render static files
app.use(
  express.static(join(dirname(fileURLToPath(import.meta.url)), 'Public'))
);

// Adds security headers
app.use(helmet());

// Implements rate limiting
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message:
    'We have received too many request from this IP address. Please try after one hour.',
});
// app.use('/api', limiter);

// Parses request body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Parses cookies
app.use(cookieParser());

// Sanitize mongo injections
app.use(sanitize());

// Sanitize html injections
app.use(xss());

// Prevents parameter pollution
app.use(
  hpp({
    whitelist: [],
  })
);

// Compresses response
app.use(compression());

// Displays response details in terminal
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Route handlers
app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/projects', projectRouter);
app.use('/api/v1/tasks', taskRouter);
app.use('/api/v1/notifications', notificationRouter);
app.use('/api/v1/analytics', analyticsRouter);
app.use('/api/v1/dashboard', dashboardRouter);

// For wrong endpoints
app.all('*', (req, res, next) => {
  const error = new CustomError(
    `Cant find ${req.originalUrl} on the server.`,
    404
  );

  next(error);
});

// Error middlewares
app.use(errorController);

export default app;
