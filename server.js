const app = require("./app");
const connectDB = require("./db/config");

const PORT = process.env.PORT || 8080;

// Connect to MongoDB
connectDB();

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});