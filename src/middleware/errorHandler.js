export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  const isClientError = statusCode >= 400 && statusCode < 500;
  const isProduction = process.env.APP_ENV === "production" || process.env.NODE_ENV === "production";
  const message = err.message || "Internal server error";

  if (statusCode >= 500) {
    console.error(err);
  }

  const response = {
    status: isClientError ? "failed" : "error",
    message: isProduction && statusCode >= 500 ? "Internal server error" : message,
  };

  if (err.details !== undefined) {
    response.details = err.details;
  }

  if (!isProduction && err.stack) {
    response.stack = err.stack;
  }

  return res.status(statusCode).json(response);
};
