const express = require("express");
const app = express();

// "hello world" route
app.get("/", (req, res) => {
    res.json({ message: "Hello World!" });
});

//health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "✅" });
});

//buggy route to test the 500 route error handler
app.get("/api/bugsalot", (req, res) => {
  throw new Error("Buggy route");  
});

//handle errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  //if the error is a 500 error
  res.status(500).json({ error: "Something broke!", stack: err.stack});
});

//create 404 route
app.use((req, res) => {
  res.status(404).json({ error: "404 unknown route", path: req.path });
});

module.exports = app;