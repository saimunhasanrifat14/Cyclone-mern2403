const { apiResponse } = require("../utils/apiResponse");
const { asynchandeler } = require("../utils/asynchandeler");
const { customError } = require("../utils/customError");
const { validateCategory } = require("../validation/category.validation");
const Category = require("../models/category.model");
exports.createCategory = asynchandeler(async (req, res) => {
  await validateCategory(req);
});
