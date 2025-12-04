import prisma from "../database/db.js";
import {customError} from "../utils/customError.js";
export const getProfile = async (req, res ,next) => {
  try {
    const {id} = req.user;
    if (!id) {
     return next(new customError("user id not found"))
    }
    const user = await prisma.user.findUnique({
      where: {id},
    });
    if (!user) {
      return next(new customError("user not found"))
    }
    const {
      password,
      resetPasswordToken,
      forgotPasswordExpiresAt,
      ...userData
    } = user;
    return res.status(200).json({
      message: "Authorized",
      userData, 
    });  
  } catch (error) {
    next(error);
  }
}; 

export const updateUser = async (req, res,next) => {
  try {
    const {id} = req.user;
    console.log(id);
    
    if (!id) {
      return next(new customError("user id not found"))
    }
    const existUser = await prisma.user.findUnique({
      where:{id:id}
    })
console.log(existUser);

    if(!existUser){
      return next(new customError("user  not found"))
    }
    const { fullName, email, address, city, country, profilePicture } =
      req.body;
    //upload cloudinary
    let profilePictureUrl;
    if (profilePicture) {
      const cloudResponse = await cloudinary.uploader.upload(profilePicture);
      profilePictureUrl = cloudResponse.secure_url;
    }
    // truthy and false

    const updateData = {
    ...(fullName && { fullName }),
    ...(email && { email }),
    ...(address && { address }),
    ...(city && { city }),
    ...(country && { country }),
    ...(profilePictureUrl && { profilePicture: profilePictureUrl }),
    };

    const user = await prisma.user.update({
      where: {
        id: id,
      },
      data: updateData,
    });
    const {
      password,
      resetPasswordToken,
      forgotPasswordExpiresAt,
      ...userData
    } = user;
    return res.status(200).json({
      message: "user Update successfully",
      userData,
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
 
