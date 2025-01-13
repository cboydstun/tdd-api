const express = require("express");
const router = express.Router();
const { enhancedLoggingMiddleware } = require("../middlewares/security");

//import routers
const blogRouter = require("./blogRouter");
const userRouter = require("./userRouter");
const contactRouter = require("./contactRouter");
const productRouter = require("./productRouter");
const reviewRouter = require("./reviewRouter");

// Use the enhancedRequestLogging middleware for all routes
router.use(enhancedLoggingMiddleware);

// API versioning
const apiV1Router = express.Router();

//define routes
apiV1Router.use("/users", userRouter);
apiV1Router.use("/blogs", blogRouter);
apiV1Router.use("/contacts", contactRouter);
apiV1Router.use("/products", productRouter);
apiV1Router.use("/reviews", reviewRouter);

// Mount API v1 routes
router.use("/api/v1", apiV1Router);

//export router
module.exports = router;
