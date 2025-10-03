const Joi = require("joi");
const { customError } = require("../utils/customError");

const orderValidationSchema = Joi.object({
  // USER INFO
  user: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .allow(null)
    .messages({
      "string.pattern.base": "User ID must be a valid ObjectId.",
    }),

  guestId: Joi.string().allow(null).messages({
    "string.base": "Guest ID must be a string.",
  }),

  // SHIPPING INFO
  shippingInfo: Joi.object({
    fullName: Joi.string().optional().messages({
      "string.base": "Full name must be a string.",
    }),
    phone: Joi.string().required().messages({
      "string.base": "Phone number must be a string.",
      "any.required": "Phone number is required.",
    }),
    address: Joi.string().optional().messages({
      "string.base": "Address must be a string.",
    }),
    email: Joi.string().email().optional().messages({
      "string.email": "Email must be a valid email address.",
    }),
  }).required(),

  // DELIVERY CHARGE
  deliveryCharge: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/) // ObjectId
    .required()
    .messages({
      "string.pattern.base": "Delivery charge must be a valid ObjectId.",
      "any.required": "Delivery charge is required.",
    }),

  // PAYMENT INFO
  paymentMethod: Joi.string().valid("cod", "sslcommerz").required().messages({
    "any.only": "Payment method must be either 'cod' or 'sslcommerz'.",
    "any.required": "Payment method is required.",
  }),
}).options({
  abortEarly: true,
  allowUnknown: true, // to allow other fields like items, timestamps etc.
});

// Async validator
exports.validateOrder = async (req) => {
  try {
    const value = await orderValidationSchema.validateAsync(req.body);
    return value;
  } catch (error) {
    if (error.details) {
      console.log("Error from validateOrder:", error.details[0].message);
      throw new customError(
        400,
        `Order Validation Failed: ${error.details[0].message}`
      );
    }
  }
};
