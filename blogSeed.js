const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');
const connectDB = require('./db/config');
const Blog = require('./models/blogSchema'); // Import the Blog model

async function seedDatabase() {
  try {
    // Connect to the database
    await connectDB();

    // Read the seed data
    const seedFilePath = path.join(process.cwd(), 'blog-post-seed.json');
    const seedData = JSON.parse(
      await fs.readFile(seedFilePath, 'utf-8')
    );

    // Clear existing data
    await Blog.deleteMany({});
    console.log('Cleared existing blog posts');

    // Insert new data
    const result = await Blog.insertMany(seedData.blogPosts);
    console.log(`Successfully seeded ${result.length} blog posts`);

    // Close the database connection
    await mongoose.connection.close();
    console.log('Database connection closed');

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedDatabase();
