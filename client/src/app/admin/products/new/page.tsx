'use client';

import { useRouter } from 'next/navigation';
import ProductForm from '../ProductForm';

interface ProductFormData {
  name: string;
  price: number;
  description: string;
  category: string;
  status: 'active' | 'inactive';
  imageUrl?: string;
}

export default function NewProductPage() {
  const router = useRouter();

  const handleSubmit = async (data: ProductFormData) => {
    // TODO: Implement actual API call to create product
    console.log('Creating product:', data);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Redirect back to products list
    router.push('/admin/products');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Add New Product
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Create a new product by filling out the form below.
        </p>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
        <div className="px-4 py-6 sm:p-8">
          <ProductForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}
