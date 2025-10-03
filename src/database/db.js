require("dotenv").config();
const { dbName } = require("../constants/constant");
const mongoose = require("mongoose");

exports.DBconnection = async () => {
  try {
    const db = await mongoose.connect(`${process.env.MONGODB_URL}/${dbName}`);
    console.log("Database Connect on hostId", db.connection.host);
  } catch (error) {
    console.log("Database Connection refused ", error);
  }
};
