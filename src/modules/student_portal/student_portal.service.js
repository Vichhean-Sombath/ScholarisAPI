const { Op } = require('sequelize');
const {
    Students,
    Users,
    StudentEmergencyContacts,
    ClassEnrollments,
    Classes,
    AcademicYears,
    Semesters,
    Subjects,
    Teachers,
    TimeSlots,
    Schedules,
    AttendanceRecords,
    Assessments,
    Grades,
    FinalGrades,
    FeeStructures,
    Invoices,
    Payments,
    Certificates,
    LessonResources,
} = require('../../models/mappingContext');

const formatCurrency = (value) => {
    const num = Number(value || 0);
    return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toISOString().split('T')[0];
};

const getActiveEnrollmentClassIds = async (studentId) => {
    const enrollments = await ClassEnrollments.findAll({
        where: { student_id: studentId, status: 'Active' },
        attributes: ['class_id'],
        raw: true,
    });
    return [...new Set(enrollments.map((e) => e.class_id))];
};

const checkInAttendance = async (studentId, payload) => {
    const { schedule_id, attendance_date, token } = payload || {};

    if (!schedule_id || !attendance_date || !token) {
        const err = new Error('schedule_id, attendance_date, and token are required!');
        err.statusCode = 400;
        throw err;
    }

    const expectedToken = process.env.ATTENDANCE_CHECKIN_TOKEN || 'scholaris-attendance-token';
    if (token !== expectedToken) {
        const err = new Error('Invalid check-in token!');
        err.statusCode = 403;
        throw err;
    }

    const schedule = await Schedules.findByPk(schedule_id, {
        include: [{ model: Classes, attributes: ['class_id', 'class_name'] }],
    });
    if (!schedule) {
        const err = new Error('Schedule not found!');
        err.statusCode = 404;
        throw err;
    }

    const enrollment = await ClassEnrollments.findOne({
        where: { student_id: studentId, class_id: schedule.class_id, status: 'Active' },
    });
    if (!enrollment) {
        const err = new Error('You are not enrolled in this class!');
        err.statusCode = 403;
        throw err;
    }

    const dateString = new Date(attendance_date).toISOString().slice(0, 10);
    const todayString = new Date().toISOString().slice(0, 10);
    if (dateString !== todayString) {
        const err = new Error('Check-in is only allowed for today!');
        err.statusCode = 400;
        throw err;
    }

    const existing = await AttendanceRecords.findOne({
        where: { schedule_id, student_id: studentId, attendance_date },
    });
    if (existing) {
        const err = new Error('Attendance already recorded for this schedule and date!');
        err.statusCode = 409;
        throw err;
    }

    const record = await AttendanceRecords.create({
        schedule_id,
        student_id: studentId,
        attendance_date,
        status: 'Present',
        marked_by: schedule.teacher_id,
        marked_at: new Date(),
    });

    return {
        attendanceId: record.attendance_id,
        scheduleId: record.schedule_id,
        studentId: record.student_id,
        attendanceDate: formatDate(record.attendance_date),
        status: record.status,
    };
};

const getStudentProfile = async (studentId) => {
    const student = await Students.findByPk(studentId, {
        include: [
            { model: Users, attributes: ['user_id', 'username', 'email', 'status', 'last_login_at'] },
            { model: StudentEmergencyContacts, attributes: ['contact_id', 'contact_name', 'relationship', 'phone_number', 'email'] },
        ],
        raw: true,
        nest: true,
    });

    if (!student) {
        const err = new Error('Student not found!');
        err.statusCode = 404;
        throw err;
    }

    const user = student.User || {};
    return {
        studentId: student.student_id,
        firstName: student.first_name,
        lastName: student.last_name,
        fullName: `${student.first_name || ''} ${student.last_name || ''}`.trim(),
        dob: formatDate(student.dob),
        gender: student.gender,
        photoUrl: student.photo_url,
        contactNumber: student.contact_number,
        address: student.address,
        enrollmentDate: formatDate(student.enrollment_date),
        status: student.status,
        user: {
            userId: user.user_id,
            username: user.username,
            email: user.email,
            status: user.status,
            lastLoginAt: user.last_login_at,
        },
        emergencyContacts: [].concat(student.StudentEmergencyContacts || []).map((c) => ({
            contactId: c.contact_id,
            contactName: c.contact_name,
            relationship: c.relationship,
            phoneNumber: c.phone_number,
            email: c.email,
        })),
    };
};

const getStudentClasses = async (studentId) => {
    const enrollments = await ClassEnrollments.findAll({
        where: { student_id: studentId, status: 'Active' },
        attributes: ['enrollment_id', 'enrollment_date', 'status'],
        include: [
            {
                model: Classes,
                attributes: ['class_id', 'class_name', 'room_number', 'max_capacity'],
                include: [
                    { model: AcademicYears, attributes: ['academic_year_id', 'year_name'] },
                    { model: Semesters, attributes: ['semester_id', 'semester_name'] },
                    { model: Teachers, as: 'HomeroomTeacher', attributes: ['teacher_id', 'first_name', 'last_name'] },
                    {
                        model: Schedules,
                        attributes: ['schedule_id', 'room_number'],
                        include: [
                            { model: Subjects, attributes: ['subject_id', 'subject_code', 'subject_name'] },
                            { model: Teachers, attributes: ['teacher_id', 'first_name', 'last_name'] },
                            { model: TimeSlots, attributes: ['time_slot_id', 'day_of_week', 'start_time', 'end_time'] },
                        ],
                    },
                ],
            },
        ],
        order: [[Classes, 'class_name', 'ASC']],
    });

    return enrollments.map((e) => {
        const cls = e.Class || {};
        const schedules = Array.isArray(cls.Schedules) ? cls.Schedules : [];
        return {
            enrollmentId: e.enrollment_id,
            enrollmentDate: formatDate(e.enrollment_date),
            status: e.status,
            classId: cls.class_id,
            className: cls.class_name,
            roomNumber: cls.room_number,
            maxCapacity: cls.max_capacity,
            academicYear: cls.AcademicYear?.year_name || '—',
            semester: cls.Semester?.semester_name || '—',
            homeroomTeacher: cls.HomeroomTeacher
                ? `${cls.HomeroomTeacher.first_name || ''} ${cls.HomeroomTeacher.last_name || ''}`.trim()
                : '—',
            scheduleCount: schedules.length,
            schedules: schedules.map((s) => ({
                scheduleId: s.schedule_id,
                subjectCode: s.Subject?.subject_code,
                subjectName: s.Subject?.subject_name,
                teacherName: s.Teacher ? `${s.Teacher.first_name || ''} ${s.Teacher.last_name || ''}`.trim() : '—',
                dayOfWeek: s.TimeSlot?.day_of_week,
                startTime: s.TimeSlot?.start_time,
                endTime: s.TimeSlot?.end_time,
                roomNumber: s.room_number,
            })),
        };
    });
};

const getStudentSchedule = async (studentId) => {
    const classIds = await getActiveEnrollmentClassIds(studentId);

    if (classIds.length === 0) return [];

    const schedules = await Schedules.findAll({
        where: { class_id: { [Op.in]: classIds } },
        include: [
            { model: Classes, attributes: ['class_id', 'class_name'] },
            { model: Subjects, attributes: ['subject_id', 'subject_code', 'subject_name'] },
            { model: Teachers, attributes: ['teacher_id', 'first_name', 'last_name'] },
            { model: TimeSlots, attributes: ['time_slot_id', 'day_of_week', 'start_time', 'end_time'] },
        ],
        order: [
            [{ model: TimeSlots }, 'day_of_week', 'ASC'],
            [{ model: TimeSlots }, 'start_time', 'ASC'],
        ],
        raw: true,
        nest: true,
    });

    const dayOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const mapped = schedules.map((s) => ({
        scheduleId: s.schedule_id,
        classId: s.Class?.class_id,
        className: s.Class?.class_name,
        subjectCode: s.Subject?.subject_code,
        subjectName: s.Subject?.subject_name,
        teacherName: s.Teacher ? `${s.Teacher.first_name || ''} ${s.Teacher.last_name || ''}`.trim() : '—',
        dayOfWeek: s.TimeSlot?.day_of_week,
        startTime: s.TimeSlot?.start_time,
        endTime: s.TimeSlot?.end_time,
        roomNumber: s.room_number,
    }));

    return mapped.sort((a, b) => {
        const dayDiff = dayOrder.indexOf(a.dayOfWeek) - dayOrder.indexOf(b.dayOfWeek);
        if (dayDiff !== 0) return dayDiff;
        return String(a.startTime).localeCompare(String(b.startTime));
    });
};

const getStudentGrades = async (studentId) => {
    const [grades, finalGrades] = await Promise.all([
        Grades.findAll({
            where: { student_id: studentId, is_published: true },
            include: [
                {
                    model: Assessments,
                    attributes: ['assessment_id', 'assessment_name', 'max_score', 'assessment_date'],
                    include: [
                        {
                            model: Schedules,
                            attributes: ['schedule_id'],
                            include: [
                                { model: Classes, attributes: ['class_id', 'class_name'] },
                                { model: Subjects, attributes: ['subject_id', 'subject_code', 'subject_name'] },
                            ],
                        },
                    ],
                },
                { model: Teachers, as: 'EnteredBy', attributes: ['teacher_id', 'first_name', 'last_name'] },
            ],
            order: [['entered_at', 'DESC']],
            raw: true,
            nest: true,
        }),
        FinalGrades.findAll({
            where: { student_id: studentId },
            include: [
                { model: Classes, attributes: ['class_id', 'class_name'] },
                { model: Subjects, attributes: ['subject_id', 'subject_code', 'subject_name'] },
                { model: Semesters, attributes: ['semester_id', 'semester_name'] },
            ],
            order: [['computed_at', 'DESC']],
            raw: true,
            nest: true,
        }),
    ]);

    const assessmentGrades = grades.map((g) => ({
        gradeId: g.grade_id,
        assessmentId: g.Assessment?.assessment_id,
        assessmentName: g.Assessment?.assessment_name,
        maxScore: Number(g.Assessment?.max_score || 0),
        score: Number(g.score || 0),
        percentage: g.Assessment?.max_score
            ? Number(((Number(g.score || 0) / Number(g.Assessment.max_score)) * 100).toFixed(1))
            : 0,
        assessmentDate: formatDate(g.Assessment?.assessment_date),
        subjectCode: g.Assessment?.Schedule?.Subject?.subject_code,
        subjectName: g.Assessment?.Schedule?.Subject?.subject_name,
        className: g.Assessment?.Schedule?.Class?.class_name,
        enteredBy: g.EnteredBy ? `${g.EnteredBy.first_name || ''} ${g.EnteredBy.last_name || ''}`.trim() : '—',
        enteredAt: g.entered_at,
    }));

    const finalGradesMapped = finalGrades.map((fg) => ({
        finalGradeId: fg.final_grade_id,
        className: fg.Class?.class_name,
        subjectCode: fg.Subject?.subject_code,
        subjectName: fg.Subject?.subject_name,
        semesterName: fg.Semester?.semester_name,
        finalScore: Number(fg.final_score || 0),
        letterGrade: fg.letter_grade,
        gpaPoints: fg.gpa_points ? Number(fg.gpa_points) : null,
        computedAt: formatDate(fg.computed_at),
    }));

    return { assessmentGrades, finalGrades: finalGradesMapped };
};

const getStudentAttendance = async (studentId) => {
    const records = await AttendanceRecords.findAll({
        where: { student_id: studentId },
        include: [
            {
                model: Schedules,
                attributes: ['schedule_id'],
                include: [
                    { model: Classes, attributes: ['class_id', 'class_name'] },
                    { model: Subjects, attributes: ['subject_id', 'subject_code', 'subject_name'] },
                    { model: TimeSlots, attributes: ['time_slot_id', 'day_of_week', 'start_time', 'end_time'] },
                ],
            },
            { model: Teachers, as: 'Marker', attributes: ['teacher_id', 'first_name', 'last_name'] },
        ],
        order: [['attendance_date', 'DESC']],
        raw: true,
        nest: true,
    });

    const statusCounts = { present: 0, absent: 0, late: 0, excused: 0 };
    let total = 0;

    const mapped = records.map((r) => {
        const status = r.status;
        const normalizedStatus = String(status).toLowerCase();
        if (statusCounts[normalizedStatus] !== undefined) {
            statusCounts[normalizedStatus] += 1;
        }
        total += 1;

        return {
            attendanceId: r.attendance_id,
            scheduleId: r.Schedule?.schedule_id,
            className: r.Schedule?.Class?.class_name,
            subjectCode: r.Schedule?.Subject?.subject_code,
            subjectName: r.Schedule?.Subject?.subject_name,
            dayOfWeek: r.Schedule?.TimeSlot?.day_of_week,
            startTime: r.Schedule?.TimeSlot?.start_time,
            endTime: r.Schedule?.TimeSlot?.end_time,
            attendanceDate: formatDate(r.attendance_date),
            status,
            markedBy: r.Marker ? `${r.Marker.first_name || ''} ${r.Marker.last_name || ''}`.trim() : '—',
        };
    });

    const presentRate = total > 0 ? Number(((statusCounts.present / total) * 100).toFixed(1)) : 0;

    return {
        summary: { ...statusCounts, total, presentRate },
        records: mapped,
    };
};

const getStudentInvoices = async (studentId) => {
    const invoices = await Invoices.findAll({
        where: { student_id: studentId },
        include: [
            { model: FeeStructures, attributes: ['fee_id', 'fee_name', 'amount'] },
            { model: Semesters, attributes: ['semester_id', 'semester_name'] },
            {
                model: Payments,
                attributes: ['payment_id', 'payment_date', 'amount', 'payment_method', 'transaction_reference', 'receipt_url'],
            },
        ],
        order: [['issue_date', 'DESC']],
    });

    let totalBilled = 0;
    let totalPaid = 0;
    let outstandingBalance = 0;

    const mapped = invoices.map((inv) => {
        const payments = Array.isArray(inv.Payments) ? inv.Payments : [];
        const paid = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
        const balance = Number(inv.total_amount || 0) - paid;

        totalBilled += Number(inv.total_amount || 0);
        totalPaid += paid;
        outstandingBalance += balance;

        return {
            invoiceId: inv.invoice_id,
            invoiceNumber: inv.invoice_number,
            feeName: inv.FeeStructure?.fee_name || '—',
            semesterName: inv.Semester?.semester_name || '—',
            issueDate: formatDate(inv.issue_date),
            dueDate: formatDate(inv.due_date),
            totalAmount: Number(inv.total_amount || 0),
            amountPaid: paid,
            balanceDue: balance,
            status: balance <= 0 ? 'Paid' : inv.status,
            payments: payments.map((p) => ({
                paymentId: p.payment_id,
                paymentDate: formatDate(p.payment_date),
                amount: Number(p.amount || 0),
                method: p.payment_method,
                transactionReference: p.transaction_reference,
                receiptUrl: p.receipt_url,
            })),
        };
    });

    return {
        summary: {
            totalBilled,
            totalPaid,
            outstandingBalance,
            totalBilledFormatted: formatCurrency(totalBilled),
            totalPaidFormatted: formatCurrency(totalPaid),
            outstandingBalanceFormatted: formatCurrency(outstandingBalance),
            invoiceCount: invoices.length,
        },
        invoices: mapped,
    };
};

const getStudentCertificates = async (studentId) => {
    const certificates = await Certificates.findAll({
        where: { student_id: studentId },
        include: [
            { model: Users, attributes: ['user_id', 'username'] },
        ],
        order: [['issue_date', 'DESC']],
        raw: true,
        nest: true,
    });

    return certificates.map((c) => ({
        certificateId: c.certificate_id,
        certificateType: c.certificate_type,
        templateUsed: c.template_used,
        issueDate: formatDate(c.issue_date),
        generatedFileUrl: c.generated_file_url,
        issuedBy: c.User?.username || '—',
    }));
};

const getStudentResources = async (studentId) => {
    const classIds = await getActiveEnrollmentClassIds(studentId);

    if (classIds.length === 0) return [];

    const scheduleIds = await Schedules.findAll({
        where: { class_id: { [Op.in]: classIds } },
        attributes: ['schedule_id'],
        raw: true,
    }).then((rows) => rows.map((r) => r.schedule_id));

    if (scheduleIds.length === 0) return [];

    const resources = await LessonResources.findAll({
        where: { schedule_id: { [Op.in]: scheduleIds } },
        include: [
            {
                model: Schedules,
                attributes: ['schedule_id'],
                include: [
                    { model: Classes, attributes: ['class_id', 'class_name'] },
                    { model: Subjects, attributes: ['subject_id', 'subject_code', 'subject_name'] },
                ],
            },
            { model: Teachers, attributes: ['teacher_id', 'first_name', 'last_name'] },
        ],
        order: [['upload_date', 'DESC']],
        raw: true,
        nest: true,
    });

    return resources.map((r) => ({
        resourceId: r.resource_id,
        title: r.title,
        description: r.description,
        resourceType: r.resource_type,
        fileUrl: r.file_url,
        uploadDate: formatDate(r.upload_date),
        className: r.Schedule?.Class?.class_name,
        subjectCode: r.Schedule?.Subject?.subject_code,
        subjectName: r.Schedule?.Subject?.subject_name,
        teacherName: r.Teacher ? `${r.Teacher.first_name || ''} ${r.Teacher.last_name || ''}`.trim() : '—',
    }));
};

const getStudentSummary = async (studentId) => {
    const [classes, scheduleItems, gradeData, attendanceData, invoiceData, certificateCount, resourceCount, profile] = await Promise.all([
        getStudentClasses(studentId),
        getStudentSchedule(studentId),
        getStudentGrades(studentId),
        getStudentAttendance(studentId),
        getStudentInvoices(studentId),
        Certificates.count({ where: { student_id: studentId } }),
        getStudentResources(studentId).then((r) => r.length),
        getStudentProfile(studentId),
    ]);

    const { assessmentGrades, finalGrades } = gradeData;
    const { summary: attendanceSummary } = attendanceData;
    const { summary: invoiceSummary } = invoiceData;

    const averageScore = assessmentGrades.length > 0
        ? Number((assessmentGrades.reduce((sum, g) => sum + g.percentage, 0) / assessmentGrades.length).toFixed(1))
        : 0;

    const averageFinalScore = finalGrades.length > 0
        ? Number((finalGrades.reduce((sum, fg) => sum + fg.finalScore, 0) / finalGrades.length).toFixed(2))
        : 0;

    const upcomingSchedule = scheduleItems
        .filter((s) => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].includes(s.dayOfWeek))
        .slice(0, 3);

    return {
        profile: {
            fullName: profile.fullName,
            email: profile.user.email,
            status: profile.status,
        },
        kpis: {
            classCount: classes.length,
            scheduleCount: scheduleItems.length,
            publishedGradeCount: assessmentGrades.length,
            averageScore,
            averageFinalScore,
            attendancePresentRate: attendanceSummary.presentRate,
            attendanceTotal: attendanceSummary.total,
            outstandingBalance: invoiceSummary.outstandingBalance,
            outstandingBalanceFormatted: invoiceSummary.outstandingBalanceFormatted,
            invoiceCount: invoiceSummary.invoiceCount,
            certificateCount,
            resourceCount,
        },
        recentGrades: assessmentGrades.slice(0, 5),
        recentAttendance: attendanceData.records.slice(0, 5),
        upcomingSchedule,
        recentInvoices: invoiceData.invoices.slice(0, 5),
    };
};

module.exports = {
    getStudentSummary,
    getStudentClasses,
    getStudentSchedule,
    getStudentGrades,
    getStudentAttendance,
    getStudentInvoices,
    getStudentCertificates,
    getStudentResources,
    getStudentProfile,
    checkInAttendance,
};
