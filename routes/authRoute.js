import { register,login,verifyEmail,logout,forgetPassword,resetPassword, } from "../controllers/authController.js";
import { getProfile,updateUser } from "../controllers/userController.js";
import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js"
const router = Router();

router.post("/register",register)  //register
router.post("/login",login)  //login
router.post("/verify-Email",verifyEmail)  //email-verify
router.get("/logout",authMiddleware,logout) //logout
router.post("/forget-Password",forgetPassword)  //forgetPassword
router.post("/reset-Password/:token",resetPassword)  //resetPassword
router.get("/check-user",authMiddleware,getProfile) //getProfile
router.put("/profile/update-user",authMiddleware,updateUser)  //updateUser

export default  router;