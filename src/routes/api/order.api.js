const express = require("express");
const _ = express.Router();
const orderController = require("../../controller/order.controller");

_.route("/create-order").post(orderController.createOrder);
_.route("/all-order").get(orderController.getAllOrder);

module.exports = _;
