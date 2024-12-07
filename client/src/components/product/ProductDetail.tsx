import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

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
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  capacity: number;
  ageRange: {
    min: number;
    max: number;
  };
  availability: string;
}

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/v1/products/${slug}`);
        if (!response.ok) {
          throw new Error('Product not found');
        }
        const data = await response.json();
        setProduct(data);
        if (data.images && data.images.length > 0) {
          setSelectedImage(data.images[0].url);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error || !product) {
    return <div className="text-red-500 text-center min-h-screen">{error || 'Product not found'}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="mb-4">
            <img
              src={selectedImage || product.images[0]?.url}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(image.url)}
                  className={`border rounded-lg overflow-hidden ${
                    selectedImage === image.url ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <img
                    src={image.url}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl font-bold text-blue-600 mb-4">
            {product.price.currency} {product.price.base.toFixed(2)}
          </p>
          <div className="prose max-w-none mb-6">
            <p>{product.description}</p>
          </div>
          
          <div className="space-y-4">
            <div className="border-t pt-4">
              <h2 className="text-xl font-semibold mb-2">Specifications</h2>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="font-medium text-gray-600">Dimensions</dt>
                  <dd>
                    {product.dimensions.length} x {product.dimensions.width} x {product.dimensions.height} {product.dimensions.unit}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-600">Capacity</dt>
                  <dd>{product.capacity} people</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-600">Age Range</dt>
                  <dd>{product.ageRange.min} - {product.ageRange.max} years</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-600">Availability</dt>
                  <dd className="capitalize">{product.availability}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
