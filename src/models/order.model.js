const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // USER INFO (Registered or Guest)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    guestId: {
      type: String, // For guest users tracking
      default: null,
    },

    // ORDER ITEMS SNAPSHOT
    items: [],

    // SHIPPING INFO
    shippingInfo: {
      fullName: { type: String, required: false },
      phone: { type: String, required: true },
      address: { type: String, required: false },
      email: { type: String },
      deliveryZone: { type: String },
    },
    productWeight: { type: Number, default: 0 },
    // DELIVERY CHARGE
    deliveryCharge: {
      type: mongoose.Types.ObjectId,
      ref: "deliveryCharge",
    },

    discountAmount: {
      type: Number,
      default: 0,
    },

    // FINAL AMOUNTS
    finalAmount: {
      type: Number,
      required: true,
    },
    // PAYMENT INFO
    paymentMethod: {
      type: String,
      enum: ["cod", "sslcommerz"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "success", "failed", "cancelled"],
      default: "Pending",
    },

    // SSLCommerz Payment Gateway Specific
    transactionId: {
      type: String, // sslcommerz transaction_id
      default: null,
    },

    currency: {
      type: String,
      default: "BDT",
    },
    paymentGatewayData: {
      type: mongoose.Schema.Types.Mixed, // store full SSLCommerz response if needed
      default: {},
    },

    // ORDER STATUS
    orderStatus: {
      type: String,
  
      default: "Pending",
    },

    // INVOICE ID
    invoiceId: {
      type: String,
      default: null,
    },
    // COURIER
    courier: {
      name: {
        type: String,
        default: null,
      },
      trackingId: { type: String, default: null },
      rawResponse: { type: mongoose.Schema.Types.Mixed, default: null },
      status: {
        type: String,
        default: "pending",
      },
    },

    followUp: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    totalQuantity: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);
