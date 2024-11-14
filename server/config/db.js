const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("connection to database successful :)");
  } catch (error) {
    console.log("failed to connect to database :/");
    console.error(error.message);
  }
};

module.exports = connectDB;
