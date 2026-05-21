-- Salon Booking System (SBS)
-- Initial manual MySQL schema
-- Source documents:
--   AGENTS.md
--   ARCHITECTURE.md
--   documents/specs/sbs_project_specification.md
--   documents/specs/sbs_data_model.md
--   PLANS.md
--
-- Intended use:
--   Run this script manually in MySQL Workbench.
--   Use an empty database for the cleanest setup.
--   This script intentionally does not include seed data.

-- =========================================================
-- Database
-- =========================================================

CREATE DATABASE IF NOT EXISTS salon_booking_system
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE salon_booking_system;

-- =========================================================
-- IAM: users
-- =========================================================

CREATE TABLE IF NOT EXISTS users (
  user_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NULL,
  role ENUM('Customer', 'Stylist', 'Manager') NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id),
  UNIQUE KEY uq_users_username (username),
  UNIQUE KEY uq_users_email (email),
  KEY idx_users_role_active (role, is_active)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- =========================================================
-- Services
-- =========================================================

CREATE TABLE IF NOT EXISTS services (
  service_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  duration INT UNSIGNED NOT NULL,
  price DECIMAL(8,2) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (service_id),
  KEY idx_services_active (is_active),
  CONSTRAINT chk_services_duration_positive CHECK (duration > 0),
  CONSTRAINT chk_services_price_nonnegative CHECK (price >= 0)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- =========================================================
-- Salon profile and business hours
-- =========================================================

CREATE TABLE IF NOT EXISTS salon_profile (
  salon_id TINYINT UNSIGNED NOT NULL DEFAULT 1,
  name VARCHAR(100) NOT NULL,
  address VARCHAR(255) NULL,
  phone VARCHAR(20) NULL,
  email VARCHAR(100) NULL,
  description TEXT NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (salon_id),
  CONSTRAINT chk_salon_profile_single_row CHECK (salon_id = 1)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS business_hours (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  day_of_week TINYINT UNSIGNED NOT NULL,
  open_time TIME NOT NULL,
  close_time TIME NOT NULL,
  is_closed BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_business_hours_day (day_of_week),
  CONSTRAINT chk_business_hours_day CHECK (day_of_week BETWEEN 0 AND 6),
  CONSTRAINT chk_business_hours_time_order CHECK (is_closed = TRUE OR close_time > open_time)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- =========================================================
-- Stylist availability
-- =========================================================

CREATE TABLE IF NOT EXISTS availability (
  availability_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  stylist_id INT UNSIGNED NOT NULL,
  day_of_week TINYINT UNSIGNED NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (availability_id),
  UNIQUE KEY uq_availability_stylist_block (stylist_id, day_of_week, start_time, end_time),
  KEY idx_availability_stylist_day (stylist_id, day_of_week),
  CONSTRAINT fk_availability_stylist
    FOREIGN KEY (stylist_id)
    REFERENCES users (user_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT chk_availability_day CHECK (day_of_week BETWEEN 0 AND 6),
  CONSTRAINT chk_availability_time_order CHECK (end_time > start_time)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- =========================================================
-- Appointments
-- =========================================================

CREATE TABLE IF NOT EXISTS appointments (
  appointment_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  idempotency_key CHAR(36) NOT NULL,
  customer_id INT UNSIGNED NOT NULL,
  stylist_id INT UNSIGNED NOT NULL,
  service_id INT UNSIGNED NOT NULL,
  appointment_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status ENUM('Pending', 'Confirmed', 'Cancelled', 'Completed') NOT NULL DEFAULT 'Pending',
  notes TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (appointment_id),
  UNIQUE KEY uq_appointments_idempotency_key (idempotency_key),
  KEY idx_appointments_customer_date (customer_id, appointment_date, start_time),
  KEY idx_appointments_stylist_date (stylist_id, appointment_date, start_time),
  KEY idx_appointments_slot_lookup (stylist_id, appointment_date, start_time, end_time, status),
  KEY idx_appointments_status_date (status, appointment_date),
  KEY idx_appointments_service (service_id),
  UNIQUE KEY uq_appointments_id_customer (appointment_id, customer_id),
  CONSTRAINT fk_appointments_customer
    FOREIGN KEY (customer_id)
    REFERENCES users (user_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT fk_appointments_stylist
    FOREIGN KEY (stylist_id)
    REFERENCES users (user_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT fk_appointments_service
    FOREIGN KEY (service_id)
    REFERENCES services (service_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT chk_appointments_time_order CHECK (end_time > start_time)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- =========================================================
-- Payments
-- =========================================================

CREATE TABLE IF NOT EXISTS payments (
  payment_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  appointment_id INT UNSIGNED NOT NULL,
  customer_id INT UNSIGNED NOT NULL,
  amount DECIMAL(8,2) NOT NULL,
  method ENUM('Card', 'PayNow', 'Cash') NOT NULL,
  status ENUM('Pending', 'Completed') NOT NULL DEFAULT 'Pending',
  invoice_sent BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (payment_id),
  UNIQUE KEY uq_payments_appointment (appointment_id),
  KEY idx_payments_customer_created (customer_id, created_at),
  KEY idx_payments_status_method (status, method),
  CONSTRAINT fk_payments_appointment_customer
    FOREIGN KEY (appointment_id, customer_id)
    REFERENCES appointments (appointment_id, customer_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT fk_payments_customer
    FOREIGN KEY (customer_id)
    REFERENCES users (user_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT chk_payments_amount_nonnegative CHECK (amount >= 0)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- =========================================================
-- Saved cards
-- =========================================================

CREATE TABLE IF NOT EXISTS saved_cards (
  card_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  customer_id INT UNSIGNED NOT NULL,
  card_number VARCHAR(20) NOT NULL,
  card_label VARCHAR(50) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (card_id),
  UNIQUE KEY uq_saved_cards_customer_card (customer_id, card_number),
  CONSTRAINT fk_saved_cards_customer
    FOREIGN KEY (customer_id)
    REFERENCES users (user_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT chk_saved_cards_card_number_not_empty CHECK (CHAR_LENGTH(TRIM(card_number)) > 0)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- =========================================================
-- Manual verification helpers
-- =========================================================

SHOW TABLES;

-- Optional checks after running:
-- SHOW CREATE TABLE users;
-- SHOW CREATE TABLE appointments;
-- SHOW CREATE TABLE payments;
-- SHOW CREATE TABLE saved_cards;
--
-- Foreign key check:
-- SELECT
--   table_name,
--   constraint_name,
--   referenced_table_name
-- FROM information_schema.key_column_usage
-- WHERE table_schema = 'salon_booking_system'
--   AND referenced_table_name IS NOT NULL
-- ORDER BY table_name, constraint_name;
