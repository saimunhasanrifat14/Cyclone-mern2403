const { apiResponse } = require("../utils/apiResponse");
const { asynchandeler } = require("../utils/asynchandeler");
const { customError } = require("../utils/customError");
const orderModel = require("../models/order.model");
// sucess
exports.successPayment = asynchandeler(async (req, res) => {
  console.log(req.body);
  const { tran_id, status } = req.body;

  await orderModel.findOneAndUpdate(
    {
      transactionId: tran_id,
    },
    {
      paymentStatus: status == "VALID" && "success",
      transactionId: tran_id,
      paymentGatewayData: req.body,
    }
  );
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
  apiResponse.sendSucess(res, 200, "ipn notification", req.body);
});
