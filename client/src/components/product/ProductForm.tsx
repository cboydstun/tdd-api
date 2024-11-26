import { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  Product,
  ProductFormData,
  RentalDuration,
  Availability,
} from "../../types/product";
import { modules, formats } from "../blog/QuillConfig";
import { useProductManagement } from "../../hooks/useProductManagement";

interface ProductFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Product;
}

interface ImagePreview {
  url: string;
  file?: File;
  existingPath?: string;
}

export default function ProductForm({
  onSubmit,
  onCancel,
  initialData,
}: ProductFormProps) {
  const { deleteImage } = useProductManagement();

  // Helper function to get full image URL
  const getImageUrl = (path: string) => {
    if (path.startsWith("http")) return path;
    return `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/${path}`;
  };

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    category: "",
    price: {
      base: 0,
      currency: "USD",
    },
    dimensions: {
      length: 0,
      width: 0,
      height: 0,
      unit: "feet",
    },
    capacity: 0,
    ageRange: {
      min: 0,
      max: 0,
    },
    setupRequirements: {
      space: "",
      powerSource: false,
      surfaceType: [],
    },
    safetyGuidelines: "",
    rentalDuration: "full-day",
    availability: "available",
  });

  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        category: initialData.category,
        price: {
          base: initialData.price.base,
          currency: initialData.price.currency,
        },
        dimensions: {
          length: initialData.dimensions.length,
          width: initialData.dimensions.width,
          height: initialData.dimensions.height,
          unit: initialData.dimensions.unit,
        },
        capacity: initialData.capacity,
        ageRange: {
          min: initialData.ageRange.min,
          max: initialData.ageRange.max,
        },
        setupRequirements: {
          space: initialData.setupRequirements.space,
          powerSource: initialData.setupRequirements.powerSource,
          surfaceType: initialData.setupRequirements.surfaceType,
        },
        safetyGuidelines: initialData.safetyGuidelines,
        rentalDuration: initialData.rentalDuration,
        availability: initialData.availability,
      });

      // Set existing images
      const existingImages = initialData.images.map((img) => ({
        url: getImageUrl(img.url),
        existingPath: img.url,
      }));
      setImagePreviews(existingImages);
    }
  }, [initialData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPreviews = Array.from(files).map((file) => ({
        url: URL.createObjectURL(file),
        file,
      }));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }
    // Reset the input value to allow selecting the same file again
    e.target.value = "";
  };

  const removeImage = async (index: number) => {
    const imageToRemove = imagePreviews[index];

    if (imageToRemove.existingPath && initialData?.slug) {
      // Extract just the filename from the path
      const filename = imageToRemove.existingPath.split("/").pop();
      if (!filename) return;

      const success = await deleteImage(initialData.slug, filename);
      if (success) {
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
      }
    } else {
      // If it's a new image that hasn't been uploaded yet, just remove it from the previews
      setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submitFormData = new FormData();

    // Add product data
    submitFormData.append("productData", JSON.stringify(formData));

    // Add new images
    imagePreviews.forEach((preview) => {
      if (preview.file) {
        submitFormData.append("images", preview.file);
      }
      if (preview.existingPath) {
        submitFormData.append("existingImages", preview.existingPath);
      }
    });

    await onSubmit(submitFormData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-purple focus:ring-primary-purple sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <div className="prose max-w-full">
          <ReactQuill
            theme="snow"
            value={formData.description}
            onChange={(content) =>
              setFormData({ ...formData, description: content })
            }
            modules={modules}
            formats={formats}
            className="bg-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <input
          type="text"
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-purple focus:ring-primary-purple sm:text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.price.base}
            onChange={(e) =>
              setFormData({
                ...formData,
                price: { ...formData.price, base: parseFloat(e.target.value) },
              })
            }
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-purple focus:ring-primary-purple sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Currency
          </label>
          <select
            value={formData.price.currency}
            onChange={(e) =>
              setFormData({
                ...formData,
                price: { ...formData.price, currency: e.target.value },
              })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-purple focus:ring-primary-purple sm:text-sm"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Dimensions</h3>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Length
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.dimensions.length}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  dimensions: {
                    ...formData.dimensions,
                    length: parseFloat(e.target.value),
                  },
                })
              }
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-purple focus:ring-primary-purple sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Width
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.dimensions.width}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  dimensions: {
                    ...formData.dimensions,
                    width: parseFloat(e.target.value),
                  },
                })
              }
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-purple focus:ring-primary-purple sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Height
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.dimensions.height}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  dimensions: {
                    ...formData.dimensions,
                    height: parseFloat(e.target.value),
                  },
                })
              }
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-purple focus:ring-primary-purple sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Unit
            </label>
            <select
              value={formData.dimensions.unit}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  dimensions: {
                    ...formData.dimensions,
                    unit: e.target.value as "feet" | "meters" | "inches",
                  },
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-purple focus:ring-primary-purple sm:text-sm"
            >
              <option value="feet">Feet</option>
              <option value="meters">Meters</option>
              <option value="inches">Inches</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Capacity (people)
          </label>
          <input
            type="number"
            value={formData.capacity}
            onChange={(e) =>
              setFormData({
                ...formData,
                capacity: parseInt(e.target.value),
              })
            }
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-purple focus:ring-primary-purple sm:text-sm"
          />
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Age Range</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Minimum Age
            </label>
            <input
              type="number"
              value={formData.ageRange.min}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  ageRange: {
                    ...formData.ageRange,
                    min: parseInt(e.target.value),
                  },
                })
              }
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-purple focus:ring-primary-purple sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Maximum Age
            </label>
            <input
              type="number"
              value={formData.ageRange.max}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  ageRange: {
                    ...formData.ageRange,
                    max: parseInt(e.target.value),
                  },
                })
              }
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-purple focus:ring-primary-purple sm:text-sm"
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Setup Requirements
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Required Space
            </label>
            <input
              type="text"
              value={formData.setupRequirements.space}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  setupRequirements: {
                    ...formData.setupRequirements,
                    space: e.target.value,
                  },
                })
              }
              required
              placeholder="e.g., 20x20 feet flat area"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-purple focus:ring-primary-purple sm:text-sm"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.setupRequirements.powerSource}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  setupRequirements: {
                    ...formData.setupRequirements,
                    powerSource: e.target.checked,
                  },
                })
              }
              className="h-4 w-4 text-primary-purple focus:ring-primary-purple border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Requires Power Source
            </label>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Safety Guidelines
        </label>
        <div className="prose max-w-full">
          <ReactQuill
            theme="snow"
            value={formData.safetyGuidelines}
            onChange={(content) =>
              setFormData({ ...formData, safetyGuidelines: content })
            }
            modules={modules}
            formats={formats}
            className="bg-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Rental Duration
        </label>
        <select
          value={formData.rentalDuration}
          onChange={(e) =>
            setFormData({
              ...formData,
              rentalDuration: e.target.value as RentalDuration,
            })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-purple focus:ring-primary-purple sm:text-sm"
        >
          <option value="hourly">Hourly</option>
          <option value="half-day">Half Day</option>
          <option value="full-day">Full Day</option>
          <option value="weekend">Weekend</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Availability
        </label>
        <select
          value={formData.availability}
          onChange={(e) =>
            setFormData({
              ...formData,
              availability: e.target.value as Availability,
            })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-purple focus:ring-primary-purple sm:text-sm"
        >
          <option value="available">Available</option>
          <option value="rented">Rented</option>
          <option value="maintenance">Maintenance</option>
          <option value="retired">Retired</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Images
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-purple file:text-white hover:file:bg-primary-blue"
        />
        {imagePreviews.length > 0 && (
          <div className="mt-4 grid grid-cols-4 gap-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview.url}
                  alt={`Preview ${index + 1}`}
                  className="h-24 w-24 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-purple hover:bg-primary-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple"
        >
          {initialData ? "Update Product" : "Create Product"}
        </button>
      </div>
    </form>
  );
}
