const express = require("express");
const _ = express.Router();
const { upload } = require("../../middleware/multer.middleware");
const bannerController = require("../../controller/banner.controller");
const { authGuard } = require("../../middleware/authGuard.middleware");
const { authorize } = require("../../middleware/authrize.middleware");
_.route("/create-banner").post(
  //   authGuard,
  //   authorize("brand", "add"),
  upload.fields([{ name: "image", maxCount: 1 }]),
  bannerController.createBanner
);

_.route("/get-all-banner").get(bannerController.getAllBanner);
_.route("/update-banner/:slug").put(
  //   authGuard,
  //   authorize("banner", "edit"),
  upload.fields([{ name: "image", maxCount: 1 }]),
  bannerController.updateBanner
);

_.route("/delete-banner/:slug").delete(
  //   authGuard,
  //   authorize("banner", "delete"),
  bannerController.deleteBanner
);
module.exports = _;
