const { apiResponse } = require("../utils/apiResponse");
const { asynchandeler } = require("../utils/asynchandeler");
const { customError } = require("../utils/customError");

const chalk = require("chalk");
// sucess
exports.successPayment = asynchandeler(async (req, res) => {
  console.log(req.body);
  return res.redirect("https://www.npmjs.com/package/chalk/v/4.1.2");
});

exports.failPayment = asynchandeler(async (req, res) => {
  console.log(req.body);
  return res.redirect("https://www.npmjs.com/package/chalk/v/4.1.2");
});
exports.canclePayment = asynchandeler(async (req, res) => {
  console.log(req.body);
  return res.redirect("https://www.npmjs.com/package/chalk/v/4.1.2");
});
exports.ipnPayment = asynchandeler(async (req, res) => {
  console.log(req.body);
  return res.redirect("https://www.npmjs.com/package/chalk/v/4.1.2");
});
