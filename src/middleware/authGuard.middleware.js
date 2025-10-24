const { customError } = require("../utils/customError");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
require("../models/permission.model");
exports.authGuard = async (req, _, next) => {
  const token =
    req.headers?.authorization?.replace("Bearer ", "") || req.body.token;
  const refreshToken = req?.headers?.cookie?.replace("refreshToken=", "");
  if (token) {
    const decodedToken = jwt.verify(token, process.env.ACCESTOKEN_SECRET);

    if (!decodedToken) {
      throw new customError(401, "token invalid");
    }

    const findUser = await User.findOne({ _id: decodedToken.userId })
      .populate("permissions.permissionId")
      .populate("role")
      .select(
        "-password -isEmailVerified -isPhoneVerified -resetPasswordExpireTime -resetPasswordOtp -twoFactorEnabled -isBlocked  -cart -wishList -refreshToken"
      );

    if (!findUser) {
      throw new customError(401, "User Not Found!!");
    }
    req.user = findUser;
    next();
  } else {
    throw new customError(401, "Token Not Found");
  }
};
