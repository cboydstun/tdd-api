import { useState, useCallback } from 'react';
import { Product, ProductFormData } from '../types/product';

export const useProductManagement = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/v1/products', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
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
    }, []);

    const createProduct = async (formData: FormData) => {
        setError(null);
        try {
            const response = await fetch('/api/v1/products', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create product');
            }

            await fetchProducts();
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            return false;
        }
    };

    const updateProduct = async (slug: string, formData: FormData) => {
        setError(null);
        try {
            const response = await fetch(`/api/v1/products/${slug}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update product');
            }

            await fetchProducts();
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            return false;
        }
    };

    const deleteProduct = async (slug: string) => {
        setError(null);
        try {
            const response = await fetch(`/api/v1/products/${slug}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete product');
            }

            await fetchProducts();
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            return false;
        }
    };

    const deleteImage = async (slug: string, imageName: string) => {
        setError(null);
        try {
            // Remove 'uploads/' from the imageName if it exists
            const cleanImageName = imageName.replace('uploads/', '');

            const response = await fetch(`/api/v1/products/${slug}/images/${cleanImageName}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete image');
            }

            await fetchProducts();
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            return false;
        }
    };

    return {
        products,
        loading,
        error,
        fetchProducts,
        createProduct,
        updateProduct,
        deleteProduct,
        deleteImage,
    };
};
