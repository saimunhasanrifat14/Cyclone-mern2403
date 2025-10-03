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

    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp",
    ];
    // Check MIME type

    if (!allowedMimeTypes.includes(req?.files?.image[0]?.mimetype)) {
      throw new customError("Only JPG, JPEG, and PNG image files are allowed.");
    }
    // console.log(req.files);

    if (req.files?.image?.length == 0) {
      throw new customError(401, "Image Not Found");
    }
    // console.log(req?.files?.image[0]?.size);
    if (req?.files?.image[0]?.size >= 10 * 1024 * 1024) {
      throw new customError(401, "image size below 5MB");
    }

    return { name: value.name, image: req?.files?.image[0] };
  } catch (error) {
    if (error.details) {
      console.log("Error from validateCategory:", error.details[0].message);
      throw new customError(
        400,
        `Category Validation Failed: ${error.details[0].message}`
      );
    } else {
      console.log("Error from validateCategory:", error);
      throw new customError(
        400,
        `Category Validation Failed: ${error.message}`
      );
    }
  }
};
