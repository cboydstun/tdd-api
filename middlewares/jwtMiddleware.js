require("dotenv").config();
const jwt = require('jsonwebtoken')

// bearer token authentication middleware
const authMiddleware = (req, res, next) => {
    // get the token from the request header
    const token = req.header("Authorization");
    // check if there is a token
    if (!token) {
        res.status(401).json({ error: "Unauthorized: No token provided" });
    } else {
        // verify the token
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            // if there is an error
            if (err) {
                res.status(401).json({ error: "Unauthorized: Invalid token" });
            } else {
                // if the token is valid
                req.user = decoded;
                next();
            }
        });
    }
};
 
module.exports = authMiddleware;