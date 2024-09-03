const mongoose = require("mongoose");
require("dotenv").config();

const mongoDB = process.env.ATLAS_URI;

// Set strictQuery option to suppress the warning
mongoose.set('strictQuery', false);

const connectDB = async () => {
  try {
    await mongoose.connect(mongoDB, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;