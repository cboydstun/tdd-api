const app = require("./app");
const mongoose = require("mongoose");
require("dotenv").config();

const PORT = process.env.PORT || 8080;
const mongoDB = process.env.ATLAS_URI;

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

//handle mongo error and success in a single if/else statement
if (db) {
  console.log("Connected to MongoDB");
} else {
  console.log("Error connecting to MongoDB");
}

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});