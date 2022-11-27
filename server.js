const app = require("./app");
const db = require("./db/config");

const PORT = process.env.PORT || 8080;

//handle mongo error and success in a single if/else statement
if (db) {
  console.log("Connected to MongoDB");
} else {
  console.log("Error connecting to MongoDB");
}

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});