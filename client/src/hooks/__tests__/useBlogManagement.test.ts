import { renderHook, act } from '@testing-library/react';
import axios from 'axios';
import { useBlogManagement } from '../useBlogManagement';
import { BlogFormData } from '../../types/blog';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('useBlogManagement', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should initialize with default values', () => {
        const { result } = renderHook(() => useBlogManagement());

        expect(result.current.blogs).toEqual([]);
        expect(result.current.loading).toBe(true);
        expect(result.current.error).toBe(null);
    });

    describe('fetchBlogs', () => {
        it('should fetch blogs successfully', async () => {
            const mockBlogs = [
                {
                    _id: '1',
                    title: 'Test Blog 1',
                    slug: 'test-blog-1',
                    introduction: 'Intro 1',
                    body: 'Body 1',
                    conclusion: 'Conclusion 1',
                    status: 'published' as const
                },
                {
                    _id: '2',
                    title: 'Test Blog 2',
                    slug: 'test-blog-2',
                    introduction: 'Intro 2',
                    body: 'Body 2',
                    conclusion: 'Conclusion 2',
                    status: 'draft' as const
                }
            ];
            mockedAxios.get.mockResolvedValueOnce({ data: mockBlogs });

            const { result } = renderHook(() => useBlogManagement());

            await act(async () => {
                await result.current.fetchBlogs();
            });

            expect(mockedAxios.get).toHaveBeenCalledWith('/api/v1/blogs');
            expect(result.current.blogs).toEqual(mockBlogs);
            expect(result.current.loading).toBe(false);
            expect(result.current.error).toBe(null);
        });

        it('should handle fetch blogs error', async () => {
            mockedAxios.get.mockRejectedValueOnce(new Error('Failed to fetch'));

            const { result } = renderHook(() => useBlogManagement());

            await act(async () => {
                await result.current.fetchBlogs();
            });

            expect(mockedAxios.get).toHaveBeenCalledWith('/api/v1/blogs');
            expect(result.current.blogs).toEqual([]);
            expect(result.current.loading).toBe(false);
            expect(result.current.error).toBe('Failed to fetch blogs');
        });
    });

    describe('createBlog', () => {
        it('should create blog successfully', async () => {
            const mockBlogData: BlogFormData = {
                title: 'New Blog',
                introduction: 'Test Introduction',
                body: 'Test Body',
                conclusion: 'Test Conclusion',
                status: 'draft',
                categories: 'cat1, cat2',
                tags: 'tag1, tag2'
            };

            mockedAxios.post.mockResolvedValueOnce({});
            mockedAxios.get.mockResolvedValueOnce({ data: [] }); // For the subsequent fetchBlogs call

            const { result } = renderHook(() => useBlogManagement());

            const success = await act(async () => {
                return await result.current.createBlog(mockBlogData);
            });

            expect(success).toBe(true);
            expect(mockedAxios.post).toHaveBeenCalledWith('/api/v1/blogs', {
                ...mockBlogData,
                categories: ['cat1', 'cat2'],
                tags: ['tag1', 'tag2']
            });
            expect(mockedAxios.get).toHaveBeenCalledWith('/api/v1/blogs');
        });

        it('should handle create blog error', async () => {
            const mockBlogData: BlogFormData = {
                title: 'New Blog',
                introduction: 'Test Introduction',
                body: 'Test Body',
                conclusion: 'Test Conclusion',
                status: 'draft'
            };

            mockedAxios.post.mockRejectedValueOnce(new Error('Failed to create'));

            const { result } = renderHook(() => useBlogManagement());

            const success = await act(async () => {
                return await result.current.createBlog(mockBlogData);
            });

            expect(success).toBe(false);
            expect(result.current.error).toBe('Failed to create blog');
        });
    });

    describe('updateBlog', () => {
        it('should update blog successfully', async () => {
            const mockBlogData: BlogFormData = {
                title: 'Updated Blog',
                introduction: 'Updated Introduction',
                body: 'Updated Body',
                conclusion: 'Updated Conclusion',
                status: 'published',
                categories: 'cat1, cat2',
                tags: 'tag1, tag2'
            };

            mockedAxios.put.mockResolvedValueOnce({});
            mockedAxios.get.mockResolvedValueOnce({ data: [] }); // For the subsequent fetchBlogs call

            const { result } = renderHook(() => useBlogManagement());

            const success = await act(async () => {
                return await result.current.updateBlog('test-slug', mockBlogData);
            });

            expect(success).toBe(true);
            expect(mockedAxios.put).toHaveBeenCalledWith('/api/v1/blogs/test-slug', {
                ...mockBlogData,
                categories: ['cat1', 'cat2'],
                tags: ['tag1', 'tag2']
            });
            expect(mockedAxios.get).toHaveBeenCalledWith('/api/v1/blogs');
        });

        it('should handle update blog error', async () => {
            const mockBlogData: BlogFormData = {
                title: 'Updated Blog',
                introduction: 'Updated Introduction',
                body: 'Updated Body',
                conclusion: 'Updated Conclusion',
                status: 'draft'
            };

            mockedAxios.put.mockRejectedValueOnce(new Error('Failed to update'));

            const { result } = renderHook(() => useBlogManagement());

            const success = await act(async () => {
                return await result.current.updateBlog('test-slug', mockBlogData);
            });

            expect(success).toBe(false);
            expect(result.current.error).toBe('Failed to update blog');
        });
    });

    describe('deleteBlog', () => {
        it('should delete blog successfully', async () => {
            mockedAxios.delete.mockResolvedValueOnce({});
            mockedAxios.get.mockResolvedValueOnce({ data: [] }); // For the subsequent fetchBlogs call

            const { result } = renderHook(() => useBlogManagement());

            const success = await act(async () => {
                return await result.current.deleteBlog('test-slug');
            });

            expect(success).toBe(true);
            expect(mockedAxios.delete).toHaveBeenCalledWith('/api/v1/blogs/test-slug');
            expect(mockedAxios.get).toHaveBeenCalledWith('/api/v1/blogs');
        });

        it('should handle delete blog error', async () => {
            mockedAxios.delete.mockRejectedValueOnce(new Error('Failed to delete'));

            const { result } = renderHook(() => useBlogManagement());

            const success = await act(async () => {
                return await result.current.deleteBlog('test-slug');
            });

            expect(success).toBe(false);
            expect(result.current.error).toBe('Failed to delete blog');
        });
    });
});
