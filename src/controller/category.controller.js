const { apiResponse } = require("../utils/apiResponse");
const { asynchandeler } = require("../utils/asynchandeler");
const { customError } = require("../utils/customError");
const { validateCategory } = require("../validation/category.validation");
const categoryModel = require("../models/category.model");
const {
  uploadCloudinaryFile,
  deleteCloudinaryFile,
} = require("../helper/cloudinary");
const { isReadable } = require("nodemailer/lib/xoauth2");
exports.createCategory = asynchandeler(async (req, res) => {
  const value = await validateCategory(req);
  const imageFile = await uploadCloudinaryFile(value?.image?.path);
  // save the category into db
  const category = await categoryModel.create({
    name: value.name,
    image: imageFile,
  });

  if (!category) throw new customError(501, "category created Failed !!");
  apiResponse.sendSucess(res, 201, "c created sucessfully", category);
});

// get all category
exports.getAllCategory = asynchandeler(async (req, res) => {
  const alllcategory = await categoryModel.aggregate([
    {
      $lookup: {
        from: "subcategories",
        localField: "subCategory",
        foreignField: "_id",
        as: "subCategory",
      },
    },
    {
      $project: {
        name: 1,
        image: 1,
        isActive: 1,
        createdAt: 1,
        slug: 1,
        subCategory: 1,
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);
  if (!alllcategory)
    throw new customError(501, "alllcategory created Failed !!");
  apiResponse.sendSucess(res, 201, "c created sucessfully", alllcategory);
});

// single category
exports.singleCategory = asynchandeler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) throw new customError(401, "slug not found !!");
  const category = await categoryModel
    .findOne({ slug })
    .populate("subCategory")
    .select("-updatedAt -subCategory");

  if (!category) throw new customError(501, "category created Failed !!");
  apiResponse.sendSucess(res, 201, "category retrive sucessfully", category);
});

// update category

exports.updateCategory = asynchandeler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) throw new customError(401, "slug not found !!");
  const category = await categoryModel.findOne({ slug });
  if (!category) throw new customError(501, "category created Failed !!");
  if (req.body.name) {
    category.name = req.body.name;
  }
  if (req?.files.image?.length) {
    // delete
    const deleted = await deleteCloudinaryFile(category.image.publicIP);
    if (!deleted) throw new customError(401, "image delete failed !!");
    const image = await uploadCloudinaryFile(req?.files.image[0].path);
    category.image = image;
  }

  await category.save();
  apiResponse.sendSucess(res, 200, "category update sucessfull", category);
});

// delete category
exports.deleteCategory = asynchandeler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) throw new customError(401, "slug not found !!");
  const category = await categoryModel.findOneAndDelete({ slug });
  if (!category) throw new customError(501, "category created Failed !!");
  await deleteCloudinaryFile(category.image.publicIP);
  apiResponse.sendSucess(res, 200, "category delete sucessfull", category);
});
