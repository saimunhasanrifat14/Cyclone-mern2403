const express = require("express");
const _ = express.Router();
const roleController = require("../../controller/userPermission.controller");
_.route("/create-userpermission").post(roleController.createUserPermission);

module.exports = _;
