const mongoose = require("mongoose");
require("dotenv").config();

const mongoDB = process.env.ATLAS_URI;

// Set strictQuery option to suppress the warning
mongoose.set('strictQuery', false);

const connectDB = async () => {
  try {
    await mongoose.connect(mongoDB, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5 second timeout
      socketTimeoutMS: 45000, // 45 second timeout,
      connectTimeoutMS: 10000 // 10 second timeout
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
