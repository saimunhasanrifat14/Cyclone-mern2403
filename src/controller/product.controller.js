const { apiResponse } = require("../utils/apiResponse");
const { asynchandeler } = require("../utils/asynchandeler");
const { customError } = require("../utils/customError");
const productModel = require("../models/product.model");
const { validateProduct } = require("../validation/product.validation");
const {
  uploadCloudinaryFile,
  deleteCloudinaryFile,
} = require("../helper/cloudinary");
const {
  generateProductQRCode,
  generateBarCode,
} = require("../helper/codeGenerator");

// Controller to create a new product
exports.createProduct = asynchandeler(async (req, res) => {
  // Step 1: Validate product data and images
  const data = await validateProduct(req);
  let imagesArray = [];
  for (let image of data?.images) {
    const imageAsset = await uploadCloudinaryFile(image.path);
    imagesArray.push(imageAsset);
  }
  //   now save the data into database
  const product = await productModel.create({
    ...data,
    image: imagesArray || [],
  });
  if (!product) {
    throw new customError(400, "Product not created");
  }

  //   generate QrCode for the product
  const link = `${process.env.FRONTEND_URL}/product/${product.slug}`;
  const barCodeText = `${product.sku}-${product.name.slice(0, 3)}-${new Date()
    .toString()
    .slice(0, 4)}`;
  const qrcode = await generateProductQRCode(link);
  const barcode = await generateBarCode(barCodeText);
  product.qrCode = qrcode;
  product.barCode = barcode;
  await product.save();
  apiResponse.sendSucess(res, 201, "Product created successfully", product);
});

// get all products
exports.getAllProducts = asynchandeler(async (req, res) => {
  const { sort } = req.query;
  let sortQuery = {};
  if (sort == "date-descending") {
    sortQuery = { createdAt: -1 };
  } else if (sort == "date-ascending") {
    sortQuery = { createdAt: 1 };
  } else if (sort == "price-ascending") {
    sortQuery = { retailPrice: 1 };
  } else if (sort == "alpha-ascending") {
    sortQuery = { name: 1 };
  } else {
    sortQuery = { createdAt: -1 };
  }

  const products = await productModel
    .find()
    .sort(sortQuery)
    .populate({
      path: "category",
    })
    .populate({
      path: "brand",
    })
    .populate({
      path: "subCategory",
    })
    .populate({
      path: "variant",
    });

  apiResponse.sendSucess(res, 200, "Products fetched successfully", products);
});

// get single product by slug
exports.getSingleProduct = asynchandeler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) throw new customError(400, "Product slug is required");
  const product = await productModel
    .findOne({ slug })
    .populate({
      path: "category",
    })
    .populate({
      path: "brand",
    })
    .populate({
      path: "subCategory",
    });
  if (!product) throw new customError(404, "Product not found");
  apiResponse.sendSucess(res, 200, "Product fetched successfully", product);
});

// update productinfo by slug
exports.updateProductinfoBySlug = asynchandeler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) throw new customError(400, "Product slug is required");
  const product = await productModel.findOneAndUpdate({ slug }, req.body, {
    new: true,
  });

  if (!product) throw new customError(404, "Product not found");
  apiResponse.sendSucess(res, 200, "Product updated successfully", product);
});

// upadate product images by slug
exports.updateProductImagesBySlug = asynchandeler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) throw new customError(400, "Product slug is required");
  const product = await productModel.findOne({ slug });
  if (!product) throw new customError(404, "Product not found");
  if (req.body.imageurl) {
    // delete images from cloudinary
    for (let imgId of req.body.imageurl) {
      await deleteCloudinaryFile(imgId);
      product.image = product.image.filter((img) => img.publicIP !== imgId);
    }
  }

  const imageUrlArray = [];
  for (let file of req.files.image) {
    const imageAsset = await uploadCloudinaryFile(file.path);
    imageUrlArray.push(imageAsset);
  }
  if (imageUrlArray.length) {
    product.image.push(...imageUrlArray);
    await product.save();
  }

  if (!product) throw new customError(404, "Product not found");
  apiResponse.sendSucess(res, 200, "Product image successfully", product);
});
// filter products by category, brand
exports.filterProducts = asynchandeler(async (req, res) => {
  const { category, brand, subCategory, minPrice, maxPrice, tag } = req.query;
  let filterQuery = {};
  if (category) {
    filterQuery = { ...filterQuery, category: category };
  }
  if (brand) {
    if (Array.isArray(brand)) {
      filterQuery = { ...filterQuery, brand: { $in: brand } };
    } else {
      filterQuery = { ...filterQuery, brand: brand };
    }
  }

  if (tag) {
    if (Array.isArray(tag)) {
      filterQuery = { ...filterQuery, tag: { $in: tag } };
    } else {
      filterQuery = { ...filterQuery, tag: tag };
    }
  }
  if (subCategory) {
    filterQuery = { ...filterQuery, subCategory: subCategory };
  } else {
    filterQuery = {};
  }
  const products = await productModel.find({
    $or: [
      { ...filterQuery },
      { retailPrice: { $gte: Number(minPrice), $lte: Number(maxPrice) } },
    ],
  });

  if (!products) throw new customError(404, "Products not found");
  apiResponse.sendSucess(res, 200, "Products fetched successfully", products);
});

// filter products by price range
// /api/v1/products/filter-pricerange?min=100&max=500
exports.filterProductsByPriceRange = asynchandeler(async (req, res) => {
  const { minPrice, maxPrice } = req.query;
  if (!minPrice || !maxPrice) {
    throw new customError(400, "Min and Max price are required");
  }

  const products = await productModel.find({
    retailPrice: { $gte: Number(minPrice), $lte: Number(maxPrice) },
  });
  if (!products) throw new customError(404, "Products not found");
  apiResponse.sendSucess(res, 200, "Products fetched successfully", products);
});

// product pagination
exports.productPagination = asynchandeler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  const products = await productModel.find().skip(skip).limit(10);
  const totalPage = (await productModel.countDocuments()) / limit;
  if (!products) throw new customError(404, "Products not found");
  apiResponse.sendSucess(res, 200, "Products fetched successfully", {
    page: Number(page),
    limit: Number(limit),
    products,
    totalPage,
  });
});

// searh product by name or sku
// /api/v1/products/search?query=iphone
exports.searchProducts = asynchandeler(async (req, res) => {
  const { name, sku } = req.query;
  if (!name || !sku) throw new customError(401, "name and sku missing !!");
  const products = await productModel.find({
    name: { $regex: name, $options: "i" },
    sku: { $regex: sku, $options: "i" },
  });
  if (!products) throw new customError(404, "Products not found");
  apiResponse.sendSucess(res, 200, "Products fetched successfully", products);
});
