'use client';

import { useEffect, useState } from 'react';
import { Product } from '../../types/product';
import { API_BASE_URL, API_ROUTES } from '../../config/constants';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ProductFilters } from '../../components/ProductFilters';

function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <a
          key={product._id}
          href={`/products/${product.slug}`}
          aria-label={`View details for ${product.name} - $${product.price.base.toFixed(2)}`}
          className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] border-2 border-transparent hover:border-secondary-blue/20"
        >
          <div className="aspect-w-16 aspect-h-16 relative overflow-hidden">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0].url}
                alt={product.images[0].alt || product.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
            ) : (
              <div className="w-full h-full bg-secondary-blue/10 flex items-center justify-center text-primary-blue font-medium">
                No Image
              </div>
            )}
          </div>
          <div className="p-6">
            <h2 className="text-xl font-bold text-primary-blue mb-2">
              {product.name}
            </h2>
            {product.dimensions && (
              <p className="text-gray-600 mb-4">
                {product.dimensions.length} W x {product.dimensions.width} L x{' '}
                {product.dimensions.height} H {product.dimensions.unit}
              </p>
            )}
            <p className="text-gray-600 mb-4 line-clamp-2">
              {product.description}
            </p>
            <p className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
              ${product.price.base.toFixed(2)}
            </p>
          </div>
        </a>
      ))}
    </div>
  );
}

async function getProducts() {
  const res = await fetch(`${API_BASE_URL}${API_ROUTES.PRODUCTS}`, {
    next: { revalidate: 3600 } // Revalidate every hour
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }
  
  return res.json();
}

export function ProductsContent() {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [initialProducts, setInitialProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products on mount
  useEffect(() => {
    async function fetchProducts() {
      try {
        const products = await getProducts();
        setInitialProducts(products);
        setFilteredProducts(products);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="w-full bg-secondary-blue/5 py-12">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="flex flex-col gap-6 mb-12">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <h1 className="text-3xl font-bold text-primary-blue">Our Products</h1>
          </div>
          <ProductFilters 
            products={initialProducts} 
            onFilteredProducts={setFilteredProducts} 
          />
        </div>

        {/* Products Grid */}
        <ProductGrid products={filteredProducts} />
      </div>
    </div>
  );
}
