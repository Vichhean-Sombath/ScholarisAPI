# Scholaris

Backend API server for the Scholaris school management platform.

**Repository:** https://github.com/rezio23/Scholaris.git  
**Live project:** https://scholaris-educate.vercel.app/

## Related Projects

- **ScholarisPage** — Role-based React web application for admins, teachers, and students. (https://github.com/rezio23/ScholarisClient.git)
- **ScholarisMobile** — Native Android app for students to scan attendance QR codes. (https://github.com/rezio23/ScholarisMobile.git)

## Overview

Scholaris is a Node.js/Express REST API that powers the Scholaris ecosystem. It provides role-based authentication and all core domain services for administrators, teachers, and students, including enrollment, scheduling, attendance, grading, invoicing, payments, certificates, and lesson resources.

## Features

- **Authentication** — JWT-based login/registration with role-based access control.
- **School management** — Administrators can manage academic years, semesters, classes, subjects, time slots, teachers, students, users, and class enrollments.
- **Scheduling** — Create and manage class schedules tied to semesters, teachers, and subjects.
- **Attendance** — Record attendance and verify QR-code check-ins from ScholarisMobile.
- **Gradebook** — Grading criteria, assessments, grades, and final grade calculation.
- **Finance** — Fee structures, invoices, Stripe card payments, and Bakong QR payments with webhook handling.
- **Certificates** — Generate and serve student certificates.
- **Resources** — Upload and share lesson resources.
- **Dashboard & reports** — Aggregated data endpoints for the web client dashboards and analytics.
- **Notifications** — Optional Telegram bot and email (SMTP) notifications.

## Tech Stack

- Node.js
- Express.js
- Sequelize ORM
- MySQL
- JSON Web Tokens (JWT)
- bcrypt
- Stripe & Bakong QR payment integrations
- Nodemailer (SMTP)
- node-telegram-bot-api
- node-schedule
- dotenv / cors / moment

## Project Structure

```
Scholaris/
├── migrations/
│   └── createSchema.sql       # Initial database schema
├── src/
│   ├── config/
│   │   └── db.js              # Sequelize database connection
│   ├── database/              # DB helpers / scripts
│   ├── middleware/
│   │   └── errorHandler.js    # Global error handler
│   ├── models/
│   │   └── mappingContext.js  # Sequelize model registry and associations
│   ├── modules/               # One folder per domain/route group
│   │   ├── academic_years
│   │   ├── assessments
│   │   ├── attendance_records
│   │   ├── auth
│   │   ├── certificates
│   │   ├── class_enrollments
│   │   ├── classes
│   │   ├── dashboard
│   │   ├── fee_structures
│   │   ├── final_grades
│   │   ├── grades
│   │   ├── grading_criteria
│   │   ├── invoices
│   │   ├── lesson_resources
│   │   ├── payments
│   │   ├── reports
│   │   ├── schedules
│   │   ├── semesters
│   │   ├── student_emergency_contacts
│   │   ├── student_portal
│   │   ├── students
│   │   ├── subjects
│   │   ├── teachers
│   │   ├── time_slots
│   │   └── users
│   ├── services/              # Cross-cutting services (e.g. email, Telegram, payment providers)
│   └── utils/                 # Shared utilities
├── .env.example               # Example environment variables
├── package.json
├── server.js                  # Application entry point
└── README.md
```

## Setup

1. Clone the repository and install dependencies:

   ```bash
   git clone https://github.com/rezio23/Scholaris.git
   cd Scholaris
   npm install
   ```

2. Create a `.env` file from the example:

   ```bash
   cp .env.example .env
   ```

3. Create the MySQL database and run the initial schema:

   ```bash
   mysql -u your_db_user -p your_db_name < migrations/createSchema.sql
   ```

4. Fill in the required environment variables in `.env` (see the table below).

## Development

Start the server in development mode with auto-reload:

```bash
npm run dev
```

The API will be available at `http://localhost:3000` by default (or the port defined in `PORT`).

## Production

Start the server in production mode:

```bash
npm start
```

For production deployments it is recommended to:

- Run migrations explicitly instead of relying on `sequelize.sync({ alter: true })`.
- Keep `SECRET_KEY`, database credentials, and payment webhook secrets secure.
- Configure a reverse proxy (e.g. Nginx) and HTTPS termination.

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `SECRET_KEY` | JWT signing secret | `super-secret-key` |
| `DB_NAME` | MySQL database name | `scholaris_db` |
| `DB_USER` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | `password` |
| `DB_HOST` | MySQL host | `localhost` |
| `DB_PORT` | MySQL port | `3306` |
| `SERVER_URL` | Public URL of this API | `https://api.scholaris.edu` |
| `EMAIL_SENDER_ADDRESS` | SMTP sender address | `noreply@scholaris.edu` |
| `EMAIL_APP_PASSWORD` | SMTP/app password | `abcd efgh ijkl mnop` |
| `TELEGRAM_BOT_TOKEN` | Telegram bot token | `123456:ABC-DEF...` |
| `TELEGRAM_BOT_ID` | Telegram chat/user ID receiving notifications | `-100123456789` |
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_test_...` |
| `STRIPE_PUBLIC_KEY` | Stripe publishable key | `pk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | `whsec_...` |
| `SYSTEM_USER_ID` | System automation user ID | `1` |
| `BAKONG_ACCOUNT_ID` | Bakong merchant account ID | `your_bakong_id` |
| `MERCHANT_NAME` | Bakong merchant name | `Scholaris` |
| `MERCHANT_CITY` | Bakong merchant city | `Phnom Penh` |
| `MERCHANT_PHONE` | Bakong merchant phone | `+85512345678` |
| `STORE_LABEL` | Bakong store label | `Scholaris Store` |
| `BAKONG_API_URL` | Bakong API base URL | `https://api.bakong.kh/v1` |
| `BAKONG_API_TOKEN` | Bakong API token | `token` |
| `BAKONG_API_ENABLED` | Enable Bakong QR payments | `true` / `false` |

## How the Ecosystem Works

1. **ScholarisPage** (React web client) is used by admins, teachers, and students for daily workflows.
2. **ScholarisMobile** (Android app) lets students scan attendance QR codes generated by teachers in ScholarisPage.
3. **Scholaris** (this API server) is the central backend that both clients talk to for data, authentication, and business logic.

### Attendance QR Flow

1. A teacher opens the **Daily Attendance** page in ScholarisPage and selects a schedule.
2. ScholarisPage requests a QR payload from the API, which includes the `scheduleId`, date, and a server-signed token.
3. A student scans the QR code with ScholarisMobile and submits it to the API.
4. The API verifies the token, confirms the student is enrolled in the schedule's class, checks the date, and records the attendance as **Present**.

## Notes

- The server uses `sequelize.sync({ alter: true })` on startup to keep models in sync during development.
- Stripe webhooks must be sent to `/payment/stripe/webhook` with the raw request body.
- Bakong webhooks are sent to `/payment/bakong/webhook` as JSON.
- Some features (Telegram, email, Stripe, Bakong) are optional and only activate when their environment variables are set.
