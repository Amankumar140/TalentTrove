/**
 * Global error-handling middleware.
 * Must have 4 parameters for Express to treat it as an error handler.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
};

export default errorHandler;
