const fileToBase64 = (file) => {
  return file ? `data:${file.mimetype};base64,${file.buffer.toString("base64")}` : null;
};

export default fileToBase64;