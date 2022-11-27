// import express and initialize app
const express = require("express");
const app = express();

// import path to grab build folder
const path = require("path");

// import bodyparser middleware
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// define react app as static folder
const reactBuild = path.join(__dirname, "client", "build");
app.use(express.static(reactBuild));

// import jwt middleware
const authMiddleware = require("./middlewares/jwtMiddleware");

// GET / - should serve up the index.html file
app.get("/", (req, res) => {
    res.sendFile(path.join(reactBuild, "index.html"));
});

// import routers
const userRouter = require("./routes/userRouter");
const blogRouter = require("./routes/blogRouter");
// use routers
app.use("/api/v1/users", userRouter);
app.use("/api/v1/blogs", blogRouter);

//health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "✅" });
});

//buggy route to test the 500 route error handler
app.get("/api/bugsalot", (req, res) => {
  throw new Error("Buggy route");  
});

// protected route
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({ message: "You are authorized" });
});

//handle errors
app.use((err, req, res, next) => {
  res.status(500).json({ error: "Something broke!", stack: err.stack});
});

//create 404 route
app.use((req, res) => {
  res.status(404).json({ error: "404 unknown route", path: req.path });
});

module.exports = app;