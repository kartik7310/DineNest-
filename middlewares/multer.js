
import multer from "multer";
const storage = multer.diskStorage({
  params: {
    folder: 'uploads', // Cloudinary folder name
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'], // Allowed file formats
  },
});

const upload = multer({ storage });

export default upload;
