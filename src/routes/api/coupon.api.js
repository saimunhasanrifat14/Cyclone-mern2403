const express = require("express");
const _ = express.Router();
const couponController = require("../../controller/coupon.controller");
const { authGuard } = require("../../middleware/authGuard.middleware");
const { authorize } = require("../../middleware/authrize.middleware");
_.route("/create-coupon").post(
  authGuard,
  authorize("coupon", "add"),
  couponController.createcoupon
);
_.route("/get-all-coupon").get(couponController.getAllCoupon);
_.route("/single-coupon/:code").get(couponController.getSingleCoupon);
module.exports = _;
