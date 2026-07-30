const { GetReportsSummary } = require('./reports.service');

const VALID_RANGES = ['weekly', 'monthly', 'yearly'];

const GetReports = async (req, res, next) => {
    try {
        const range = VALID_RANGES.includes(req.query.range) ? req.query.range : 'monthly';
        const academicYearId = req.query.academicYearId ? Number(req.query.academicYearId) : null;
        const semesterId = req.query.semesterId ? Number(req.query.semesterId) : null;

        const summary = await GetReportsSummary({ range, academicYearId, semesterId });

        res.status(200).json({
            message: 'Reports summary loaded successfully',
            data: summary,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    GetReports,
};
