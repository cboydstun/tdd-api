import { Product } from "../../types/product";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (slug: string) => void;
}

export default function ProductTable({
  products,
  onEdit,
  onDelete,
}: ProductTableProps) {
  // Helper function to get full image URL
  const getImageUrl = (path: string) => {
    if (path.startsWith("http")) return path;
    return `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/${path}`;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Image
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Details
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Specifications
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Setup & Safety
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product._id}>
              <td className="px-6 py-4 whitespace-nowrap">
                {product.images && product.images.length > 0 && (
                  <img
                    src={getImageUrl(product.images[0].url)}
                    alt={product.images[0].alt || product.name}
                    className="h-16 w-16 object-cover rounded"
                  />
                )}
              </td>
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">
                  {product.name}
                </div>
                <div className="text-sm text-gray-500">{product.category}</div>
                <div className="text-sm text-gray-500">
                  {product.price.base.toFixed(2)} {product.price.currency} /{" "}
                  {product.rentalDuration
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </div>
                <div
                  className="text-sm text-gray-500 prose max-w-none line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                <div>
                  Dimensions: {product.dimensions.length} ×{" "}
                  {product.dimensions.width} × {product.dimensions.height}{" "}
                  {product.dimensions.unit}
                </div>
                <div>Capacity: {product.capacity} people</div>
                <div>
                  Age: {product.ageRange.min}-{product.ageRange.max} years
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                <div>
                  <span className="font-medium">Space Required:</span>{" "}
                  {product.setupRequirements.space}
                </div>
                {product.setupRequirements.powerSource && (
                  <div className="text-yellow-600">Requires power source</div>
                )}
                <div
                  className="text-sm text-gray-500 prose max-w-none line-clamp-2 mt-2"
                  dangerouslySetInnerHTML={{ __html: product.safetyGuidelines }}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    product.availability === "available"
                      ? "bg-green-100 text-green-800"
                      : product.availability === "rented"
                      ? "bg-blue-100 text-blue-800"
                      : product.availability === "maintenance"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.availability.charAt(0).toUpperCase() +
                    product.availability.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => onEdit(product)}
                  className="text-primary-purple hover:text-primary-blue mr-4"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete this product?"
                      )
                    ) {
                      onDelete(product.slug);
                    }
                  }}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
