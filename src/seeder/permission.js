require("dotenv").config();
const { dbName } = require("../constants/constant");
const mongoose = require("mongoose");
const permissionModel = require("../models/permission.model");
const chalk = require("chalk");

const DBconnection = async () => {
  try {
    const db = await mongoose.connect(`${process.env.MONGODB_URL}/${dbName}`);
    console.log("Database Connection sucessfully ");
    await seedPermission();
  } catch (error) {
    console.log("Database Connection refused ", error);
  }
};

// seed all permission resource

const seedPermission = async () => {
  try {
    // remove old permission
    await permissionModel.deleteMany();
    const permissonData = [
      {
        name: "category",
      },
      {
        name: "subcategory",
      },
      {
        name: "brand",
      },
      {
        name: "coupon",
      },
      {
        name: "deliverycharge",
      },
      {
        name: "discount",
      },
      {
        name: "invoice",
      },
      {
        name: "order",
      },
      {
        name: "permission",
      },
      {
        name: "product",
      },
      {
        name: "role",
      },
      {
        name: "variant",
      },
      {
        name: "user",
      },
    ];

    const allPermisson = await permissionModel.insertMany(permissonData);
    console.log("permission seed sucessfully", allPermisson);
  } catch (error) {
    console.log("error", error);
  }
};

DBconnection();
