const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

// Cart Schema
const cartSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      default: null,
    },
    guestId: {
      type: String,
      default: null,
    },
    items: [
      {
        product: {
          type: Types.ObjectId,
          ref: "Product",
          default: null,
        },
        variant: {
          type: Types.ObjectId,
          ref: "Variant",
          default: null,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        totalPrice: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        color: {
          type: String,
          required: true,
          default: "N/A",
        },
        size: {
          type: String,
          required: true,
          default: "N/A",
        },
      },
    ],
    coupon: {
      type: Types.ObjectId,
      ref: "Coupon",
      default: null,
    },
    discountType: {
      type: String,
      default: null,
    },
    discountValue: {
      type: Number,
      default: 0,
    },
    finalAmount: {
      type: Number,
      required: true,
    },
    totalQuantity: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Cart || mongoose.model("Cart", cartSchema);
