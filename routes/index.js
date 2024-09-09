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

//define routes
router.use('/users', userRouter);
router.use('/blogs', blogRouter);
router.use('/emails', emailRouter);
router.use('/leads', leadRouter);
router.use('/contacts', contactRouter);
router.use('/products', productRouter);

//export router
module.exports = router;