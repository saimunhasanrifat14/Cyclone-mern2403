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
        actions: ["create", "read", "update", "delete"],
      },
      {
        name: "subcategory",
        actions: ["create", "read", "update", "delete"],
      },
      {
        name: "brand",
        actions: ["create", "read", "update", "delete"],
      },
      {
        name: "coupon",
        actions: ["create", "read", "update", "delete"],
      },
      {
        name: "deliverycharge",
        actions: ["create", "read", "update", "delete"],
      },
      {
        name: "discount",
        actions: ["create", "read", "update", "delete"],
      },
      {
        name: "invoice",
        actions: ["create", "read", "update", "delete"],
      },
      {
        name: "order",
        actions: ["create", "read", "update", "delete"],
      },
      {
        name: "permission",
        actions: ["create", "read", "update", "delete"],
      },
      {
        name: "product",
        actions: ["create", "read", "update", "delete"],
      },
      {
        name: "role",
        actions: ["create", "read", "update", "delete"],
      },
      {
        name: "variant",
        actions: ["create", "read", "update", "delete"],
      },
      {
        name: "user",
        actions: ["create", "read", "update", "delete"],
      },
    ];

    const allPermisson = await permissionModel.insertMany(permissonData);
    console.log("permission seed sucessfully", allPermisson);
  } catch (error) {
    console.log("error", error);
  }
};

DBconnection();
