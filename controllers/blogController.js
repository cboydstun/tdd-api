const Blog = require('../models/blogSchema');
const slugify = require('slugify');
const sanitizeHtml = require('sanitize-html');

// GET /blogs - should return all blogs
const getAllBlogs = async (req, res) => {
    try {
        let query = {};
        // If the request is not authenticated, only return published blogs
        if (!req.user) {
            query.status = 'published';
        }
        const blogs = await Blog.find(query)
            .sort({ createdAt: -1 }) // Sort by creation date
            .select('title slug content excerpt featuredImage categories tags publishDate readTime status seo'); // Added 'seo' here
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
        const {
            title,
            content,
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

        console.log('Received blog data:', req.body);

        if (!title || !content) {
            return res.status(400).json({ error: "Title and content are required" });
        }

        // Sanitize the content, allowing for images and videos
        const sanitizedContent = sanitizeHtml(content, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'video', 'iframe']),
            allowedAttributes: {
                ...sanitizeHtml.defaults.allowedAttributes,
                'img': ['src', 'alt', 'width', 'height'],
                'video': ['src', 'controls', 'width', 'height'],
                'iframe': ['src', 'width', 'height', 'frameborder', 'allowfullscreen']
            },
            allowedIframeHostnames: ['www.youtube.com', 'player.vimeo.com']
        });

        // Generate slug (unchanged)
        let slug = slugify(title, { lower: true, strict: true });
        let slugExists = await Blog.findOne({ slug });
        let counter = 1;
        while (slugExists) {
            slug = slugify(`${title}-${counter}`, { lower: true, strict: true });
            slugExists = await Blog.findOne({ slug });
            counter++;
        }

        // Truncate and sanitize excerpt (unchanged)
        const truncatedExcerpt = excerpt
            ? sanitizeHtml(excerpt.substring(0, 197)) + '...'
            : sanitizeHtml(sanitizedContent.substring(0, 197)) + '...';

        // Create new blog object
        const newBlog = new Blog({
            title: sanitizeHtml(title),
            slug,
            content: sanitizedContent,
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
            publishDate
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

        const updates = req.body;
        console.log('Received update data:', updates);

        // Sanitize and process updates
        if (updates.title) {
            updates.title = sanitizeHtml(updates.title);
            updates.slug = slugify(updates.title, { lower: true, strict: true });
        }
        if (updates.content) {
            // First, sanitize the content
            updates.content = sanitizeHtml(updates.content, {
                allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
                allowedAttributes: {
                    ...sanitizeHtml.defaults.allowedAttributes,
                    img: ['src', 'alt']
                }
            });

            // Then, process any empty img tags
            updates.content = updates.content.replace(/<img>/g, '<img src="/api/placeholder/400/300" alt="Placeholder image" />');
        }
        if (updates.categories) {
            updates.categories = Array.isArray(updates.categories)
                ? updates.categories.map(cat => sanitizeHtml(cat.trim()))
                : updates.categories.split(',').map(cat => sanitizeHtml(cat.trim()));
        }
        if (updates.tags) {
            updates.tags = Array.isArray(updates.tags)
                ? updates.tags.map(tag => sanitizeHtml(tag.trim()))
                : updates.tags.split(',').map(tag => sanitizeHtml(tag.trim()));
        }
        if (updates.seo) {
            updates.seo = {
                metaTitle: sanitizeHtml(updates.seo.metaTitle),
                metaDescription: sanitizeHtml(updates.seo.metaDescription),
                focusKeyword: sanitizeHtml(updates.seo.focusKeyword)
            };
        }

        console.log('Sanitized update data:', updates);

        const updatedBlog = await Blog.findOneAndUpdate(
            { slug: req.params.slug },
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!updatedBlog) {
            return res.status(404).json({ error: 'Blog not found after update' });
        }

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

module.exports = { getAllBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog };