require("dotenv").config();
const { dbName } = require("../constants/constant");
const mongoose = require("mongoose");
const roleModel = require("../models/role.model");
const permissionModel = require("../models/permission.model");

const DBconnection = async () => {
  try {
    const db = await mongoose.connect(`${process.env.MONGODB_URL}/${dbName}`);
    console.log("Database Connection sucessfully For Role Seeder ");
    await seedPermission();
  } catch (error) {
    console.log("Database Connection refused ", error);
  }
};

// seed all permission resource

const seedPermission = async () => {
  try {
    // remove old permission
    await roleModel.deleteMany();
    const allpermisson = await permissionModel.find();
    const roleModelData = [
      {
        name: "admin",
      },
      {
        name: "manager",
      },
      {
        name: "salesman",
      },
      {
        name: "user",
      },
    ];

    const allPermisson = await roleModel.insertMany(roleModelData);
    console.log("role seed sucessfully", allPermisson);
  } catch (error) {
    console.log("error", error);
  }
};

DBconnection();
