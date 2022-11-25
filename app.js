const express = require("express");
const app = express();

app.get("/", (req, res) => {
  //send a string as a response that says "Hello World!" in the body of the response
  res.json({ message: "Hello World!" });
});



module.exports = app;