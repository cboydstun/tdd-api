// __tests__/mocks/cloudinary.js
const cloudinary = {
    v2: {
        config: jest.fn(),
        uploader: {
            upload: jest.fn().mockImplementation(() => Promise.resolve({
                secure_url: 'https://test-cloudinary-url.com/image.jpg',
                public_id: 'test-public-id'
            })),
            destroy: jest.fn().mockImplementation(() => Promise.resolve({ result: 'ok' }))
        }
    }
};

module.exports = cloudinary;
