// jwtMiddleware:
require("dotenv").config();
const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({
            error: 'Unauthorized, Token not provided'
        });
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2) {
        return res.status(401).json({
            error: 'Token error'
        });
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).json({
            error: 'Token malformatted'
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                error: 'Unauthorized, Token invalid'
            });
        }
        req.userId = decoded.id;
        next();
    });
};

module.exports = authMiddleware;