const { apiResponse } = require("../utils/apiResponse");
const { asynchandeler } = require("../utils/asynchandeler");
const { customError } = require("../utils/customError");
const roleModel = require("../models/role.model");

// create a role
exports.createRole = asynchandeler(async (req, res) => {
  const role = await roleModel.create(req.body);
  if (!role) throw new customError(500, "Role crate failed!!");
  apiResponse.sendSucess(res, 200, "Role created Sucessfully", role);
});
