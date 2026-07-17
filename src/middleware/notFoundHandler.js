import ApiError from "../utils/ApiError.utils.js";

export const notFoundHandler = (req, res, next) => {
  next(
    new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`, {
      method: req.method,
      path: req.originalUrl,
    }),
  );
};
