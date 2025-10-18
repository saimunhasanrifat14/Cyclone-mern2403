const { apiResponse } = require("../utils/apiResponse");
const { asynchandeler } = require("../utils/asynchandeler");
const { customError } = require("../utils/customError");
const permissionModel = require("../models/permission.model");

exports.createPermission = asynchandeler(async (req, res) => {
  for (let p in req.body) {
    if (req.body[p] == "") {
      throw new customError(401, `${p} is Missing`);
    }
  }

  const permisson = await permissionModel.create({
    name: req.body.name,
    actions: ["create", "read", "update", "delete"],
  });
  if (!permisson) throw new customError(500, "permisson not created");
  apiResponse.sendSucess(res, 200, "permisson created", permisson);
});

// get all permisson
exports.getAllPermission = asynchandeler(async (req, res) => {
  const permisson = await permissionModel.find();
  if (!permisson) throw new customError(500, "permisson not created");
  apiResponse.sendSucess(res, 200, "permisson created", permisson);
});

// delete permisson using id
exports.deletePermission = asynchandeler(async (req, res) => {
  const { id } = req.params;
  const permisson = await permissionModel.findByIdAndDelete(id);
  if (!permisson) throw new customError(500, "permisson not created");
  apiResponse.sendSucess(res, 200, "permisson delete", permisson);
});
