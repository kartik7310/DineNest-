import cloudinary from "./cloudinary.js"
import { customError } from "./customError.js";
const uploadImageOnCloudinary = async(file)=>{
  try {
    
    const result = await cloudinary.uploader.upload(file.path);
    if(!result){
      throw new customError("image not upload")
    }
    return result.url;
  } catch (error) {
    console.log(error.message);
   throw error
    
  }
}

  

export default uploadImageOnCloudinary;