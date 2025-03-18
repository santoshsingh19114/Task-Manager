const errorHandler = (err, req, res, next) => {
  let statuscode = res.statuscode === 200 ? 500 : res.statuscode;
  let message = err.message;

  if (err.name == "CastError" && err.kind === "objectId") {
    statuscode = 404;
    message = "Resource not Found";
  }
  console.error(err.stack);
  res
    .status(statuscode)
    .json({
      message: message,
      stack: process.env.Node_ENV !== "production" ? null : err.stack,
    });
};

const routeNotFound = (req, res, next) => {
  const error = new Error(`Route not Found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export { errorHandler, routeNotFound };
