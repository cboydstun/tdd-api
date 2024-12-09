import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getApiUrl } from "../utils/env";
import { Product, Specification } from "../types/product";

const ProductCarousel = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const API_URL = getApiUrl();

  // Number of items to show per page based on screen size
  const getItemsPerPage = () => {
    if (window.innerWidth >= 1024) return 3; // lg
    if (window.innerWidth >= 768) return 2; // md
    return 1; // mobile
  };

  const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage());

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(getItemsPerPage());
      setCurrentPage(0); // Reset to first page on resize
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/v1/products`);
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();

        const filteredAndSortedProducts = [...data]
          .filter((product: Product) =>
            product.specifications.some(
              (spec: Specification) =>
                spec.name === "Type" && spec.value === "DRY"
            )
          )
          .sort((a: Product, b: Product) => b.price.base - a.price.base);

        setProducts(filteredAndSortedProducts);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [API_URL]);

  if (loading)
    return (
      <div className="text-center text-primary-blue font-semibold">
        Loading products...
      </div>
    );
  if (error)
    return (
      <div className="text-red-500 text-center font-semibold">{error}</div>
    );
  if (!products.length)
    return (
      <div className="text-center text-primary-blue font-semibold">
        No products available
      </div>
    );

  const pageCount = Math.ceil(products.length / itemsPerPage);
  const visibleProducts = products.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  return (
    <div className="w-full bg-[#663399] py-12 rounded-b-xl">
    <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-white">
          Featured Products
        </h2>

        <div className="relative">
          {/* Navigation Buttons */}
          {pageCount > 1 && (
            <>
              <button
                onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
                className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 text-primary-blue p-2 rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous products"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(pageCount - 1, prev + 1))
                }
                disabled={currentPage === pageCount - 1}
                className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 text-primary-blue p-2 rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next products"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-100 overflow-hidden">
                  <img
                    src={product.images[0]?.url}
                    alt={product.images[0]?.alt || product.name}
                    className="w-full h-full object-cover"
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
                    >
                      More Info
                    </Link>
                    <Link
                      to="/contact"
                      className="flex-1 bg-gradient-to-r from-blue-400 to-purple-600 text-white text-center py-3 px-4 rounded-lg font-semibold hover:from-blue-500 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      Contact Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Page Dots */}
          {pageCount > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {[...Array(pageCount)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentPage
                      ? "bg-primary-blue w-4"
                      : "bg-gray-300"
                  }`}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCarousel;
