const express = require('express');
const router = express.Router();

//import routers
const blogRouter = require('./blogRouter');
const emailRouter = require('./emailRouter');
const userRouter = require('./userRouter');
const leadRouter = require('./leadRouter');
const contactRouter = require('./contactRouter');
const productRouter = require('./productRouter');

//define routes
router.use('/users', userRouter);
router.use('/blogs', blogRouter);
router.use('/emails', emailRouter);
router.use('/leads', leadRouter);
router.use('/contacts', contactRouter);
router.use('/products', productRouter);

//export router
module.exports = router;