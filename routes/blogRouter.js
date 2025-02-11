// routes/blogRouter.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/jwtMiddleware");
const blogController = require("../controllers/blogController");

// define routes
router.get("/", blogController.getAllBlogs);
router.get("/:slug", blogController.getBlogBySlug);
router.post("/", authMiddleware, blogController.createBlog);
router.put("/:slug", authMiddleware, blogController.updateBlog);
router.delete("/:slug", authMiddleware, blogController.deleteBlog);
router.delete(
  "/:slug/images/:imageName",
  authMiddleware,
  blogController.removeImage,
);

// export router
module.exports = router;
