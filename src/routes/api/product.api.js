const express = require("express");
const _ = express.Router();
// const { authGuard } = require("../../middleware/authGuard.middleware");
const { upload } = require("../../middleware/multer.middleware");
const productController = require("../../controller/product.controller");

_.route("/create-product").post(
  upload.fields([{ name: "image", maxCount: 10 }]),
  productController.createProduct
);
_.route("/get-products").get(productController.getAllProducts);
_.route("/single-products/:slug").get(productController.getSingleProduct);
_.route("/update-productinfo/:slug").put(
  productController.updateProductinfoBySlug
);
_.route("/update-productimage/:slug").put(
  upload.fields([{ name: "image", maxCount: 10 }]),
  productController.updateProductImagesBySlug
);

_.route("/filter-products").get(productController.filterProducts);
_.route("/filter-pricerange").get(productController.filterProductsByPriceRange);
_.route("/product-pagination").get(productController.productPagination);

module.exports = _;
