import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: {
    base: number;
    currency: string;
  };
  images: {
    url: string;
    filename: string;
  }[];
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/v1/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center min-h-screen">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Link 
            key={product._id} 
            to={`/products/${product.slug}`}
            className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="aspect-w-16 aspect-h-9">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0].url}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  No Image
                </div>
              )}
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              <p className="text-gray-600 mb-2 line-clamp-2">{product.description}</p>
              <p className="text-lg font-bold text-blue-600">
                {product.price.currency} {product.price.base.toFixed(2)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
