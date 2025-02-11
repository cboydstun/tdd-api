// routes/productRouter.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/jwtMiddleware");
const productController = require("../controllers/productController");

// define routes
router.get("/", productController.getAllProducts); // PUBLIC
router.get("/:slug", productController.getProductBySlug); // PUBLIC
router.post(
  "/",
  authMiddleware,
  productController.createProduct,
);
router.put(
  "/:slug",
  authMiddleware,
  productController.updateProduct,
);
router.delete("/:slug", authMiddleware, productController.deleteProduct);
router.delete(
  "/:slug/images/:imageName",
  authMiddleware,
  productController.removeImage,
);

// export router
module.exports = router;
