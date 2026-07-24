CREATE TABLE IF NOT EXISTS users (
    user_id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'Teacher', 'Student') NOT NULL,
    status ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
    last_login_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id),
    UNIQUE KEY users_username (username),
    UNIQUE KEY users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS teachers (
    teacher_id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    dob DATE NULL,
    gender ENUM('Male', 'Female', 'Other') NULL,
    photo_url VARCHAR(255) NULL,
    contact_number VARCHAR(20) NULL,
    specialization VARCHAR(100) NULL,
    bio TEXT NULL,
    hire_date DATE NULL,
    status ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
    PRIMARY KEY (teacher_id),
    UNIQUE KEY teachers_user_id (user_id),
    KEY teachers_contact_number (contact_number),
    CONSTRAINT teachers_user_id_fk FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS students (
    student_id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    dob DATE NULL,
    gender ENUM('Male', 'Female', 'Other') NULL,
    photo_url VARCHAR(255) NULL,
    contact_number VARCHAR(20) NULL,
    address VARCHAR(255) NULL,
    enrollment_date DATE NOT NULL,
    status ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (student_id),
    UNIQUE KEY students_user_id (user_id),
    KEY students_contact_number (contact_number),
    CONSTRAINT students_user_id_fk FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS academic_years (
    academic_year_id INT NOT NULL AUTO_INCREMENT,
    year_name VARCHAR(20) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('Active', 'Closed') NOT NULL DEFAULT 'Active',
    PRIMARY KEY (academic_year_id),
    UNIQUE KEY academic_years_year_name (year_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS semesters (
    semester_id INT NOT NULL AUTO_INCREMENT,
    academic_year_id INT NOT NULL,
    semester_name VARCHAR(30) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    PRIMARY KEY (semester_id),
    KEY idx_semesters_year (academic_year_id),
    CONSTRAINT semesters_academic_year_id_fk FOREIGN KEY (academic_year_id) REFERENCES academic_years(academic_year_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS subjects (
    subject_id INT NOT NULL AUTO_INCREMENT,
    subject_code VARCHAR(20) NOT NULL,
    subject_name VARCHAR(100) NOT NULL,
    description TEXT NULL,
    prerequisite_subject_id INT NULL,
    PRIMARY KEY (subject_id),
    UNIQUE KEY subjects_subject_code (subject_code),
    KEY idx_subjects_prerequisite (prerequisite_subject_id),
    CONSTRAINT subjects_prerequisite_subject_id_fk FOREIGN KEY (prerequisite_subject_id) REFERENCES subjects(subject_id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS classes (
    class_id INT NOT NULL AUTO_INCREMENT,
    class_name VARCHAR(50) NOT NULL,
    academic_year_id INT NOT NULL,
    semester_id INT NOT NULL,
    room_number VARCHAR(20) NULL,
    max_capacity INT NULL,
    homeroom_teacher_id INT NULL,
    PRIMARY KEY (class_id),
    KEY idx_classes_year (academic_year_id),
    KEY idx_classes_semester (semester_id),
    KEY idx_classes_homeroom (homeroom_teacher_id),
    CONSTRAINT classes_academic_year_id_fk FOREIGN KEY (academic_year_id) REFERENCES academic_years(academic_year_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT classes_semester_id_fk FOREIGN KEY (semester_id) REFERENCES semesters(semester_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT classes_homeroom_teacher_id_fk FOREIGN KEY (homeroom_teacher_id) REFERENCES teachers(teacher_id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS class_enrollments (
    enrollment_id INT NOT NULL AUTO_INCREMENT,
    student_id INT NOT NULL,
    class_id INT NOT NULL,
    enrollment_date DATE NOT NULL,
    status ENUM('Active', 'Transferred', 'Withdrawn') NOT NULL DEFAULT 'Active',
    PRIMARY KEY (enrollment_id),
    UNIQUE KEY class_enrollments_student_class_enrollment_date (student_id, class_id, enrollment_date),
    KEY idx_enrollments_student (student_id),
    KEY idx_enrollments_class (class_id),
    CONSTRAINT class_enrollments_student_id_fk FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT class_enrollments_class_id_fk FOREIGN KEY (class_id) REFERENCES classes(class_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS time_slots (
    time_slot_id INT NOT NULL AUTO_INCREMENT,
    day_of_week ENUM('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun') NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    PRIMARY KEY (time_slot_id),
    UNIQUE KEY time_slots_day_of_week_start_time (day_of_week, start_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS schedules (
    schedule_id INT NOT NULL AUTO_INCREMENT,
    class_id INT NOT NULL,
    subject_id INT NOT NULL,
    teacher_id INT NOT NULL,
    time_slot_id INT NOT NULL,
    room_number VARCHAR(20) NULL,
    PRIMARY KEY (schedule_id),
    UNIQUE KEY schedules_teacher_id_time_slot_id (teacher_id, time_slot_id),
    KEY idx_schedules_class (class_id),
    KEY idx_schedules_subject (subject_id),
    KEY idx_schedules_teacher (teacher_id),
    KEY idx_schedules_time_slot (time_slot_id),
    CONSTRAINT schedules_class_id_fk FOREIGN KEY (class_id) REFERENCES classes(class_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT schedules_subject_id_fk FOREIGN KEY (subject_id) REFERENCES subjects(subject_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT schedules_teacher_id_fk FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT schedules_time_slot_id_fk FOREIGN KEY (time_slot_id) REFERENCES time_slots(time_slot_id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS attendance_records (
    attendance_id INT NOT NULL AUTO_INCREMENT,
    schedule_id INT NOT NULL,
    student_id INT NOT NULL,
    attendance_date DATE NOT NULL,
    status ENUM('Present', 'Absent', 'Late', 'Excused') NOT NULL,
    marked_by INT NOT NULL,
    marked_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_edited_at DATETIME NULL,
    PRIMARY KEY (attendance_id),
    UNIQUE KEY attendance_records_schedule_id_student_id_attendance_date (schedule_id, student_id, attendance_date),
    KEY idx_attendance_student (student_id),
    KEY idx_attendance_marked_by (marked_by),
    KEY idx_attendance_date (attendance_date),
    CONSTRAINT attendance_records_schedule_id_fk FOREIGN KEY (schedule_id) REFERENCES schedules(schedule_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT attendance_records_student_id_fk FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT attendance_records_marked_by_fk FOREIGN KEY (marked_by) REFERENCES teachers(teacher_id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS grading_criteria (
    criteria_id INT NOT NULL AUTO_INCREMENT,
    subject_id INT NULL,
    class_id INT NULL,
    component_name VARCHAR(50) NOT NULL,
    weight_percentage DECIMAL(5, 2) NOT NULL,
    attempt_count INT NOT NULL DEFAULT 1,
    PRIMARY KEY (criteria_id),
    KEY idx_criteria_subject (subject_id),
    KEY idx_criteria_class (class_id),
    CONSTRAINT grading_criteria_subject_id_fk FOREIGN KEY (subject_id) REFERENCES subjects(subject_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT grading_criteria_class_id_fk FOREIGN KEY (class_id) REFERENCES classes(class_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS assessments (
    assessment_id INT NOT NULL AUTO_INCREMENT,
    schedule_id INT NOT NULL,
    criteria_id INT NOT NULL,
    assessment_name VARCHAR(100) NOT NULL,
    max_score DECIMAL(6, 2) NOT NULL,
    assessment_date DATE NULL,
    PRIMARY KEY (assessment_id),
    KEY idx_assessments_schedule (schedule_id),
    KEY idx_assessments_criteria (criteria_id),
    CONSTRAINT assessments_schedule_id_fk FOREIGN KEY (schedule_id) REFERENCES schedules(schedule_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT assessments_criteria_id_fk FOREIGN KEY (criteria_id) REFERENCES grading_criteria(criteria_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS grades (
    grade_id INT NOT NULL AUTO_INCREMENT,
    assessment_id INT NOT NULL,
    student_id INT NOT NULL,
    score DECIMAL(6, 2) NOT NULL,
    entered_by INT NOT NULL,
    entered_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_published TINYINT(1) NOT NULL DEFAULT 0,
    PRIMARY KEY (grade_id),
    UNIQUE KEY grades_assessment_id_student_id (assessment_id, student_id),
    KEY idx_grades_student (student_id),
    KEY idx_grades_entered_by (entered_by),
    CONSTRAINT grades_assessment_id_fk FOREIGN KEY (assessment_id) REFERENCES assessments(assessment_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT grades_student_id_fk FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT grades_entered_by_fk FOREIGN KEY (entered_by) REFERENCES teachers(teacher_id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS final_grades (
    final_grade_id INT NOT NULL AUTO_INCREMENT,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    class_id INT NOT NULL,
    semester_id INT NOT NULL,
    final_score DECIMAL(6, 2) NOT NULL,
    letter_grade VARCHAR(2) NULL,
    gpa_points DECIMAL(3, 2) NULL,
    computed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (final_grade_id),
    UNIQUE KEY final_grades_student_id_subject_id_semester_id (student_id, subject_id, semester_id),
    KEY idx_final_grades_subject (subject_id),
    KEY idx_final_grades_class (class_id),
    KEY idx_final_grades_semester (semester_id),
    CONSTRAINT final_grades_student_id_fk FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT final_grades_subject_id_fk FOREIGN KEY (subject_id) REFERENCES subjects(subject_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT final_grades_class_id_fk FOREIGN KEY (class_id) REFERENCES classes(class_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT final_grades_semester_id_fk FOREIGN KEY (semester_id) REFERENCES semesters(semester_id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS fee_structures (
    fee_id INT NOT NULL AUTO_INCREMENT,
    class_id INT NULL,
    semester_id INT NOT NULL,
    fee_name VARCHAR(100) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    due_date DATE NULL,
    PRIMARY KEY (fee_id),
    KEY idx_fee_structures_class (class_id),
    KEY idx_fee_structures_semester (semester_id),
    CONSTRAINT fee_structures_class_id_fk FOREIGN KEY (class_id) REFERENCES classes(class_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fee_structures_semester_id_fk FOREIGN KEY (semester_id) REFERENCES semesters(semester_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS invoices (
    invoice_id INT NOT NULL AUTO_INCREMENT,
    invoice_number VARCHAR(30) NOT NULL,
    student_id INT NOT NULL,
    fee_id INT NOT NULL,
    semester_id INT NOT NULL,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    amount_paid DECIMAL(10, 2) NOT NULL DEFAULT 0,
    status ENUM('Unpaid', 'Partial', 'Paid', 'Overdue') NOT NULL DEFAULT 'Unpaid',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (invoice_id),
    UNIQUE KEY invoices_invoice_number (invoice_number),
    KEY idx_invoices_student (student_id),
    KEY idx_invoices_fee (fee_id),
    KEY idx_invoices_semester (semester_id),
    CONSTRAINT invoices_student_id_fk FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT invoices_fee_id_fk FOREIGN KEY (fee_id) REFERENCES fee_structures(fee_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT invoices_semester_id_fk FOREIGN KEY (semester_id) REFERENCES semesters(semester_id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS payments (
    payment_id INT NOT NULL AUTO_INCREMENT,
    invoice_id INT NOT NULL,
    payment_date DATE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('Stripe', 'BakongKHQR') NOT NULL,
    receipt_url VARCHAR(255) NULL,
    transaction_reference VARCHAR(255) NULL,
    recorded_by INT NOT NULL,
    notes VARCHAR(255) NULL,
    PRIMARY KEY (payment_id),
    KEY idx_payments_invoice (invoice_id),
    KEY idx_payments_recorded_by (recorded_by),
    CONSTRAINT payments_invoice_id_fk FOREIGN KEY (invoice_id) REFERENCES invoices(invoice_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT payments_recorded_by_fk FOREIGN KEY (recorded_by) REFERENCES users(user_id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS certificates (
    certificate_id INT NOT NULL AUTO_INCREMENT,
    student_id INT NOT NULL,
    certificate_type ENUM('Completion', 'Transcript', 'Recommendation') NOT NULL,
    template_used VARCHAR(100) NULL,
    issue_date DATE NOT NULL,
    generated_file_url VARCHAR(255) NULL,
    issued_by INT NOT NULL,
    PRIMARY KEY (certificate_id),
    KEY idx_certificates_student (student_id),
    KEY idx_certificates_issued_by (issued_by),
    CONSTRAINT certificates_student_id_fk FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT certificates_issued_by_fk FOREIGN KEY (issued_by) REFERENCES users(user_id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS lesson_resources (
    resource_id INT NOT NULL AUTO_INCREMENT,
    schedule_id INT NULL,
    teacher_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NULL,
    resource_type ENUM('LessonPlan', 'Homework', 'Syllabus', 'Other') NOT NULL,
    file_url VARCHAR(255) NULL,
    upload_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (resource_id),
    KEY idx_lesson_resources_schedule (schedule_id),
    KEY idx_lesson_resources_teacher (teacher_id),
    CONSTRAINT lesson_resources_schedule_id_fk FOREIGN KEY (schedule_id) REFERENCES schedules(schedule_id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT lesson_resources_teacher_id_fk FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS student_emergency_contacts (
    contact_id INT NOT NULL AUTO_INCREMENT,
    student_id INT NOT NULL,
    contact_name VARCHAR(100) NOT NULL,
    relationship VARCHAR(50) NULL,
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(100) NULL,
    PRIMARY KEY (contact_id),
    KEY idx_sec_student (student_id),
    CONSTRAINT student_emergency_contacts_student_id_fk FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
