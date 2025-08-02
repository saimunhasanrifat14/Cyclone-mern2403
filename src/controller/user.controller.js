const User = require("../models/user.model");
const { apiResponse } = require("../utils/apiResponse");
const { customError } = require("../utils/customError");
const { asynchandeler } = require("../utils/asynchandeler");
const { valdateUser } = require("../validation/user.validation");
const { emailSend } = require("../helper/helper");
const {
  RegistrationTemplate,
  resetPasswordEmailTemplate,
} = require("../template/Templete");

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
exports.emailVerification = asynchandeler(async (req, res) => {
  const { otp, email } = req.body;
  if (!otp && !email) {
    throw new customError("401", "Otp or mail Not found");
  }
  const findUser = await User.findOne({
    $and: [
      { email: email },
      { resetPasswordOtp: otp },
      { resetPasswordExpireTime: { $gt: Date.now() } },
    ],
  });

  if (!findUser) {
    throw new customError(401, "Otp Or Time expire try again !!");
  }
  findUser.resetPasswordExpireTime = null;
  findUser.resetPasswordOtp = null;
  findUser.isEmailVerified = true;
  apiResponse.sendSucess(res, 200, "Email Verification Sucessfully ", {
    email: findUser.email,
    firstName: findUser.firstName,
  });
});

// forgot password
exports.forgotPassword = asynchandeler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new customError(401, "Email Missing");
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new customError("401", "User Not found!!");
  }

  // opt generate
  const otp = crypto.randomInt(100000, 999999);
  const expireTime = Date.now() + 10 * 60 * 60 * 1000;
  const verifyLink = `http://forn.com/resetpassword/${email}`;
  const template = resetPasswordEmailTemplate(
    user.firstName,
    verifyLink,
    otp,
    expireTime
  );
  await emailSend(email, template);
  apiResponse.sendSucess(res, 301, "Check Your Email", null);
});

// reset password
exports.resetPassword = asynchandeler(async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;
  if (!email) {
    throw new Error(401, "email Missing");
  }
  if (!newPassword) {
    throw new Error(401, "NewPassword Missing");
  }
  if (!confirmPassword) {
    throw new Error(401, "confirmPassword Missing");
  }
  if (newPassword !== confirmPassword) {
    throw new Error(401, "password and confrim password not match!!");
  }

  // find the user
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error(401, "user Not Found!!");
  }

  user.password = newPassword;
  user.resetPasswordExpireTime = null;
  user.resetPasswordOtp = null;
  await user.save();
  apiResponse.sendSucess(res, 200, "Password Reset Succesfullly", user);
});
