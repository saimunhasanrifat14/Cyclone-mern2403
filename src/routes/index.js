const express = require("express");
const _ = express.Router();

_.use("/testapi", require("./api/test.api"));

module.exports = _;
