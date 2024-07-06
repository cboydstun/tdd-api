const express = require('express');
const router = express.Router();

//import routers
const blogRouter = require('./blogRouter');
const emailRouter = require('./emailRouter');
const userRouter = require('./userRouter');
const leadRouter = require('./leadRouter');
const contactRouter = require('./contactRouter');
const rsvpRouter = require('./rsvpRouter');

//define routes
router.use('/blogs', blogRouter);
router.use('/emails', emailRouter);
router.use('/users', userRouter);
router.use('/leads', leadRouter);
router.use('/contacts', contactRouter);
router.use('/rsvp', rsvpRouter);

//export router
module.exports = router;