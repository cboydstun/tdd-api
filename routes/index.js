const express = require('express');
const router = express.Router();
const { enhancedLoggingMiddleware } = require('../middlewares/security');

//import routers
const blogRouter = require('./blogRouter');
const emailRouter = require('./emailRouter');
const userRouter = require('./userRouter');
const leadRouter = require('./leadRouter');
const contactRouter = require('./contactRouter');
const productRouter = require('./productRouter');

// Use the enhancedRequestLogging middleware for all routes
router.use(enhancedLoggingMiddleware);

// API versioning
const apiV1Router = express.Router();

//define routes
apiV1Router.use('/users', userRouter);
apiV1Router.use('/blogs', blogRouter);
apiV1Router.use('/emails', emailRouter);
apiV1Router.use('/leads', leadRouter);
apiV1Router.use('/contacts', contactRouter);
apiV1Router.use('/products', productRouter);

// Mount API v1 routes
router.use('/api/v1', apiV1Router);

//export router
module.exports = router;
