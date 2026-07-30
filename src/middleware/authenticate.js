const jwt = require('jsonwebtoken');

const AccessToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        const err = new Error('Access denied. No token provided!');
        err.statusCode = 401;
        return next(err);
    }

    const BearerToken = authHeader.substring(7).trim();

    try {
        const decoded = jwt.verify(BearerToken, process.env.SECRET_KEY);
        req.user = decoded;
        req.token = BearerToken;
        next();
    } catch (error) {
        const err = new Error('Invalid or expired token!');
        err.statusCode = 401;
        next(err);
    }
}

module.exports = AccessToken;