const mockPrefer = jest.fn();
const mockRequestBody = jest.fn();

const mockPayPalSDK = {
    core: {
        SandboxEnvironment: jest.fn(),
        PayPalHttpClient: jest.fn(() => ({
            execute: jest.fn().mockImplementation((request) => {
                if (request.prefer === mockPrefer && request.requestBody === mockRequestBody) {
                    if (request.constructor.name === "OrdersCreateRequest") {
                        return Promise.resolve({
                            result: {
                                id: "test-order-id",
                                status: "CREATED"
                            }
                        });
                    }
                    if (request.constructor.name === "OrdersCaptureRequest") {
                        return Promise.resolve({
                            result: {
                                id: "test-capture-id",
                                status: "COMPLETED",
                                purchase_units: [{
                                    payments: {
                                        captures: [{
                                            id: "test-transaction-id"
                                        }]
                                    }
                                }]
                            }
                        });
                    }
                }
                return Promise.reject(new Error("Invalid request"));
            })
        }))
    },
    orders: {
        OrdersCreateRequest: jest.fn().mockImplementation(() => ({
            prefer: mockPrefer,
            requestBody: mockRequestBody,
            constructor: { name: "OrdersCreateRequest" }
        })),
        OrdersCaptureRequest: jest.fn().mockImplementation((orderId) => ({
            prefer: mockPrefer,
            requestBody: mockRequestBody,
            constructor: { name: "OrdersCaptureRequest" }
        }))
    }
};

module.exports = mockPayPalSDK;
