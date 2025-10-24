const express = require("express");
const _ = express.Router();
const userRolePermissionController = require("../../controller/userRolePermission.controller");
const { upload } = require("../../middleware/multer.middleware");
_.route("/adduser").post(
  upload.fields([{ name: "image", maxCount: 1 }]),
  userRolePermissionController.createUser
);
_.route("/getuser").get(userRolePermissionController.getUserbyadmin);


_.route('/adduserpermission').post(userRolePermissionController.addUserPermission)

module.exports = _;
