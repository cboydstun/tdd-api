import { renderHook, act } from '@testing-library/react';
import { useProductManagement } from '../useProductManagement';
import { Product } from '../../types/product';

// Extend window interface to allow mocking fetch
declare global {
    interface Window {
        fetch: jest.Mock;
    }
}

describe('useProductManagement', () => {
    const mockToken = 'mock-token';

    // Mock localStorage and fetch
    beforeEach(() => {
        window.localStorage.clear();
        localStorage.setItem('token', mockToken);
        // Reset fetch mock
        window.fetch = jest.fn();
    });

    it('should initialize with default values', () => {
        const { result } = renderHook(() => useProductManagement());

        expect(result.current.products).toEqual([]);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(null);
    });

    describe('fetchProducts', () => {
        it('should fetch products successfully', async () => {
            const mockProducts: Product[] = [
                {
                    _id: '1',
                    slug: 'product-1',
                    name: 'Product 1',
                    description: 'Test description',
                    category: 'Test Category',
                    price: { base: 100, currency: 'USD' },
                    dimensions: { length: 10, width: 10, height: 10, unit: 'feet' },
                    capacity: 5,
                    ageRange: { min: 3, max: 12 },
                    setupRequirements: {
                        space: 'Large area',
                        powerSource: true,
                        surfaceType: ['Grass', 'Concrete']
                    },
                    features: [],
                    safetyGuidelines: 'Test safety guidelines',
                    maintenanceSchedule: {
                        lastMaintenance: new Date().toISOString(),
                        nextMaintenance: new Date().toISOString()
                    },
                    weatherRestrictions: [],
                    additionalServices: [],
                    specifications: [],
                    images: [],
                    rentalDuration: 'full-day',
                    availability: 'available',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    _id: '2',
                    slug: 'product-2',
                    name: 'Product 2',
                    description: 'Test description 2',
                    category: 'Test Category',
                    price: { base: 150, currency: 'USD' },
                    dimensions: { length: 12, width: 12, height: 12, unit: 'feet' },
                    capacity: 8,
                    ageRange: { min: 4, max: 15 },
                    setupRequirements: {
                        space: 'Medium area',
                        powerSource: true,
                        surfaceType: ['Grass']
                    },
                    features: [],
                    safetyGuidelines: 'Test safety guidelines',
                    maintenanceSchedule: {
                        lastMaintenance: new Date().toISOString(),
                        nextMaintenance: new Date().toISOString()
                    },
                    weatherRestrictions: [],
                    additionalServices: [],
                    specifications: [],
                    images: [],
                    rentalDuration: 'full-day',
                    availability: 'available',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            ];

            window.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockProducts
            });

            const { result } = renderHook(() => useProductManagement());

            await act(async () => {
                await result.current.fetchProducts();
            });

            expect(window.fetch).toHaveBeenCalledWith('/api/v1/products', {
                headers: {
                    'Authorization': `Bearer ${mockToken}`
                }
            });
            expect(result.current.products).toEqual(mockProducts);
            expect(result.current.loading).toBe(false);
            expect(result.current.error).toBe(null);
        });

        it('should handle fetch products error', async () => {
            const errorMessage = 'Failed to fetch products';
            window.fetch.mockResolvedValueOnce({
                ok: false,
                json: async () => ({ error: errorMessage })
            });

            const { result } = renderHook(() => useProductManagement());

            await act(async () => {
                await result.current.fetchProducts();
            });

            expect(result.current.products).toEqual([]);
            expect(result.current.loading).toBe(false);
            expect(result.current.error).toBe(errorMessage);
        });
    });

    describe('createProduct', () => {
        it('should create product successfully', async () => {
            const mockFormData = new FormData();
            window.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ message: 'Product created' })
            });
            // Mock the subsequent fetchProducts call
            window.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ([])
            });

            const { result } = renderHook(() => useProductManagement());

            const success = await act(async () => {
                return await result.current.createProduct(mockFormData);
            });

            expect(success).toBe(true);
            expect(window.fetch).toHaveBeenCalledWith('/api/v1/products', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${mockToken}`
                },
                body: mockFormData
            });
            expect(result.current.error).toBe(null);
        });

        it('should handle create product error', async () => {
            const errorMessage = 'Failed to create product';
            const mockFormData = new FormData();
            window.fetch.mockResolvedValueOnce({
                ok: false,
                json: async () => ({ error: errorMessage })
            });

            const { result } = renderHook(() => useProductManagement());

            const success = await act(async () => {
                return await result.current.createProduct(mockFormData);
            });

            expect(success).toBe(false);
            expect(result.current.error).toBe(errorMessage);
        });
    });

    describe('updateProduct', () => {
        it('should update product successfully', async () => {
            const mockFormData = new FormData();
            const mockSlug = 'test-product';
            window.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ message: 'Product updated' })
            });
            // Mock the subsequent fetchProducts call
            window.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ([])
            });

            const { result } = renderHook(() => useProductManagement());

            const success = await act(async () => {
                return await result.current.updateProduct(mockSlug, mockFormData);
            });

            expect(success).toBe(true);
            expect(window.fetch).toHaveBeenCalledWith(`/api/v1/products/${mockSlug}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${mockToken}`
                },
                body: mockFormData
            });
            expect(result.current.error).toBe(null);
        });

        it('should handle update product error', async () => {
            const errorMessage = 'Failed to update product';
            const mockFormData = new FormData();
            const mockSlug = 'test-product';
            window.fetch.mockResolvedValueOnce({
                ok: false,
                json: async () => ({ error: errorMessage })
            });

            const { result } = renderHook(() => useProductManagement());

            const success = await act(async () => {
                return await result.current.updateProduct(mockSlug, mockFormData);
            });

            expect(success).toBe(false);
            expect(result.current.error).toBe(errorMessage);
        });
    });

    describe('deleteProduct', () => {
        it('should delete product successfully', async () => {
            const mockSlug = 'test-product';
            window.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ message: 'Product deleted' })
            });
            // Mock the subsequent fetchProducts call
            window.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ([])
            });

            const { result } = renderHook(() => useProductManagement());

            const success = await act(async () => {
                return await result.current.deleteProduct(mockSlug);
            });

            expect(success).toBe(true);
            expect(window.fetch).toHaveBeenCalledWith(`/api/v1/products/${mockSlug}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${mockToken}`
                }
            });
            expect(result.current.error).toBe(null);
        });

        it('should handle delete product error', async () => {
            const errorMessage = 'Failed to delete product';
            const mockSlug = 'test-product';
            window.fetch.mockResolvedValueOnce({
                ok: false,
                json: async () => ({ error: errorMessage })
            });

            const { result } = renderHook(() => useProductManagement());

            const success = await act(async () => {
                return await result.current.deleteProduct(mockSlug);
            });

            expect(success).toBe(false);
            expect(result.current.error).toBe(errorMessage);
        });
    });

    describe('deleteImage', () => {
        it('should delete image successfully', async () => {
            const mockSlug = 'test-product';
            const mockImageName = 'uploads/test-image.jpg';
            window.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ message: 'Image deleted' })
            });
            // Mock the subsequent fetchProducts call
            window.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ([])
            });

            const { result } = renderHook(() => useProductManagement());

            const success = await act(async () => {
                return await result.current.deleteImage(mockSlug, mockImageName);
            });

            expect(success).toBe(true);
            expect(window.fetch).toHaveBeenCalledWith(`/api/v1/products/${mockSlug}/images/test-image.jpg`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${mockToken}`
                }
            });
            expect(result.current.error).toBe(null);
        });

        it('should handle delete image error', async () => {
            const errorMessage = 'Failed to delete image';
            const mockSlug = 'test-product';
            const mockImageName = 'test-image.jpg';
            window.fetch.mockResolvedValueOnce({
                ok: false,
                json: async () => ({ error: errorMessage })
            });

            const { result } = renderHook(() => useProductManagement());

            const success = await act(async () => {
                return await result.current.deleteImage(mockSlug, mockImageName);
            });

            expect(success).toBe(false);
            expect(result.current.error).toBe(errorMessage);
        });
    });
});
