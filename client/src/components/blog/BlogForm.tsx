import { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Blog, BlogFormData } from "../../types/blog";
import { modules, formats } from "./QuillConfig";

interface BlogFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Blog;
}

export default function BlogForm({
  onSubmit,
  onCancel,
  initialData,
}: BlogFormProps) {

  const [formData, setFormData] = useState<BlogFormData>(() => {    
    if (initialData) {
      return {
        title: initialData.title || "",
        introduction: initialData.introduction || "",
        body: initialData.body || "",
        conclusion: initialData.conclusion || "",
        excerpt: initialData.excerpt || "",
        categories: initialData.categories?.join(", ") || "",
        tags: initialData.tags?.join(", ") || "",
        status: initialData.status || "draft",
      };
    }

    return {
      title: "",
      introduction: "",
      body: "",
      conclusion: "",
      excerpt: "",
      categories: "",
      tags: "",
      status: "draft",
    };
  });

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<
    Array<{ url: string; filename: string }>
  >([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle image initialization
  useEffect(() => {
    if (initialData?.images) {
      const images = initialData.images.map((img) => ({
        url: img.url,
        filename: img.filename,
      }));
      setExistingImages(images);
    }
  }, [initialData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedImages((prev) => [...prev, ...files]);

    // Create preview URLs
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeSelectedImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));

    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(imagePreviews[index]);
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    const imageToDelete = existingImages[index];
    setImagesToDelete((prev) => [...prev, imageToDelete.filename]);
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();

    // Append text fields
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    // Append new images
    selectedImages.forEach((image) => {
      formDataToSend.append("images", image);
    });

    // Append existing images info
    formDataToSend.append("existingImages", JSON.stringify(existingImages));

    // Append images to delete
    if (imagesToDelete.length > 0) {
      formDataToSend.append("imagesToDelete", JSON.stringify(imagesToDelete));
    }

    await onSubmit(formDataToSend);
  };

  // Rest of the component remains exactly the same...
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
          Images
        </label>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          multiple
          accept="image/*"
          className="mt-1 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-primary-purple file:text-white
            hover:file:bg-primary-blue"
        />
      </div>

      {/* Display existing images */}
      {existingImages.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Existing Images
          </label>
          <div className="grid grid-cols-3 gap-4">
            {existingImages.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image.url}
                  alt={`Existing ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Display new image previews */}
      {imagePreviews.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Images
          </label>
          <div className="grid grid-cols-3 gap-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeSelectedImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

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
