// blogController.js
const Blog = require('../models/blogSchema');
const slugify = require('slugify');
const sanitizeHtml = require('sanitize-html');
const path = require('path');
const fs = require('fs');

// GET /blogs - should return all blogs
const getAllBlogs = async (req, res) => {
    try {
        let query = {};
        if (!req.user) {
            query.status = 'published';
        }
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
        const blog = await Blog.findOne({ slug: req.params.slug })
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
        console.log('Received blog data:', req.body);

        // Parse the JSON string from blogData
        const blogData = JSON.parse(req.body.blogData);

        const {
            title,
            introduction,
            body,
            conclusion,
            excerpt,
            featuredImage,
            categories,
            tags,
            status,
            publishDate,
            comments,
            meta,
            seo,
            readTime,
            isFeature
        } = blogData;

        if (!title || !introduction || !body || !conclusion) {
            return res.status(400).json({ error: "Title, introduction, body, and conclusion are required" });
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

        const newBlog = new Blog({
            title: sanitizeHtml(title),
            slug,
            introduction: sanitizedIntroduction,
            body: sanitizedBody,
            conclusion: sanitizedConclusion,
            author: req.user._id,
            excerpt: truncatedExcerpt,
            featuredImage,
            categories: categories?.map(cat => sanitizeHtml(cat)) || [],
            tags: tags?.map(tag => sanitizeHtml(tag)) || [],
            status,
            publishDate: status === 'published' ? new Date() : null,
            comments: comments ? comments.map(comment => ({
                ...comment,
                content: sanitizeHtml(comment.content)
            })) : [],
            meta,
            seo: seo ? {
                metaTitle: sanitizeHtml(seo.metaTitle),
                metaDescription: sanitizeHtml(seo.metaDescription),
                focusKeyword: sanitizeHtml(seo.focusKeyword)
            } : {},
            readTime,
            isFeature,
            publishDate,
            images: req.files ? req.files.map(file => ({
                filename: file.filename,
                path: file.path,
                mimetype: file.mimetype,
                size: file.size
            })) : []
        });

        const savedBlog = await newBlog.save();
        console.log('Saved blog:', savedBlog);
        res.status(201).json(savedBlog);
    } catch (err) {
        console.error('Error creating blog:', err);
        res.status(500).json({ error: 'An error occurred while creating the blog', details: err.message });
    }
};

// PUT /blogs/:slug - should update a single blog by slug
const updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findOne({ slug: req.params.slug });

        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        let updates = JSON.parse(req.body.blogData);
        console.log('Received update data:', updates);

        // Handle image deletions
        const imagesToDelete = JSON.parse(req.body.imagesToDelete || '[]');
        console.log('Images to delete:', imagesToDelete);

        for (const imageName of imagesToDelete) {
            const imagePath = path.join(__dirname, '..', 'uploads', imageName);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
                console.log(`Deleted image file: ${imagePath}`);
            }
            blog.images = blog.images.filter(img => img.filename !== imageName);
        }

        // Handle new image uploads
        console.log('Files received:', req.files);
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => ({
                filename: file.filename,
                path: file.path,
                mimetype: file.mimetype,
                size: file.size
            }));
            console.log('New images to add:', newImages);
            blog.images = [...blog.images, ...newImages];
        }

        // Update other fields
        Object.keys(updates).forEach(key => {
            if (key !== 'images') {
                blog[key] = updates[key];
            }
        });

        const updatedBlog = await blog.save();

        console.log('Updated blog:', updatedBlog);
        res.status(200).json(updatedBlog);
    } catch (err) {
        console.error('Error updating blog:', err);
        res.status(500).json({ error: 'An error occurred while updating the blog', details: err.message });
    }
};

// DELETE /blogs/:slug - should delete a single blog
const deleteBlog = async (req, res) => {
    try {
        console.log('Attempting to delete blog with slug:', req.params.slug);

        const blog = await Blog.findOneAndDelete({ slug: req.params.slug });

        if (!blog) {
            console.log('Blog not found for deletion');
            return res.status(404).json({ error: 'Blog not found' });
        }

        console.log('Blog successfully deleted:', blog);
        res.status(200).json({ message: 'Blog successfully deleted', deletedBlog: blog });
    } catch (err) {
        console.error('Error in deleteBlog:', err);
        res.status(500).json({ error: 'An error occurred while deleting the blog', details: err.message });
    }
};

// DELETE - /:slug/images/:imageName - should delete a single image from a blog
const removeImage = async (req, res) => {
    try {
        const { slug, imageName } = req.params;

        console.log(`Attempting to remove image ${imageName} from blog with slug ${slug}`);

        const blog = await Blog.findOne({ slug });
        if (!blog) {
            console.log(`Blog with slug ${slug} not found`);
            return res.status(404).json({ error: 'Blog not found' });
        }

        const imageIndex = blog.images.findIndex(img => img.filename === imageName);
        if (imageIndex === -1) {
            console.log(`Image ${imageName} not found in blog`);
            return res.status(404).json({ error: 'Image not found in blog' });
        }

        // Remove image from filesystem
        const imagePath = path.join(__dirname, '..', 'uploads', imageName);
        console.log(`Attempting to delete file at path: ${imagePath}`);

        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
            console.log(`File successfully deleted from filesystem`);
        } else {
            console.log(`File not found in filesystem, proceeding with database update`);
        }

        // Remove image from blog document
        blog.images.splice(imageIndex, 1);
        await blog.save();
        console.log(`Image removed from blog document`);

        res.status(200).json({ message: 'Image removed successfully' });
    } catch (err) {
        console.error('Error removing image:', err);
        res.status(500).json({ error: 'An error occurred while removing the image', details: err.message });
    }
};

module.exports = { getAllBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog, removeImage };