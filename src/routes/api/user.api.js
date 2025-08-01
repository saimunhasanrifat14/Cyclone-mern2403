const express = require("express");
const _ = express.Router();
const authController = require("../../controller/user.controller");
_.route("/registration").post(authController.registration);
_.route("/login").post(authController.login);
module.exports = _;
