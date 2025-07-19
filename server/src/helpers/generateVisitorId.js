import Visitor from "../models/visitor.model.js";

const generateVisitorId = async (prefix = "", suffix = "") => {
  let visitorId;
  let isUnique = false;

  while (!isUnique) {
    const finalSuffix = suffix || Math.floor(1000000 + Math.random() * 9000000);
    visitorId = `${prefix}${finalSuffix}`;

    const existing = await Visitor.findOne({ visitorId });

    if (!existing) {
      isUnique = true;
    } else if (suffix) {
      throw new Error(`Visitor ID '${visitorId}' already exists.`);
    };
  };

  return visitorId;
};

export default generateVisitorId;
