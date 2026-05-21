1. ## **Table Definitions**

   1. ### **users**

| Column | Type | Constraints | Description |
| :---- | :---- | :---- | :---- |
| user\_id | INT | PK, AUTO\_INCREMENT | Unique user identifier |
| username | VARCHAR(50) | UNIQUE, NOT NULL | Login username |
| password | VARCHAR(255) | NOT NULL | Bcrypt-hashed password |
| full\_name | VARCHAR(100) | NOT NULL | Display name |
| email | VARCHAR(100) | UNIQUE, NOT NULL | Email address (used for invoices) |
| phone | VARCHAR(20) | NULL | Contact phone number |
| role | ENUM('Customer','Stylist','Manager') | NOT NULL | User role for access control |

      2. ### **services**

| Column | Type | Constraints | Description |
| :---- | :---- | :---- | :---- |
| service\_id | INT | PK, AUTO\_INCREMENT | Unique service identifier |
| name | VARCHAR(100) | NOT NULL | Service name (e.g., Haircut, Colouring) |
| duration | INT | NOT NULL | Service duration in minutes |
| price | DECIMAL(8,2) | NOT NULL | Price in local currency |
| is\_active | BOOLEAN | DEFAULT TRUE | Soft-delete flag |

      3. ### **availability**

| Column | Type | Constraints | Description |
| :---- | :---- | :---- | :---- |
| availability\_id | INT | PK, AUTO\_INCREMENT | Unique record identifier |
| stylist\_id | INT | FK → users.user\_id, NOT NULL | The stylist this slot belongs to |
| day\_of\_week | TINYINT | NOT NULL (0=Sun, 6=Sat) | Day of the week |
| start\_time | TIME | NOT NULL | Slot start time |
| end\_time | TIME | NOT NULL | Slot end time |

      4. ### **appointments**

| Column | Type | Constraints | Description |
| :---- | :---- | :---- | :---- |
| appointment\_id | INT | PK, AUTO\_INCREMENT | Unique appointment identifier |
| idempotency\_key | CHAR(36) | UNIQUE, NOT NULL | Client-generated UUID to prevent duplicate bookings |
| customer\_id | INT | FK → users.user\_id, NOT NULL | The customer who booked |
| stylist\_id | INT | FK → users.user\_id, NOT NULL | The assigned stylist |
| service\_id | INT | FK → services.service\_id, NOT NULL | The booked service |
| appointment\_date | DATE | NOT NULL | Date of appointment |
| start\_time | TIME | NOT NULL | Appointment start time |
| end\_time | TIME | NOT NULL | Calculated: start\_time \+ duration |
| status | ENUM('Pending','Confirmed','Cancelled','Completed') | DEFAULT 'Pending' | Current booking status |
| notes | TEXT | NULL | Customer notes or special requests |
| created\_at | DATETIME | DEFAULT CURRENT\_TIMESTAMP | Booking creation time |

      5. ### **payments**

| Column | Type | Constraints | Description |
| :---- | :---- | :---- | :---- |
| payment\_id | INT | PK, AUTO\_INCREMENT | Unique payment identifier |
| appointment\_id | INT | FK → appointments.appointment\_id, NOT NULL | The associated appointment |
| customer\_id | INT | FK → users.user\_id, NOT NULL | The customer who paid |
| amount | DECIMAL(8,2) | NOT NULL | Payment amount (equals service price) |
| method | ENUM('Card','PayNow','Cash') | NOT NULL | Payment method used |
| status | ENUM('Pending','Completed') | NOT NULL | Pending for Cash; Completed for Card/PayNow |
| invoice\_sent | BOOLEAN | DEFAULT FALSE | Whether invoice email was sent |
| created\_at | DATETIME | DEFAULT CURRENT\_TIMESTAMP | Payment record creation time |

      6. ### **saved\_cards**

| Column | Type | Constraints | Description |
| :---- | :---- | :---- | :---- |
| card\_id | INT | PK, AUTO\_INCREMENT | Unique card record identifier |
| customer\_id | INT | FK → users.user\_id, NOT NULL | The customer who owns this card |
| card\_number | VARCHAR(20) | NOT NULL | Full card number (stored for simulation; obfuscated on retrieval) |
| card\_label | VARCHAR(50) | NULL | Nickname (e.g., My Visa, Work Card) |
| created\_at | DATETIME | DEFAULT CURRENT\_TIMESTAMP | When the card was saved |
| updated\_at | DATETIME | ON UPDATE CURRENT\_TIMESTAMP | Last update timestamp |

Note: The backend API must never return the full card\_number in any response. All GET endpoints return only the last 4 digits in a masked format (e.g., \*\*\*\* \*\*\*\* \*\*\*\* 4321). The full card number is used internally only when simulating a payment charge. A UNIQUE composite constraint on (customer\_id, card\_number) prevents duplicate card entries for the same customer.

7. ### **salon\_profile**

| Column | Type | Constraints | Description |
| :---- | :---- | :---- | :---- |
| salon\_id | INT | PK, DEFAULT 1 | Single-row constraint |
| name | VARCHAR(100) | NOT NULL | Salon name |
| address | VARCHAR(255) | NULL | Physical address |
| phone | VARCHAR(20) | NULL | Contact number |
| email | VARCHAR(100) | NULL | Contact email |
| description | TEXT | NULL | About the salon |

   8. ### **business\_hours**

| Column | Type | Constraints | Description |
| :---- | :---- | :---- | :---- |
| id | INT | PK, AUTO\_INCREMENT | Record identifier |
| day\_of\_week | TINYINT | UNIQUE, NOT NULL (0–6) | Day of the week |
| open\_time | TIME | NOT NULL | Opening time |
| close\_time | TIME | NOT NULL | Closing time |
| is\_closed | BOOLEAN | DEFAULT FALSE | Whether salon is closed this day |

