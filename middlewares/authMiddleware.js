import jwt from "jsonwebtoken";
import { customError } from "../utils/customError.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.Token;

    if (!token) {
      throw new customError("Token not provided!");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      throw new customError("Unauthorized");
    }

    req.user = { id: decoded.id, role: decoded.role };
   
     // Add the entire decoded payload for later use
    next();
  } catch (error) {
    next(error);
  }
};

export const adminMiddleware = async (req, res, next) => {
  try {
    console.log(req.user.role);
    
    if (!req.user || req.user.role !== "ADMIN") {
      throw new customError("Access denied! Admins only.");
    }
    next();
  } catch (error) {
    next(error);
  }
};

export const userMiddleware = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "user") {
      throw new customError("Access denied! Users only.");
    }
    next();
  } catch (error) {
    next(error);
  }
};

export default authMiddleware;
