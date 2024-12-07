import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpDown, Filter, X } from 'lucide-react';

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

type FilterType = 'ALL' | 'DRY' | 'WET';

const getCurrencySymbol = (currencyCode: string): string => {
  const symbols: { [key: string]: string } = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
  };
  return symbols[currencyCode] || currencyCode;
};

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortAscending, setSortAscending] = useState(false);
  const [selectedType, setSelectedType] = useState<FilterType>('ALL');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [minSize, setMinSize] = useState<number>(0);

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

  const categories = ['ALL', ...new Set(products.map(p => p.category))];

  const filteredAndSortedProducts = [...products]
    .filter(product => {
      // Type filter
      if (selectedType !== 'ALL') {
        const typeSpec = product.specifications?.find(spec => spec.name === 'Type');
        if (!typeSpec) return false;
        const typeValue = typeSpec.value;
        if (Array.isArray(typeValue)) {
          if (selectedType === 'DRY') {
            if (!typeValue.includes('DRY') || typeValue.includes('WET')) return false;
          } else if (!typeValue.includes(selectedType)) return false;
        } else if (typeValue !== selectedType) return false;
      }

      // Category filter
      if (selectedCategory !== 'ALL' && product.category !== selectedCategory) return false;

      // Price range filter
      if (product.price.base < priceRange.min || product.price.base > priceRange.max) return false;

      // Size filter (based on floor area)
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
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center min-h-screen">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <h1 className="text-2xl md:text-3xl font-bold">Our Products</h1>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={toggleFilters}
              className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm md:text-base"
            >
              {showFilters ? <X size={18} /> : <Filter size={18} />}
              Filters
            </button>
            <button
              onClick={toggleSort}
              className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base"
            >
              <ArrowUpDown size={18} />
              <span className="hidden md:inline">Price:</span> {sortAscending ? '↑' : '↓'}
            </button>
          </div>
        </div>
        
        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            {/* Type Filter */}
            <div className="flex flex-col md:flex-row gap-2 md:items-center">
              <span className="font-semibold md:min-w-24">Type:</span>
              <div className="flex flex-wrap gap-2">
                {(['ALL', 'DRY', 'WET'] as FilterType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      selectedType === type
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-col md:flex-row gap-2 md:items-center">
              <span className="font-semibold md:min-w-24">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1.5 rounded-lg border bg-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div className="flex flex-col md:flex-row gap-2 md:items-center">
              <span className="font-semibold md:min-w-24">Price:</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                  className="px-3 py-1.5 rounded-lg border w-24"
                  placeholder="Min"
                />
                <span>to</span>
                <input
                  type="number"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                  className="px-3 py-1.5 rounded-lg border w-24"
                  placeholder="Max"
                />
              </div>
            </div>

            {/* Minimum Size Filter */}
            <div className="flex flex-col md:flex-row gap-2 md:items-center">
              <span className="font-semibold md:min-w-24">Min Size (sq ft):</span>
              <input
                type="number"
                value={minSize}
                onChange={(e) => setMinSize(Number(e.target.value))}
                className="px-3 py-1.5 rounded-lg border w-24"
                placeholder="0"
              />
            </div>
          </div>
        )}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredAndSortedProducts.map((product) => (
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
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  No Image
                </div>
              )}
            </div>
            <div className="p-4">
              <h2 className="text-lg md:text-xl font-semibold mb-2">{product.name}</h2>
              <p className="text-gray-600 mb-2 line-clamp-2 text-sm md:text-base">{product.description}</p>
              <p className="text-base md:text-lg font-bold text-blue-600">
                {getCurrencySymbol(product.price.currency)}{product.price.base.toFixed(2)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}