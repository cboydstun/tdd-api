import { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Blog, BlogFormData } from "../../types/blog";
import { modules, formats } from "./QuillConfig";

interface BlogFormProps {
  onSubmit: (data: BlogFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Blog;
}

export default function BlogForm({
  onSubmit,
  onCancel,
  initialData,
}: BlogFormProps) {
  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    introduction: "",
    body: "",
    conclusion: "",
    excerpt: "",
    categories: "",
    tags: "",
    status: "draft",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        introduction: initialData.introduction,
        body: initialData.body,
        conclusion: initialData.conclusion,
        excerpt: initialData.excerpt || "",
        categories: initialData.categories?.join(", ") || "",
        tags: initialData.tags?.join(", ") || "",
        status: initialData.status,
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-purple focus:ring-primary-purple sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Introduction
        </label>
        <div className="prose max-w-full">
          <ReactQuill
            theme="snow"
            value={formData.introduction}
            onChange={(content) =>
              setFormData({ ...formData, introduction: content })
            }
            modules={modules}
            formats={formats}
            className="bg-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Body
        </label>
        <div className="prose max-w-full">
          <ReactQuill
            theme="snow"
            value={formData.body}
            onChange={(content) => setFormData({ ...formData, body: content })}
            modules={modules}
            formats={formats}
            className="bg-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Conclusion
        </label>
        <div className="prose max-w-full">
          <ReactQuill
            theme="snow"
            value={formData.conclusion}
            onChange={(content) =>
              setFormData({ ...formData, conclusion: content })
            }
            modules={modules}
            formats={formats}
            className="bg-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Excerpt
        </label>
        <textarea
          value={formData.excerpt}
          onChange={(e) =>
            setFormData({ ...formData, excerpt: e.target.value })
          }
          rows={2}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-purple focus:ring-primary-purple sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Categories (comma-separated)
        </label>
        <input
          type="text"
          value={formData.categories}
          onChange={(e) =>
            setFormData({ ...formData, categories: e.target.value })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-purple focus:ring-primary-purple sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-purple focus:ring-primary-purple sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          value={formData.status}
          onChange={(e) =>
            setFormData({
              ...formData,
              status: e.target.value as "draft" | "published",
            })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-purple focus:ring-primary-purple sm:text-sm"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-purple hover:bg-primary-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple"
        >
          {initialData ? "Update" : "Create"} Post
        </button>
      </div>
    </form>
  );
}
