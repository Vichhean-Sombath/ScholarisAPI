const { Op, Sequelize, fn, col, literal } = require('sequelize');
const {
    Payments,
    Invoices,
    Students,
    Teachers,
    Classes,
    ClassEnrollments,
    AcademicYears,
    Semesters,
    Subjects,
    Schedules,
    TimeSlots,
    AttendanceRecords,
    Grades,
    FinalGrades,
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

const getRevenueTrend = async (range = 'monthly', filters = {}) => {
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

    const where = { payment_date: { [Op.gte]: since } };
    if (filters.semesterId) {
        where.semester_id = filters.semesterId;
    }

    const rows = await Payments.findAll({
        attributes: [
            [fn('DATE_FORMAT', col('payment_date'), dbGroupFormat), 'period'],
            [fn('SUM', col('amount')), 'total'],
        ],
        where,
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

const getFinancialReports = async (range, filters) => {
    const invoiceWhere = {};
    const paymentWhere = {};
    if (filters.semesterId) {
        invoiceWhere.semester_id = filters.semesterId;
        paymentWhere.semester_id = filters.semesterId;
    }

    const [totalRevenue, totalBilled, totalPaid, outstandingCount, revenueTrend, paymentMethods, outstandingRows] = await Promise.all([
        Payments.sum('amount', { where: paymentWhere }),
        Invoices.sum('total_amount', { where: invoiceWhere }),
        Invoices.sum('amount_paid', { where: invoiceWhere }),
        Invoices.count({
            where: {
                ...invoiceWhere,
                status: { [Op.in]: ['Unpaid', 'Partial', 'Overdue'] },
            },
        }),
        getRevenueTrend(range, filters),
        Payments.findAll({
            attributes: ['payment_method', [fn('SUM', col('amount')), 'total']],
            where: paymentWhere,
            group: ['payment_method'],
            raw: true,
        }),
        Invoices.findAll({
            attributes: ['invoice_id', 'invoice_number', 'issue_date', 'due_date', 'total_amount', 'amount_paid', 'status'],
            where: {
                ...invoiceWhere,
                status: { [Op.in]: ['Unpaid', 'Partial', 'Overdue'] },
            },
            include: [{ model: Students, attributes: ['first_name', 'last_name'] }],
            order: [['due_date', 'DESC']],
            limit: 50,
            raw: true,
            nest: true,
        }),
    ]);

    const revenue = Number(totalRevenue || 0);
    const billed = Number(totalBilled || 0);
    const paid = Number(totalPaid || 0);
    const outstanding = billed - paid;
    const collectionRate = billed > 0 ? Number(((paid / billed) * 100).toFixed(1)) : 0;

    const formattedOutstandingRows = outstandingRows.map((r) => {
        const student = r.Student || {};
        const balance = Number(r.total_amount || 0) - Number(r.amount_paid || 0);
        return {
            invoiceId: r.invoice_id,
            invoiceNumber: r.invoice_number,
            studentName: `${student.first_name || ''} ${student.last_name || ''}`.trim() || '—',
            issueDate: r.issue_date,
            dueDate: r.due_date,
            totalAmount: Number(r.total_amount || 0),
            amountPaid: Number(r.amount_paid || 0),
            balanceDue: balance,
            status: r.status,
        };
    });

    return {
        totalRevenue: revenue,
        totalRevenueFormatted: formatCurrency(revenue),
        totalOutstanding: outstanding,
        totalOutstandingFormatted: formatCurrency(outstanding),
        collectionRate,
        outstandingInvoicesCount: outstandingCount,
        revenueTrend,
        paymentMethods: paymentMethods.map((m) => ({ name: m.payment_method || 'Other', value: Number(m.total || 0) })),
        outstandingInvoices: {
            totalCount: outstandingCount,
            totalAmount: outstanding,
            totalAmountFormatted: formatCurrency(outstanding),
            rows: formattedOutstandingRows,
        },
    };
};

const getEnrollmentReports = async (filters) => {
    const studentWhere = {};
    const classWhere = {};
    if (filters.semesterId) {
        classWhere.semester_id = filters.semesterId;
    }
    if (filters.academicYearId) {
        classWhere.academic_year_id = filters.academicYearId;
    }

    const [totalStudents, activeStudents, inactiveStudents, newStudentsTrend, statusRows, genderRows, classes] = await Promise.all([
        Students.count(),
        Students.count({ where: { status: 'Active' } }),
        Students.count({ where: { status: 'Inactive' } }),
        getNewStudentsTrend(),
        Students.findAll({
            attributes: ['status', [fn('COUNT', col('student_id')), 'count']],
            group: ['status'],
            raw: true,
        }),
        Students.findAll({
            attributes: ['gender', [fn('COUNT', col('student_id')), 'count']],
            where: { gender: { [Op.ne]: '' } },
            group: ['gender'],
            raw: true,
        }),
        Classes.findAll({
            where: classWhere,
            attributes: ['class_id', 'class_name', 'max_capacity', 'academic_year_id', 'semester_id'],
            include: [
                { model: AcademicYears, attributes: ['year_name'] },
                { model: Semesters, attributes: ['semester_name'] },
                { model: ClassEnrollments, attributes: ['enrollment_id'], where: { status: 'Active' }, required: false },
            ],
            raw: true,
            nest: true,
        }),
    ]);

    const classCapacity = classes.map((c) => {
        const enrolled = Array.isArray(c.ClassEnrollments) ? c.ClassEnrollments.length : 0;
        const max = Number(c.max_capacity || 0);
        return {
            classId: c.class_id,
            className: c.class_name,
            academicYearName: c.AcademicYear?.year_name || '—',
            semesterName: c.Semester?.semester_name || '—',
            maxCapacity: max,
            enrolled,
            available: max > 0 ? max - enrolled : 0,
            utilizationPercent: max > 0 ? Number(((enrolled / max) * 100).toFixed(1)) : 0,
        };
    });

    const avgUtilization = classCapacity.length > 0
        ? Number((classCapacity.reduce((sum, c) => sum + c.utilizationPercent, 0) / classCapacity.length).toFixed(1))
        : 0;

    return {
        totalStudents,
        activeStudents,
        inactiveStudents,
        newStudentsTrend,
        statusDistribution: statusRows.map((r) => ({ name: r.status || 'Unknown', value: Number(r.count || 0) })),
        genderDistribution: genderRows.map((r) => ({ name: r.gender || 'Unknown', value: Number(r.count || 0) })),
        classCapacity,
        averageUtilization: avgUtilization,
    };
};

const getAcademicReports = async (filters) => {
    const scheduleWhere = {};
    const finalGradeWhere = {};
    if (filters.semesterId) {
        scheduleWhere.semester_id = filters.semesterId;
        finalGradeWhere.semester_id = filters.semesterId;
    }
    if (filters.academicYearId) {
        scheduleWhere.academic_year_id = filters.academicYearId;
    }

    const [attendanceRows, attendanceByClassRows, gradeRows, finalGradeRows, totalGraded] = await Promise.all([
        AttendanceRecords.findAll({
            attributes: ['status', [fn('COUNT', col('attendance_id')), 'count']],
            group: ['status'],
            raw: true,
        }),
        AttendanceRecords.findAll({
            attributes: [
                [col('Schedule.class_id'), 'class_id'],
                [col('Schedule.Class.class_name'), 'class_name'],
                'status',
                [fn('COUNT', col('attendance_id')), 'count'],
            ],
            include: [
                {
                    model: Schedules,
                    attributes: [],
                    where: scheduleWhere,
                    include: [{ model: Classes, attributes: [] }],
                },
            ],
            group: ['Schedule.class_id', 'status'],
            raw: true,
        }),
        FinalGrades.findAll({
            attributes: [
                [col('Class.class_id'), 'class_id'],
                [col('Class.class_name'), 'class_name'],
                [col('Subject.subject_id'), 'subject_id'],
                [col('Subject.subject_name'), 'subject_name'],
                [fn('AVG', col('final_score')), 'average_score'],
                [fn('COUNT', col('final_grade_id')), 'student_count'],
            ],
            where: finalGradeWhere,
            include: [
                { model: Classes, attributes: [] },
                { model: Subjects, attributes: [] },
            ],
            group: ['Class.class_id', 'Subject.subject_id'],
            raw: true,
        }),
        FinalGrades.findAll({
            attributes: ['letter_grade', [fn('COUNT', col('final_grade_id')), 'count']],
            where: finalGradeWhere,
            group: ['letter_grade'],
            raw: true,
        }),
        FinalGrades.count({ where: finalGradeWhere }),
    ]);

    const statusCounts = { Present: 0, Absent: 0, Late: 0, Excused: 0 };
    let totalAttendance = 0;
    attendanceRows.forEach((r) => {
        const status = r.status;
        const count = Number(r.count || 0);
        if (statusCounts[status] !== undefined) {
            statusCounts[status] = count;
        }
        totalAttendance += count;
    });

    const presentRate = totalAttendance > 0 ? Number(((statusCounts.Present / totalAttendance) * 100).toFixed(1)) : 0;
    const absentRate = totalAttendance > 0 ? Number(((statusCounts.Absent / totalAttendance) * 100).toFixed(1)) : 0;

    const classAttendanceMap = {};
    attendanceByClassRows.forEach((r) => {
        const id = r.class_id;
        if (!classAttendanceMap[id]) {
            classAttendanceMap[id] = { classId: id, className: r.class_name || '—', Present: 0, Absent: 0, Late: 0, Excused: 0, total: 0 };
        }
        const count = Number(r.count || 0);
        if (classAttendanceMap[id][r.status] !== undefined) {
            classAttendanceMap[id][r.status] += count;
        }
        classAttendanceMap[id].total += count;
    });
    const attendanceByClass = Object.values(classAttendanceMap).map((c) => ({
        ...c,
        presentRate: c.total > 0 ? Number(((c.Present / c.total) * 100).toFixed(1)) : 0,
    }));

    const avgScore = gradeRows.length > 0
        ? Number((gradeRows.reduce((sum, r) => sum + Number(r.average_score || 0), 0) / gradeRows.length).toFixed(2))
        : 0;

    const gradesByClassSubject = gradeRows.map((r) => ({
        classId: r.class_id,
        className: r.class_name,
        subjectId: r.subject_id,
        subjectName: r.subject_name,
        averageScore: Number(Number(r.average_score || 0).toFixed(2)),
        studentCount: Number(r.student_count || 0),
    }));

    const gradeOrder = ['A', 'B', 'C', 'D', 'F'];
    const finalGradeDistribution = gradeOrder.map((grade) => {
        const row = finalGradeRows.find((r) => r.letter_grade === grade);
        return { name: grade, value: Number(row?.count || 0) };
    });

    return {
        attendanceSummary: {
            present: statusCounts.Present,
            absent: statusCounts.Absent,
            late: statusCounts.Late,
            excused: statusCounts.Excused,
            total: totalAttendance,
            presentRate,
            absentRate,
        },
        attendanceByClass,
        gradesByClassSubject,
        finalGradeDistribution,
        averageFinalScore: avgScore,
        totalGradedRecords: totalGraded,
    };
};

const getTeacherWorkloadReports = async (filters) => {
    const classWhere = {};
    const scheduleWhere = {};
    if (filters.semesterId) {
        classWhere.semester_id = filters.semesterId;
        scheduleWhere.semester_id = filters.semesterId;
    }
    if (filters.academicYearId) {
        classWhere.academic_year_id = filters.academicYearId;
        scheduleWhere.academic_year_id = filters.academicYearId;
    }

    const [totalTeachers, homeroomRows, scheduleRows, subjectRows] = await Promise.all([
        Teachers.count({ include: [{ model: require('../../models/users.model'), where: { status: 'Active' } }] }),
        Classes.findAll({
            attributes: ['homeroom_teacher_id', [fn('COUNT', col('class_id')), 'count']],
            where: { homeroom_teacher_id: { [Op.ne]: null }, ...classWhere },
            group: ['homeroom_teacher_id'],
            raw: true,
        }),
        Schedules.findAll({
            attributes: [
                'teacher_id',
                [fn('COUNT', col('schedule_id')), 'total_slots'],
                [fn('COUNT', fn('DISTINCT', col('class_id'))), 'scheduled_classes'],
                [col('TimeSlot.day_of_week'), 'day_of_week'],
            ],
            where: scheduleWhere,
            include: [{ model: TimeSlots, attributes: [] }],
            group: ['teacher_id', 'TimeSlot.day_of_week'],
            raw: true,
        }),
        Schedules.findAll({
            attributes: [
                'teacher_id',
                [fn('COUNT', fn('DISTINCT', col('subject_id'))), 'unique_subjects'],
            ],
            where: scheduleWhere,
            group: ['teacher_id'],
            raw: true,
        }),
    ]);

    const teachers = await Teachers.findAll({
        attributes: ['teacher_id', 'first_name', 'last_name'],
        include: [{ model: require('../../models/users.model'), where: { status: 'Active' }, attributes: [] }],
        raw: true,
    });

    const workload = teachers.map((t) => {
        const teacherId = t.teacher_id;
        const homeroom = homeroomRows.find((r) => Number(r.homeroom_teacher_id) === teacherId);
        const teacherScheduleRows = scheduleRows.filter((r) => Number(r.teacher_id) === teacherId);
        const subjectRow = subjectRows.find((r) => Number(r.teacher_id) === teacherId);

        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const dailySlotDensity = {};
        days.forEach((day) => { dailySlotDensity[day] = 0; });
        let totalWeeklySlots = 0;
        teacherScheduleRows.forEach((r) => {
            const count = Number(r.total_slots || 0);
            if (r.day_of_week && dailySlotDensity[r.day_of_week] !== undefined) {
                dailySlotDensity[r.day_of_week] += count;
            }
            totalWeeklySlots += count;
        });

        return {
            teacherId,
            teacherName: `${t.first_name || ''} ${t.last_name || ''}`.trim() || '—',
            homeroomClasses: Number(homeroom?.count || 0),
            scheduledClasses: Number(teacherScheduleRows[0]?.scheduled_classes || 0),
            uniqueSubjects: Number(subjectRow?.unique_subjects || 0),
            totalWeeklySlots,
            dailySlotDensity,
        };
    });

    const avgClasses = totalTeachers > 0 ? Number((workload.reduce((sum, w) => sum + w.scheduledClasses, 0) / totalTeachers).toFixed(1)) : 0;
    const avgSlots = totalTeachers > 0 ? Number((workload.reduce((sum, w) => sum + w.totalWeeklySlots, 0) / totalTeachers).toFixed(1)) : 0;
    const avgSubjects = totalTeachers > 0 ? Number((workload.reduce((sum, w) => sum + w.uniqueSubjects, 0) / totalTeachers).toFixed(1)) : 0;

    return {
        totalTeachers,
        averageClassesPerTeacher: avgClasses,
        averageScheduleSlotsPerTeacher: avgSlots,
        averageSubjectsPerTeacher: avgSubjects,
        workload,
    };
};

const GetReportsSummary = async ({ range = 'monthly', academicYearId = null, semesterId = null } = {}) => {
    const filters = { academicYearId, semesterId };

    const [financial, enrollment, academic, teacherWorkload] = await Promise.all([
        getFinancialReports(range, filters),
        getEnrollmentReports(filters),
        getAcademicReports(filters),
        getTeacherWorkloadReports(filters),
    ]);

    return {
        financial,
        enrollment,
        academic,
        teacherWorkload,
    };
};

module.exports = {
    GetReportsSummary,
};
