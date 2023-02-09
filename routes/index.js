const express = require('express');
const router = express.Router();

//import routers
const blogRouter = require('./blogRouter');
const emailRouter = require('./emailRouter');
const userRouter = require('./userRouter');
const leadRouter = require('./leadRouter');

//define routes
router.use('/blogs', blogRouter);
router.use('/emails', emailRouter);
router.use('/users', userRouter);
router.use('/leads', leadRouter);

//export router
module.exports = router;