
const Blog = require('../models/blogSchema');

// GET /blogs - should return all blogs
const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({});
        res.status(200).json(blogs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /blogs/:id - should return a single blog
const getBlogById = async (req, res) => {

    try {
        const blog = await Blog.findById(req.params.id);
        //return status 200 and the blog
        res.status(200).json(blog);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST /blogs - should create a new blog
const createBlog = async (req, res) => {
    try {
        //must have a title, author, and content
        if (!req.body.title || !req.body.author || !req.body.content) {
            res.status(400).json({ error: "Please provide a title, author, and content" });
        } else {
            const blog = await Blog.create(req.body);
            res.json(blog);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// PUT /blogs/:id - should update a single blog
const updateBlog = async (req, res) => {
    try {
        //find by id
        const blog = await Blog.findById(req.params.id);
        //update the blog
        blog.title = req.body.title;
        blog.author = req.body.author;
        blog.content = req.body.content;
        //save the blog
        await blog.save();
        res.status(200).json(blog);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE /blogs/:id - should delete a single blog
const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        res.status(200).json(blog);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getAllBlogs, getBlogById, createBlog, updateBlog, deleteBlog };