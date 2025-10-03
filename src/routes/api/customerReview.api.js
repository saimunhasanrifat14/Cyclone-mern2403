const express = require("express");
const _ = express.Router();
const customerController = require("../../controller/customerReview.controller");
const { upload } = require("../../middleware/multer.middleware");
_.route("/create-customerReview").post(
  upload.fields([{ name: "image", maxCount: 5 }]),
  customerController.createCustomerReview
);
_.route("/remove-customerReview/:slug").delete(
  customerController.deleteProdutReview
);
_.route("/edit-customerReview").put(customerController.editProdutReview);

module.exports = _;
