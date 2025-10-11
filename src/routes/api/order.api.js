const express = require("express");
const _ = express.Router();
const orderController = require("../../controller/order.controller");

_.route("/create-order").post(orderController.createOrder);
_.route("/all-order").get(orderController.getAllOrder);
_.route("/update-order").put(orderController.updateOrderInfo);
_.route("/order-status").get(orderController.OrderStatus);
_.route("/courierpending").get(orderController.CourierPending);
_.route("/courier-order").post(orderController.Couriersend);
_.route("/webhook").post(orderController.webhook);

module.exports = _;
