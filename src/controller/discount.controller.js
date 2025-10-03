const { apiResponse } = require("../utils/apiResponse");
const { asynchandeler } = require("../utils/asynchandeler");
const { customError } = require("../utils/customError");
const discountModel = require("../models/discount.model");
const { validateDiscount } = require("../validation/discount.validation");
const categoryModel = require("../models/category.model");
// const subCategoryModel = require("../models/subCategory.model");
const NodeCache = require("node-cache");
const Cache = new NodeCache();
// Create Discount Controller
exports.createDiscount = asynchandeler(async (req, res) => {
  // Validate Request Body
  const value = await validateDiscount(req);
  //   save the discount to database
  const discount = new discountModel(value);
  await discount.save();
  if (!discount) {
    throw new customError(400, "Failed to create discount");
  }
  // update category id into category collection
  if (value.discountPlan === "category" && value.category) {
    await categoryModel.findByIdAndUpdate(value.category, {
      discount: discount._id,
    });
  }

  //   update sub category id into sub category collection
  if (value.discountPlan === "subCategory" && value.subCategory) {
    await subCategoryModel.findByIdAndUpdate(value.subCategory, {
      discount: discount._id,
    });
  }

  apiResponse.sendSucess(res, 201, discount, "Discount created successfully");
});

// get all discount
exports.getAllDiscount = asynchandeler(async (req, res) => {
  const value = Cache.get("disounts");
  if (value == undefined) {
    const discounts = await discountModel
      .find()
      .sort({ createdAt: -1 })
      .populate({
        path: "category subCategory",
      });
    //   save data into cache
    Cache.set("disounts", JSON.stringify(discounts), 3600);
    if (!discounts) {
      throw new customError(404, "No discounts found");
    }
    apiResponse.sendSucess(
      res,
      200,
      discounts,
      "Discounts fetched successfully"
    );
  }
  apiResponse.sendSucess(
    res,
    200,
    JSON.parse(value),
    "Discounts fetched successfully"
  );
});

// get single category

exports.getSingleDiscount = asynchandeler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) {
    throw new customError(400, "Invalid request");
  }
  const discount = await discountModel
    .findOne({ slug })
    .populate({ path: "category subCategory" });
  if (!discount) {
    throw new customError(404, "No discount found");
  }
  apiResponse.sendSucess(res, 200, discount, "Discount fetched successfully");
});

// update discount

exports.updateDiscount = asynchandeler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) {
    throw new customError(400, "Invalid request");
  }
  const value = await validateDiscount(req);
  const discount = await discountModel.findOne({ slug });
  if (!discount) {
    throw new customError(404, "No discount found");
  }
  //   remove category id
  if (discount.discountPlan === "category" && discount.category) {
    await categoryModel.findByIdAndUpdate(discount.category, {
      discount: null,
    });
  }
  //   remove sub category id
  if (discount.discountPlan === "subCategory" && discount.subCategory) {
    await subCategoryModel.findByIdAndUpdate(discount.subCategory, {
      discount: null,
    });
  }

  //   now update the discount
  if (value.discountPlan === "category" && value.category) {
    await categoryModel.findByIdAndUpdate(value.category, {
      discount: discount._id,
    });
  }
  // update the sub category id into sub category collection
  if (value.discountPlan === "subCategory" && value.subCategory) {
    await subCategoryModel.findByIdAndUpdate(value.subCategory, {
      discount: discount._id,
    });
  }

  //   finally update the disount
  const updateDiscount = await discountModel.findOneAndUpdate(
    { _id: discount._id },
    value,
    { new: true }
  );
  if (!updateDiscount) {
    //   remove category id
    if (discount.discountPlan === "category" && discount.category) {
      await categoryModel.findByIdAndUpdate(discount.category, {
        discount: discount._id,
      });
    }
    //   remove sub category id
    if (discount.discountPlan === "subCategory" && discount.subCategory) {
      await subCategoryModel.findByIdAndUpdate(discount.subCategory, {
        discount: discount._id,
      });
    }
    throw new customError(400, "Failed to update discount");
  }
  apiResponse.sendSucess(
    res,
    200,
    updateDiscount,
    "Discount fetched successfully"
  );
});
