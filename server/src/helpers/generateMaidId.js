const generateMaidId = async (prefix = "", suffix = "") => {
  const finalSuffix = suffix || Math.floor(10000 + Math.random() * 90000);
  const maidId = `${prefix}${finalSuffix}`;

  return maidId;
};

export default generateMaidId;
