const generateMemberId = async (prefix = "", suffix = "") => {
  const finalSuffix = suffix || Math.floor(1000000 + Math.random() * 9000000);
  const memberId = `${prefix}${finalSuffix}`;

  return memberId;
};

export default generateMemberId;
