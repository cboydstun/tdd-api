const express = require('express');
const router = express.Router();

// import blog controller
const blogController = require('../controllers/blogController');

// define routes
router.get('/', blogController.getAllBlogs);
router.get('/:id', blogController.getBlogById);
router.post('/', blogController.createBlog);
router.put('/:id', blogController.updateBlog);
router.delete('/:id', blogController.deleteBlog);

// export router
module.exports = router;