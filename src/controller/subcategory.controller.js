const { apiResponse } = require("../utils/apiResponse");
const { asynchandeler } = require("../utils/asynchandeler");
const { customError } = require("../utils/customError");
const subCategoryModel = require("../models/subcategory.model");
const categoryModel = require("../models/category.model");
const { validateSubCategory } = require("../validation/subcategory.validation");

// create subcategory
exports.createSubCategory = asynchandeler(async (req, res) => {
  const value = await validateSubCategory(req);

  const sc = await subCategoryModel.create(value);
  await categoryModel.findOneAndUpdate(
    { _id: value.category },
    { $push: { subCategory: sc._id } },
    { new: true }
  );
  if (!sc) throw new customError(500, "category Created failed");
  //  now push the sc id inot category subcategory field

  apiResponse.sendSucess(res, 201, "subcategory created succesfull ", sc);
});

// create subcategory
exports.allSubCategory = asynchandeler(async (_, res) => {
  const sc = await subCategoryModel.find({});
  if (!sc) throw new customError(401, "category not Found !!");
  apiResponse.sendSucess(res, 200, "subcategory retirive succesfull ", sc);
});

// create subcategory
exports.singleSubCategory = asynchandeler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) throw new customError(401, "slug not found !!");
  const sc = await subCategoryModel.findOne({ slug }).populate({
    path: "category",
    select: "-subCategory",
  });
  if (!sc) throw new customError(401, "singleSubCategory not Found !!");
  apiResponse.sendSucess(
    res,
    200,
    "singleSubCategory retirive succesfull ",
    sc
  );
});

// update subCategory
exports.updateSubCategory = asynchandeler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) throw new customError(401, "slug not found !!");
  const sc = await subCategoryModel.findOne({ slug });
  if (!sc) throw new customError(401, "singleSubCategory not Found !!");
  if (req.body.category) {
    await categoryModel.findOneAndUpdate(
      { _id: sc.category },
      { $pull: { subCategory: sc._id } },
      { new: true }
    );

    // update sc into ne category
    await categoryModel.findOneAndUpdate(
      { _id: req.body.category },
      { $push: { subCategory: sc._id } },
      { new: true }
    );
  }
  sc.name = req.body.name || sc.name;
  sc.category = req.body.category || sc.category;
  await sc.save();
  apiResponse.sendSucess(res, 200, "update retirive succesfull ", sc);
});

// delete subCategory
exports.deleteSubCategory = asynchandeler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) throw new customError(401, "slug not found !!");
  const sc = await subCategoryModel.findOne({ slug });
  if (!sc) throw new customError(401, "singleSubCategory not Found !!");

  // update sc into ne category
  await categoryModel.findOneAndUpdate(
    { _id: sc.category },
    { $pull: { subCategory: sc._id } },
    { new: true }
  );

  // delete sc
  await subCategoryModel.deleteOne({ _id: sc._id });

  apiResponse.sendSucess(res, 200, "delete  succesfull ", sc);
});
