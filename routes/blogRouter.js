const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const authMiddleware = require('../middlewares/jwtMiddleware');

const blogController = require('../controllers/blogController');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        // Remove the leading number and hyphen
        const fileName = file.originalname.replace(/^\d+-/, '');
        cb(null, fileName)
    }
});

const upload = multer({ storage: storage });

// define routes
router.get('/', blogController.getAllBlogs); // PUBLIC
router.get('/:slug', blogController.getBlogBySlug); // PUBLIC
router.post('/', authMiddleware, upload.array('images'), blogController.createBlog);
router.put('/:slug', authMiddleware, upload.array('images'), blogController.updateBlog);
router.delete('/:slug', authMiddleware, blogController.deleteBlog);

// export router
module.exports = router;