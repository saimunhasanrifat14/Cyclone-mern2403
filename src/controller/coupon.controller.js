const { apiResponse } = require("../utils/apiResponse");
const { asynchandeler } = require("../utils/asynchandeler");
const { customError } = require("../utils/customError");
const couponModel = require("../models/coupon.model");
// create coupon
exports.createcoupon = asynchandeler(async (req, res) => {
  const coupon = await couponModel.create(req.body);
  if (!coupon) throw new customError(500, "Coupon crate failed!!");
  apiResponse.sendSucess(res, 200, "Coupon created Sucessfully", coupon);
});

// get all coupon
exports.getAllCoupon = asynchandeler(async (req, res) => {
  //   upload image into cloudinary
  const coupon = await couponModel.find();
  if (!coupon) throw new customError(500, "Coupon crate failed!!");
  apiResponse.sendSucess(res, 200, "Coupon get Sucessfully", coupon);
});

// get single coupon
exports.getSingleCoupon = asynchandeler(async (req, res) => {
  const { code } = req.params;
  if (!code) throw new customError(500, "slug not found !!");
  //   upload image into cloudinary
  const coupon = await couponModel.findOne({ code });
  if (!coupon) throw new customError(500, "Coupon crate failed!!");
  apiResponse.sendSucess(res, 200, "Coupon get Sucessfully", coupon);
});
