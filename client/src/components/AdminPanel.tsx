import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useBlogManagement } from "../hooks/useBlogManagement";
import { Blog } from "../types/blog";
import BlogForm from "./blog/BlogForm";
import BlogTable from "./blog/BlogTable";

export default function AdminPanel() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const {
    blogs,
    loading,
    error,
    fetchBlogs,
    createBlog,
    updateBlog,
    deleteBlog,
  } = useBlogManagement();

  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleSubmit = async (formData: any) => {
    const success = editingBlog
      ? await updateBlog(editingBlog.slug, formData)
      : await createBlog(formData);

    if (success) {
      setShowForm(false);
      setEditingBlog(null);
    }
  };

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingBlog(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                Blog Management
              </h1>
              <button
                onClick={() => {
                  setShowForm(true);
                  setEditingBlog(null);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-purple hover:bg-primary-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple"
              >
                Create New Post
              </button>
            </div>

            {error && (
              <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
                {error}
              </div>
            )}

            {showForm ? (
              <BlogForm
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                initialData={editingBlog || undefined}
              />
            ) : (
              <BlogTable
                blogs={blogs}
                onEdit={handleEdit}
                onDelete={deleteBlog}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
