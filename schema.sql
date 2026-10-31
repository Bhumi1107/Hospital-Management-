-- Hospital Management System: five-entity relational design
-- Use only synthetic data for demonstrations. Never commit real patient data.
CREATE DATABASE IF NOT EXISTS hospital_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hospital_db;

CREATE TABLE IF NOT EXISTS departments (
 department_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 department_name VARCHAR(100) NOT NULL UNIQUE,
 location VARCHAR(120) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS doctors (
 doctor_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 doctor_name VARCHAR(120) NOT NULL,
 specialization VARCHAR(120) NOT NULL,
 department_id INT UNSIGNED NOT NULL,
 CONSTRAINT fk_doctor_department FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS patients (
 patient_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 patient_name VARCHAR(120) NOT NULL,
 age TINYINT UNSIGNED NOT NULL,
 gender VARCHAR(25) NOT NULL,
 phone VARCHAR(20) NOT NULL,
 CONSTRAINT chk_age CHECK (age <= 120)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS appointments (
 appointment_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 patient_id INT UNSIGNED NOT NULL,
 doctor_id INT UNSIGNED NOT NULL,
 appointment_date DATETIME NOT NULL,
 status VARCHAR(24) NOT NULL DEFAULT 'Scheduled',
 CONSTRAINT fk_appointment_patient FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE RESTRICT ON UPDATE CASCADE,
 CONSTRAINT fk_appointment_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id) ON DELETE RESTRICT ON UPDATE CASCADE,
 CONSTRAINT chk_appointment_status CHECK (status IN ('Scheduled','Completed','Cancelled')),
 INDEX idx_appointment_date (appointment_date)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS medical_records (
 record_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 patient_id INT UNSIGNED NOT NULL,
 doctor_id INT UNSIGNED NOT NULL,
 diagnosis TEXT NOT NULL,
 treatment TEXT NOT NULL,
 CONSTRAINT fk_record_patient FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE RESTRICT ON UPDATE CASCADE,
 CONSTRAINT fk_record_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;
