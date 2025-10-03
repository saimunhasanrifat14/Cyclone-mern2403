const { apiResponse } = require("../utils/apiResponse");
const { asynchandeler } = require("../utils/asynchandeler");
const { customError } = require("../utils/customError");
const { validateOrder } = require("../validation/order.validation");
const cartModel = require("../models/cart.model");
const productModel = require("../models/product.model");
const variantModel = require("../models/variant.model");
const veliveryChargeModel = require("../models/deliveryCharge.model");
const orderModel = require("../models/order.model");

// applyDeliveryCharge
const applyDeliveryCharge = async (dcId) => {
  const charge = await veliveryChargeModel.findById(dcId);
  if (!charge) throw new customError(501, "charge not found !!");
  return charge;
};

// create order
exports.createOrder = asynchandeler(async (req, res) => {
  const { user, guestId, shippingInfo, deliveryCharge, paymentMethod } =
    await validateOrder(req);
  const query = user ? { user } : { guestId };
  const cart = await cartModel
    .findOne(query)
    .populate("items.product")
    .populate("items.variant")
    .populate("coupon");

  // now decrease the stock
  const stockAdjustPromise = [];
  for (let item of cart.items) {
    if (item.product) {
      stockAdjustPromise.push(
        productModel.findOneAndUpdate(
          { _id: item.product._id },
          { $inc: { stock: -item.quantity, totalSales: item.quantity } },
          { new: true }
        )
      );
    }
    if (item.variant) {
      stockAdjustPromise.push(
        variantModel.findOneAndUpdate(
          { _id: item.variant._id },
          { $inc: { stockVariant: -item.quantity, totalSales: item.quantity } },
          { new: true }
        )
      );
    }
  }

  // make a order
  let order = null;
  order = new orderModel({
    user: user,
    guestId: guestId,
    items: cart.items,
    shippingInfo: shippingInfo,
    deliveryCharge: deliveryCharge,
  });

  //  applly deliveryCharge
  const { name, charge } = await applyDeliveryCharge(deliveryCharge);
  order.finalAmount = Math.round(cart.finalAmount + charge);
  order.discountAmount = cart.discountValue;
  order.shippingInfo.deliveryZone = name;
});
