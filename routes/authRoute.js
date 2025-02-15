import { register,login,verifyEmail,logout,forgetPassword,resetPassword, } from "../controllers/authController.js";
import { getProfile,updateUser } from "../controllers/userController.js";
import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js"
const router = Router();
import {rateLimiter} from "../middlewares/rateLimitLimiter.js"
router.post("/register",rateLimiter,register)  //register
router.post("/login",rateLimiter,login)  //login
router.post("/verify-Email",rateLimiter,verifyEmail)  //email-verify
router.get("/logout",authMiddleware,logout) //logout
router.post("/forget-Password",rateLimiter,forgetPassword)  //forgetPassword
router.post("/reset-Password/:token",rateLimiter,resetPassword)  //resetPassword
router.get("/check-user",authMiddleware,getProfile) //getProfile
router.put("/profile/update-user",authMiddleware,updateUser)  //updateUser

export default  router;