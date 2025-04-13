const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  if (err.name == "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = "Resource not Found";
  }
  console.error(err.stack);
  res
    .status(statusCode)
    .json({
      message: message,
      stack: process.env.NODE_ENV !== "production" ? null : err.stack,
    });
};

const routeNotFound = (req, res, next) => {
  const error = new Error(`Route not Found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export { errorHandler, routeNotFound };
