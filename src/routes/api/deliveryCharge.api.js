const express = require("express");
const _ = express.Router();
const deliveryChargeController = require("../../controller/deliveryCharge.controller");
_.route("/create-delivery-charge").post(
  deliveryChargeController.createDeliveryCharge
);
_.route("/all-delivery-charge").get(
  deliveryChargeController.getAllDeliveryCharge
);

_.route("/single-delivery-charge/:id").get(
  deliveryChargeController.getSingleDeliveryCharge
);

_.route("/update-delivery-charge/:id").put(
  deliveryChargeController.updateDeliveryCharge
);

_.route("/delete-delivery-charge/:id").delete(
  deliveryChargeController.deleteDeliveryCharge
);

module.exports = _;
