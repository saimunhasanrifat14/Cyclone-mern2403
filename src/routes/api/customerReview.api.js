const express = require("express");
const _ = express.Router();
const customerController = require("../../controller/customerReview.controller");
const { upload } = require("../../middleware/multer.middleware");
const { authGuard } = require("../../middleware/authGuard.middleware");

_.route("/create-customerReview").post(
  authGuard,
  upload.fields([{ name: "image", maxCount: 5 }]),
  customerController.createCustomerReview
);
_.route("/remove-customerReview/:slug").delete(
  authGuard,
  customerController.deleteProdutReview
);
_.route("/edit-customerReview").put(
  authGuard,
  customerController.editProdutReview
);

module.exports = _;
