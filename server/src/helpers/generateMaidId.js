const generateMaidId = async (prefix = "", suffix = "") => {
  const finalSuffix = suffix || Math.floor(100000 + Math.random() * 900000);
  const maidId = `${prefix}${finalSuffix}`;

  return maidId;
};

export default generateMaidId;
