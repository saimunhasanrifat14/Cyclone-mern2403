const mongoose = require("mongoose");
const { Schema, Types } = mongoose;
const slugify = require("slugify");
const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {},
    slug: {
      type: String,

      trim: true,
      unique: true,
    },
    subCategory: [
      {
        type: Types.ObjectId,
        ref: "SubCategory",
      },
    ],
    discount: {
      type: Types.ObjectId,
      ref: "Discount",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// make a slug
categorySchema.pre("save", async function (next) {
  if (this.isModified("name")) {
    this.slug = await slugify(this.name, {
      replacement: "-",
      lower: false,
      strict: false,
    });
  }
  next();
});

// check already exist this cateogry or not
categorySchema.pre("save", async function (next) {
  const findCategory = await this.constructor.findOne({ slug: this.slug });
  if (
    findCategory &&
    findCategory._id.toString() !== findCategory._id.toString()
  ) {
    throw new customError(400, "findCategory already Exist try anther name !");
  }
  next();
});

module.exports = mongoose.model("Category", categorySchema);
