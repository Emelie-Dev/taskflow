const devErrorHandler = (error, req, res) => {
  return res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    stackTrace: error.stack,
    error,
  });
};

const prodErrorHandler = (error, req, res) => {
  if (error.isOperational) {
    return res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  }

  return res.status(error.statusCode).json({
    status: error.status,
    message: 'Something went wrong! Please try again later.',
  });
};

export default (error, req, res, next) => {
  error.status = error.status || 'error';
  error.statusCode = error.statusCode || 500;

  if (process.env.NODE_ENV.trim() === 'development') {
    devErrorHandler(error, req, res);
  } else {
    prodErrorHandler(error, req, res);
  }
};
