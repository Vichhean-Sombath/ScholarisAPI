const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error!';

    console.error(`[${req.method}] ${req.path} - ${statusCode}: ${message}`);

    res.status(statusCode).json({
        message: message
    });
};

module.exports = errorHandler;
