import cloudinary from './cloudinary.js';
const deleteImage = async (imageURL) => {
  if(!imageURL) return;
  const image = imageURL.split("/").pop();
  await cloudinary.uploader.destroy(image);
}
export {deleteImage};
  