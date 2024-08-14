// middlewares/uploadMiddleware.js
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        // Remove the leading number and hyphen
        const fileName = file.originalname.replace(/^\d+-/, '');
        cb(null, fileName)
    }
});

const upload = multer({ storage: storage });

module.exports = upload;