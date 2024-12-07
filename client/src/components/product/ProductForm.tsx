import { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  Product,
  ProductFormData,
  RentalDuration,
  Availability,
  Specification,
  AdditionalService,
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
  alt?: string;
  isPrimary?: boolean;
}

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

export default function ProductForm({
  onSubmit,
  onCancel,
  initialData,
}: ProductFormProps) {

  const [formData, setFormData] = useState<ProductFormData>(() => {
    
    // Initialize with initialData if available, otherwise use defaults
    if (initialData) {
      return {
        name: initialData.name || "",
        slug: initialData.slug || "",
        description: initialData.description || "",
        category: initialData.category || "",
        price: {
          base: initialData.price?.base || 0,
          currency: initialData.price?.currency || "USD",
        },
        dimensions: {
          length: initialData.dimensions?.length || 0,
          width: initialData.dimensions?.width || 0,
          height: initialData.dimensions?.height || 0,
          unit: initialData.dimensions?.unit || "feet",
        },
        capacity: initialData.capacity || 0,
        ageRange: {
          min: initialData.ageRange?.min || 0,
          max: initialData.ageRange?.max || 0,
        },
        setupRequirements: {
          space: initialData.setupRequirements?.space || "",
          powerSource: initialData.setupRequirements?.powerSource || false,
          surfaceType: initialData.setupRequirements?.surfaceType || [],
        },
        features: initialData.features || [],
        safetyGuidelines: initialData.safetyGuidelines || "",
        maintenanceSchedule: {
          lastMaintenance: initialData.maintenanceSchedule?.lastMaintenance || new Date().toISOString(),
          nextMaintenance: initialData.maintenanceSchedule?.nextMaintenance || new Date().toISOString(),
        },
        weatherRestrictions: initialData.weatherRestrictions || [],
        additionalServices: initialData.additionalServices || [],
        specifications: initialData.specifications || [],
        images: initialData.images || [],
        rentalDuration: (initialData.rentalDuration as RentalDuration) || "full-day",
        availability: (initialData.availability as Availability) || "available",
      };
    }

    // Default values if no initialData
    return {
      name: "",
      slug: "",
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
      features: [],
      safetyGuidelines: "",
      maintenanceSchedule: {
        lastMaintenance: new Date().toISOString(),
        nextMaintenance: new Date().toISOString(),
      },
      weatherRestrictions: [],
      additionalServices: [],
      specifications: [],
      images: [],
      rentalDuration: "full-day" as RentalDuration,
      availability: "available" as Availability,
    };
  });

  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle image previews initialization
  useEffect(() => {
    
    if (initialData) {
      // Create a deep copy of initialData to avoid reference issues
      const formattedData = {
        name: initialData.name || "",
        slug: initialData.slug || "",
        description: initialData.description || "",
        category: initialData.category || "",
        price: {
          base: initialData.price?.base || 0,
          currency: initialData.price?.currency || "USD",
        },
        dimensions: {
          length: initialData.dimensions?.length || 0,
          width: initialData.dimensions?.width || 0,
          height: initialData.dimensions?.height || 0,
          unit: initialData.dimensions?.unit || "feet",
        },
        capacity: initialData.capacity || 0,
        ageRange: {
          min: initialData.ageRange?.min || 0,
          max: initialData.ageRange?.max || 0,
        },
        setupRequirements: {
          space: initialData.setupRequirements?.space || "",
          powerSource: initialData.setupRequirements?.powerSource || false,
          surfaceType: initialData.setupRequirements?.surfaceType || [],
        },
        features: initialData.features || [],
        safetyGuidelines: initialData.safetyGuidelines || "",
        maintenanceSchedule: {
          lastMaintenance: initialData.maintenanceSchedule?.lastMaintenance || new Date().toISOString(),
          nextMaintenance: initialData.maintenanceSchedule?.nextMaintenance || new Date().toISOString(),
        },
        weatherRestrictions: initialData.weatherRestrictions || [],
        additionalServices: initialData.additionalServices || [],
        specifications: initialData.specifications || [],
        images: initialData.images || [],
        rentalDuration: (initialData.rentalDuration as RentalDuration) || "full-day",
        availability: (initialData.availability as Availability) || "available",
      };

      setFormData(formattedData);

      if (initialData.images?.length > 0) {
        const existingImages = initialData.images.map((img) => ({
          url: img.url,
          alt: img.alt || "",
          isPrimary: img.isPrimary || false,
          public_id: img.url.split("/").pop()?.split(".")[0] || "",
        }));
        setImagePreviews(existingImages);
      }
    }
  }, [initialData]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = generateSlug(name);
    setFormData({ ...formData, name, slug });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPreviews = Array.from(files).map((file) => ({
        url: URL.createObjectURL(file),
        file,
      }));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    const imageToRemove = imagePreviews[index];

    if (!imageToRemove.file) {
      const identifier = imageToRemove.public_id;
      if (identifier) {
        setImagesToDelete((prev) => [...prev, identifier]);
      }
    }

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
      .filter((preview) => !preview.file)
      .map((preview) => ({
        url: preview.url,
        public_id: preview.public_id,
        alt: preview.alt,
        isPrimary: preview.isPrimary,
      }));
    submitFormData.append("existingImages", JSON.stringify(existingImages));

    // Add images to delete
    if (imagesToDelete.length > 0) {
      submitFormData.append("imagesToDelete", JSON.stringify(imagesToDelete));
    }

    await onSubmit(submitFormData);
  };

  // Rest of the component remains exactly the same...
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={handleNameChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-purple focus:ring-primary-purple sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Slug</label>
        <input
          type="text"
          value={formData.slug}
          readOnly
          className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-primary-purple focus:ring-primary-purple sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <input
          type="text"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-purple focus:ring-primary-purple sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <div className="prose max-w-full">
          <ReactQuill
            theme="snow"
            value={formData.description}
            onChange={(content) => setFormData({ ...formData, description: content })}
            modules={modules}
            formats={formats}
            className="bg-white"
          />
        </div>
      </div>

     {/* Price */}
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

      {/* Dimensions */}
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

      {/* Capacity */}
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

      {/* Age Range */}
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

      {/* Setup Requirements */}
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
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Surface Types
            </label>
            <input
              type="text"
              value={formData.setupRequirements.surfaceType?.join(", ") || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  setupRequirements: {
                    ...formData.setupRequirements,
                    surfaceType: e.target.value.split(",").map((s) => s.trim()),
                  },
                })
              }
              placeholder="e.g., Grass, Concrete, Asphalt"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-purple focus:ring-primary-purple sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Features */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Features
        </label>
        <input
          type="text"
          value={formData.features.join(", ")}
          onChange={(e) =>
            setFormData({
              ...formData,
              features: e.target.value.split(",").map((s) => s.trim()),
            })
          }
          placeholder="e.g., Basketball Hoop, Climbing Wall, Safety Netting"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-purple focus:ring-primary-purple sm:text-sm"
        />
      </div>

      {/* Safety Guidelines */}
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

      {/* Weather Restrictions */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Weather Restrictions
        </label>
        <input
          type="text"
          value={formData.weatherRestrictions.join(", ")}
          onChange={(e) =>
            setFormData({
              ...formData,
              weatherRestrictions: e.target.value.split(",").map((s) => s.trim()),
            })
          }
          placeholder="e.g., No use in rain, Wind under 15mph"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-purple focus:ring-primary-purple sm:text-sm"
        />
      </div>

      {/* Specifications */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Specifications
        </label>
        <div className="space-y-2">
          {formData.specifications.map((spec: Specification, index: number) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={spec.name}
                onChange={(e) => {
                  const newSpecs = [...formData.specifications];
                  newSpecs[index] = { ...spec, name: e.target.value };
                  setFormData({ ...formData, specifications: newSpecs });
                }}
                placeholder="Name"
                className="mt-1 block w-1/3 rounded-md border-gray-300 shadow-sm focus:border-primary-purple focus:ring-primary-purple sm:text-sm"
              />
              <input
                type="text"
                value={spec.value}
                onChange={(e) => {
                  const newSpecs = [...formData.specifications];
                  newSpecs[index] = { ...spec, value: e.target.value };
                  setFormData({ ...formData, specifications: newSpecs });
                }}
                placeholder="Value"
                className="mt-1 block w-1/3 rounded-md border-gray-300 shadow-sm focus:border-primary-purple focus:ring-primary-purple sm:text-sm"
              />
              <button
                type="button"
                onClick={() => {
                  const newSpecs = formData.specifications.filter((_: Specification, i: number) => i !== index);
                  setFormData({ ...formData, specifications: newSpecs });
                }}
                className="mt-1 px-2 py-1 bg-red-500 text-white rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              setFormData({
                ...formData,
                specifications: [...formData.specifications, { name: "", value: "" }],
              });
            }}
            className="mt-2 px-4 py-2 bg-primary-purple text-white rounded"
          >
            Add Specification
          </button>
        </div>
      </div>

      {/* Additional Services */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Additional Services
        </label>
        <div className="space-y-2">
          {formData.additionalServices.map((service: AdditionalService, index: number) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={service.name}
                onChange={(e) => {
                  const newServices = [...formData.additionalServices];
                  newServices[index] = { ...service, name: e.target.value };
                  setFormData({ ...formData, additionalServices: newServices });
                }}
                placeholder="Service Name"
                className="mt-1 block w-1/3 rounded-md border-gray-300 shadow-sm focus:border-primary-purple focus:ring-primary-purple sm:text-sm"
              />
              <input
                type="number"
                value={service.price}
                onChange={(e) => {
                  const newServices = [...formData.additionalServices];
                  newServices[index] = { ...service, price: parseFloat(e.target.value) };
                  setFormData({ ...formData, additionalServices: newServices });
                }}
                placeholder="Price"
                className="mt-1 block w-1/3 rounded-md border-gray-300 shadow-sm focus:border-primary-purple focus:ring-primary-purple sm:text-sm"
              />
              <button
                type="button"
                onClick={() => {
                  const newServices = formData.additionalServices.filter((_: AdditionalService, i: number) => i !== index);
                  setFormData({ ...formData, additionalServices: newServices });
                }}
                className="mt-1 px-2 py-1 bg-red-500 text-white rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              setFormData({
                ...formData,
                additionalServices: [...formData.additionalServices, { name: "", price: 0 }],
              });
            }}
            className="mt-2 px-4 py-2 bg-primary-purple text-white rounded"
          >
            Add Service
          </button>
        </div>
      </div>

      {/* Rental Duration */}
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

      {/* Availability */}
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

      {/* Images */}
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

      {/* Form Actions */}
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
