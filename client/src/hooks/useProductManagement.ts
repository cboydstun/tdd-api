import { useState, useCallback } from 'react';
import axios from 'axios';
import { Product } from '../types/product';

export const useProductManagement = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('/api/v1/products', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setProducts(response.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, []);

    const createProduct = async (formData: FormData) => {
        setError(null);
        try {
            await axios.post('/api/v1/products', formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            await fetchProducts();
            return true;
        } catch (err) {
            console.error('Error creating product:', err);
            setError(err instanceof Error ? err.message : 'An error occurred');
            return false;
        }
    };

    const updateProduct = async (slug: string, formData: FormData) => {
        setError(null);
        try {
            await axios.put(`/api/v1/products/${slug}`, formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            await fetchProducts();
            return true;
        } catch (err) {
            console.error('Error updating product:', err);
            setError(err instanceof Error ? err.message : 'An error occurred');
            return false;
        }
    };

    const deleteProduct = async (slug: string) => {
        setError(null);
        try {
            await axios.delete(`/api/v1/products/${slug}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            await fetchProducts();
            return true;
        } catch (err) {
            console.error('Error deleting product:', err);
            setError(err instanceof Error ? err.message : 'An error occurred');
            return false;
        }
    };

    const deleteImage = async (slug: string, public_id: string) => {
        setError(null);
        try {
            await axios.delete(`/api/v1/products/${slug}/images/${public_id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            await fetchProducts();
            return true;
        } catch (err) {
            console.error('Error deleting image:', err);
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
