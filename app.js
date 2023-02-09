// import express and initialize app
const express = require("express");
const app = express();

// import and use CORS to allow cross-origin requests
const cors = require("cors");
app.use(cors(
  {origin: "http://localhost:3000", credentials: true, optionsSuccessStatus: 200, methods: "GET,HEAD,PUT,PATCH,POST,DELETE", preflightContinue: false},
  {origin: "http://localhost:3001", credentials: true, optionsSuccessStatus: 200, methods: "GET,HEAD,PUT,PATCH,POST,DELETE", preflightContinue: false},
  {origin: "http://34.235.15.185:8080/", credentials: true, optionsSuccessStatus: 200, methods: "GET,HEAD,PUT,PATCH,POST,DELETE", preflightContinue: false},
  {origin: "https://www.codingcurricula.com/", credentials: true, optionsSuccessStatus: 200, methods: "GET,HEAD,PUT,PATCH,POST,DELETE", preflightContinue: false},
  {origin: "https://www.codingcurricula.com", credentials: true, optionsSuccessStatus: 200, methods: "GET,HEAD,PUT,PATCH,POST,DELETE", preflightContinue: false},
  {origin: "https://codingcurricula.com/", credentials: true, optionsSuccessStatus: 200, methods: "GET,HEAD,PUT,PATCH,POST,DELETE", preflightContinue: false},
  {origin: "https://bounce-v1.vercel.app", credentials: true, optionsSuccessStatus: 200, methods: "GET,HEAD,PUT,PATCH,POST,DELETE", preflightContinue: false},
  {origin: "https://bounce-v1.vercel.app/", credentials: true, optionsSuccessStatus: 200, methods: "GET,HEAD,PUT,PATCH,POST,DELETE", preflightContinue: false},
));

const corsOptions = function(req, res, next){ 
  res.header('Access-Control-Allow-Origin', '*'); 
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 
  'Content-Type, Authorization, Content-Length, X-Requested-With');
   next();
}

app.use(corsOptions);

// import bodyparser middleware
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// import path to grab build folder
const path = require("path");

// define react app as static folder
const reactBuild = path.join(__dirname, "client", "build");
app.use(express.static(reactBuild));

// import jwt middleware
const authMiddleware = require("./middlewares/jwtMiddleware");

// GET / - should serve up the index.html file
app.get("/", (req, res) => {
    res.sendFile(path.join(reactBuild, "index.html"));
});

// import routes
const router = require("./routes/index");
// use routes
app.use("/api/v1", router);

//health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "✅" });
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