const { apiResponse } = require("../utils/apiResponse");
const { asynchandeler } = require("../utils/asynchandeler");
const { customError } = require("../utils/customError");
exports.sayHi = asynchandeler(async (req, res) => {
  throw new customError(501, "clientError", "email Missing");
});
