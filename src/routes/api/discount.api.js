const express = require("express");
const _ = express.Router();
const discountController = require("../../controller/discount.controller");
const { authGuard } = require("../../middleware/authGuard.middleware");
const { authorize } = require("../../middleware/authrize.middleware");
_.route("/create-discount").post(
  authGuard,
  authorize("discount", "add"),
  discountController.createDiscount
);
_.route("/get-all-discount").get(
  authGuard,
  authorize("discount", "view"),
  discountController.getAllDiscount
);
_.route("/single-discount/:slug").get(
  authGuard,
  authorize("discount", "edit"),
  discountController.getSingleDiscount
);
_.route("/update-discount/:slug").put(
  authGuard,
  authorize("discount", "delete"),
  discountController.updateDiscount
);

module.exports = _;
