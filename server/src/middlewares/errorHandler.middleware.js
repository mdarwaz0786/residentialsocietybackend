import multer from "multer";
import jwt from "jsonwebtoken";

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = "Internal Server Error";

  // Custom App Error (like ApiError)
  if (err.name === "ApiError") {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Mongoose Validation Error
  else if (err.name === "ValidationError") {
    statusCode = 400;
    const errors = Object.values(err.errors).map((e) => e.message);
    message = errors.join(", ");
  }

  // Mongoose CastError (invalid ObjectId)
  else if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Duplicate key error (unique field violation)
  else if (err.code && err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue);
    message = `Duplicate field value: ${field.join(", ")}`;
  }

  // Multer File Upload Errors
  else if (err instanceof multer.MulterError) {
    statusCode = 400;

    // Handle specific Multer error codes
    switch (err.code) {
      case "LIMIT_FILE_SIZE":
        message = "File size too large.";
        break;
      case "LIMIT_FILE_COUNT":
        message = "File limit exceeded.";
        break;
      default:
        message = err.message;
    };
  }

  // Invalid JSON Payload
  else if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    statusCode = 400;
    message = "Invalid JSON payload.";
  }

  // JWT Errors
  else if (err.name === "UnauthorizedError") {
    statusCode = 401;
    message = "Unauthorized token.";
  } else if (err instanceof jwt.JsonWebTokenError) {
    statusCode = 401;
    message = "Invalid token.";
  } else if (err instanceof jwt.TokenExpiredError) {
    statusCode = 401;
    message = "Token expired.";
  }

  // CSRF Error (from csurf)
  else if (err.code === "EBADCSRFTOKEN") {
    statusCode = 403;
    message = "Invalid CSRF token.";
  }

  // Rate Limit Error (status code 429)
  else if (err.status === 429) {
    statusCode = 429;
    message = err.message || "Too many requests. Please try again later.";
  }

  // Axios External API Error (if using axios)
  else if (err.isAxiosError) {
    statusCode = err.response?.status || 500;
    message = err.response?.data?.message || "External API error.";
  }

  // Default fallback (unexpected error)
  else if (err.message) {
    message = err.message;
  }

  // Final response
  res.status(statusCode).json({
    success: false,
    message,
    type: err.name || "Error",
    code: statusCode,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorHandler;
