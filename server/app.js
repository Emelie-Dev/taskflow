// Core Modules

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

const app = express();

config({ path: './config.env' });

// Middlewares

// Implements Cors
app.use(cors());
app.options('*', cors());

// Adds security headers
app.use(helmet());

// Implements rate limiting
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message:
    'We have received too many request from this IP. Please try after one hour.',
});
app.use('/api', limiter);

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
app.use(morgan('dev'));

export default app;
