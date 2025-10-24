require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { customError } = require("../utils/customError");
const { Schema, Types } = mongoose;

const userSchema = new Schema({
  firstName: {
    type: String,
    trim: true,
    required: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  companyName: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
  },
  password: {
    type: String,
    trim: true,
    required: true,
  },
  image: {},
  adress: {
    type: String,
    trim: true,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  isPhoneVerified: {
    type: Boolean,
    default: false,
  },
  role: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },
  ],
  permissions: [
    {
      permissionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Permisson",
      },
      actions: [
        {
          type: String,
          enum: ["view", "add", "edit", "delete"],
        },
      ],
    },
  ],
  region: {
    type: String,
    trim: true,
  },
  district: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    trim: true,
  },
  thana: {
    type: String,
    trim: true,
  },
  zipCode: {
    type: Number,
  },
  country: {
    type: String,
    trim: true,
    default: "Bangladesh",
  },
  dateOfBirth: {
    type: Date,
  },
  gender: {
    type: String,
    enum: ["male", "female", "custom"],
  },
  lastLogin: {
    type: Date,
  },
  lastLogout: {
    type: Date,
  },
  cart: [
    {
      type: Types.ObjectId,
      ref: "Product",
    },
  ],
  wishList: [
    {
      type: Types.ObjectId,
      ref: "Product",
    },
  ],
  newsLetterSubscribe: Boolean,
  resetPasswordOtp: Number,
  resetPasswordExpireTime: Date,
  twoFactorEnabled: Boolean,
  isBlocked: Boolean,
  createdBy: {
    type: Types.ObjectId,
    ref: "User",
  },
  refreshToken: {
    type: String,
    trim: true,
  },
  isActive: Boolean,
});

// schema middleware
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// check already exist this email or not
userSchema.pre("save", async function (next) {
  const findUser = await this.constructor.findOne({ email: this.email });
  if (findUser && findUser._id.toString() !== this._id.toString()) {
    throw new customError(400, "User already Exist try anther email !");
  }
  next();
});

// generate accesToken method
userSchema.methods.generateAccesToken = async function () {
  return await jwt.sign(
    {
      userId: this._id,
      email: this.email,
      role: this.role,
    },
    process.env.ACCESTOKEN_SECRET,
    { expiresIn: process.env.ACCESTOKEN_EXPIRE }
  );
};

// compare hash password
userSchema.methods.compareHashPassword = async function (humanPass) {
  return await bcrypt.compare(humanPass, this.password);
};
// generate RefreshToken method

userSchema.methods.generateRefreshToken = async function () {
  return await jwt.sign(
    {
      userId: this._id,
    },
    process.env.REFRESHTOKEN_SECRET,
    { expiresIn: process.env.REFRESHTOKEN_EXPIRE }
  );
};

// verify AccesToken Token
userSchema.methods.verifyAccesToken = function (token) {
  return jwt.verify(token, process.env.ACCESTOKEN_SECRET);
};

// verify RefreshToken Token
userSchema.methods.verifyRefreshToken = function (token) {
  return jwt.verify(token, process.env.REFRESHTOKEN_SECRET);
};

module.exports = mongoose.model("User", userSchema);
