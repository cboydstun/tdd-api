import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: string;
  publishDate: string;
  readTime?: string;
}

const BlogList = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("/api/v1/blogs");
        setBlogs(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch blogs");
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div
          data-testid="loading-spinner"
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-blue"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-primary-blue mb-8">Blog Posts</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <Link
            key={blog._id}
            to={`/blogs/${blog.slug}`}
            className="group hover:shadow-lg transition-shadow duration-300 rounded-lg overflow-hidden border border-gray-200"
          >
            {blog.featuredImage && (
              <div className="aspect-video overflow-hidden">
                <img
                  src={blog.featuredImage}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-blue transition-colors">
                {blog.title}
              </h2>
              <p className="text-gray-600 mb-4">{blog.excerpt}</p>
              <div className="flex items-center text-sm text-gray-500">
                <span>{new Date(blog.publishDate).toLocaleDateString()}</span>
                {blog.readTime && (
                  <>
                    <span className="mx-2">•</span>
                    <span>{blog.readTime} min read</span>
                  </>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BlogList;
