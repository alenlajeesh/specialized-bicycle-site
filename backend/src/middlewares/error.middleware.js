
const ApiError = require('../utils/api.error.handle');

const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;

  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    statusCode = 404;
  }

  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    statusCode = 400;
  }
  
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    statusCode = 400;
  }

  if (err.isOperational) {
     statusCode = err.statusCode || 500;
     message = err.message || 'Something went wrong';
  } else {
     statusCode = 500;
     message = 'Internal Server Error';
  }
  
  console.error('ERROR ', err);
  
  res.status(statusCode).json({
    success: false,
    error: {
      message: message,
    }
  });
};

module.exports = errorHandler;
