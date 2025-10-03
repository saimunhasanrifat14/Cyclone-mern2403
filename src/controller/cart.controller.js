const { apiResponse } = require("../utils/apiResponse");
const { asynchandeler } = require("../utils/asynchandeler");
const { customError } = require("../utils/customError");
const cartModel = require("../models/cart.model");
const productModel = require("../models/product.model");
const variantModel = require("../models/variant.model");
const couponModel = require("../models/coupon.model");
const { validateCart } = require("../validation/cart.validation");
const { getIo } = require("../socket/server");

// apply coupon
const applyCoupon = async (totalPrice = 0, couponCode) => {
  if (couponCode == null) return { finalAmount: totalPrice, discountinfo: {} };
  try {
    let finalAmount = 0;
    let discountinfo = {};
    const coupon = await couponModel.findOne({ code: couponCode });
    if (!coupon) throw new customError(401, "coupoun not found !!");
    if (Date.now() > coupon.expireAt)
      throw new customError(401, "coupoun expired!!");
    if (coupon.usageLimit < coupon.usedCount)
      throw new customError(401, "coupoun limit expires!!");
    if (coupon.discountType === "percentage") {
      const discountAmount = (totalPrice * coupon.discountValue) / 100;
      finalAmount = Math.round(totalPrice - discountAmount);
      coupon.usedCount += 1;
      discountinfo.discountType = "percentage";
      discountinfo.discountValue = coupon.discountValue;
    }
    if (coupon.discountType === "tk") {
      finalAmount = Math.round(totalPrice - coupon.discountValue);
      coupon.usedCount += 1;
      discountinfo.discountType = "tk";
      discountinfo.discountValue = coupon.discountValue;
    }

    discountinfo.couponId = coupon._id;
    await coupon.save();

    return { finalAmount, discountinfo };
  } catch (error) {
    console.log(error);
    throw new customError(401, "coupoun apply failed " + error);
  }
};

// addtocart
exports.addToCart = asynchandeler(async (req, res) => {
  const data = await validateCart(req);
  const { user, guestId, product, variant, quantity, color, size, coupon } =
    data;

  let productObj = null;
  let variantObj = null;
  let price = 0;

  //   extract price
  if (product) {
    productObj = await productModel.findById(product);
    price = productObj.retailPrice;
  }
  if (variant) {
    variantObj = await variantModel.findById(variant);
    price = variantObj.retailPrice;
  }

  // if user or guestId already exist in cart model
  const cartQuery = user ? { user: user } : { guestId: guestId };
  let cart = await cartModel.findOne(cartQuery);
  if (!cart) {
    cart = new cartModel({
      user: user || null,
      guestId: guestId || null,
      items: [],
    });
  }

  // check product info into cart items array
  let findIndex = -1;
  if (productObj) {
    findIndex = cart.items.findIndex((item) => item.product == product);
  }
  if (variantObj) {
    findIndex = cart.items.findIndex((item) => item.variant == variant);
  }

  //  update the product infomation into cart items
  if (findIndex > -1) {
    cart.items[findIndex].quantity += quantity;
    cart.items[findIndex].totalPrice += cart.items[findIndex].price * quantity;
  } else {
    cart.items.push({
      product: product ? product : null,
      variant: variant ? variant : null,
      quantity: quantity,
      price: price,
      totalPrice: Math.ceil(price * quantity),
      color: color,
      size: size,
    });
  }

  //   calculated total price and quantity
  const totalreductPrice = cart.items.reduce(
    (acc, item) => {
      acc.totalPrice += item.totalPrice;
      acc.totalQuantity += item.quantity;
      return acc;
    },
    {
      totalPrice: 0,
      totalQuantity: 0,
    }
  );

  //   if have coupon
  const { finalAmount, discountinfo } = await applyCoupon(
    totalreductPrice.totalPrice,
    coupon
  );
  // now update the cart model

  cart.coupon = discountinfo.couponId || null;
  cart.discountType = discountinfo.discountType || null;
  cart.discountValue = discountinfo.discountValue || null;
  cart.finalAmount = finalAmount;
  cart.totalQuantity = totalreductPrice.totalQuantity;
  await cart.save();
  const io = getIo();
  io.to("123").emit("cart", {
    message: "🛒 Product added to your cart successfully",
    cart: cart,
  });

  apiResponse.sendSucess(res, 201, "Add to cart sucessfully", cart);
});

// decrease quantity
exports.decreaseQuantity = asynchandeler(async (req, res) => {
  const userid = req.userid || req.body.userid;
  const { guestId, cartItemId } = req.body;
  if (!cartItemId) throw new customError(401, "cart item id not missing !");
  const query = userid ? { user: userid } : { guestId: guestId };
  const cart = await cartModel.findOne(query);
  const index = cart.items.findIndex((item) => item._id == cartItemId);
  const cartItem = cart.items[index];
  if (cartItem.quantity > 1) {
    cartItem.quantity -= 1;
    cartItem.totalPrice = cartItem.price * cartItem.quantity;
  }

  // calculated total price and quantity
  const totalreductPrice = cart.items.reduce(
    (acc, item) => {
      acc.totalPrice += item.totalPrice;
      acc.totalQuantity += item.quantity;
      return acc;
    },
    {
      totalPrice: 0,
      totalQuantity: 0,
    }
  );

  cart.finalAmount = totalreductPrice.totalPrice;
  cart.totalQuantity = totalreductPrice.totalQuantity;
  await cart.save();
  const io = getIo();
  io.to("123").emit("cart", {
    message: "🛒 cart item decreased",
    cart: cart,
  });

  apiResponse.sendSucess(res, 201, "cart item decrease  sucessfully", cart);
});

// increase quantity
exports.increaseQuantity = asynchandeler(async (req, res) => {
  const userid = req.userid || req.body.userid;
  const { guestId, cartItemId } = req.body;
  if (!cartItemId) throw new customError(401, "cart item id not missing !");
  const query = userid ? { user: userid } : { guestId: guestId };
  const cart = await cartModel.findOne(query);
  const index = cart.items.findIndex((item) => item._id == cartItemId);
  const cartItem = cart.items[index];
  if (cartItem.quantity > 0) {
    cartItem.quantity += 1;
    cartItem.totalPrice = cartItem.price * cartItem.quantity;
  }

  // calculated total price and quantity
  const totalreductPrice = cart.items.reduce(
    (acc, item) => {
      acc.totalPrice += item.totalPrice;
      acc.totalQuantity += item.quantity;
      return acc;
    },
    {
      totalPrice: 0,
      totalQuantity: 0,
    }
  );

  cart.finalAmount = totalreductPrice.totalPrice;
  cart.totalQuantity = totalreductPrice.totalQuantity;
  await cart.save();
  const io = getIo();
  io.to("123").emit("cart", {
    message: "🛒 cart item increase",
    cart: cart,
  });

  apiResponse.sendSucess(res, 201, "cart item increase  sucessfully", cart);
});

// delete item
exports.deleteCartItem = asynchandeler(async (req, res) => {
  const userid = req.userid || req.body.userid;
  const { guestId, cartItemId } = req.body;
  if (!cartItemId) throw new customError(401, "cart item id not missing !");
  const query = userid ? { user: userid } : { guestId: guestId };
  const cart = await cartModel.findOneAndUpdate(
    query,
    {
      $pull: { items: { _id: cartItemId } }, // correct $pull syntax
    },
    { new: true } // return updated cart
  );

  if (cart.items.length == 0) {
    await cartModel.deleteOne({ _id: cart._id });
    apiResponse.sendSucess(res, 201, "cart item delete   sucessfully", cart);
  }

  // calculated total price and quantity
  const totalreductPrice = cart.items.reduce(
    (acc, item) => {
      acc.totalPrice += item.totalPrice;
      acc.totalQuantity += item.quantity;
      return acc;
    },
    {
      totalPrice: 0,
      totalQuantity: 0,
    }
  );

  cart.finalAmount = totalreductPrice.totalPrice;
  cart.totalQuantity = totalreductPrice.totalQuantity;
  await cart.save();
  const io = getIo();
  io.to("123").emit("cart", {
    message: "🛒 cart item deleted",
    cart: cart,
  });
  apiResponse.sendSucess(res, 201, "cart item delete   sucessfully", cart);
});
