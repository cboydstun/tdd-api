const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/jwtMiddleware');

const blogController = require('../controllers/blogController');

// define routes
router.get('/', blogController.getAllBlogs); // PUBLIC
router.get('/:slug', blogController.getBlogBySlug); // PUBLIC
router.post('/', authMiddleware, blogController.createBlog);
router.put('/:slug', authMiddleware, blogController.updateBlog);
router.delete('/:slug', authMiddleware, blogController.deleteBlog);

// export router
module.exports = router;