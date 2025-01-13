const mongoose = require("mongoose");
const fs = require("fs").promises;
const path = require("path");
const connectDB = require("./db/config");
const Product = require("./models/productSchema"); // Import the Product model

async function seedDatabase() {
  try {
    // Connect to the database
    await connectDB();

    // Read the seed data
    const seedFilePath = path.join(process.cwd(), "products-seed.json");
    const seedData = JSON.parse(await fs.readFile(seedFilePath, "utf-8"));

    // Clear existing data
    await Product.deleteMany({});
    console.log("Cleared existing products");

    // Insert new data
    const result = await Product.insertMany(seedData.products);
    console.log(`Successfully seeded ${result.length} products`);

    // Close the database connection
    await mongoose.connection.close();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

// Run the seeding function
seedDatabase();
