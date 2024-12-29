'use client';

import { useRouter } from 'next/navigation';
import BlogForm from '../BlogForm';

interface BlogFormData {
  title: string;
  content: string;
  slug: string;
  status: 'draft' | 'published';
}

export default function NewBlogPage() {
  const router = useRouter();

  const handleSubmit = async (data: BlogFormData) => {
    // TODO: Implement actual API call to create blog
    console.log('Creating blog:', data);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Redirect back to blogs list
    router.push('/admin/blogs');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Create New Blog Post
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Create a new blog post by filling out the form below.
        </p>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
        <div className="px-4 py-6 sm:p-8">
          <BlogForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}
