const { Op, Sequelize, fn, col, literal } = require('sequelize');
const {
    Payments,
    Students,
    Teachers,
    Classes,
    Invoices,
    ClassEnrollments,
} = require('../../models/mappingContext');

const formatCurrency = (value) => {
    const num = Number(value || 0);
    return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const formatMonthLabel = (date) => {
    const d = new Date(date);
    return d.toLocaleString('en-US', { month: 'short', year: 'numeric' });
};

const formatDayLabel = (date) => {
    const d = new Date(date);
    return d.toLocaleString('en-US', { month: 'short', day: 'numeric' });
};

const formatYearLabel = (date) => {
    const d = new Date(date);
    return d.getFullYear().toString();
};

const dayKey = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const monthKey = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

const getRevenueTrend = async (range = 'monthly') => {
    const now = new Date();
    let since;
    let formatLabel;
    let groupKey;
    let dbGroupFormat;
    let periods = [];

    if (range === 'weekly') {
        since = new Date(now);
        since.setDate(since.getDate() - 6);
        since.setHours(0, 0, 0, 0);
        formatLabel = formatDayLabel;
        groupKey = dayKey;
        dbGroupFormat = '%Y-%m-%d';
        for (let i = 6; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            d.setHours(0, 0, 0, 0);
            periods.push({ date: d, key: dayKey(d) });
        }
    } else if (range === 'yearly') {
        since = new Date(now);
        since.setFullYear(since.getFullYear() - 4);
        since.setMonth(0, 1);
        since.setHours(0, 0, 0, 0);
        formatLabel = formatYearLabel;
        groupKey = (d) => d.getFullYear().toString();
        dbGroupFormat = '%Y';
        for (let i = 4; i >= 0; i--) {
            const d = new Date(now);
            d.setFullYear(d.getFullYear() - i);
            d.setMonth(0, 1);
            periods.push({ date: d, key: d.getFullYear().toString() });
        }
    } else {
        since = new Date(now.getFullYear(), now.getMonth(), 1);
        since.setHours(0, 0, 0, 0);
        formatLabel = formatDayLabel;
        groupKey = dayKey;
        dbGroupFormat = '%Y-%m-%d';
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        for (let day = 1; day <= lastDay; day++) {
            const d = new Date(now.getFullYear(), now.getMonth(), day);
            periods.push({ date: d, key: dayKey(d) });
        }
    }

    const rows = await Payments.findAll({
        attributes: [
            [fn('DATE_FORMAT', col('payment_date'), dbGroupFormat), 'period'],
            [fn('SUM', col('amount')), 'total'],
        ],
        where: {
            payment_date: { [Op.gte]: since },
        },
        group: [literal('period')],
        order: [[literal('period'), 'ASC']],
        raw: true,
    });

    const labels = periods.map((p) => formatLabel(p.date));
    const data = periods.map((p) => {
        const row = rows.find((r) => r.period === p.key);
        return Number(row?.total || 0);
    });

    return { labels, data };
};

const getMonthlyComparison = async () => {
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const previousMonthEnd = new Date(currentMonthStart.getTime() - 1);

    const [currentTotal, previousTotal] = await Promise.all([
        Payments.sum('amount', {
            where: {
                payment_date: { [Op.gte]: currentMonthStart },
            },
        }),
        Payments.sum('amount', {
            where: {
                payment_date: {
                    [Op.gte]: previousMonthStart,
                    [Op.lte]: previousMonthEnd,
                },
            },
        }),
    ]);

    const current = Number(currentTotal || 0);
    const previous = Number(previousTotal || 0);
    const difference = current - previous;
    const percent = previous === 0 ? (current > 0 ? 100 : 0) : (difference / previous) * 100;

    return {
        current,
        currentFormatted: formatCurrency(current),
        previous,
        previousFormatted: formatCurrency(previous),
        difference,
        differenceFormatted: formatCurrency(Math.abs(difference)),
        percent: Math.abs(Number(percent.toFixed(1))),
        direction: difference >= 0 ? 'up' : 'down',
    };
};

const getPaymentMethods = async () => {
    const rows = await Payments.findAll({
        attributes: ['payment_method', [fn('SUM', col('amount')), 'total']],
        group: ['payment_method'],
        raw: true,
    });

    return rows.map((r) => ({
        name: r.payment_method || 'Other',
        value: Number(r.total || 0),
    }));
};

const getInvoiceStatus = async () => {
    const rows = await Invoices.findAll({
        attributes: ['status', [fn('COUNT', col('invoice_id')), 'count']],
        group: ['status'],
        raw: true,
    });

    return rows.map((r) => ({
        name: r.status,
        value: Number(r.count || 0),
    }));
};

const getNewStudentsTrend = async () => {
    const now = new Date();
    const since = new Date(now);
    since.setMonth(since.getMonth() - 5);
    since.setDate(1);
    since.setHours(0, 0, 0, 0);

    const rows = await Students.findAll({
        attributes: [
            [fn('DATE_FORMAT', col('enrollment_date'), '%Y-%m'), 'month'],
            [fn('COUNT', col('student_id')), 'count'],
        ],
        where: {
            enrollment_date: { [Op.gte]: since },
        },
        group: [literal('month')],
        order: [[literal('month'), 'ASC']],
        raw: true,
    });

    const labels = [];
    const data = [];
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now);
        d.setMonth(d.getMonth() - i);
        d.setDate(1);
        const key = monthKey(d);
        const row = rows.find((r) => r.month === key);
        labels.push(formatMonthLabel(d));
        data.push(Number(row?.count || 0));
    }

    return { labels, data };
};

const getRecentPayments = async () => {
    const rows = await Payments.findAll({
        attributes: ['payment_id', 'payment_date', 'amount', 'payment_method'],
        include: [
            {
                model: Invoices,
                attributes: ['invoice_number'],
            },
        ],
        order: [['payment_date', 'DESC']],
        limit: 5,
        raw: true,
        nest: true,
    });

    return rows.map((r) => ({
        id: r.payment_id,
        invoiceNumber: r.Invoice?.invoice_number || '—',
        amount: Number(r.amount || 0),
        method: r.payment_method,
        date: r.payment_date,
    }));
};

const GetDashboardSummary = async (range = 'monthly') => {
    const [totalRevenue, totalStudents, totalTeachers, totalClasses, revenueTrend, monthlyComparison, paymentMethods, invoiceStatus, newStudentsTrend, recentPayments] = await Promise.all([
        Payments.sum('amount'),
        Students.count(),
        Teachers.count(),
        Classes.count(),
        getRevenueTrend(range),
        getMonthlyComparison(),
        getPaymentMethods(),
        getInvoiceStatus(),
        getNewStudentsTrend(),
        getRecentPayments(),
    ]);

    return {
        kpis: {
            totalRevenue: Number(totalRevenue || 0),
            totalRevenueFormatted: formatCurrency(totalRevenue),
            totalStudents,
            totalTeachers,
            totalClasses,
        },
        revenueTrend,
        monthlyComparison,
        paymentMethods,
        invoiceStatus,
        newStudentsTrend,
        recentPayments,
    };
};

module.exports = {
    GetDashboardSummary,
};
