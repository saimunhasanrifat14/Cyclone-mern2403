const express = require("express");
const _ = express.Router();
const roleController = require("../../controller/role.controller");
_.route("/create-role").post(roleController.createRole);

module.exports = _;
