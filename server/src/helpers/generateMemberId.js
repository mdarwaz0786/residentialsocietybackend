const generateMemberId = async (prefix = "", suffix = "") => {
  const finalSuffix = suffix || Math.floor(100000 + Math.random() * 900000);
  const memberId = `${prefix}${finalSuffix}`;

  return memberId;
};

export default generateMemberId;
