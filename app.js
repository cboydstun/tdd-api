// import express and initialize app
const express = require("express");
const app = express();

// import and use morgan to log requests
const morganMiddleware = require("./middlewares/morganMiddleware");
const logger = require("./utils/logger");
app.use(morganMiddleware);



// import and use CORS to allow cross-origin requests
const cors = require("cors");

// cors options
const corsOptions = {
  origin: "https://www.satxbounce.com",
  optionsSuccessStatus: 200,
  methods: "GET,POST",
  preflightContinue: false,
  credentials: true,
  allowedHeaders: "Content-Type, Authorization, X-Requested-With",
  exposedHeaders: "Content-Range, X-Content-Range",
  
};

app.use(cors(corsOptions));

// import and use helmet to secure headers
const helmet = require("helmet");
app.use(helmet());

// too busy
const tooBusy = require("toobusy-js");
app.use((req, res, next) => {
  if (tooBusy()) {
    res.status(503).send("Server is too busy right now, try again later.");
  } else {
    next();
  }
});

// express-rate-limit
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use(limiter);

// xss-clean
const xss = require("xss-clean");
app.use(xss());

// hsts
const hsts = require("hsts");
app.use(hsts({ maxAge: 15552000 }));

// compression
const compression = require("compression");
app.use(compression());

// import bodyparser middleware
const bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: "50kb" }));
app.use(bodyParser.urlencoded({ extended: true }));

// import jwt middleware
const authMiddleware = require("./middlewares/jwtMiddleware");

// import routes
const router = require("./routes/index");

// use routes
app.use("/api/v1", router);

//health check route
app.get("/api/health", (req, res) => {
  logger.info("Health check...");
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