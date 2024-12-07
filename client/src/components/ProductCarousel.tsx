import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getApiUrl } from "../utils/env";
import type { Product } from '../types/product';

const ProductCarousel = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const API_URL: string = getApiUrl();

  const carouselRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const animationRef = useRef<number>();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/v1/products`);
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

  // Auto-scroll animation
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const scroll = () => {
      if (isDragging.current) {
        // Don't auto-scroll while dragging
        animationRef.current = requestAnimationFrame(scroll);
        return;
      }

      carousel.scrollLeft += 1; // Slow scroll speed

      // Reset scroll position when reaching the end
      if (carousel.scrollLeft >= carousel.scrollWidth / 2) {
        carousel.scrollLeft = 0;
      }

      animationRef.current = requestAnimationFrame(scroll);
    };

    animationRef.current = requestAnimationFrame(scroll);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [products]); // Restart animation when products change

  const handleDragStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    isDragging.current = true;
    const carousel = carouselRef.current;
    if (!carousel) return;

    if ('touches' in e) {
      startX.current = e.touches[0].pageX - carousel.offsetLeft;
    } else {
      startX.current = e.pageX - carousel.offsetLeft;
    }
    scrollLeft.current = carousel.scrollLeft;
    
    carousel.style.cursor = 'grabbing';
    carousel.style.userSelect = 'none';
  };

  const handleDragEnd = () => {
    isDragging.current = false;
    const carousel = carouselRef.current;
    if (!carousel) return;
    
    carousel.style.cursor = 'grab';
    carousel.style.removeProperty('user-select');
  };

  const handleDragMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging.current || !carouselRef.current) return;
    e.preventDefault();

    let x;
    if ('touches' in e) {
      x = e.touches[0].pageX - carouselRef.current.offsetLeft;
    } else {
      x = e.pageX - carouselRef.current.offsetLeft;
    }

    const walk = (x - startX.current) * 2;
    carouselRef.current.scrollLeft = scrollLeft.current - walk;
  };

  if (loading) {
    return <div className="text-center text-primary-blue font-semibold">Loading products...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center font-semibold">Failed to load products</div>;
  }

  if (!products.length) {
    return <div className="text-center text-primary-blue font-semibold">No products available</div>;
  }

  return (
    <div className="w-full overflow-hidden bg-secondary-blue/5 py-12 rounded-xl">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-primary-purple">
          Featured Products
        </h2>
        <div className="relative">
          <div
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto whitespace-nowrap scroll-smooth cursor-grab touch-pan-x"
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {/* Hide scrollbar */}
            <style>
              {`
                .overflow-x-auto::-webkit-scrollbar {
                  display: none;
                }
              `}
            </style>
            {/* Double the products array to create seamless loop */}
            {[...products, ...products].map((product, index) => (
              <div
                key={`${product._id}-${index}`}
                className="inline-block w-72 flex-shrink-0"
              >
                <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={product.images[0]?.url}
                      alt={product.images[0]?.alt || product.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      draggable="false"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-primary-blue truncate mb-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-lg mb-4">
                      ${product.price.base}/{product.rentalDuration}
                    </p>
                    <div className="flex gap-3">
                      <Link
                        to={`/products/${product.slug}`}
                        className="flex-1 bg-primary-blue text-white text-center py-3 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-300 shadow-md hover:shadow-lg"
                        onClick={(e) => e.stopPropagation()} // Prevent drag when clicking
                      >
                        More Info
                      </Link>
                      <Link
                        to="/contact"
                        className="flex-1 bg-gradient-to-r from-blue-400 to-purple-600 text-white text-center py-3 px-4 rounded-lg font-semibold hover:from-blue-500 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
                        onClick={(e) => e.stopPropagation()} // Prevent drag when clicking
                      >
                        Contact Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCarousel;
