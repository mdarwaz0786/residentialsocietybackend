import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return id ? jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.EXPIRES_IN }) : null;
};

export default generateToken;