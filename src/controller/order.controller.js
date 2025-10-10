const { apiResponse } = require("../utils/apiResponse");
const { asynchandeler } = require("../utils/asynchandeler");
const { customError } = require("../utils/customError");
const { validateOrder } = require("../validation/order.validation");
const cartModel = require("../models/cart.model");
const productModel = require("../models/product.model");
const variantModel = require("../models/variant.model");
const veliveryChargeModel = require("../models/deliveryCharge.model");
const orderModel = require("../models/order.model");
const crypto = require("crypto");
const invoiceModel = require("../models/invoice.model");
const SSLCommerzPayment = require("sslcommerz-lts");
const { orderTemplate } = require("../template/Templete");
const { smsSend, emailSend } = require("../helper/helper");

const store_id = process.env.SSLC_STORE_ID;
const store_passwd = process.env.SSLC_STORE_PASSWORD;
const is_live = process.env.NODE_ENV == "developement" ? false : true;

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
  try {
    order = new orderModel({
      user: user,
      guestId: guestId,
      shippingInfo: shippingInfo,
      deliveryCharge: deliveryCharge,
    });

    //  applly deliveryCharge
    const { name, charge } = await applyDeliveryCharge(deliveryCharge);

    const transactionid = `INV-${crypto
      .randomUUID()
      .split("-")[0]
      .toLocaleUpperCase()}`;

    // item add
    order.items = cart.items.map((item) => {
      const plainItem = item.toObject();
      if (plainItem.product && typeof plainItem.product === "object") {
        plainItem.product = {
          _id: plainItem.product._id,
          name: plainItem.product.name,
          price: plainItem.product.retailPrice,
          image: plainItem.product.retailPrice.image,
          totalSales: plainItem.product.retailPrice.totalSales,
        };
      }

      if (plainItem.variant && typeof plainItem.variant === "object") {
        plainItem.variant = {
          _id: plainItem.variant._id,
          name: plainItem.variant.variantName,
          price: plainItem.variant.retailPrice,
          image: plainItem.variant.image,
          totalSales: plainItem.variant.totalSales,
        };
      }
      return plainItem;
    });

    // update order filed
    order.finalAmount = Math.round(cart.finalAmount + charge);
    order.discountAmount = cart.discountValue;
    order.shippingInfo.deliveryZone = name;

    order.totalQuantity = cart.totalQuantity;
    order.transactionId = transactionid;

    // invoice
    const invoice = await invoiceModel.create({
      invoiceId: transactionid,
      order: order._id,
      customerDetails: shippingInfo,
      discountAmount: order.discountAmount,
      finalAmount: order.finalAmount,
      deliveryChargeAmount: charge,
    });

    // payement status
    if (paymentMethod == "cod") {
      order.paymentMethod = "cod";
      order.paymentStatus = "Pending";
      order.orderStatus = "Pending";
      order.invoiceId = invoice.invoiceId;
    } else {
      const data = {
        total_amount: order.finalAmount,
        currency: "BDT",
        tran_id: transactionid,
        success_url: `${process.env.BACKEND_URL}${process.env.BASE_URL}/payment/success`,
        fail_url: `${process.env.BACKEND_URL}${process.env.BASE_URL}/payment/fail`,
        cancel_url: `${process.env.BACKEND_URL}${process.env.BASE_URL}/payment/cancle`,
        ipn_url: `${process.env.BACKEND_URL}${process.env.BASE_URL}/payment/ipn`,
        shipping_method: "Courier",
        product_name: "Computer.",
        product_category: "Electronic",
        product_profile: "general",
        cus_name: order.shippingInfo.fullName,
        cus_email: order.shippingInfo.email,
        cus_add1: order.shippingInfo.address,
        cus_city: "Dhaka",
        cus_state: "Dhaka",
        cus_postcode: "1000",
        cus_country: "Bangladesh",
        cus_phone: order.shippingInfo.phone,
        ship_name: order.shippingInfo.fullName,
        ship_add1: order.shippingInfo.address,
        ship_city: "Dhaka",
        ship_state: "Dhaka",
        ship_postcode: 1000,
        ship_country: "Bangladesh",
      };

      const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
      const Response = await sslcz.init(data);
      if (!Response.GatewayPageURL)
        throw new customError(500, "pailed initiated failed !!");
      order.paymentMethod = "sslcommerz";
      order.paymentStatus = "Pending";
      order.orderStatus = "Pending";
      order.invoiceId = invoice.invoiceId;
      order.paymentGatewayData = Response;
      // send Confirmed sms
      if (shippingInfo.email) {
        const template = orderTemplate(cart, order.finalAmount, charge);
        sendEmail(shippingInfo.email, template, "Order Confrim");
      }
      if (shippingInfo.phone) {
        const res = await smsSend(shippingInfo.phone, "order confrim");
        console.log(res);
      }
      await order.save();
      return apiResponse.sendSucess(res, 201, "easyCheckouturl", {
        url: Response.GatewayPageURL,
      });
    }
    // send Confirmed sms
    if (shippingInfo.email) {
      const template = orderTemplate(cart, order.finalAmount, charge);
      sendEmail(shippingInfo.email, template, "Order Confrim");
    }
    if (shippingInfo.phone) {
      const res = await smsSend(shippingInfo.phone, "order confrim");
      console.log(res);
    }
    await order.save();
    apiResponse.sendSucess(res, 201, "order place sucessfull", order);
  } catch (error) {
    console.log(error);
    const stockAdjustPromise = [];
    for (let item of cart.items) {
      if (item.product) {
        stockAdjustPromise.push(
          productModel.findOneAndUpdate(
            { _id: item.product._id },
            { $inc: { stock: item.quantity, totalSales: -item.quantity } },
            { new: true }
          )
        );
      }
      if (item.variant) {
        stockAdjustPromise.push(
          variantModel.findOneAndUpdate(
            { _id: item.variant._id },
            {
              $inc: { stockVariant: item.quantity, totalSales: -item.quantity },
            },
            { new: true }
          )
        );
      }
    }

    await Promise.all(stockAdjustPromise);
  }
});

// send email
const sendEmail = async (email, template, msg) => {
  const info = await emailSend(email, template, msg);
  console.log(info);
};

// get all order
exports.getAllOrder = asynchandeler(async (req, res) => {
  const allorder = await orderModel
    .find({})
    .populate("deliveryCharge items.variant items.product")
    .sort({ createdAt: -1 });

  if (!allorder.length) throw new customError(500, "order not Found !!");
  apiResponse.sendSucess(res, 200, "ordere retrive succesfully", allorder);
});
