const { apiResponse } = require("../utils/apiResponse");
const { asynchandeler } = require("../utils/asynchandeler");
const { customError } = require("../utils/customError");
const bannerModel = require("../models/banner.model");
const { validateBanner } = require("../validation/banner.validation");
const {
  uploadCloudinaryFile,
  deleteCloudinaryFile,
} = require("../helper/cloudinary");
// create a role
exports.createBanner = asynchandeler(async (req, res) => {
  const value = await validateBanner(req);
  //   upload cloudinary
  const image = await uploadCloudinaryFile(value.image.path);
  const banner = await bannerModel.create({ ...value, image });
  if (!banner) throw new customError(500, "Banner crate failed!!");
  apiResponse.sendSucess(res, 200, "Banner created Sucessfully", banner);
});

// get all banner
exports.getAllBanner = asynchandeler(async (req, res) => {
  //   upload image into cloudinary
  const banner = await bannerModel.find();
  if (!banner) throw new customError(500, "Banner crate failed!!");
  apiResponse.sendSucess(res, 200, "Banner get Sucessfully", banner);
});

// update banner when image upload then delete old image and upload new image
exports.updateBanner = asynchandeler(async (req, res) => {
  const { slug } = req.params;

  // ✅ Step 1: Validate request data
  const value = await validateBanner(req);

  // ✅ Step 2: Find existing banner
  const existingBanner = await bannerModel.findOne({ slug });
  if (!existingBanner) {
    throw new customError(404, "Banner not found");
  }

  let imageAsset = existingBanner.image; // keep old image if new one not provided

  // ✅ Step 3: If new image uploaded → delete old one & upload new
  if (value.image) {
    try {
      // delete old image from cloudinary if exists
      if (existingBanner?.image?.public_id) {
        await deleteCloudinaryFile(existingBanner.image.public_id);
      }

      // upload new image
      imageAsset = await uploadCloudinaryFile(value.image.path);
    } catch (err) {
      throw new customError(500, "Image upload failed: " + err.message);
    }
  }

  // ✅ Step 4: Update banner data
  const updatedBanner = await bannerModel.findOneAndUpdate(
    { slug },
    {
      ...value,
      image: imageAsset,
    },
    { new: true }
  );

  if (!updatedBanner) {
    throw new customError(500, "Banner update failed!!");
  }

  // ✅ Step 5: Send success response
  apiResponse.sendSucess(
    res,
    200,
    "Banner updated successfully",
    updatedBanner
  );
});

// delete banner when delete then remove old image into cloudinary
exports.deleteBanner = asynchandeler(async (req, res) => {
  const { slug } = req.params;
  const banner = await bannerModel.findOneAndDelete({ slug });
  if (!banner) throw new customError(500, "Banner delete failed!!");
  await deleteCloudinaryFile(banner.image.public_id);
  apiResponse.sendSucess(res, 200, "Banner deleted Sucessfully", banner);
});
