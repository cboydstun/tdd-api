// Node.js and Express.js JWT middleware:

require("dotenv").config();
const jwt = require('jsonwebtoken')

// bearer token authentication middleware
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({
            error: 'Unauthorized, Token not provided'
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                error: 'Unauthorized, Token invalid'
            });
        }
        req.decoded = decoded;
        next();
    });
};

module.exports = authMiddleware;