const User = require("../models/user.model");
const { apiResponse } = require("../utils/apiResponse");
const { customError } = require("../utils/customError");
const { asynchandeler } = require("../utils/asynchandeler");
const { valdateUser } = require("../validation/user.validation");
const { emailSend } = require("../helper/helper");
const { RegistrationTemplate } = require("../template/Templete");
const userModel = require("../models/user.model");
const crypto = require("crypto");
const { log } = require("console");

// registration user
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

  const randomNumber = crypto.randomInt(100000, 999999);
  const expireTime = Date.now() + 10 * 60 * 60 * 1000;
  const verifyLink = `http://forn.com/verify-email/${email}`;
  const template = RegistrationTemplate(
    firstName,
    verifyLink,
    randomNumber,
    expireTime
  );
  await emailSend(email, template);
  user.resetPasswordOtp = randomNumber;
  user.resetPasswordExpireTime = expireTime;
  await user.save();
  apiResponse.sendSucess(res, 201, "Registration Sucessfull Check Your email", {
    firstName,
    email,
  });
});

// login
exports.login = asynchandeler(async (req, res) => {
  const value = await valdateUser(req);
  const { email, phoneNumber, password } = value;
  const user = await userModel.findOne({
    $or: [{ email: email }, { phoneNumber: phoneNumber }],
  });
  const passwordIsCorrect = await user.compareHashPassword(password);
  if (!passwordIsCorrect) {
    throw new customError(400, "Your Password or Email incorrect");
  }
  // make a access and refreshToken
  const accessToken = await user.generateAccesToken();
  const refreshToken = await user.generateRefreshToken();

  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProduction ? true : false, // http / https
    sameSite: "none",
    path: "/",
    maxAge: 15 * 24 * 60 * 60 * 1000, // 7 days
  });

  apiResponse.sendSucess(res, 200, "Login Succesfull", {
    accessToken: accessToken,
    userName: user.firstName,
    email: user.email,
  });
});

// email verification
