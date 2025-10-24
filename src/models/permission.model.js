const mongoose = require("mongoose");
const { Schema, Types } = mongoose;
const { customError } = require("../utils/customError");
const PermissionSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      trim: true,
    },
    description: String,
  },
  {
    timestamps: true,
  }
);

// Check if variant with the same slug already exists
PermissionSchema.pre("save", async function (next) {
  const findPermissons = await this.constructor.findOne({ name: this.name });
  if (findPermissons && findPermissons._id.toString() !== this._id.toString()) {
    throw new customError(
      401,
      "findPermissons name already exists. Please choose another name."
    );
  }
  next();
});

module.exports =
  mongoose.models.Permisson || mongoose.model("Permisson", PermissionSchema);
