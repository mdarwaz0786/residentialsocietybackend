const SIZE_LIMITS = {
  image: 2 * 1024 * 1024,
  pdf: 5 * 1024 * 1024,
};

const validateFileSize = (req, res, next) => {
  if (!req.files) {
    return next();
  };

  for (const file of req.files) {
    const { mimetype, size } = file;

    if (mimetype.startsWith("image/") && size > SIZE_LIMITS.image) {
      return next(new ApiError(400, `${file.originalname} exceeds 2MB image size limit.`));
    };

    if (mimetype === "application/pdf" && size > SIZE_LIMITS.pdf) {
      return next(new ApiError(400, `${file.originalname} exceeds 5MB PDF size limit.`));
    };
  };

  next();
};

export default validateFileSize;