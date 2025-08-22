const { apiResponse } = require("../utils/apiResponse");
const { asynchandeler } = require("../utils/asynchandeler");
const { customError } = require("../utils/customError");
const subCategoryModel = require('../models/subcategory.model');
const { validateSubCategory } = require("../validation/subcategory.validation");

// create subcategory
exports.createSubCategory = asynchandeler(async (req, res) => {
 const value =  await validateSubCategory(req);
 const sc =  await subCategoryModel.create(value);
 if(!sc) throw new customError(500 , "category Created failed");
 apiResponse.sendSucess(res,201, "subcategory created succesfull " , sc)

});

// create subcategory
exports.allSubCategory = asynchandeler(async (_, res) => {
 const sc =  await subCategoryModel.find({});
 if(!sc) throw new customError(401 , "category not Found !!");
 apiResponse.sendSucess(res,200, "subcategory retirive succesfull " , sc)
});

// create subcategory
exports.singleSubCategory = asynchandeler(async (req, res) => {
   const { slug } = req.params;
  if (!slug) throw new customError(401, "slug not found !!");
 const sc =  await subCategoryModel.findOne({slug}).populate({
    path:'category',
    select:"-subCategory"
   
 });
 if(!sc) throw new customError(401 , "singleSubCategory not Found !!");
 apiResponse.sendSucess(res,200, "singleSubCategory retirive succesfull " , sc)
});
