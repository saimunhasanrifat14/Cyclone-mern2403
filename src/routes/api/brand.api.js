const express = require("express");
const _ = express.Router();
const categoryController = require("../../controller/category.controller");
const { upload } = require("../../middleware/multer.middleware");
const brandController = require("../../controller/brand.controller");
_.route("/create-brand").post(
  upload.fields([{ name: "image", maxCount: 1 }]),
  brandController.createBrand
);
_.route("/getall-brand").get(brandController.getAllBrand);
_.route("/single-brand/:slug").get(brandController.getSingleBrand);

module.exports = _;
