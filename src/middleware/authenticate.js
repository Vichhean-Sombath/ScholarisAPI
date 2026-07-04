const jwt = require('jsonwebtoken');

const AccessToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({ message: 'Access denied. No token provided!'});
    }

    const BearerToken = authHeader.substring(7).trim();

    try {
        const decoded = jwt.verify(BearerToken, process.env.SECRET_KEY);
        req.user = decoded;
        req.token = BearerToken; // Automatically added bearer token for user after logged in
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token!'})
    }
}

module.exports = AccessToken;