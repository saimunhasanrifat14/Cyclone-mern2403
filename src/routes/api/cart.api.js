const express = require("express");
const _ = express.Router();
const cartController = require("../../controller/cart.controller");
_.route("/addtocart").post(cartController.addToCart);
_.route("/decreasecartitem").put(cartController.decreaseQuantity);
_.route("/increasecartitem").put(cartController.increaseQuantity);
_.route("/deletecartitem").delete(cartController.deleteCartItem);

module.exports = _;
