const mongoose = require("mongoose");
const { Schema } = mongoose;
const deliveryChargeSchema = new Schema({
  name: { type: String, required: [true, "name is required !!"] },
  charge: {
    type: Number,
    required: [true, "delivery charge amount required !"],
  },
  decription: { type: String },
});

deliveryChargeSchema.pre("save", async function (next) {
  const isExist = await this.constructor.findOne({ name: this.name });
  if (isExist && isExist._id.toString() !== this._id.toString()) {
    throw new customError(400, "delivery charge name is already exist !");
  }
  next();
});

module.exports =
  mongoose.models.deliveryCharge ||
  mongoose.model("deliveryCharge", deliveryChargeSchema);
