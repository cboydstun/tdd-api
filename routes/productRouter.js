// routes/productRouter.js
const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const authMiddleware = require('../middlewares/jwtMiddleware');
const productController = require('../controllers/productController');

// define routes
router.get('/', productController.getAllProducts); // PUBLIC
router.get('/:slug', productController.getProductBySlug); // PUBLIC
router.post('/', authMiddleware, upload.array('images'), productController.createProduct);
router.put('/:slug', authMiddleware, upload.array('images'), productController.updateProduct);
router.delete('/:slug', authMiddleware, productController.deleteProduct);
router.delete('/:slug/images/:imageName', authMiddleware, productController.removeImage);

// export router
module.exports = router;