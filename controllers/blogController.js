// controllers/blogController.js
const Blog = require('../models/blogSchema');
const slugify = require('slugify');
const sanitizeHtml = require('sanitize-html');
const cloudinary = require('cloudinary').v2;
const fs = require('fs').promises;

// Helper function to upload image to Cloudinary
const uploadToCloudinary = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(file.path, {
            folder: 'blogs',
            resource_type: 'auto'
        });
        // Delete local file after upload
        await fs.unlink(file.path);
        return {
            filename: file.originalname,
            url: result.secure_url,
            public_id: result.public_id,
            mimetype: file.mimetype,
            size: file.size
        };
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw error;
    }
};

// GET /blogs - should return all blogs
const getAllBlogs = async (req, res) => {
    try {
        // Only show published blogs for public access
        const query = { status: 'published' };

        const blogs = await Blog.find(query)
            .sort({ createdAt: -1 })
            .select('title slug introduction body conclusion excerpt featuredImage categories tags publishDate readTime status seo images');
        res.status(200).json(blogs);
    } catch (err) {
        console.error('Error fetching blogs:', err);
        res.status(500).json({ error: 'An error occurred while fetching blogs' });
    }
};

// GET /blogs/:slug - should return a single blog
const getBlogBySlug = async (req, res) => {
    try {
        const query = { slug: req.params.slug };
        if (!req.user) {
            query.status = 'published';
        }

        const blog = await Blog.findOne(query)
            .populate('author', 'email')
            .populate('relatedPosts', 'title slug');

        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        res.status(200).json(blog);
    } catch (err) {
        console.error('Error fetching blog:', err);
        res.status(500).json({
            error: 'An error occurred while fetching the blog',
            details: err.message
        });
    }
};

// POST /blogs - should create a new blog
const createBlog = async (req, res) => {
    try {
        // Parse form fields
        const {
            title,
            introduction,
            body,
            conclusion,
            excerpt,
            categories,
            tags,
            status,
        } = req.body;

        if (!title || !introduction || !body || !conclusion) {
            return res.status(400).json({ error: "Title, introduction, body, and conclusion are required" });
        }

        if (!req.user || !req.user._id) {
            return res.status(401).json({ error: "Authentication required" });
        }

        const sanitizeOptions = {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'video', 'iframe']),
            allowedAttributes: {
                ...sanitizeHtml.defaults.allowedAttributes,
                'img': ['src', 'alt', 'width', 'height'],
                'video': ['src', 'controls', 'width', 'height'],
                'iframe': ['src', 'width', 'height', 'frameborder', 'allowfullscreen']
            },
            allowedIframeHostnames: ['www.youtube.com', 'player.vimeo.com']
        };

        const sanitizedIntroduction = sanitizeHtml(introduction, sanitizeOptions);
        const sanitizedBody = sanitizeHtml(body, sanitizeOptions);
        const sanitizedConclusion = sanitizeHtml(conclusion, sanitizeOptions);

        let slug = slugify(title, { lower: true, strict: true });
        let slugExists = await Blog.findOne({ slug });
        let counter = 1;
        while (slugExists) {
            slug = slugify(`${title}-${counter}`, { lower: true, strict: true });
            slugExists = await Blog.findOne({ slug });
            counter++;
        }

        const truncatedExcerpt = excerpt
            ? sanitizeHtml(excerpt.substring(0, 197)) + '...'
            : sanitizeHtml(sanitizedIntroduction.substring(0, 197)) + '...';

        // Upload images to Cloudinary if present
        let uploadedImages = [];
        if (req.files && req.files.length > 0) {
            uploadedImages = await Promise.all(req.files.map(file => uploadToCloudinary(file)));
        }

        // Parse categories and tags from comma-separated strings
        const categoriesArray = categories ? categories.split(',').map(cat => cat.trim()) : [];
        const tagsArray = tags ? tags.split(',').map(tag => tag.trim()) : [];

        const newBlog = new Blog({
            title: sanitizeHtml(title),
            slug,
            introduction: sanitizedIntroduction,
            body: sanitizedBody,
            conclusion: sanitizedConclusion,
            author: req.user._id,
            excerpt: truncatedExcerpt,
            categories: categoriesArray,
            tags: tagsArray,
            status,
            publishDate: status === 'published' ? new Date() : null,
            images: uploadedImages
        });

        const savedBlog = await newBlog.save();
        res.status(201).json(savedBlog);
    } catch (err) {
        console.error('Error creating blog:', err);
        res.status(500).json({
            error: 'An error occurred while creating the blog',
            details: err.message
        });
    }
};

// PUT /blogs/:slug - should update a single blog by slug
const updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findOne({ slug: req.params.slug });

        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        // Parse form fields
        const {
            title,
            introduction,
            body,
            conclusion,
            excerpt,
            categories,
            tags,
            status,
        } = req.body;

        // Handle image deletions from Cloudinary
        const imagesToDelete = req.body.imagesToDelete ? JSON.parse(req.body.imagesToDelete) : [];

        for (const imageName of imagesToDelete) {
            const imageToDelete = blog.images.find(img =>
                img.filename === imageName || img.public_id === imageName
            );
            if (imageToDelete && imageToDelete.public_id) {
                try {
                    await cloudinary.uploader.destroy(imageToDelete.public_id);
                } catch (err) {
                    console.error(`Failed to delete image from Cloudinary: ${imageToDelete.public_id}`, err);
                }
            }
            blog.images = blog.images.filter(img =>
                img.filename !== imageName && img.public_id !== imageName
            );
        }

        // Handle new image uploads to Cloudinary
        let newImages = [];
        if (req.files && req.files.length > 0) {
            newImages = await Promise.all(req.files.map(file => uploadToCloudinary(file)));
        }

        // Parse categories and tags from comma-separated strings
        const categoriesArray = categories ? categories.split(',').map(cat => cat.trim()) : blog.categories;
        const tagsArray = tags ? tags.split(',').map(tag => tag.trim()) : blog.tags;

        const sanitizeOptions = {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'video', 'iframe']),
            allowedAttributes: {
                ...sanitizeHtml.defaults.allowedAttributes,
                'img': ['src', 'alt', 'width', 'height'],
                'video': ['src', 'controls', 'width', 'height'],
                'iframe': ['src', 'width', 'height', 'frameborder', 'allowfullscreen']
            },
            allowedIframeHostnames: ['www.youtube.com', 'player.vimeo.com']
        };

        // Update blog fields
        if (title) blog.title = sanitizeHtml(title);
        if (introduction) blog.introduction = sanitizeHtml(introduction, sanitizeOptions);
        if (body) blog.body = sanitizeHtml(body, sanitizeOptions);
        if (conclusion) blog.conclusion = sanitizeHtml(conclusion, sanitizeOptions);
        if (excerpt) blog.excerpt = sanitizeHtml(excerpt);
        if (status) blog.status = status;
        if (categoriesArray) blog.categories = categoriesArray;
        if (tagsArray) blog.tags = tagsArray;

        // Add new images
        blog.images = [...blog.images, ...newImages];

        const updatedBlog = await blog.save();
        res.status(200).json(updatedBlog);
    } catch (err) {
        console.error('Error updating blog:', err);
        res.status(500).json({
            error: 'An error occurred while updating the blog',
            details: err.message
        });
    }
};

// DELETE /blogs/:slug - should delete a single blog
const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findOne({ slug: req.params.slug });

        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        // Delete images from Cloudinary
        if (blog.images && blog.images.length > 0) {
            for (const image of blog.images) {
                if (image.public_id) {
                    try {
                        await cloudinary.uploader.destroy(image.public_id);
                    } catch (err) {
                        console.error(`Failed to delete image from Cloudinary: ${image.public_id}`, err);
                    }
                }
            }
        }

        await Blog.deleteOne({ _id: blog._id });

        res.status(200).json({ message: 'Blog successfully deleted', deletedBlog: blog });
    } catch (err) {
        console.error('Error in deleteBlog:', err);
        res.status(500).json({
            error: 'An error occurred while deleting the blog',
            details: err.message
        });
    }
};

// DELETE - /:slug/images/:imageName - should delete a single image from a blog
const removeImage = async (req, res) => {
    try {
        const { slug, imageName } = req.params;

        const blog = await Blog.findOne({ slug });
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        const imageToDelete = blog.images.find(img =>
            img.filename === imageName || img.public_id === imageName
        );

        if (!imageToDelete) {
            return res.status(404).json({ error: 'Image not found in blog' });
        }

        // Delete from Cloudinary if public_id exists
        if (imageToDelete.public_id) {
            try {
                await cloudinary.uploader.destroy(imageToDelete.public_id);
            } catch (err) {
                console.error(`Failed to delete image from Cloudinary: ${imageToDelete.public_id}`, err);
            }
        }

        // Remove image from blog document
        blog.images = blog.images.filter(img =>
            img.filename !== imageName && img.public_id !== imageName
        );
        await blog.save();

        res.status(200).json({ message: 'Image removed successfully' });
    } catch (err) {
        console.error('Error removing image:', err);
        res.status(500).json({
            error: 'An error occurred while removing the image',
            details: err.message
        });
    }
};

module.exports = { getAllBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog, removeImage };
