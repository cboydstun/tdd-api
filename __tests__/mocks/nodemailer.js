const mockSendMail = jest.fn().mockImplementation((mailOptions, callback) => {
    callback(null, { response: 'Email sent' });
});

const mockTransporter = {
    sendMail: mockSendMail
};

const nodemailer = {
    createTransport: jest.fn().mockReturnValue(mockTransporter)
};

module.exports = nodemailer;
