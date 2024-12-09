import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpDown, Filter, X } from "lucide-react";
import { Helmet } from "react-helmet";

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  price: {
    base: number;
    currency: string;
  };
  images: {
    url: string;
    filename: string;
  }[];
  specifications: {
    name: string;
    value: string | string[];
  }[];
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
}

type FilterType = "ALL" | "DRY" | "WET";

const getCurrencySymbol = (currencyCode: string): string => {
  const symbols: { [key: string]: string } = {
    USD: "$",
    EUR: "€",
    GBP: "£",
  };
  return symbols[currencyCode] || currencyCode;
};

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortAscending, setSortAscending] = useState(false);
  const [selectedType, setSelectedType] = useState<FilterType>("DRY");
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [minSize, setMinSize] = useState<number>(0);

  // Create product listing structured data
  const createProductListingSchema = (products: Product[]) => {
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: products.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Product",
          name: product.name,
          description: product.description,
          image: product.images?.[0]?.url,
          offers: {
            "@type": "Offer",
            price: product.price.base,
            priceCurrency: product.price.currency,
            availability: "https://schema.org/InStock",
          },
        },
      })),
    };
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/v1/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = ["ALL", ...new Set(products.map((p) => p.category))];

  const filteredAndSortedProducts = [...products]
    .filter((product) => {
      if (selectedType !== "ALL") {
        const typeSpec = product.specifications?.find(
          (spec) => spec.name === "Type"
        );
        if (!typeSpec) return false;
        const typeValue = typeSpec.value;
        if (Array.isArray(typeValue)) {
          if (selectedType === "DRY") {
            if (!typeValue.includes("DRY") || typeValue.includes("WET"))
              return false;
          } else if (!typeValue.includes(selectedType)) return false;
        } else if (typeValue !== selectedType) return false;
      }

      if (selectedCategory !== "ALL" && product.category !== selectedCategory)
        return false;
      if (
        product.price.base < priceRange.min ||
        product.price.base > priceRange.max
      )
        return false;

      const floorArea = product.dimensions.length * product.dimensions.width;
      if (floorArea < minSize) return false;

      return true;
    })
    .sort((a, b) => {
      const modifier = sortAscending ? 1 : -1;
      return (a.price.base - b.price.base) * modifier;
    });

  const toggleSort = () => setSortAscending(!sortAscending);
  const toggleFilters = () => setShowFilters(!showFilters);

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Loading Products... | SATX Bounce House Rentals</title>
          <meta
            name="description"
            content="Loading our selection of bounce houses and party equipment..."
          />
        </Helmet>
        <div className="min-h-screen flex justify-center items-center">
          <p className="text-primary-blue font-semibold text-lg">
            Loading products...
          </p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Helmet>
          <title>Error | SATX Bounce House Rentals</title>
          <meta
            name="description"
            content="An error occurred while loading our products."
          />
        </Helmet>
        <div className="min-h-screen flex justify-center items-center">
          <p className="text-red-500 font-semibold text-lg">{error}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>
          Bounce Houses & Party Equipment Rentals | SATX Bounce House Rentals
        </title>
        <meta
          name="description"
          content="Browse our selection of bounce houses, water slides, and party equipment for rent in San Antonio. Filter by type, size, and price. Free delivery within Loop 1604!"
        />
        <meta
          name="keywords"
          content="bounce house rental, water slides, party equipment, San Antonio rentals, inflatable rentals, party supplies, event rentals"
        />

        {/* Open Graph tags */}
        <meta
          property="og:title"
          content="Bounce Houses & Party Equipment Rentals | SATX Bounce House Rentals"
        />
        <meta
          property="og:description"
          content="Browse our selection of bounce houses, water slides, and party equipment for rent in San Antonio. Free delivery within Loop 1604!"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        {products[0]?.images?.[0]?.url && (
          <meta property="og:image" content={products[0].images[0].url} />
        )}

        {/* Location specific meta tags */}
        <meta name="geo.region" content="US-TX" />
        <meta name="geo.placename" content="San Antonio" />
        <meta name="geo.position" content="29.4241;-98.4936" />
        <meta name="ICBM" content="29.4241, -98.4936" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(
            createProductListingSchema(filteredAndSortedProducts)
          )}
        </script>
      </Helmet>

      <div className="w-full bg-secondary-blue/5 py-12">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="flex flex-col gap-6 mb-12">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <h1 className="text-3xl font-bold text-white">Our Products</h1>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={toggleFilters}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white text-primary-blue rounded-xl border-2 border-primary-blue/20 hover:border-primary-blue/40 transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
                >
                  {showFilters ? <X size={20} /> : <Filter size={20} />}
                  Filters
                </button>
                <button
                  onClick={toggleSort}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-400 to-purple-600 text-white rounded-xl hover:from-blue-500 hover:to-purple-700 transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
                >
                  <ArrowUpDown size={20} />
                  <span className="hidden md:inline">Price:</span>{" "}
                  {sortAscending ? "↑" : "↓"}
                </button>
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="bg-white p-6 rounded-xl shadow-lg space-y-6 border-2 border-secondary-blue/20">
                {/* Type Filter */}
                <div className="flex flex-col md:flex-row gap-3 md:items-center">
                  <span className="font-semibold text-primary-blue md:min-w-24">
                    Type:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {(["ALL", "DRY", "WET"] as FilterType[]).map((type) => (
                      <button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className={`px-4 py-2 rounded-lg transition-all duration-300 font-semibold ${
                          selectedType === type
                            ? "bg-gradient-to-r from-blue-400 to-purple-600 text-white shadow-md"
                            : "bg-secondary-blue/10 hover:bg-secondary-blue/20 text-primary-blue"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category Filter */}
                <div className="flex flex-col md:flex-row gap-3 md:items-center">
                  <span className="font-semibold text-primary-blue md:min-w-24">
                    Category:
                  </span>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 rounded-lg border-2 border-secondary-blue/20 bg-white text-primary-blue font-medium focus:border-primary-blue focus:outline-none transition-colors duration-300"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range Filter */}
                <div className="flex flex-col md:flex-row gap-3 md:items-center">
                  <span className="font-semibold text-primary-blue md:min-w-24">
                    Price:
                  </span>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={priceRange.min}
                      onChange={(e) =>
                        setPriceRange((prev) => ({
                          ...prev,
                          min: Number(e.target.value),
                        }))
                      }
                      className="px-4 py-2 rounded-lg border-2 border-secondary-blue/20 w-28 text-primary-blue font-medium focus:border-primary-blue focus:outline-none transition-colors duration-300"
                      placeholder="Min"
                    />
                    <span className="text-primary-blue font-medium">to</span>
                    <input
                      type="number"
                      value={priceRange.max}
                      onChange={(e) =>
                        setPriceRange((prev) => ({
                          ...prev,
                          max: Number(e.target.value),
                        }))
                      }
                      className="px-4 py-2 rounded-lg border-2 border-secondary-blue/20 w-28 text-primary-blue font-medium focus:border-primary-blue focus:outline-none transition-colors duration-300"
                      placeholder="Max"
                    />
                  </div>
                </div>

                {/* Minimum Size Filter */}
                <div className="flex flex-col md:flex-row gap-3 md:items-center">
                  <span className="font-semibold text-primary-blue md:min-w-24">
                    Min Size (sq ft):
                  </span>
                  <input
                    type="number"
                    value={minSize}
                    onChange={(e) => setMinSize(Number(e.target.value))}
                    className="px-4 py-2 rounded-lg border-2 border-secondary-blue/20 w-28 text-primary-blue font-medium focus:border-primary-blue focus:outline-none transition-colors duration-300"
                    placeholder="0"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedProducts.map((product) => (
              <Link
                key={product._id}
                to={`/products/${product.slug}`}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] border-2 border-transparent hover:border-secondary-blue/20"
              >
                <div className="aspect-w-16 aspect-h-9 relative overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0].url}
                      alt={product.name}
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
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <p className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
                    {getCurrencySymbol(product.price.currency)}
                    {product.price.base.toFixed(2)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
