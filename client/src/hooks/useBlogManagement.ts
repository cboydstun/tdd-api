import { useState, useCallback } from 'react';
import axios from 'axios';
import { Blog, BlogFormData } from '../types/blog';

export const useBlogManagement = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBlogs = useCallback(async () => {
        try {
            const response = await axios.get("/api/v1/blogs");
            setBlogs(response.data);
            setLoading(false);
            setError(null);
        } catch (err) {
            setError("Failed to fetch blogs");
            setLoading(false);
        }
    }, []);

    const createBlog = useCallback(async (blogData: BlogFormData) => {
        try {
            const formattedData = {
                ...blogData,
                categories: blogData.categories
                    ? blogData.categories.split(",").map((c) => c.trim())
                    : [],
                tags: blogData.tags
                    ? blogData.tags.split(",").map((t) => t.trim())
                    : [],
            };
            await axios.post("/api/v1/blogs", formattedData);
            await fetchBlogs();
            return true;
        } catch (err) {
            setError("Failed to create blog");
            return false;
        }
    }, [fetchBlogs]);

    const updateBlog = useCallback(async (slug: string, blogData: BlogFormData) => {
        try {
            const formattedData = {
                ...blogData,
                categories: blogData.categories
                    ? blogData.categories.split(",").map((c) => c.trim())
                    : [],
                tags: blogData.tags
                    ? blogData.tags.split(",").map((t) => t.trim())
                    : [],
            };
            await axios.put(`/api/v1/blogs/${slug}`, formattedData);
            await fetchBlogs();
            return true;
        } catch (err) {
            setError("Failed to update blog");
            return false;
        }
    }, [fetchBlogs]);

    const deleteBlog = useCallback(async (slug: string) => {
        try {
            await axios.delete(`/api/v1/blogs/${slug}`);
            await fetchBlogs();
            return true;
        } catch (err) {
            setError("Failed to delete blog");
            return false;
        }
    }, [fetchBlogs]);

    return {
        blogs,
        loading,
        error,
        fetchBlogs,
        createBlog,
        updateBlog,
        deleteBlog,
    };
};
