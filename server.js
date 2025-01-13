const app = require("./app");
const connectDB = require("./db/config");
const cloudinary = require("cloudinary").v2;

const PORT = process.env.PORT || 8080;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.VITE_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.VITE_CLOUDINARY_API_KEY,
  api_secret: process.env.VITE_CLOUDINARY_API_SECRET,
});

// Connect to MongoDB
connectDB();

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
