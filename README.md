# Salon Booking System (SBS)

Salon Booking System is a local web application for salon service browsing, appointment booking, simulated payments, invoice emails, and staff/admin management.

The project is designed as a final-year academic project. It runs locally and uses simulated payment and email workflows instead of real payment processing.

## Target Users

- **Customers:** browse services, book appointments, pay using simulated payment methods, and manage saved cards.
- **Stylists:** manage availability, view appointments, complete appointments, and mark Cash payments as paid.
- **Manager:** manage users, stylists, services, appointments, business hours, and salon profile details.

## Core Modules

### Identity Access Management (IAM)

Handles user registration, login, logout, JWT authentication through HTTP-only cookies, bcrypt password hashing, and role-based access control.

### Appointment Booking System

Handles services, stylist availability, available slots, appointment booking, cancellations, dashboards, salon profile, and business hours.

### Payment Module

Handles simulated Card, PayNow, and Cash payments, saved cards, payment history, and invoice generation through Mailtrap.

## Technology Stack

| Layer | Technology |
| --- | --- |
| Frontend | React.js |
| Backend | Express.js on Node.js |
| Database | MySQL |
| Authentication | JWT in HTTP-only cookies, bcrypt |
| API | REST over HTTP with JSON |
| Email | Nodemailer with Mailtrap |
| Payments | Simulated Card, PayNow, and Cash |

## Project Documents

The main project documents are:

- `documents/specs/sbs-project-specification.md`
- `documents/specs/sbs-data-model.md`

Read these files before making product, API, database, or workflow changes.

## Current Status

The repository currently contains the project documentation and setup guidance. The frontend and backend application files have not been scaffolded yet.

## Expected Commands

These commands are expected by the specification, but should be verified against package files after the app is scaffolded.

| Purpose | Expected Command |
| --- | --- |
| Install | Check package files first |
| Frontend dev | `npm start` |
| Backend dev | `npm run dev` |
| Build | Not defined yet |
| Test | Not defined yet |
| Lint | Not defined yet |

## Key Requirements

- Use React.js for the frontend and Express.js for the backend.
- Use MySQL with foreign key constraints.
- Protect non-public API routes with JWT cookie verification.
- Enforce role permissions in backend middleware.
- Store secrets in environment variables.
- Provide a `.env.example` when environment variables are introduced.
- Use bcrypt with at least 10 salt rounds for passwords.
- Validate and sanitize API inputs on the server.
- Use soft deletes or active flags for referenced records.

## Data Model

The database should follow the schema in `documents/specs/sbs-data-model.md`.

Core tables:

- `users`
- `services`
- `availability`
- `appointments`
- `payments`
- `saved_cards`
- `salon_profile`
- `business_hours`

## Booking and Payment Rules

- Booking with payment must be atomic.
- Appointment creation and payment creation must succeed or fail together.
- Slot availability checks and booking inserts must happen in the same transaction.
- The backend must prevent double-booking.
- Invoice emails must be sent only after a successful transaction commit.
- `POST /api/appointments` must use a UUID v4 `idempotency_key`.
- Duplicate booking requests must return the original booking response.
- Saved cards must prevent duplicate cards for the same customer.

## Payment Scope

All payments are simulated.

- **Card:** frontend shows a 5-second processing delay.
- **PayNow:** frontend displays a random QR code and completes after the customer confirms.
- **Cash:** creates a pending payment that staff can mark completed later.

Card and PayNow payments send simulated invoice emails through Mailtrap after a successful booking.

Saved card numbers are stored only for academic simulation. Backend APIs must never return full card numbers. Saved cards must be shown only in an obfuscated format, such as `**** **** **** 4321`.

## Out of Scope

- Real payment gateways such as Stripe or PayPal
- Email verification
- Password reset
- Reviews and ratings
- Waitlists or walk-ins
- OAuth login
- Production deployment
- Appointment rescheduling

Rescheduling is handled by cancelling the existing appointment and creating a new booking.

## Development Notes

- Keep frontend and backend code separated.
- Keep changes small and focused.
- Match existing project patterns once code exists.
- Run relevant build, test, or lint commands after changes when scripts exist.
- Do not hardcode secrets, API keys, credentials, or Mailtrap settings.
- Do not return full saved card numbers from any API response.
