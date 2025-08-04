import sharp from "sharp";

const compressImageToBase64 = async (buffer, mimetype) => {
  const maxBase64SizeKB = 250;
  const maxBufferSizeKB = Math.floor(maxBase64SizeKB * 0.75);

  if (buffer.length / 1024 <= maxBufferSizeKB) {
    const base64 = buffer.toString("base64");
    return `data:${mimetype};base64,${base64}`;
  };

  if (buffer.length > 10 * 1024 * 1024) {
    throw new Error("File is too large. Max allowed: 10MB.");
  };

  let quality = 80;
  let width = 1200;

  const image = sharp(buffer, { failOnError: true });
  const metadata = await image.metadata();
  const aspectRatio = metadata?.width && metadata?.height
    ? metadata.width / metadata.height
    : 1;
  let height = Math.round(width / aspectRatio);

  let resizedBuffer = null;

  while (true) {
    resizedBuffer = await sharp(buffer)
      .resize({ width, height, fit: "inside" })
      .jpeg({ quality })
      .toBuffer();

    const bufferSizeKB = resizedBuffer.length / 1024;

    if (bufferSizeKB <= maxBufferSizeKB) {
      const base64 = resizedBuffer.toString("base64");
      return `data:image/jpeg;base64,${base64}`;
    };

    if (quality > 30) {
      quality -= 10;
    } else if (width > 200) {
      width = Math.floor(width * 0.85);
      height = Math.floor(width / aspectRatio);
    } else {
      break;
    };
  };

  throw new Error("Unable to compress image under 250KB. Try to upload smaller size image.");
};

export default compressImageToBase64;
