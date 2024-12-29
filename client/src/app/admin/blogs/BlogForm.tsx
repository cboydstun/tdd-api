'use client';

import { useState, FormEvent } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface BlogFormData {
  title: string;
  content: string;
  slug: string;
  status: 'draft' | 'published';
}

interface BlogFormProps {
  initialData?: BlogFormData;
  onSubmit: (data: BlogFormData) => Promise<void>;
  isEdit?: boolean;
}

export default function BlogForm({ initialData, onSubmit, isEdit = false }: BlogFormProps) {
  const [formData, setFormData] = useState<BlogFormData>(
    initialData || {
      title: '',
      content: '',
      slug: '',
      status: 'draft',
    }
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while saving');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
          Title
        </label>
        <div className="mt-2">
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="slug" className="block text-sm font-medium leading-6 text-gray-900">
          Slug
        </label>
        <div className="mt-2">
          <input
            type="text"
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium leading-6 text-gray-900">
          Content
        </label>
        <div className="mt-2">
          <textarea
            id="content"
            rows={10}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium leading-6 text-gray-900">
          Status
        </label>
        <div className="mt-2">
          <select
            id="status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-x-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {isLoading ? (
            <LoadingSpinner className="w-5 h-5" />
          ) : (
            isEdit ? 'Update Blog Post' : 'Create Blog Post'
          )}
        </button>
      </div>
    </form>
  );
}
