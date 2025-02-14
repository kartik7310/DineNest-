import prisma from "../database/db.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";
import {customError} from "../utils/customError.js";
import { generateVerification } from "../utils/generateVerificationToken.js";
import {welcomeMessageEmail,sendVerificationEmail,sendPasswordEmail} from "../server/mailTrap/email.js"
import { v2 as cloudinary } from "cloudinary"; // import jwt 
// from "jsonwebtoken";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
uuidv4();

export const register = async (req, res,next) => {
  try {
    const { fullName, contact, email, password, country,role } = req.body;

    // Input validation
    if (!fullName || !email || !password || !contact) {
     throw new customError("All fields are required",400);
    }
    const isUserExist = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (isUserExist) {
      throw new customError("User already exist with this email",400);
    }
    //hash password
    const hashPassword = await bcrypt.hash(password, 10);
    // otp
    const verificationToken = generateVerification();
// Create a new user
await sendVerificationEmail(email,verificationToken);
const user = await prisma.user.create({
  data: {
    fullName,
    email,
    contact,
    role,
    password: hashPassword,
    country,
    verificationToken,
    verificationTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Add 24 hours
  },
});

    // console.log(encodePassword);

    // generate token
     generateToken(res,user);
    

    // email verification
    

    const { password: hashedPassword, ...userWithoutPassword } = user;
 

    // Send a response with the created user
    return res
      .status(201)
      .json({ message: "User created successfully", userWithoutPassword });
  } catch (error) {
    next(error)
  }
};
// login

export const login = async (req, res,next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
    return next(customError("All fields are required"))
    }
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (!user) {
      throw new customError(401).json("User not exist!");
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new customError("Invalid email or password");
    }
    // generate token
    generateToken(res , user)

    // lastLogin
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    
   await welcomeMessageEmail(user.email,user.fullName)
    return res.status(200).json({
      message: `Welcome  back ${user.fullName}`,
      user: {
        id: user.id,
        email: user.email,
        contact: user.contact,
        lastLogin: user.lastLogin,
        country: user.country,
      },
    });
  } catch (error) {
    next(error);
  }
};

// verify email
export const verifyEmail = async (req, res,next) => {
  try {
    const { verificationCode } = req.body;
    if (!verificationCode) {
     throw new customError("Please Enter OTP");
    }
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: verificationCode,
        verificationTokenExpiresAt: {
          gt: new Date(), // Use `new Date()` to get the current date and time
        },
      },
    });
    if (!user) {
     throw new customError("OTP not Valid or Expire");
    }
    const updateUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        isVerified: true, // Mark user as verified
        verificationToken: null, // Optionally clear the verification token
        verificationTokenExpiresAt: null, // Op
      },
    });
    await welcomeMessageEmail(user.email,user.fullName);
    const { password, ...userWithoutPassword } = updateUser;
    return res.status(200).json({
      message: "email verify successfully",
      userWithoutPassword,
    });
   
  } catch (error) {
   next(error)
  }
};

export const logout = async (req, res,next) => {
  try {
    return res
      .clearCookie("Token", " ")
      .status(200)
      .json("Logout successfully");
  } catch (error) {
    next(error);
  }
};

export const forgetPassword = async (req, res,next) => {
  try {
    const { email } = req.body;
    if (!email) {
     throw new customError("please Enter your Email !");
    }
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new customError("User not Exist !");
    }
    const resetToken = crypto.randomBytes(40).toString("hex");
    const ExpireAt = new Date(Date.now() + 5 * 60 * 1000); // five minutes
    await sendPasswordEmail (user.email,`${process.env.FRONTEND_URL}/resetPassword/{resetToken}`);
    await prisma.user.update({
      where: {
        email,
      },
      data: {
        resetPasswordToken: resetToken,
        forgotPasswordExpiresAt: ExpireAt,
      },
    });

    // send email
   

    return res.status(200).json("Password reset Email send to your email");
  } catch (error) {
   next(error) ;
  }
};

export const resetPassword = async (req, res,next) => {
  try {
    const { resetToken } = req.params;
    if (!resetToken) {
      throw new customError("token not received");
    }
    const { newPassword } = req.body;
    if (!newPassword && newPassword.length < 6) {
      throw new customError("Please Enter your New Password !");
    }
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: resetToken,
        forgotPasswordExpiresAt: {
          gte: new Date(),
        },
      },
    });
    if (!user) {
      throw new customError("Invalid or Expire Token");
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        forgotPasswordExpiresAt: null,
      },
    });
    //email for show resetpassword successfully
    await sendResetSuccessEmail(user.email)
    return res
      .status(200)
      .json({ message: "Password has been reset successfully." });
  } catch (error) {
    next(error);  
  }
};
