const Blog = require('../models/blogSchema');
const slugify = require('slugify');
const sanitizeHtml = require('sanitize-html');

// GET /blogs - should return all blogs
const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ status: 'published' })
            .sort({ publishDate: -1 })
            .select('title slug excerpt featuredImage categories tags publishDate readTime');
        res.status(200).json(blogs);
    } catch (err) {
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

        // Increment view count
        blog.meta.views += 1;
        await blog.save();

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
        const {
            title,
            content,
            author,
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
        } = req.body;

        // Basic validation
        if (!title || !content || !author) {
            return res.status(400).json({ error: "Title, content, and author are required" });
        }

        // Sanitize the content
        const sanitizedContent = sanitizeHtml(content, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
            allowedAttributes: {
                ...sanitizeHtml.defaults.allowedAttributes,
                'img': ['src', 'alt']
            }
        });

        // Generate slug
        let slug = slugify(title, { lower: true, strict: true });
        let slugExists = await Blog.findOne({ slug });
        let counter = 1;
        while (slugExists) {
            slug = slugify(`${title}-${counter}`, { lower: true, strict: true });
            slugExists = await Blog.findOne({ slug });
            counter++;
        }

        // Truncate and sanitize excerpt
        const truncatedExcerpt = excerpt
            ? sanitizeHtml(excerpt.substring(0, 197)) + '...'
            : sanitizeHtml(sanitizedContent.substring(0, 197)) + '...';

        // Create new blog object
        const newBlog = new Blog({
            title: sanitizeHtml(title),
            slug,
            content: sanitizedContent,
            author,
            excerpt: truncatedExcerpt,
            featuredImage,
            categories: categories.map(cat => sanitizeHtml(cat)),
            tags: tags.map(tag => sanitizeHtml(tag)),
            status,
            publishDate,
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
            isFeature
        });

        if (status === 'published' && !publishDate) {
            newBlog.publishDate = new Date();
        }

        const savedBlog = await newBlog.save();

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

        const updates = req.body;

        // If title is being updated, update the slug as well
        if (updates.title) {
            updates.title = sanitizeHtml(updates.title);
            updates.slug = slugify(updates.title, { lower: true, strict: true });
            // Check if the new slug already exists
            const existingBlog = await Blog.findOne({ slug: updates.slug });
            if (existingBlog && existingBlog._id.toString() !== blog._id.toString()) {
                return res.status(400).json({ error: 'A blog with this title already exists' });
            }
        }

        // If content is being updated, sanitize it and update excerpt and readTime
        if (updates.content) {
            updates.content = sanitizeHtml(updates.content, {
                allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
                allowedAttributes: {
                    ...sanitizeHtml.defaults.allowedAttributes,
                    'img': ['src', 'alt']
                }
            });
            // Truncate the excerpt to 197 characters and add '...'
            updates.excerpt = sanitizeHtml(updates.content.substring(0, 197)) + '...';
            updates.readTime = Math.ceil(updates.content.split(' ').length / 200);
        }

        // Sanitize other fields if they're being updated
        if (updates.categories) {
            updates.categories = updates.categories.map(cat => sanitizeHtml(cat));
        }
        if (updates.tags) {
            updates.tags = updates.tags.map(tag => sanitizeHtml(tag));
        }
        if (updates.seo) {
            updates.seo = {
                metaTitle: sanitizeHtml(updates.seo.metaTitle),
                metaDescription: sanitizeHtml(updates.seo.metaDescription),
                focusKeyword: sanitizeHtml(updates.seo.focusKeyword)
            };
        }
        if (updates.comments) {
            updates.comments = updates.comments.map(comment => ({
                ...comment,
                content: sanitizeHtml(comment.content)
            }));
        }

        // If status is being changed to published, set publishDate
        if (updates.status === 'published' && blog.status !== 'published') {
            updates.publishDate = new Date();
        }

        updates.lastModified = new Date();

        const updatedBlog = await Blog.findOneAndUpdate(
            { slug: req.params.slug },
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!updatedBlog) {
            return res.status(404).json({ error: 'Blog not found after update' });
        }

        res.status(200).json(updatedBlog);
    } catch (err) {
        console.error('Error updating blog:', err);
        if (err.name === 'ValidationError') {
            const validationErrors = Object.values(err.errors).map(error => error.message);
            res.status(400).json({ error: 'Validation error', details: validationErrors });
        } else if (err.code === 11000) {
            res.status(400).json({ error: 'A blog with this title already exists' });
        } else {
            res.status(500).json({ error: 'An error occurred while updating the blog', details: err.message });
        }
    }
};

// DELETE /blogs/:slug - should delete a single blog
const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findOneAndDelete({ slug: req.params.slug });

        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        res.status(200).json({ message: 'Blog successfully deleted' });
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while deleting the blog' });
    }
};

module.exports = { getAllBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog };