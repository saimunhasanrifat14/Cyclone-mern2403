const { apiResponse } = require("../utils/apiResponse");
const { asynchandeler } = require("../utils/asynchandeler");
const { customError } = require("../utils/customError");
const { validateCategory } = require("../validation/category.validation");
exports.createCategory = asynchandeler(async (req, res) => {
  const value = await validateCategory(req);
  console.log(value);
});
