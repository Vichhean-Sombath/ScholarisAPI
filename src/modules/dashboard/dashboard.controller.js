const { GetDashboardSummary } = require('./dashboard.service');

const VALID_RANGES = ['weekly', 'monthly', 'yearly'];

const GetDashboard = async (req, res, next) => {
    try {
        const range = VALID_RANGES.includes(req.query.range) ? req.query.range : 'monthly';
        const summary = await GetDashboardSummary(range);

        res.status(200).json({
            message: 'Dashboard summary loaded successfully',
            data: summary,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    GetDashboard,
};
