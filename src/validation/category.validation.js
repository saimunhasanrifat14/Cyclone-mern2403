const Joi = require("joi");
const { customError } = require("../utils/customError");

// Define Category Validation Schema
const categoryValidationSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.base": "Category name must be a string.",
    "string.empty": "Category name is required.",
    "any.required": "Category name is required.",
    "string.trim": "Category name should not contain extra spaces.",
  }),
}).options({
  abortEarly: true,
  allowUnknown: true, // Allows additional optional fields like image, slug, etc.
});

// Async function to validate category
exports.validateCategory = async (req) => {
  try {
    const value = await categoryValidationSchema.validateAsync(req.body);
    return value;
  } catch (error) {
    console.log("Error from validateCategory:", error.details[0].message);
    throw new customError(
      400,
      `Category Validation Failed: ${error.details[0].message}`
    );
  }
};
