import multer from "multer";
import ApiError from "../helpers/apiError.js";

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new ApiError(400, "Unsupported file type."), false);
    };
    cb(null, true);
  },
});

export default upload;