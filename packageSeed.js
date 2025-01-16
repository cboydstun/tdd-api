const mongoose = require("mongoose");
const fs = require("fs").promises;
const path = require("path");
const connectDB = require("./db/config");
const Package = require("./models/packageSchema");

async function seedDatabase() {
    try {
        // Connect to the database
        await connectDB();

        // Read the seed data
        const seedFilePath = path.join(process.cwd(), "product-packages-seed.json");
        const seedData = JSON.parse(await fs.readFile(seedFilePath, "utf-8"));

        // Clear existing data
        await Package.deleteMany({});
        console.log("Cleared existing packages");

        // Insert packages one at a time
        console.log("Starting to insert packages...");
        let successCount = 0;
        for (const [index, package] of seedData.packages.entries()) {
            try {
                const newPackage = new Package(package);
                const validationError = newPackage.validateSync();
                if (validationError) {
                    console.error("Validation failed:", validationError);
                    throw validationError;
                }
                // Add timeout to save operation
                const savePromise = newPackage.save();
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(
                        () => reject(new Error("Save operation timed out after 10 seconds")),
                        10000,
                    ),
                );
                await Promise.race([savePromise, timeoutPromise]);
                successCount++;
            } catch (error) {
                console.error(`Error inserting package ${index}:`, error.message);
                if (error.name === "ValidationError" && error.errors) {
                    Object.keys(error.errors).forEach((key) => {
                        console.error(`Field "${key}":`, error.errors[key].message);
                    });
                }
                throw error;
            }
        }
        console.log(`Successfully seeded ${successCount} packages`);

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
