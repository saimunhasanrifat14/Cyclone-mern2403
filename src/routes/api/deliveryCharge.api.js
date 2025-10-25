const express = require("express");
const _ = express.Router();
const deliveryChargeController = require("../../controller/deliveryCharge.controller");
const { authorize } = require("../../middleware/authrize.middleware");
const { authGuard } = require("../../middleware/authGuard.middleware");

_.route("/create-delivery-charge").post(
  authGuard,
  authorize("deliverycharge", "add"),
  deliveryChargeController.createDeliveryCharge
);
_.route("/all-delivery-charge").get(
  deliveryChargeController.getAllDeliveryCharge
);

_.route("/single-delivery-charge/:id").get(
  deliveryChargeController.getSingleDeliveryCharge
);

_.route("/update-delivery-charge/:id").put(
  authGuard,
  authorize("deliverycharge", "edit"),
  deliveryChargeController.updateDeliveryCharge
);

_.route("/delete-delivery-charge/:id").delete(
  authGuard,
  authorize("deliverycharge", "delete"),
  deliveryChargeController.deleteDeliveryCharge
);

module.exports = _;
