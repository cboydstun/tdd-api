import { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  Product,
  ProductFormData,
  RentalDuration,
  Availability,
} from "../../types/product";
import { modules, formats } from "../blog/QuillConfig";

interface ProductFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Product;
}

interface ImagePreview {
  url: string;
  file?: File;
  public_id?: string;
  filename?: string;
}

export default function ProductForm({
  onSubmit,
  onCancel,
  initialData,
}: ProductFormProps) {
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
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

      // Set existing images with proper mapping of all fields
      const existingImages = initialData.images.map((img) => ({
        url: img.url,
        public_id: img.url.split("/products/")[1]?.split(".")[0], // Extract public_id from URL
        filename: img.alt,
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

  const removeImage = (index: number) => {
    const imageToRemove = imagePreviews[index];

    if (!imageToRemove.file) {
      // Only handle deletion for existing images
      const identifier = imageToRemove.public_id;
      if (identifier) {
        setImagesToDelete((prev) => {
          const newImagesToDelete = [...prev, identifier];
          return newImagesToDelete;
        });
      }
    }

    // If it's a new image that hasn't been uploaded yet, revoke the object URL
    if (imageToRemove.url.startsWith("blob:")) {
      URL.revokeObjectURL(imageToRemove.url);
    }

    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
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
    });

    // Add existing images info
    const existingImages = imagePreviews
      .filter((preview) => !preview.file) // Only include non-new images
      .map((preview) => ({
        url: preview.url,
        public_id: preview.public_id,
        filename: preview.filename,
      }));
    submitFormData.append("existingImages", JSON.stringify(existingImages));

    // Add images to delete
    if (imagesToDelete.length > 0) {
      submitFormData.append("imagesToDelete", JSON.stringify(imagesToDelete));
    }

    // Debug log the form data
    for (const [key, value] of submitFormData.entries()) {
      console.log(key, ":", typeof value === "string" ? value : "File or Blob");
    }

    await onSubmit(submitFormData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Rest of the form JSX remains unchanged */}
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
        <label className="block text-sm font-medium text-gray-700">
          Images
        </label>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          multiple
          accept="image/*"
          className="mt-1 block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-semibold
          file:bg-primary-purple file:text-white
          hover:file:bg-primary-blue"
        />
      </div>

      {/* Display image previews */}
      {imagePreviews.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Images
          </label>
          <div className="grid grid-cols-3 gap-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative">
                <img
                  src={preview.url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-purple hover:bg-primary-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple"
        >
          {initialData ? "Update" : "Create"} Product
        </button>
      </div>
    </form>
  );
}
