import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import ContactForm from "../ContactForm";

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
          throw new Error("Product not found");
        }
        const data = await response.json();
        setProduct(data);
        if (data.images && data.images.length > 0) {
          setSelectedImage(data.images[0].url);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Loading Product... | SATX Bounce House Rentals</title>
          <meta name="description" content="Loading product details..." />
        </Helmet>
        <div className="min-h-screen flex justify-center items-center">
          <p className="text-primary-blue font-semibold text-lg">
            Loading product details...
          </p>
        </div>
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Helmet>
          <title>Product Not Found | SATX Bounce House Rentals</title>
          <meta
            name="description"
            content="The requested product could not be found."
          />
        </Helmet>
        <div className="min-h-screen flex justify-center items-center">
          <p className="text-red-500 font-semibold text-lg">
            {error || "Product not found"}
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${product.name} | SATX Bounce House Rentals`}</title>
        <meta name="description" content={product.description} />

        {/* Open Graph tags */}
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={product.description} />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={window.location.href} />
        {product.images[0]?.url && (
          <meta property="og:image" content={product.images[0].url} />
        )}

        {/* Product-specific meta tags */}
        <meta
          property="product:price:amount"
          content={product.price.base.toString()}
        />
        <meta
          property="product:price:currency"
          content={product.price.currency}
        />
        <meta property="product:availability" content={product.availability} />

        {/* Additional meta tags */}
        <meta
          name="keywords"
          content={`bounce house rental, ${product.name}, party rental, San Antonio, ${product.capacity} people, ages ${product.ageRange.min}-${product.ageRange.max}`}
        />
      </Helmet>

      <div className="w-full bg-secondary-blue/5 py-12">
        <div className="container mx-auto px-4">
          {/* Product Details Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Image Gallery */}
              <div className="space-y-6">
                <div className="rounded-xl overflow-hidden shadow-lg">
                  <img
                    src={selectedImage || product.images[0]?.url}
                    alt={product.name}
                    className="w-full h-[400px] object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                {product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-4">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(image.url)}
                        className={`rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 ${
                          selectedImage === image.url
                            ? "ring-2 ring-primary-blue"
                            : "ring-2 ring-transparent"
                        }`}
                      >
                        <img
                          src={image.url}
                          alt={`${product.name} view ${index + 1}`}
                          className="w-full h-24 object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="space-y-8">
                <div>
                  <h1 className="text-4xl font-bold text-primary-purple mb-4">
                    {product.name}
                  </h1>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text mb-6">
                    {product.price.currency} {product.price.base.toFixed(2)}
                  </p>
                  <div className="prose max-w-none text-gray-600 text-lg">
                    <p>{product.description}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-primary-blue">
                    Specifications
                  </h2>
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-secondary-blue/5 p-4 rounded-lg">
                      <dt className="font-semibold text-primary-blue mb-1">
                        Dimensions
                      </dt>
                      <dd className="text-gray-600">
                        {product.dimensions.length} x {product.dimensions.width}{" "}
                        x {product.dimensions.height} {product.dimensions.unit}
                      </dd>
                    </div>
                    <div className="bg-secondary-blue/5 p-4 rounded-lg">
                      <dt className="font-semibold text-primary-blue mb-1">
                        Capacity
                      </dt>
                      <dd className="text-gray-600">
                        {product.capacity} people
                      </dd>
                    </div>
                    <div className="bg-secondary-blue/5 p-4 rounded-lg">
                      <dt className="font-semibold text-primary-blue mb-1">
                        Age Range
                      </dt>
                      <dd className="text-gray-600">
                        {product.ageRange.min} - {product.ageRange.max} years
                      </dd>
                    </div>
                    <div className="bg-secondary-blue/5 p-4 rounded-lg">
                      <dt className="font-semibold text-primary-blue mb-1">
                        Availability
                      </dt>
                      <dd className="text-gray-600 capitalize">
                        {product.availability}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-center text-primary-purple mb-8">
                Book {product.name}
              </h2>
              <ContactForm initialBouncerId={product._id} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
