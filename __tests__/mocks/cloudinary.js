// __tests__/mocks/cloudinary.js
jest.mock('cloudinary', () => ({
  config: jest.fn(),
  v2: {
    config: jest.fn(),
    api_key: "test-api-key",
    api_secret: "test-api-secret",
    cloud_name: "test-cloud-name",
    uploader: {
      upload: jest.fn().mockImplementation(() =>
        Promise.resolve({
          secure_url: "https://test-cloudinary-url.com/image.jpg",
          public_id: "test-public-id",
        }),
      ),
      destroy: jest
        .fn()
        .mockImplementation(() => Promise.resolve({ result: "ok" })),
    },
  },
}));
