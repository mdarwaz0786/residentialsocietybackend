import ApiError from "../helpers/apiError.js";

const SIZE_LIMITS = {
  image: 2 * 1024 * 1024,
  pdf: 5 * 1024 * 1024,
};

const validateFileSize = (req, res, next) => {
  // Single file (upload.single)
  if (req.file) {
    const { mimetype, size, originalname } = req.file;

    if (mimetype.startsWith("image/") && size > SIZE_LIMITS.image) {
      return next(new ApiError(400, `${originalname} exceeds 2MB image size limit.`));
    };

    if (mimetype === "application/pdf" && size > SIZE_LIMITS.pdf) {
      return next(new ApiError(400, `${originalname} exceeds 5MB PDF size limit.`));
    };

    return next();
  };

  // Multiple files (upload.array or upload.fields)
  if (req.files) {
    // Case: upload.array() → req.files is an array
    if (Array.isArray(req.files)) {
      for (const file of req.files) {
        const { mimetype, size, originalname } = file;

        if (mimetype.startsWith("image/") && size > SIZE_LIMITS.image) {
          return next(new ApiError(400, `${originalname} exceeds 2MB image size limit.`));
        };

        if (mimetype === "application/pdf" && size > SIZE_LIMITS.pdf) {
          return next(new ApiError(400, `${originalname} exceeds 5MB PDF size limit.`));
        };
      };
    } else {
      // Case: upload.fields() → req.files is an object { fieldName: [file, file] }
      for (const field in req.files) {
        const fileArray = req.files[field];
        for (const file of fileArray) {
          const { mimetype, size, originalname } = file;

          if (mimetype.startsWith("image/") && size > SIZE_LIMITS.image) {
            return next(new ApiError(400, `${originalname} exceeds 2MB image size limit.`));
          };

          if (mimetype === "application/pdf" && size > SIZE_LIMITS.pdf) {
            return next(new ApiError(400, `${originalname} exceeds 5MB PDF size limit.`));
          };
        };
      };
    };
  };

  next();
};

export default validateFileSize;
