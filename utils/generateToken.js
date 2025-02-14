import jwt from "jsonwebtoken";
import { customError } from "../utils/customError.js";
export const generateToken = async (res, user,next) => {
  try {
    if (!user || !res) {
      throw new customError("user id not provide");
    }
    const payload = { id: user.id ,role:user.role};
    const token =  jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.cookie("Token", token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
    return token;
  } catch (error) {
    next(error)
    }
};
