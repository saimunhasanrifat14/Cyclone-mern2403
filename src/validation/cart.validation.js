const Joi = require("joi");
const { customError } = require("../utils/customError");

// Cart Validation Schema
const cartValidationSchema = Joi.object({
  user: Joi.string().allow(null).messages({
    "string.base": "User must be a string (ObjectId).",
  }),

  guestId: Joi.string().allow(null).messages({
    "string.base": "Guest ID must be a string.",
  }),

  product: Joi.string().optional().allow(null, "").messages({
    "string.base": "Product ID must be a string.",
    "any.required": "Product is required.",
  }),

  variant: Joi.string().allow(null, "").messages({
    "string.base": "Variant ID must be a string.",
  }),

  quantity: Joi.number().integer().min(1).required().messages({
    "number.base": "Quantity must be a number.",
    "number.min": "Quantity must be at least 1.",
    "any.required": "Quantity is required.",
  }),

  color: Joi.string().trim().allow(null).messages({
    "string.base": "Color must be a string.",
  }),

  size: Joi.string().trim().allow(null).messages({
    "string.base": "Size must be a string.",
  }),

  coupon: Joi.string().trim().allow(null).messages({
    "string.base": "Coupon must be a string.",
  }),
}).options({
  abortEarly: true,
  allowUnknown: true, // In case you add fields like createdAt, updatedAt later
});

// Async function to validate cart
exports.validateCart = async (req) => {
  try {
    const value = await cartValidationSchema.validateAsync(req.body);
    return value;
  } catch (error) {
    if (error.details) {
      console.log("Error from validateCart:", error.details[0].message);
      throw new customError(
        400,
        `Cart Validation Failed: ${error.details[0].message}`
      );
    } else {
      console.log("Error from validateCart:", error);
      throw new customError(400, `Cart Validation Failed: ${error.message}`);
    }
  }
};
