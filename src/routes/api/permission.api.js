const express = require("express");
const _ = express.Router();
const permissionController = require("../../controller/permisson.controller");
_.route("/create-permission").post(permissionController.createPermission);
_.route("/getall-permission").get(permissionController.getAllPermission);
_.route("/delete-permission/:id").delete(permissionController.deletePermission);

module.exports = _;
