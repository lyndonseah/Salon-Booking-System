  
**Project Specification**

Salon Booking System

────────────────────────────────────────

Final-Year Project

Version 1.4

Date: 14 May 2026

# **Revision History**

| Version | Date | Author | Description |
| :---- | :---- | :---- | :---- |
| 1.0 | 12 May 2026 | Claude | Initial project specification |
| 1.1 | 13 May 2026 | Lyndon Seah | Added payment simulation, email invoicing modules, and full card storage with obfuscation |
| 1.2 | 14 May 2026 | Lyndon Seah | ACID transaction requirements, Added idempotency handling |
| 1.3 | 14 May 2026 | Lyndon Seah | Removed rescheduling and service description; removed stylist-service mapping; added auto-numbered paragraph styles |

# **Table of Contents**

[**Revision History	2**](#heading=)

[**Table of Contents	3**](#heading=)

[**1\. Introduction	5**](#heading=)

[1.1 Project Overview	5](#heading=)

[1.2 Purpose	5](#heading=)

[1.3 Scope	5](#heading=)

[1.4 Technology Stack	6](#heading=)

[1.5 Definitions and Abbreviations	6](#heading=)

[**2\. System Architecture	7**](#heading=)

[2.1 High-Level Architecture	7](#heading=)

[2.2 Authentication Flow	7](#heading=)

[2.3 Payment Flow	7](#heading=)

[2.4 Transaction Management (ACID Compliance)	8](#heading=)

[2.5 Idempotency	9](#heading=)

[2.6 Project Structure (Recommended)	9](#heading=)

[**3\. Database Design	11**](#heading=)

[3.1 Entity-Relationship Overview	11](#heading=)

[**4\. Part 1 – Identity Access Management (IAM)	12**](#heading=)

[4.1 Overview	12](#heading=)

[4.2 Functional Requirements	12](#heading=)

[4.2.1 Registration	12](#heading=)

[4.2.2 Login	12](#heading=)

[4.2.3 Authorization	12](#heading=)

[4.2.4 User Management (Manager Only)	13](#heading=)

[4.3 Use Cases	13](#heading=)

[UC-IAM-01: Customer Registration	13](#heading=)

[UC-IAM-02: User Login	13](#heading=)

[UC-IAM-03: Manager Creates Stylist Account	13](#heading=)

[4.4 API Endpoints	14](#heading=)

[4.5 UI Wireframe Descriptions	14](#heading=)

[4.5.1 Registration Page	14](#heading=)

[4.5.2 Login Page	14](#heading=)

[4.5.3 User Management Page (Manager)	14](#heading=)

[**5\. Part 2 – Appointment Booking System	15**](#heading=)

[5.1 Overview	15](#heading=)

[5.2 Functional Requirements	15](#heading=)

[5.2.1 Service Management (Manager)	15](#heading=)

[5.2.2 Stylist Availability Management (Stylist)	15](#heading=)

[5.2.3 Appointment Booking (Customer)	15](#heading=)

[5.2.4 Payment (Customer)	16](#heading=)

[5.2.5 Saved Card Management (Customer)	16](#heading=)

[5.2.6 Appointment Management	16](#heading=)

[5.2.7 Transaction Integrity (ACID) and Idempotency	17](#heading=)

[5.2.8 Salon Profile and Business Hours (Manager)	17](#heading=)

[5.3 Use Cases	17](#heading=)

[UC-ABS-01: Customer Books an Appointment with Payment	17](#heading=)

[UC-ABS-02: Customer Cancels an Appointment	18](#heading=)

[UC-ABS-03: Stylist Sets Availability	18](#heading=)

[UC-ABS-04: Manager Manages Services	19](#heading=)

[UC-ABS-05: Card Payment	19](#heading=)

[UC-ABS-06: PayNow Payment	19](#heading=)

[UC-ABS-07: Cash Payment	20](#heading=)

[5.4 API Endpoints	20](#heading=)

[5.4.1 Services	20](#heading=)

[5.4.2 Stylists	20](#heading=)

[5.4.3 Availability	21](#heading=)

[5.4.4 Appointments	21](#heading=)

[5.4.5 Payments	21](#heading=)

[5.4.6 Saved Cards	21](#heading=)

[5.4.7 Salon Profile & Business Hours	22](#heading=)

[5.5 UI Wireframe Descriptions	22](#heading=)

[5.5.1 Public Landing Page	22](#heading=)

[5.5.2 Booking Flow (Customer)	22](#heading=)

[5.5.3 Payment – Card Tab	22](#heading=)

[5.5.4 Payment – PayNow Tab	22](#heading=)

[5.5.5 Payment – Cash Tab	23](#heading=)

[5.5.6 My Appointments (Customer)	23](#heading=)

[5.5.7 Customer Profile – Saved Cards Section	23](#heading=)

[5.5.8 Stylist Dashboard	23](#heading=)

[5.5.9 My Availability (Stylist)	23](#heading=)

[5.5.10 Service Management (Manager)	24](#heading=)

[5.5.11 Manager Dashboard	24](#heading=)

[5.5.12 Business Hours and Salon Profile (Manager)	24](#heading=)

[**6\. Non-Functional Requirements	25**](#heading=)

[**7\. Assumptions and Constraints	26**](#heading=)

[7.1 Assumptions	26](#heading=)

[7.2 Constraints	26](#heading=)

[**8\. Appendix: Role-Permission Matrix	27**](#heading=)

1. # **Introduction**

   1. ## **Project Overview**

This document defines the project specification for a Hair Salon Appointment Booking System. The system enables customers to discover salon services, select preferred stylists, and book appointments online with integrated payment options. It provides stylists with tools to manage their availability and view upcoming appointments, while giving the salon manager full administrative control over services, staff, business hours, and the salon profile.

The system is composed of three core modules: Identity Access Management (IAM), which handles user authentication and role-based access; the Appointment Booking System, which manages all scheduling-related functionality; and the Payment Module, which provides simulated payment processing and invoice generation.

2. ## **Purpose**

This specification serves as the authoritative reference for development. It defines functional requirements, use cases, API contracts, database schema, UI descriptions, and technical architecture so that implementation can proceed without ambiguity.

3. ## **Scope**

The system covers the following capabilities:

* User registration (username, email, password) and login (username and password).

* Role-based access control for three roles: Customer, Stylist, and Manager.

* Service catalogue management (create, read, update, delete) by the Manager.

* Stylist self-service availability scheduling.

* Customer-facing appointment booking with stylist selection and cancellation.

* Booking history for customers and appointment dashboards for stylists and the manager.

* Salon profile and business hours management by the Manager.

* Simulated payment processing via three methods: Card, PayNow (QR code), and Cash.

* Saved card management for customer convenience (full card number stored; displayed obfuscated).

* Simulated invoice emails sent to customers for Card and PayNow payments via Nodemailer with Mailtrap.

The following are explicitly out of scope:

* Real payment gateway integration (all payments are simulated).

* Email verification or password reset functionality.

* Customer reviews and ratings.

* Waitlist or walk-in management.

* Appointment rescheduling (customers cancel and rebook instead).

* Production deployment, hosting, or domain configuration.

  4. ## **Technology Stack**

| Layer | Technology | Notes |
| :---- | :---- | :---- |
| Frontend | React.js | Single-page application with client-side routing |
| Backend | Express.js on Node.js | RESTful API server |
| Database | MySQL | Relational database with foreign key constraints |
| Authentication | JSON Web Tokens (JWT) | Stateless token-based auth stored in HTTP-only cookies or local storage |
| API Protocol | REST over HTTP | JSON request/response bodies |
| Email Service | Nodemailer \+ Mailtrap | Simulated email delivery for invoices (Mailtrap catches all outbound emails in a test inbox) |

  5. ## **Definitions and Abbreviations**

| Term | Definition |
| :---- | :---- |
| IAM | Identity Access Management – the module handling authentication and authorization |
| JWT | JSON Web Token – a compact, URL-safe token format for stateless authentication |
| RBAC | Role-Based Access Control – restricting system access based on user roles |
| CRUD | Create, Read, Update, Delete – the four basic data operations |
| ACID | Atomicity, Consistency, Isolation, Durability – database transaction guarantees |
| Idempotency | A property ensuring that making the same request multiple times produces the same result as making it once |
| Idempotency Key | A client-generated UUID included in a request to allow the server to detect and safely handle duplicate submissions |
| Slot | A bookable time window defined by a stylist’s availability and service duration |
| Manager | The salon administrator role with full system privileges |
| PayNow | A simulated QR-code-based payment method |
| Mailtrap | An email testing service that captures outgoing emails without delivering them to real inboxes |

2. # **System Architecture**

   1. ## **High-Level Architecture**

The system follows a three-tier client–server architecture:

**Presentation Tier (Frontend):** A React.js single-page application running in the browser. It communicates with the backend exclusively through RESTful API calls. React Router handles client-side navigation. State management uses React Context or a lightweight library (e.g., Zustand) for global auth state.

**Application Tier (Backend):** An Express.js server running on Node.js. It exposes REST endpoints, enforces business logic, performs authentication/authorization via JWT middleware, queries the database through a connection pool, and sends invoice emails through Nodemailer configured with Mailtrap SMTP credentials.

**Data Tier (Database):** A MySQL relational database storing all persistent data: users, roles, services, availability, appointments, payments, and saved cards. The backend connects via a MySQL client library (e.g., mysql2).

2. ## **Authentication Flow**

1\. The user submits credentials (username and password) via the login form.

2\. The backend validates credentials against the hashed password stored in MySQL.

3\. On success, the backend issues a signed JWT containing the user ID and role.

4\. The frontend stores the JWT and attaches it as a Bearer token in the Authorization header of subsequent API requests.

5\. A JWT middleware on the backend verifies the token on every protected route and extracts the user’s identity and role.

6\. Role-checking middleware gates routes so that, for example, only a Manager can access admin endpoints.

3. ## **Payment Flow**

The payment module simulates real-world payment without connecting to any payment gateway. The flow differs by method:

**Card:** The customer enters a card number (or selects a saved card). On submission, the frontend displays a loading state for 5 seconds to simulate processing. After the delay, a success toast appears and the backend records the payment as completed. The customer may opt to save the card for future use; the full card number is stored in the database. When displayed (e.g., in the profile or payment form), the card number is obfuscated by the backend, showing only the last 4 digits (e.g., \*\*\*\* \*\*\*\* \*\*\*\* 4321). Customers can edit a saved card to change the number but can never retrieve the prior card number.

**PayNow:** The system generates a random QR code image displayed to the customer. The customer clicks a Finish button to confirm payment. A success toast appears and the backend records the payment as completed.

**Cash:** The customer selects Cash as the payment method. No upfront payment is required. The appointment is booked with a payment status of Pending. Payment is collected physically at the salon after service completion and updated by the Stylist or Manager.

For Card and PayNow payments, the backend triggers an invoice email to the customer’s registered email address via Nodemailer (using Mailtrap SMTP). The invoice contains the appointment details, service name, price, and payment method.

4. ## **Transaction Management (ACID Compliance)**

Several operations in this system involve multiple database writes that must succeed or fail as a unit. These operations must be wrapped in MySQL transactions to guarantee Atomicity, Consistency, Isolation, and Durability (ACID). The backend shall use MySQL’s START TRANSACTION, COMMIT, and ROLLBACK statements via the database client library’s transaction API.

**The following operations require transactions:**

**Booking with Payment:** Creating an appointment record and its associated payment record must be atomic. If either insert fails, neither should persist. This prevents orphaned appointments without payment records (or vice versa). For Card and PayNow, the invoice email is triggered only after the transaction commits successfully.

**Slot Availability Check:** When a customer submits a booking, the system must check slot availability and insert the appointment within the same transaction using appropriate isolation (e.g., SELECT ... FOR UPDATE or serialisable isolation) to prevent two customers from booking the same slot simultaneously.

**Cash Payment Completion:** Updating the payment status to Completed and the appointment status to Completed (if both happen together) must be atomic.

Any operation that modifies a single table in a single row (e.g., updating salon profile, editing a service) does not require an explicit transaction, as MySQL guarantees atomicity for individual statements by default.

5. ## **Idempotency**

In RESTful APIs, GET, PUT, and DELETE are inherently idempotent — repeating the same request produces the same result. POST is not idempotent: submitting the same booking request twice could create duplicate appointments and payments. This is a real risk when network latency, frontend retries, or impatient users trigger repeated submissions.

**The system addresses this with an idempotency key pattern for critical POST operations:**

**POST /api/appointments (Booking):** The frontend generates a UUID (v4) before initiating the booking request and includes it in the request body as idempotency\_key. The backend stores this key in the appointments table (UNIQUE constraint). If a duplicate key is received, the backend returns the original response (the existing appointment and payment details) instead of creating a new record. This ensures that network retries, double-clicks, or frontend re-submissions never produce duplicate bookings.

**POST /api/cards (Save Card):** A UNIQUE composite constraint on (customer\_id, card\_number) in the saved\_cards table prevents the same card from being saved twice for the same customer. If a duplicate is submitted, the backend returns the existing saved card record rather than creating a new one.

The following POST endpoints do not require explicit idempotency handling because the database already enforces uniqueness:

* POST /api/auth/register – UNIQUE constraints on username and email prevent duplicate accounts.

* POST /api/users/stylist – Same UNIQUE constraints apply.

* POST /api/services – Low-frequency Manager operation; duplicate service names can be caught by application-level validation.

  6. ## **Project Structure (Recommended)**

The following directory layout is recommended. Teams may adapt this as needed.

**Frontend (React.js):**

* src/components/ – Reusable UI components (e.g., Navbar, ServiceCard, TimeSlotPicker, PaymentForm).

* src/pages/ – Route-level page components (e.g., LoginPage, BookingPage, DashboardPage, PaymentPage).

* src/context/ – React Context providers (e.g., AuthContext).

* src/services/ – API call functions grouped by domain (e.g., authService.js, bookingService.js, paymentService.js).

* src/utils/ – Utility/helper functions (e.g., QR code generation).

**Backend (Express.js):**

* routes/ – Express route definitions grouped by domain (e.g., authRoutes.js, appointmentRoutes.js, paymentRoutes.js).

* controllers/ – Request handlers containing business logic.

* middleware/ – Authentication and authorization middleware (e.g., verifyToken.js, checkRole.js).

* models/ – Database query functions or ORM models.

* config/ – Database connection setup, environment variables, Mailtrap SMTP config.

* emails/ – Email templates and Nodemailer transport setup.

3. # **Database Design**

   1. ## **Entity-Relationship Overview**

The database consists of the following core entities and their relationships:

* Users – Central entity. Each user has exactly one role (Customer, Stylist, or Manager). One-to-many with Appointments (as customer). One-to-many with Availability (as stylist). One-to-many with Appointments (as stylist). One-to-many with Saved\_Cards. One-to-many with Payments.

* Services – Catalogue of salon services. Each service has a name, duration (minutes), and price. All stylists are qualified to perform all services, so no junction table is needed.

* Availability – Time blocks during which a stylist is available. Each record stores a stylist ID, day of week, start time, and end time.

* Appointments – A booking linking a customer, a stylist, a service, a date/time, and a status. Includes a unique idempotency key to prevent duplicate bookings from repeated submissions.

* Payments – Records each payment transaction. Links to an appointment. Stores the payment method, status, and amount.

* Saved\_Cards – Stores the full card number for payment simulation. The API layer obfuscates the number on retrieval, returning only the last 4 digits. Customers can edit or delete saved cards but cannot view the prior full number.

* Salon\_Profile – Single-row table storing the salon name, address, contact info, and description.

* Business\_Hours – Operating hours per day of week.

4. # **Part 1 – Identity Access Management (IAM)**

   1. ## **Overview**

The IAM module handles all user authentication and authorization. It ensures that only registered users can access the system, and that each user can only perform actions permitted by their assigned role. Authentication is username/password based, with passwords hashed using bcrypt. Authorization is enforced via JWT tokens carrying the user’s role, checked by middleware on every protected API request.

2. ## **Functional Requirements**

   1. ### **Registration**

1. The system shall allow a new user to register by providing a username, email, password, full name, and optionally a phone number.

2. The system shall assign the Customer role by default to all self-registered users.

3. The system shall validate that the username and email are unique before creating the account.

4. The system shall hash the password using bcrypt before storing it.

5. The system shall return a validation error if any required field is missing or malformed.

   2. ### **Login**

6. The system shall allow a registered user to log in with their username and password.

7. On successful login, the system shall return a signed JWT containing the user ID and role.

8. On failed login, the system shall return a generic error message (to prevent username enumeration).

   3. ### **Authorization**

9. The system shall protect all API routes (except registration and login) with JWT verification middleware.

10. The system shall enforce role-based access control so that Customer, Stylist, and Manager roles can only access their permitted endpoints.

11. The system shall return HTTP 401 for missing/invalid tokens and HTTP 403 for insufficient role privileges.

    4. ### **User Management (Manager Only)**

12. The Manager shall be able to view a list of all registered users.

13. The Manager shall be able to create a Stylist account.

14. The Manager shall be able to deactivate or delete user accounts.

15. The Manager shall be able to update user roles if needed.

    3. ## **Use Cases**

### **UC-IAM-01: Customer Registration**

| Use Case ID | UC-IAM-01 |
| :---- | :---- |
| **Use Case Name** | Customer Registration |
| **Actor(s)** | Customer (unregistered visitor) |
| **Precondition** | User is not logged in and does not have an existing account. |
| **Main Flow** | 1\. User navigates to the Registration page. 2\. User enters username, email, password, full name, and optionally phone. 3\. System validates inputs (uniqueness of username and email, format). 4\. System hashes password, creates user record with Customer role. 5\. System returns success message and redirects to Login page. |
| **Postcondition** | A new Customer account exists in the database. |
| **Alternative Flow** | 3a. Username or email already exists → system displays an error and prompts correction. |

### **UC-IAM-02: User Login**

| Use Case ID | UC-IAM-02 |
| :---- | :---- |
| **Use Case Name** | User Login |
| **Actor(s)** | Customer, Stylist, or Manager |
| **Precondition** | User has a registered account. |
| **Main Flow** | 1\. User navigates to the Login page. 2\. User enters username and password. 3\. System verifies credentials. 4\. System issues JWT and stores it on the client. 5\. System redirects user to their role-appropriate dashboard. |
| **Postcondition** | User is authenticated and holds a valid JWT. |
| **Alternative Flow** | 3a. Credentials are invalid → system displays a generic error message. |

### **UC-IAM-03: Manager Creates Stylist Account**

| Use Case ID | UC-IAM-03 |
| :---- | :---- |
| **Use Case Name** | Manager Creates Stylist Account |
| **Actor(s)** | Manager |
| **Precondition** | Manager is logged in. |
| **Main Flow** | 1\. Manager navigates to User Management. 2\. Manager selects Create Stylist. 3\. Manager fills in username, email, password, full name. 4\. System creates the user with the Stylist role. 5\. System displays confirmation. |
| **Postcondition** | A new Stylist account exists in the database. |
| **Alternative Flow** | 3a. Username or email conflict → system displays an error. |

4. ## **API Endpoints**

| Method | Endpoint | Description | Auth |
| :---- | :---- | :---- | :---- |
| POST | /api/auth/register | Register a new Customer account | None |
| POST | /api/auth/login | Authenticate and receive JWT | None |
| GET | /api/auth/me | Get current user profile from token | JWT |
| GET | /api/users | List all users (Manager) | Manager |
| POST | /api/users/stylist | Create a Stylist account (Manager) | Manager |
| PUT | /api/users/:id | Update user details (Manager) | Manager |
| DELETE | /api/users/:id | Delete/deactivate a user (Manager) | Manager |

   5. ## **UI Wireframe Descriptions**

      1. ### **Registration Page**

Layout: Centred card on a clean background. Contains a form with the following fields arranged vertically: Username (text input), Email (email input), Password (password input with visibility toggle), Full Name (text input), Phone (optional text input). A primary Register button sits below the form. A text link below reads: Already have an account? Login. Validation errors appear inline below each field in red.

2. ### **Login Page**

Layout: Centred card matching the registration page style. Two fields: Username and Password. A primary Login button. A text link below: Don’t have an account? Register. A generic error banner appears above the form on failed login.

3. ### **User Management Page (Manager)**

Layout: A data table listing all users with columns: Full Name, Username, Email, Role, and Actions. Actions include an Edit button (opens a modal to update role or details) and a Delete button (triggers a confirmation dialog). A Create Stylist button in the top-right opens a modal form identical to the registration form but with the role pre-set to Stylist. The table supports search/filter by role.

5. # **Part 2 – Appointment Booking System**

   1. ## **Overview**

The Appointment Booking System enables customers to browse salon services, select a stylist, choose an available time slot, book appointments, and pay using one of three methods (Card, PayNow, or Cash). All stylists are qualified to perform all services. Stylists manage their own weekly availability. The Manager has oversight of all appointments and manages the service catalogue, business hours, and salon profile. The system sends simulated invoice emails for Card and PayNow payments via Nodemailer and Mailtrap.

2. ## **Functional Requirements**

   1. ### **Service Management (Manager)**

1. The Manager shall be able to create a new service with a name, duration (minutes), and price.

2. The Manager shall be able to update existing service details.

3. The Manager shall be able to deactivate a service (soft delete) so it no longer appears to customers but historical appointments referencing it remain intact.

   2. ### **Stylist Availability Management (Stylist)**

4. Each Stylist shall be able to define their weekly availability by specifying one or more time blocks per day (e.g., Monday 09:00–12:00, Monday 14:00–18:00).

5. The Stylist shall be able to update or remove their availability blocks.

6. The system shall validate that stylist availability does not extend beyond the salon’s business hours.

   3. ### **Appointment Booking (Customer)**

7. The Customer shall be able to browse all active services.

8. After selecting a service, the Customer shall see a list of all stylists (since all stylists are qualified for all services).

9. After selecting a stylist, the Customer shall see available time slots derived from the stylist’s availability minus existing booked appointments.

10. The Customer shall be able to select a date and an available time slot to book an appointment.

11. The system shall prevent double-booking: a slot occupied by a Confirmed or Pending appointment is unavailable.

12. The Customer shall be able to add optional notes when booking.

    4. ### **Payment (Customer)**

13. After confirming appointment details, the Customer shall choose a payment method: Card, PayNow, or Cash.

14. If Card is selected, the system shall display a card number input field. The Customer may alternatively select a previously saved card.

15. On card submission, the system shall display a loading/processing state for 5 seconds to simulate payment processing, then show a success toast.

16. The Customer shall have the option to save the card for future use. The system shall store the full card number. When displaying saved cards, the system shall obfuscate the number, showing only the last 4 digits (e.g., \*\*\*\* \*\*\*\* \*\*\*\* 4321). The full card number shall never be returned by any API endpoint.

17. If PayNow is selected, the system shall display a randomly generated QR code and a Finish button.

18. When the Customer clicks Finish, the system shall display a success toast confirming payment.

19. If Cash is selected, no payment is processed at booking time. The payment record is created with status Pending.

20. For Card and PayNow payments, the system shall send a simulated invoice email to the customer’s registered email address using Nodemailer via Mailtrap SMTP.

21. The invoice email shall include: salon name, customer name, service name, stylist name, appointment date and time, amount paid, and payment method.

22. The Stylist or Manager shall be able to mark a Cash payment as Completed after the customer pays at the salon.

    5. ### **Saved Card Management (Customer)**

23. The Customer shall be able to view their saved cards in their profile. Each card shall display the obfuscated card number (last 4 digits only) and the card label.

24. The Customer shall be able to delete a saved card from their profile.

25. The Customer shall be able to save a new card either during the payment flow or from their profile page.

26. The Customer shall be able to edit a saved card to change the card number or label. The edit form shall not display the prior card number; it shall show the obfuscated version as a placeholder and require full re-entry of the new number.

    6. ### **Appointment Management**

27. The Customer shall be able to view their booking history (past and upcoming appointments).

28. The Customer shall be able to cancel an upcoming appointment (status changes to Cancelled).

29. The Stylist shall be able to view all their upcoming appointments.

30. The Stylist shall be able to mark an appointment as Completed.

31. The Manager shall be able to view and filter all appointments across all stylists.

32. The Manager shall be able to update the status of any appointment.

    7. ### **Transaction Integrity (ACID) and Idempotency**

33. The system shall create appointment and payment records within a single database transaction. If either operation fails, both shall be rolled back.

34. The system shall perform slot availability verification and appointment insertion within the same transaction, using row-level locking (e.g., SELECT ... FOR UPDATE) to prevent double-booking under concurrent access.

35. The system shall execute cash payment completion and appointment status update within a single database transaction when both occur together.

36. Invoice emails shall be triggered only after the database transaction has committed successfully, not before.

37. The frontend shall generate a UUID v4 idempotency key for each booking attempt and include it in the POST /api/appointments request body.

38. The backend shall check the idempotency\_key (UNIQUE constraint) before processing a booking. If a matching key already exists, the backend shall return the existing appointment and payment details without creating new records.

39. The saved\_cards table shall enforce a UNIQUE composite constraint on (customer\_id, card\_number). If a duplicate card is submitted, the backend shall return the existing saved card record.

    8. ### **Salon Profile and Business Hours (Manager)**

40. The Manager shall be able to update the salon profile (name, address, phone, email, description).

41. The Manager shall be able to set business hours per day of the week (open time, close time, or closed).

42. The salon profile and business hours shall be visible to all users (including unauthenticated visitors) on the public landing page.

    3. ## **Use Cases**

### **UC-ABS-01: Customer Books an Appointment with Payment**

| Use Case ID | UC-ABS-01 |
| :---- | :---- |
| **Use Case Name** | Customer Books an Appointment with Payment |
| **Actor(s)** | Customer |
| **Precondition** | Customer is logged in. |
| **Main Flow** | 1\. Customer navigates to Services page and browses active services. 2\. Customer selects a service. 3\. System displays all stylists. 4\. Customer selects a stylist. 5\. System displays a calendar/date picker. 6\. Customer selects a date. 7\. System calculates and displays available time slots for that date. 8\. Customer selects a slot and optionally adds notes. 9\. System displays a booking summary and payment method selection (Card, PayNow, Cash). 10\. Customer selects a payment method and completes payment (see UC-ABS-05/06/07). 11\. Frontend generates a unique idempotency key (UUID v4) and submits the booking request. 12\. Backend verifies slot availability within a transaction, checks the idempotency key for duplicates, and creates the appointment and payment records atomically. 13\. On successful commit, system displays booking confirmation with a success toast. For Card/PayNow, invoice email is sent after commit. |
| **Postcondition** | An appointment record exists with a unique idempotency key. A payment record exists (Completed for Card/PayNow, Pending for Cash). For Card/PayNow, an invoice email is sent. All records were created atomically within a single transaction. |
| **Alternative Flow** | 7a. No slots available on selected date → system prompts to choose another date. 12a. Slot was taken between display and submission (concurrent booking) → transaction rolls back, system returns an error and refreshes available slots. 12b. Duplicate idempotency key detected → backend returns the original booking response without creating new records. |

### **UC-ABS-02: Customer Cancels an Appointment**

| Use Case ID | UC-ABS-02 |
| :---- | :---- |
| **Use Case Name** | Customer Cancels an Appointment |
| **Actor(s)** | Customer |
| **Precondition** | Customer is logged in and has an upcoming appointment. |
| **Main Flow** | 1\. Customer navigates to My Appointments. 2\. Customer selects an upcoming appointment. 3\. Customer clicks Cancel. 4\. System shows confirmation dialog. 5\. Customer confirms. 6\. System updates appointment status to Cancelled. |
| **Postcondition** | Appointment status is Cancelled; the time slot becomes available again. |
| **Alternative Flow** | 5a. Customer declines confirmation → no change. |

### **UC-ABS-03: Stylist Sets Availability**

| Use Case ID | UC-ABS-03 |
| :---- | :---- |
| **Use Case Name** | Stylist Sets Weekly Availability |
| **Actor(s)** | Stylist |
| **Precondition** | Stylist is logged in. |
| **Main Flow** | 1\. Stylist navigates to My Availability page. 2\. Stylist sees a weekly grid (Monday–Sunday). 3\. Stylist adds time blocks for desired days (e.g., Mon 09:00–18:00). 4\. System validates blocks fall within salon business hours. 5\. System saves the availability. |
| **Postcondition** | Stylist availability records are created/updated in the database. |
| **Alternative Flow** | 4a. Time block exceeds business hours → system shows an error specifying the valid range. |

### **UC-ABS-04: Manager Manages Services**

| Use Case ID | UC-ABS-04 |
| :---- | :---- |
| **Use Case Name** | Manager Manages Services |
| **Actor(s)** | Manager |
| **Precondition** | Manager is logged in. |
| **Main Flow** | 1\. Manager navigates to Service Management. 2\. Manager can create a new service (name, duration, price), edit an existing service, or deactivate a service. 3\. System saves changes. |
| **Postcondition** | Service catalogue is updated. |
| **Alternative Flow** | 2a. Duplicate service name → system warns and prompts correction. |

### **UC-ABS-05: Card Payment**

| Use Case ID | UC-ABS-05 |
| :---- | :---- |
| **Use Case Name** | Card Payment |
| **Actor(s)** | Customer |
| **Precondition** | Customer has confirmed booking details and selected Card as payment method. |
| **Main Flow** | 1\. System displays a card number input field and a list of saved cards (if any). 2\. Customer enters a card number or selects a saved card. 3\. Customer optionally checks Save this card for future use. 4\. Customer clicks Pay. 5\. System shows a processing spinner for 5 seconds. 6\. System displays a success toast: Payment successful. 7\. System records payment as Completed and sends invoice email. |
| **Postcondition** | Payment record has status Completed. Invoice email sent. If save was selected, full card number is stored in saved\_cards (obfuscated on any future retrieval). |
| **Alternative Flow** | 2a. Customer selects a saved card → skip card number input, proceed to step 4\. |

### **UC-ABS-06: PayNow Payment**

| Use Case ID | UC-ABS-06 |
| :---- | :---- |
| **Use Case Name** | PayNow Payment |
| **Actor(s)** | Customer |
| **Precondition** | Customer has confirmed booking details and selected PayNow as payment method. |
| **Main Flow** | 1\. System generates and displays a random QR code image. 2\. System displays a Finish button below the QR code. 3\. Customer clicks Finish. 4\. System displays a success toast: Payment successful. 5\. System records payment as Completed and sends invoice email. |
| **Postcondition** | Payment record has status Completed. Invoice email sent. |
| **Alternative Flow** | N/A |

### **UC-ABS-07: Cash Payment**

| Use Case ID | UC-ABS-07 |
| :---- | :---- |
| **Use Case Name** | Cash Payment |
| **Actor(s)** | Customer, Stylist/Manager |
| **Precondition** | Customer has confirmed booking details and selected Cash as payment method. |
| **Main Flow** | 1\. Customer selects Cash. 2\. System displays a message: Please pay at the salon after your appointment. 3\. System creates the appointment with a payment record in Pending status. 4\. After the service, the Stylist or Manager navigates to the appointment and marks the payment as Completed. |
| **Postcondition** | Appointment is booked. Payment record exists with Pending status until marked Completed by staff. |
| **Alternative Flow** | N/A |

4. ## **API Endpoints**

   1. ### **Services**

| Method | Endpoint | Description | Auth |
| :---- | :---- | :---- | :---- |
| GET | /api/services | List all active services | None |
| GET | /api/services/:id | Get service details | None |
| POST | /api/services | Create a new service | Manager |
| PUT | /api/services/:id | Update a service | Manager |
| DELETE | /api/services/:id | Deactivate a service | Manager |

      2. ### **Stylists**

| Method | Endpoint | Description | Auth |
| :---- | :---- | :---- | :---- |
| GET | /api/stylists | List all active stylists (for booking flow) | JWT |

      3. ### **Availability**

| Method | Endpoint | Description | Auth |
| :---- | :---- | :---- | :---- |
| GET | /api/availability/me | Get own weekly availability | Stylist |
| PUT | /api/availability/me | Set/replace own availability | Stylist |
| GET | /api/availability/:stylistId | Get a stylist’s availability (for booking) | JWT |

      4. ### **Appointments**

| Method | Endpoint | Description | Auth |
| :---- | :---- | :---- | :---- |
| GET | /api/appointments/slots | Get available slots (query: stylistId, serviceId, date) | JWT |
| POST | /api/appointments | Book appointment (body includes payment method, idempotency\_key) | Customer |
| GET | /api/appointments/me | Get own appointments (Customer) | Customer |
| GET | /api/appointments/stylist/me | Get own appointments (Stylist) | Stylist |
| GET | /api/appointments | Get all appointments (Manager) | Manager |
| PUT | /api/appointments/:id/cancel | Cancel an appointment | Customer/Manager |
| PUT | /api/appointments/:id/status | Update appointment status | Stylist/Manager |

      5. ### **Payments**

| Method | Endpoint | Description | Auth |
| :---- | :---- | :---- | :---- |
| POST | /api/payments | Create a payment record (called during booking) | Customer |
| GET | /api/payments/me | Get own payment history | Customer |
| PUT | /api/payments/:id/complete | Mark a Cash payment as Completed | Stylist/Manager |
| GET | /api/payments/appointment/:id | Get payment for an appointment | JWT |

      6. ### **Saved Cards**

| Method | Endpoint | Description | Auth |
| :---- | :---- | :---- | :---- |
| GET | /api/cards/me | List saved cards (obfuscated numbers) | Customer |
| POST | /api/cards | Save a new card (body: cardNumber, label) | Customer |
| PUT | /api/cards/:id | Update card number or label | Customer |
| DELETE | /api/cards/:id | Delete a saved card | Customer |

      7. ### **Salon Profile & Business Hours**

| Method | Endpoint | Description | Auth |
| :---- | :---- | :---- | :---- |
| GET | /api/salon | Get salon profile (public) | None |
| PUT | /api/salon | Update salon profile | Manager |
| GET | /api/salon/hours | Get business hours (public) | None |
| PUT | /api/salon/hours | Update business hours | Manager |

   5. ## **UI Wireframe Descriptions**

      1. ### **Public Landing Page**

Layout: A hero section displaying the salon name, a brief description, and a Book Now call-to-action button. Below: a grid of service cards showing service name, duration, and price. A sidebar or footer section shows business hours and contact information pulled from the salon profile. Unauthenticated visitors see Login / Register links in the navbar.

2. ### **Booking Flow (Customer)**

Step 1 – Select Service: A grid or list of active service cards. Each card shows name, duration, price, and a Select button. Step 2 – Select Stylist: After choosing a service, a list of all stylists, each showing their name. Step 3 – Select Date and Time: A date picker (calendar) showing the next 14–30 days. After selecting a date, a grid of available time slots (e.g., 09:00, 09:30, 10:00) is shown. Unavailable slots are greyed out. Step 4 – Review and Pay: A summary card showing the service, stylist, date, time, price, and an optional notes text area. Below the summary, three payment method tabs: Card, PayNow, and Cash.

3. ### **Payment – Card Tab**

Layout: Within the Card tab, a dropdown/select to choose a saved card (if any exist) or an option to Enter new card. If entering a new card: a single text input for the card number, a checkbox labelled Save this card for future use, and an optional Card Label text input that appears when the save checkbox is ticked. A Pay button at the bottom. On click, the button transitions to a disabled state with a spinner and Processing... text for 5 seconds. After 5 seconds, a success toast appears at the top-right: Payment successful\! Booking confirmed.

4. ### **Payment – PayNow Tab**

Layout: Within the PayNow tab, a prominently displayed QR code image (randomly generated, approximately 200x200 pixels). Below the QR code, instructional text: Scan the QR code with your banking app to complete payment. A Finish button below the text. On click, a success toast appears: Payment successful\! Booking confirmed.

5. ### **Payment – Cash Tab**

Layout: Within the Cash tab, an informational message: You have selected to pay by cash. Please pay at the salon after your appointment. A Confirm Booking button below. On click, a toast appears: Booking confirmed\! Please remember to bring cash to your appointment.

6. ### **My Appointments (Customer)**

Layout: Two tabs: Upcoming and Past. Each tab shows a list of appointment cards sorted by date. Each card displays: service name, stylist name, date, time, status badge (colour-coded: Pending \= yellow, Confirmed \= green, Cancelled \= red, Completed \= grey), and payment status (Paid or Pending). Upcoming appointments have a Cancel action button. To rebook, the customer uses the standard booking flow.

7. ### **Customer Profile – Saved Cards Section**

Layout: Within the customer profile page, a Saved Cards section. A list of saved cards, each showing: a card icon, the obfuscated card number in the format \*\*\*\* \*\*\*\* \*\*\*\* 4321 (only last 4 digits visible), the card label (if any), an Edit button, and a Delete button (with confirmation dialog). Clicking Edit opens an inline form pre-filled with the obfuscated number as a read-only placeholder and the existing label; the customer must enter the full new card number to replace it (the prior number is never shown). An Add Card button opens a small inline form with a card number input field and an optional label field.

8. ### **Stylist Dashboard**

Layout: A top section shows a summary (number of upcoming appointments today, this week). Below: a table or timeline view of upcoming appointments sorted chronologically. Each row shows: customer name, service, date, time, status, payment status. Stylists can click an appointment to mark it as Completed. For appointments with Cash payment in Pending status, a Mark as Paid button is available. A sidebar navigation link leads to the My Availability page.

9. ### **My Availability (Stylist)**

Layout: A weekly grid (7 columns for each day). Each column shows existing time blocks as coloured bars. A plus button on each day opens a form to add a new block (start time and end time, validated against business hours). Existing blocks can be clicked to edit or delete. A Save button persists all changes.

10. ### **Service Management (Manager)**

Layout: A data table listing all services with columns: Name, Duration, Price, Status (Active/Inactive), and Actions (Edit, Deactivate). An Add Service button opens a form modal with fields: Name, Duration (minutes), Price.

11. ### **Manager Dashboard**

Layout: A summary section at the top showing key metrics: total appointments today, pending appointments, total customers, total stylists, and revenue summary (total payments completed). Below: a filterable appointment table with columns: Customer, Stylist, Service, Date, Time, Status, Payment Status, Payment Method. Filters include: date range, stylist, status, payment status. The manager can click any appointment to view details, update its status, or mark cash payments as completed. Sidebar navigation links to: User Management, Service Management, Business Hours, Salon Profile.

12. ### **Business Hours and Salon Profile (Manager)**

Business Hours: A simple table showing each day of the week with editable Open Time and Close Time fields, plus a Closed toggle. A Save button applies all changes. Salon Profile: A form with fields for salon name, address, phone, email, and a text area for description. A Save button updates the single salon profile record.

6. # **Non-Functional Requirements**

1. (Security) Passwords must be hashed with bcrypt (minimum 10 salt rounds). JWT secret must be stored in environment variables, not hard-coded.

2. (Security) All API inputs must be validated and sanitised on the server to prevent SQL injection and XSS.

3. (Security) CORS must be configured to allow only the frontend origin.

4. (Security) Full card numbers are stored for simulation purposes only. The backend API must never return the full card number in any response; all card-related GET endpoints must return only the last 4 digits in an obfuscated format. In a production system, this would be replaced by payment gateway tokenisation.

5. (Data Integrity – ACID) All multi-table write operations (booking \+ payment, cash payment completion) must be wrapped in MySQL transactions. The system must use row-level locking or serialisable isolation to prevent double-booking of the same time slot under concurrent access. Invoice emails must be sent only after the transaction commits.

6. (Reliability – Idempotency) All POST endpoints that create critical resources (appointments, payments, saved cards) must be idempotent. The booking endpoint must use a client-generated idempotency key (UUID v4) with a UNIQUE database constraint. The saved cards endpoint must enforce a UNIQUE composite constraint on (customer\_id, card\_number). Duplicate requests must return the original response, not create duplicate records.

7. (Usability) The UI must be responsive, functioning correctly on desktop and mobile browsers.

8. (Performance) API responses should complete within 500ms under normal load for single-record operations.

9. (Data Integrity) Foreign key constraints must be enforced at the database level. Deletes of referenced records must be handled via soft-delete flags, not hard deletion.

10. (Code Quality) The codebase must follow a consistent structure with separation of concerns between routes, controllers, middleware, and models.

11. (Environment) The application must be runnable locally via npm scripts (npm start for frontend, npm run dev for backend) with a documented .env.example file listing all required variables including Mailtrap SMTP credentials.

12. (Email) Mailtrap SMTP credentials must be stored in environment variables. The email transport must be configured so that switching to a production email provider requires only changing the SMTP credentials, not the code.

7. # **Assumptions and Constraints**

   1. ## **Assumptions**

* Only one salon is managed by this system (single-tenant).

* The Manager account is seeded directly in the database during initial setup (no self-registration for Manager).

* Stylist accounts are created by the Manager; stylists do not self-register.

* Customers register themselves via the public registration page using username, email, and password.

* All stylists are qualified to perform all services. There is no per-stylist service restriction.

* Time slots are calculated in fixed increments (e.g., 30-minute intervals) based on stylist availability and service duration.

* A customer can book only one service per appointment. Multiple services require separate bookings.

* Rescheduling is not supported as a standalone feature. Customers cancel the existing appointment and create a new booking.

* The system operates in a single time zone.

* Idempotency keys are generated client-side as UUID v4 strings. The backend relies on the UNIQUE database constraint to detect duplicates rather than an in-memory cache or TTL-based expiry.

* All payments are simulated. No real money is exchanged. Card validation is not performed beyond accepting the input.

* Full card numbers are stored in the database for simulation realism. In a production system, this would be replaced by tokenisation via a payment gateway (e.g., Stripe). The API layer ensures card numbers are never exposed in responses.

* The 5-second delay for card payment is a frontend-only simulation and does not involve a real payment gateway.

* PayNow QR codes are randomly generated and do not represent real payment instructions.

* Invoice emails are captured by Mailtrap and are not delivered to real customer inboxes.

  2. ## **Constraints**

* This is a final-year academic project. It will run in a local development environment only.

* No production deployment, load balancing, or CI/CD pipeline is required.

* No real payment gateway integration (Stripe, PayPal, etc.).

* No email verification or password reset.

* No third-party OAuth providers (Google, Facebook, etc.) for login.

* Mailtrap free tier limits apply (typically 100 emails per month).

8. # **Appendix: Role-Permission Matrix**

The following table summarises which actions each role can perform.

| Action | Customer | Stylist | Manager |
| :---- | :---- | :---- | :---- |
| Register / Login | ✓ | ✓ | ✓ |
| Browse services (public) | ✓ | ✓ | ✓ |
| Book an appointment | ✓ | – | – |
| Select payment method | ✓ | – | – |
| Cancel own appointment | ✓ | – | – |
| View own booking history | ✓ | – | – |
| View own payment history | ✓ | – | – |
| Manage saved cards (view/add/edit/delete) | ✓ | – | – |
| View own upcoming appointments | – | ✓ | ✓ |
| Set own availability | – | ✓ | – |
| Mark appointment as Completed | – | ✓ | ✓ |
| Mark Cash payment as Completed | – | ✓ | ✓ |
| Manage users (CRUD) | – | – | ✓ |
| Create Stylist accounts | – | – | ✓ |
| Manage services (CRUD) | – | – | ✓ |
| View / manage all appointments | – | – | ✓ |
| Manage business hours | – | – | ✓ |
| Manage salon profile | – | – | ✓ |

