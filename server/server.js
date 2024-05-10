// Core Modules

// Third party Modules

import { config } from 'dotenv';

// Set environmental variables

export const configEnv = () => config({ path: './config.env' });

configEnv();

// Handles uncaught exceptions(No business with the server)

process.on('uncaughtException', (err) => {
  console.log('\nError ', { name: err.name, message: err.message });
  console.log('\nUncaught Exception Occured! Shutting down....\n');
  process.exit(1);
});

// Custom Modules

import app from './app.js';

// Starting the server

const port = process.env.PORT || 3500;

const server = app.listen(port, () => {
  console.log(`App is running on port - ${port}`);
});

// Handles Promise Rejections

process.on('unhandledRejection', (err) => {
  console.log('\nError ', { name: err.name, message: err.message });
  console.log('\nUnhandled Rejection Occured! Shutting down....\n');
  server.close(() => {
    process.exit(1);
  });
});

// Heroku specific

process.on('SIGTERM', () => {
  console.log('\nSIGTERM RECEIVED. Shutting down....');
  server.close(() => {
    console.log('\nProcess terminated!!\n');
  });
});
