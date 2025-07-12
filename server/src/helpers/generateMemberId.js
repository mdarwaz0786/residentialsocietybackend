import User from "../models/user.model.js";

const generateMemberId = async (prefix = "", suffix = "") => {
  let memberId;
  let isUnique = false;

  while (!isUnique) {
    const finalSuffix = suffix || Math.floor(10000 + Math.random() * 90000);
    memberId = `${prefix}${finalSuffix}`;

    const existing = await User.findOne({ memberId });

    if (!existing) {
      isUnique = true;
    } else if (suffix) {
      throw new Error(`Member ID '${memberId}' already exists.`);
    };
  };

  return memberId;
};

export default generateMemberId;
