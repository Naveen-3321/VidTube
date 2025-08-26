import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import multer from "multer";

const errorHandler = (err, req, res, next) => {
  let error = err;

  let statusCode = 500;
  let message = "Something went wrong";
  let errors = [];

  if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;
    errors = error.errors || [];
  } else if (error instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = "Validation Error";
    errors = Object.values(error.errors).map((el) => el.message);
  } else if (error instanceof mongoose.Error) {
    statusCode = 400;
    message = error.message;
  } else if (error.statusCode) {
    statusCode = error.statusCode;
    message = error.message || message;
    errors = error.errors || [];
  } else if (error.message) {
    message = error.message;
  }

  error = new ApiError(statusCode, message, errors);

  const response = {
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    errors: error.errors,
    ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
  };

  return res.status(error.statusCode).json(response);
};

export { errorHandler };
