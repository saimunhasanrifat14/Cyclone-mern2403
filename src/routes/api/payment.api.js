const express = require("express");
const _ = express.Router();
const paymentController = require("../../controller/payment.controller");
_.route("/success").post(paymentController.successPayment);
_.route("/fail").post(paymentController.failPayment);
_.route("/cancle").post(paymentController.canclePayment);
_.route("/ipn").post(paymentController.ipnPayment);

module.exports = _;
