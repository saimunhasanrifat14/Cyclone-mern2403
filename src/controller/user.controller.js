const User = require("../models/user.model");
const { apiResponse } = require("../utils/apiResponse");
const { customError } = require("../utils/customError");
const { asynchandeler } = require("../utils/asynchandeler");
const { valdateUser } = require("../validation/user.validation");

exports.registration = asynchandeler(async (req, res) => {
  const value = await valdateUser(req);
  const { firstName, email, password } = value;
  //save the user info into database
  const user = await new User({
    firstName,
    email,
    password,
  }).save();

  if (!user) {
    throw new customError(500, "Registration Failed Try agian !!");
  }
  apiResponse.sendSucess(res, 201, "Registration Sucessfull", user);
});
