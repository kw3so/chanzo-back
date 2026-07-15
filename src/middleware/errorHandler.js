export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;

  return res.status(statusCode).json({
    status: "failed",
    message: err.message || "Internal server error",
  });
};
