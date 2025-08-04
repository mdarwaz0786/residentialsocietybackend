import sharp from "sharp";
import ApiError from "../helpers/apiError.js";

const compressImageToBase64 = async (
  buffer,
  mimetype,
  maxSizeKB = 200,
  quality = 80,
  minQuality = 50,
  width = 1200,
  minWidth = 200,
) => {
  const maxBufferSizeKB = Math.floor(maxSizeKB * 0.75);
  const initialSizeMB = buffer.length / (1024 * 1024);

  if (initialSizeMB > 10) {
    throw new ApiError(400, "File is too large. Max allowed: 10MB.");
  };

  if (buffer.length / 1024 <= maxBufferSizeKB) {
    const base64 = buffer.toString("base64");
    return `data:${mimetype};base64,${base64}`;
  };

  try {
    const baseImage = sharp(buffer);
    const metadata = await baseImage.metadata();
    const aspectRatio = metadata?.width && metadata?.height ? metadata.width / metadata.height : 1;

    let currentQuality = quality;
    let currentWidth = width;
    let height = Math.round(currentWidth / aspectRatio);
    let resizedBuffer;

    while (true) {
      resizedBuffer = await baseImage
        .clone()
        .resize({ width: currentWidth, height, fit: "inside" })
        .sharpen()
        .jpeg({ quality: currentQuality, mozjpeg: true })
        .toBuffer();

      const bufferSizeKB = resizedBuffer.length / 1024;

      if (bufferSizeKB <= maxBufferSizeKB) {
        const base64 = resizedBuffer.toString("base64");
        return `data:image/jpeg;base64,${base64}`;
      };

      if (currentQuality > minQuality) {
        currentQuality -= 10;
      } else if (currentWidth > minWidth) {
        currentWidth = Math.floor(currentWidth * 0.85);
        height = Math.floor(currentWidth / aspectRatio);
      } else {
        break;
      };
    };

    throw new ApiError(422, "Unable to compress image under desired size. Try uploading a smaller image.");
  } catch (error) {
    throw new ApiError(400, "Image is corrupted or in unsupported format.");
  };
};

export default compressImageToBase64;
