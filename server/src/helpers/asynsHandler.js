const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch((err) => {
    if (!err.statusCode) {
      err.statusCode = 500;
    };
    next(err);
  });

export default asyncHandler;
