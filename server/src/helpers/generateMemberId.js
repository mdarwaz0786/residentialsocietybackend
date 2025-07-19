const generateMemberId = async (prefix = "", suffix = "") => {
  const finalSuffix = suffix || Math.floor(10000 + Math.random() * 90000);
  const memberId = `${prefix}${finalSuffix}`;

  return memberId;
};

export default generateMemberId;
