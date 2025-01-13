// Mock Twilio client
const mockTwilioMessages = {
  create: jest.fn().mockResolvedValue({
    sid: "mock-sid",
    body: "Test message",
    status: "sent",
  }),
};

const mockTwilioClient = {
  messages: mockTwilioMessages,
};

const twilio = jest.fn(() => mockTwilioClient);

module.exports = twilio;
