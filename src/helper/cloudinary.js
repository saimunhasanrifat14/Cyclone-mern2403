const { customError } = require("../utils/customError");
const fs = require("fs");
require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRECT,
});

// upload image into cloudinary
exports.uploadCloudinaryFile = async (filePath) => {
  try {
    if (!filePath && !fs.existsSync(filePath)) {
      throw new customError(401, "filePath Missing !!");
    }
    // upload image
    const image = await cloudinary.uploader.upload(filePath, {
      resource_type: "image",
      quality: "auto",
    });
    if(image){
        fs.unlinkSync(filePath);
        return {publicIP : image.public_id , url : image.secure_url}
    }
    console.log(image);
  } catch (error) {
     if(fs.existsSync(filePath)){
        fs.unlinkSync(filePath);
        return {publicIP : image.public_id , url : image.secure_url}
    }
    console.log("error from cloudinary file upload ", error);
    throw new customError(
      500,
      "error from cloudinary file upload " + error.message
    );
  }
};

// delete cloudinary iamge
exports.deleteCloudinaryFile = async (public_id)=> {
  try {
   const reponse =   await cloudinary.uploader.destroy(public_id , {
       resource_type: "image",
      quality: "auto",
    })
    return reponse
  } catch (error) {
    console.log("error from cloudinary delete image ", error);
    throw new customError(
      500,
      "error from cloudinary delete image " + error.message
    );
  }
}
