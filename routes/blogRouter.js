const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/jwtMiddleware');

const blogController = require('../controllers/blogController');

// define routes
router.get('/', blogController.getAllBlogs); // PUBLIC
router.get('/:id', blogController.getBlogById); // PUBLIC
router.post('/', authMiddleware, blogController.createBlog);
router.put('/:id', authMiddleware, blogController.updateBlog);
router.delete('/:id', authMiddleware, blogController.deleteBlog);

// export router
module.exports = router;