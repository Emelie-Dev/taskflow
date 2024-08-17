import CustomError from '../Utils/CustomError.js';

const duplicateKeyErrorHandler = (error) => {
  const errorName = Object.keys(error.keyValue)[0];

  let message;

  if (errorName) {
    message = `The ${errorName} you provided already exists.`;
  } else {
    message = `One of the values you provided already exists.`;
  }

  return new CustomError(message, 400);
};

const validationErrorHandler = (error) => {
  const errors = Object.values(error.errors);

  const message = errors.map((detail) => detail.message).join('\n');

  return new CustomError(message, 400);
};

const castErrorHandler = (error) => {
  const message = `The ${error.path} value (${error.value}) you provided is invalid.`;

  return new CustomError(message, 400);
};

const handleExpiredJWT = (error) => {
  return new CustomError('Your token has expired. Please login again.', 401);
};

const handleJWTError = (error) => {
  return new CustomError('Invalid token. Please login again.', 401);
};

const devErrorHandler = (error, req, res) => {
  return res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    stackTrace: error.stack,
    error,
    isSignup: error.isSignup,
  });
};

const prodErrorHandler = (error, req, res) => {
  console.log(error);
  if (error.isOperational) {
    return res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
      isSignup: error.isSignup,
    });
  }

  return res.status(error.statusCode).json({
    status: error.status,
    message: 'Something went wrong! Please try again later.',
  });
};

export default (error, req, res, next) => {
  // console.log(error);
  error.status = error.status || 'error';
  error.statusCode = error.statusCode || 500;

  if (process.env.NODE_ENV.trim() === 'development') {
    devErrorHandler(error, req, res);
  } else {
    if (error.code === 11000) error = duplicateKeyErrorHandler(error);
    if (error.name === 'ValidationError') error = validationErrorHandler(error);
    if (error.name === 'CastError') error = castErrorHandler(error);
    if (error.name === 'TokenExpiredError') error = handleExpiredJWT(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError(error);

    prodErrorHandler(error, req, res);
  }
};
