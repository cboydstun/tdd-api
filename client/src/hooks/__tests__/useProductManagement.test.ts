import { renderHook, act } from '@testing-library/react';
import { useProductManagement } from '../useProductManagement';

describe('useProductManagement', () => {
    const mockToken = 'mock-token';

    // Mock localStorage
    beforeEach(() => {
        global.localStorage.clear();
        localStorage.setItem('token', mockToken);
        // Reset fetch mock
        global.fetch = jest.fn();
    });

    it('should initialize with default values', () => {
        const { result } = renderHook(() => useProductManagement());

        expect(result.current.products).toEqual([]);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(null);
    });

    describe('fetchProducts', () => {
        it('should fetch products successfully', async () => {
            const mockProducts = [
                { id: 1, name: 'Product 1' },
                { id: 2, name: 'Product 2' }
            ];

            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockProducts
            });

            const { result } = renderHook(() => useProductManagement());

            await act(async () => {
                await result.current.fetchProducts();
            });

            expect(global.fetch).toHaveBeenCalledWith('/api/v1/products', {
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
            (global.fetch as jest.Mock).mockResolvedValueOnce({
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
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => ({ message: 'Product created' })
            });
            // Mock the subsequent fetchProducts call
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => ([])
            });

            const { result } = renderHook(() => useProductManagement());

            const success = await act(async () => {
                return await result.current.createProduct(mockFormData);
            });

            expect(success).toBe(true);
            expect(global.fetch).toHaveBeenCalledWith('/api/v1/products', {
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
            (global.fetch as jest.Mock).mockResolvedValueOnce({
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
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => ({ message: 'Product updated' })
            });
            // Mock the subsequent fetchProducts call
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => ([])
            });

            const { result } = renderHook(() => useProductManagement());

            const success = await act(async () => {
                return await result.current.updateProduct(mockSlug, mockFormData);
            });

            expect(success).toBe(true);
            expect(global.fetch).toHaveBeenCalledWith(`/api/v1/products/${mockSlug}`, {
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
            (global.fetch as jest.Mock).mockResolvedValueOnce({
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
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => ({ message: 'Product deleted' })
            });
            // Mock the subsequent fetchProducts call
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => ([])
            });

            const { result } = renderHook(() => useProductManagement());

            const success = await act(async () => {
                return await result.current.deleteProduct(mockSlug);
            });

            expect(success).toBe(true);
            expect(global.fetch).toHaveBeenCalledWith(`/api/v1/products/${mockSlug}`, {
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
            (global.fetch as jest.Mock).mockResolvedValueOnce({
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
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => ({ message: 'Image deleted' })
            });
            // Mock the subsequent fetchProducts call
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => ([])
            });

            const { result } = renderHook(() => useProductManagement());

            const success = await act(async () => {
                return await result.current.deleteImage(mockSlug, mockImageName);
            });

            expect(success).toBe(true);
            expect(global.fetch).toHaveBeenCalledWith(`/api/v1/products/${mockSlug}/images/test-image.jpg`, {
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
            (global.fetch as jest.Mock).mockResolvedValueOnce({
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
