// routes/blogRouter.js
const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const authMiddleware = require('../middlewares/jwtMiddleware');
const blogController = require('../controllers/blogController');

// define routes
router.get('/', blogController.getAllBlogs); // PUBLIC
router.get('/:slug', blogController.getBlogBySlug); // PUBLIC
router.post('/', authMiddleware, upload.array('images'), blogController.createBlog);
router.put('/:slug', authMiddleware, upload.array('images'), blogController.updateBlog);
router.delete('/:slug', authMiddleware, blogController.deleteBlog);
router.delete('/:slug/images/:imageName', authMiddleware, blogController.removeImage);

// export router
module.exports = router;