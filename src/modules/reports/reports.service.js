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

const sumAmount = async (model, query = {}, field = 'amount') => {
    const result = await model.aggregate([
        { $match: query },
        { $group: { _id: null, total: { $sum: `$${field}` } } }
    ]);
    return result.length > 0 ? result[0].total : 0;
};

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

    const where = { payment_date: { $gte: since } };
    if (filters.semesterId) {
        where.semester_id = Number(filters.semesterId);
    }

    const rows = await Payments.aggregate([
        { $match: where },
        {
            $group: {
                _id: {
                    $dateToString: {
                        format: dbGroupFormat,
                        date: '$payment_date'
                    }
                },
                total: { $sum: '$amount' }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    const mappedRows = rows.map(r => ({
        period: r._id,
        total: r.total
    }));

    const labels = periods.map((p) => formatLabel(p.date));
    const data = periods.map((p) => {
        const row = mappedRows.find((r) => r.period === p.key);
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

    const rows = await Students.aggregate([
        { $match: { enrollment_date: { $gte: since } } },
        {
            $group: {
                _id: {
                    $dateToString: {
                        format: '%Y-%m',
                        date: '$enrollment_date'
                    }
                },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    const mappedRows = rows.map(r => ({
        month: r._id,
        count: r.count
    }));

    const labels = [];
    const data = [];
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now);
        d.setMonth(d.getMonth() - i);
        d.setDate(1);
        const key = monthKey(d);
        const row = mappedRows.find((r) => r.month === key);
        labels.push(formatMonthLabel(d));
        data.push(Number(row?.count || 0));
    }

    return { labels, data };
};

const getFinancialReports = async (range, filters) => {
    const invoiceWhere = {};
    const paymentWhere = {};
    if (filters.semesterId) {
        invoiceWhere.semester_id = Number(filters.semesterId);
        paymentWhere.semester_id = Number(filters.semesterId);
    }

    const [totalRevenue, totalBilled, totalPaid, outstandingCount, revenueTrend, rawPaymentMethods, outstandingRows] = await Promise.all([
        sumAmount(Payments, paymentWhere, 'amount'),
        sumAmount(Invoices, invoiceWhere, 'total_amount'),
        sumAmount(Invoices, invoiceWhere, 'amount_paid'),
        Invoices.countDocuments({
            ...invoiceWhere,
            status: { $in: ['Unpaid', 'Partial', 'Overdue'] },
        }),
        getRevenueTrend(range, filters),
        Payments.aggregate([
            { $match: paymentWhere },
            {
                $group: {
                    _id: '$payment_method',
                    total: { $sum: '$amount' }
                }
            }
        ]),
        Invoices.find({
            ...invoiceWhere,
            status: { $in: ['Unpaid', 'Partial', 'Overdue'] },
        })
        .populate({ path: 'student', select: 'first_name last_name' })
        .sort({ due_date: -1 })
        .limit(50)
        .lean(),
    ]);

    const revenue = Number(totalRevenue || 0);
    const billed = Number(totalBilled || 0);
    const paid = Number(totalPaid || 0);
    const outstanding = billed - paid;
    const collectionRate = billed > 0 ? Number(((paid / billed) * 100).toFixed(1)) : 0;

    const formattedOutstandingRows = outstandingRows.map((r) => {
        const student = r.student || {};
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
        paymentMethods: rawPaymentMethods.map((m) => ({ name: m._id || 'Other', value: Number(m.total || 0) })),
        outstandingInvoices: {
            totalCount: outstandingCount,
            totalAmount: outstanding,
            totalAmountFormatted: formatCurrency(outstanding),
            rows: formattedOutstandingRows,
        },
    };
};

const getEnrollmentReports = async (filters) => {
    const classWhere = {};
    if (filters.semesterId) {
        classWhere.semester_id = Number(filters.semesterId);
    }
    if (filters.academicYearId) {
        classWhere.academic_year_id = Number(filters.academicYearId);
    }

    const [totalStudents, activeStudents, inactiveStudents, newStudentsTrend, statusRows, genderRows, classes] = await Promise.all([
        Students.countDocuments(),
        Students.countDocuments({ status: 'Active' }),
        Students.countDocuments({ status: 'Inactive' }),
        getNewStudentsTrend(),
        Students.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]),
        Students.aggregate([
            { $match: { gender: { $ne: '' } } },
            { $group: { _id: '$gender', count: { $sum: 1 } } }
        ]),
        Classes.find(classWhere)
            .populate({ path: 'academicYear', select: 'year_name' })
            .populate({ path: 'semester', select: 'semester_name' })
            .populate({ path: 'classEnrollments', match: { status: 'Active' } })
            .lean(),
    ]);

    const classCapacity = classes.map((c) => {
        const enrolled = Array.isArray(c.classEnrollments) ? c.classEnrollments.length : 0;
        const max = Number(c.max_capacity || 0);
        return {
            classId: c.class_id,
            className: c.class_name,
            academicYearName: c.academicYear?.year_name || '—',
            semesterName: c.semester?.semester_name || '—',
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
        statusDistribution: statusRows.map((r) => ({ name: r._id || 'Unknown', value: Number(r.count || 0) })),
        genderDistribution: genderRows.map((r) => ({ name: r._id || 'Unknown', value: Number(r.count || 0) })),
        classCapacity,
        averageUtilization: avgUtilization,
    };
};

const getAcademicReports = async (filters) => {
    const scheduleWhere = {};
    const finalGradeWhere = {};
    if (filters.semesterId) {
        scheduleWhere.semester_id = Number(filters.semesterId);
        finalGradeWhere.semester_id = Number(filters.semesterId);
    }
    if (filters.academicYearId) {
        scheduleWhere.academic_year_id = Number(filters.academicYearId);
    }

    const [attendanceRows, attendanceByClassRows, gradeRows, finalGradeRows, totalGraded] = await Promise.all([
        AttendanceRecords.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]),
        AttendanceRecords.aggregate([
            {
                $lookup: {
                    from: 'schedules',
                    localField: 'schedule_id',
                    foreignField: 'schedule_id',
                    as: 'schedule'
                }
            },
            { $unwind: '$schedule' },
            {
                $match: Object.keys(scheduleWhere).reduce((acc, k) => {
                    acc[`schedule.${k}`] = scheduleWhere[k];
                    return acc;
                }, {})
            },
            {
                $lookup: {
                    from: 'classes',
                    localField: 'schedule.class_id',
                    foreignField: 'class_id',
                    as: 'class'
                }
            },
            { $unwind: '$class' },
            {
                $group: {
                    _id: {
                        class_id: '$schedule.class_id',
                        class_name: '$class.class_name',
                        status: '$status'
                    },
                    count: { $sum: 1 }
                }
            }
        ]),
        FinalGrades.aggregate([
            { $match: finalGradeWhere },
            {
                $lookup: {
                    from: 'classes',
                    localField: 'class_id',
                    foreignField: 'class_id',
                    as: 'class'
                }
            },
            { $unwind: '$class' },
            {
                $lookup: {
                    from: 'subjects',
                    localField: 'subject_id',
                    foreignField: 'subject_id',
                    as: 'subject'
                }
            },
            { $unwind: '$subject' },
            {
                $group: {
                    _id: {
                        class_id: '$class_id',
                        class_name: '$class.class_name',
                        subject_id: '$subject_id',
                        subject_name: '$subject.subject_name'
                    },
                    average_score: { $avg: '$final_score' },
                    student_count: { $sum: 1 }
                }
            }
        ]),
        FinalGrades.aggregate([
            { $match: finalGradeWhere },
            { $group: { _id: '$letter_grade', count: { $sum: 1 } } }
        ]),
        FinalGrades.countDocuments(finalGradeWhere),
    ]);

    const statusCounts = { Present: 0, Absent: 0, Late: 0, Excused: 0 };
    let totalAttendance = 0;
    attendanceRows.forEach((r) => {
        const status = r._id;
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
        const id = r._id.class_id;
        if (!classAttendanceMap[id]) {
            classAttendanceMap[id] = { classId: id, className: r._id.class_name || '—', Present: 0, Absent: 0, Late: 0, Excused: 0, total: 0 };
        }
        const count = Number(r.count || 0);
        if (classAttendanceMap[id][r._id.status] !== undefined) {
            classAttendanceMap[id][r._id.status] += count;
        }
        classAttendanceMap[id].total += count;
    });
    const attendanceByClass = Object.values(classAttendanceMap).map((c) => ({
        ...c,
        presentRate: c.total > 0 ? Number(((c.Present / c.total) * 100).toFixed(1)) : 0,
    }));

    const gradeRowsMapped = gradeRows.map(r => ({
        class_id: r._id.class_id,
        class_name: r._id.class_name,
        subject_id: r._id.subject_id,
        subject_name: r._id.subject_name,
        average_score: r.average_score,
        student_count: r.student_count
    }));

    const avgScore = gradeRowsMapped.length > 0
        ? Number((gradeRowsMapped.reduce((sum, r) => sum + Number(r.average_score || 0), 0) / gradeRowsMapped.length).toFixed(2))
        : 0;

    const gradesByClassSubject = gradeRowsMapped.map((r) => ({
        classId: r.class_id,
        className: r.class_name,
        subjectId: r.subject_id,
        subjectName: r.subject_name,
        averageScore: Number(Number(r.average_score || 0).toFixed(2)),
        studentCount: Number(r.student_count || 0),
    }));

    const gradeOrder = ['A', 'B', 'C', 'D', 'F'];
    const finalGradeDistribution = gradeOrder.map((grade) => {
        const row = finalGradeRows.find((r) => r._id === grade);
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
        classWhere.semester_id = Number(filters.semesterId);
        scheduleWhere.semester_id = Number(filters.semesterId);
    }
    if (filters.academicYearId) {
        classWhere.academic_year_id = Number(filters.academicYearId);
        scheduleWhere.academic_year_id = Number(filters.academicYearId);
    }

    const [totalTeachers, homeroomRows, scheduleRows, subjectRows, teachers] = await Promise.all([
        Teachers.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'user_id',
                    foreignField: 'user_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            { $match: { 'user.status': 'Active' } },
            { $count: 'count' }
        ]).then(res => res.length > 0 ? res[0].count : 0),
        Classes.aggregate([
            { $match: { homeroom_teacher_id: { $ne: null }, ...classWhere } },
            { $group: { _id: '$homeroom_teacher_id', count: { $sum: 1 } } }
        ]),
        Schedules.aggregate([
            { $match: scheduleWhere },
            {
                $lookup: {
                    from: 'time_slots',
                    localField: 'time_slot_id',
                    foreignField: 'time_slot_id',
                    as: 'timeSlot'
                }
            },
            { $unwind: '$timeSlot' },
            {
                $group: {
                    _id: {
                        teacher_id: '$teacher_id',
                        day_of_week: '$timeSlot.day_of_week'
                    },
                    total_slots: { $sum: 1 },
                    classIds: { $addToSet: '$class_id' }
                }
            },
            {
                $project: {
                    teacher_id: '$_id.teacher_id',
                    day_of_week: '$_id.day_of_week',
                    total_slots: '$total_slots',
                    scheduled_classes: { $size: '$classIds' }
                }
            }
        ]),
        Schedules.aggregate([
            { $match: scheduleWhere },
            {
                $group: {
                    _id: '$teacher_id',
                    subjectIds: { $addToSet: '$subject_id' }
                }
            },
            {
                $project: {
                    teacher_id: '$_id',
                    unique_subjects: { $size: '$subjectIds' }
                }
            }
        ]),
        Teachers.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'user_id',
                    foreignField: 'user_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            { $match: { 'user.status': 'Active' } },
            {
                $project: {
                    teacher_id: 1,
                    first_name: 1,
                    last_name: 1
                }
            }
        ]),
    ]);

    const workload = teachers.map((t) => {
        const teacherId = t.teacher_id;
        const homeroom = homeroomRows.find((r) => Number(r._id) === teacherId);
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
