const { apiResponse } = require("../utils/apiResponse");
const { asynchandeler } = require("../utils/asynchandeler");
const { customError } = require("../utils/customError");
const brandModel = require("../models/brand.model");
const { validateBrand } = require("../validation/brand.validation");
const { uploadCloudinaryFile } = require("../helper/cloudinary");

//@desc create a new brand
exports.createBrand = asynchandeler(async (req, res) => {
  const value = await validateBrand(req);
  //   upload image into cloudinary
  const images = await uploadCloudinaryFile(value.image.path);
  const brand = await brandModel.create({
    name: value.name,
    image: images,
  });
  if (!brand) throw new customError(500, "Brand crate failed!!");
  apiResponse.sendSucess(res, 200, "brand created Sucessfully", brand);
});

//@desc create a new brand
exports.getAllBrand = asynchandeler(async (req, res) => {
  //   upload image into cloudinary
  const brand = await brandModel.find();
  if (!brand) throw new customError(500, "Brand crate failed!!");
  apiResponse.sendSucess(res, 200, "brand get Sucessfully", brand);
});

//@desc create a new brand
exports.getSingleBrand = asynchandeler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) throw new customError(500, "slug not found !!");
  //   upload image into cloudinary
  const brand = await brandModel.findOne({ slug });
  if (!brand) throw new customError(500, "Brand crate failed!!");
  apiResponse.sendSucess(res, 200, "brand get Sucessfully", brand);
});
