# CareFlow — Hospital Management System

A responsive **Hospital Management System** mini-project with five connected database entities, record CRUD, appointment management, and SQL reporting. The same interface offers a **public demonstration** and a **real MySQL-backed localhost application**.

## Quick links

- **Source code:** https://github.com/Bhumi1107/Hospital-Management-
- **Pages demo (once enabled):** https://bhumi1107.github.io/Hospital-Management-/

> **Privacy notice:** GitHub Pages is a *demo*, not a secure patient-record system. It includes clearly fictitious starter data and stores changes in the current browser only. Never enter real patient, medical or other confidential information into the public demo. The localhost app is an educational prototype without login or access controls, so it is also not appropriate for real clinical deployment.

## What it does

| Section | Features |
| --- | --- |
| Overview | Patient, doctor, appointment and medical-record counts; upcoming schedule; quick actions |
| Patients | Add, search, edit and delete patient records |
| Doctors | Link doctors to departments, and manage doctor records |
| Appointments | Link patients to doctors; appointment date/time; Scheduled / Completed / Cancelled statuses |
| Medical records | Patient and doctor linked diagnoses and treatment notes |
| Departments | Department name and location management |
| Reports | Appointment JOIN, doctor workload GROUP BY, repeat-patient correlated subquery |
| Export | Export currently displayed dataset as JSON on user request |

**The five tables match the mini-project ER design:**

- departments(department_id PK, department_name, location)
- doctors(doctor_id PK, doctor_name, specialization, department_id FK)
- patients(patient_id PK, patient_name, age, gender, phone)
- appointments(appointment_id PK, patient_id FK, doctor_id FK, appointment_date, status)
- medical_records(record_id PK, patient_id FK, doctor_id FK, diagnosis, treatment)

Foreign keys prevent deletion of referenced records. Input validation covers required fields, phone/age ranges, valid appointments and foreign keys.

## A. Open demo mode immediately — no installation

Open the index.html file in Chrome or Edge. You can also enable GitHub Pages:

1. Visit https://github.com/Bhumi1107/Hospital-Management-/settings/pages
2. Choose **Source: Deploy from a branch**.
3. Select **main** and **/(root)**, then click **Save**.
4. Once the Pages deployment succeeds, open https://bhumi1107.github.io/Hospital-Management-/

Demo data stays in that browser's localStorage; its records are not shared between devices or connected to MySQL. Edits are preserved across refreshes until site storage is cleared.

## B. Run with the real MySQL database on localhost (Windows)

**Prerequisites:** Windows, Python 3.10 or newer, and a running MySQL server (MySQL Community Server or MySQL Workbench connected to its server).

1. On GitHub, click **Code → Download ZIP** and extract the folder.
2. Double-click **start_local.bat**. The first run creates a local .env file and explains what to do.
3. Open the extracted **.env** file and change MYSQL_PASSWORD to *your own* MySQL password. If needed, also edit MYSQL_USER, MYSQL_HOST and MYSQL_PORT. Do not upload the .env file to GitHub.
4. Double-click **start_local.bat** again.
5. It installs the Python packages, initializes hospital_db and all five MySQL tables, and launches http://127.0.0.1:5000 in your browser.
6. A blue **MySQL connected** badge indicates that create/read/update/delete operations really use MySQL. A green **Demo mode** badge means you're *not* connected to MySQL.

Alternative terminal commands (run in the project folder):

    python -m pip install -r requirements.txt
    python setup_db.py
    python app.py

If a command fails: confirm that Python is on PATH, that your MySQL server is running, and that .env has correct values. MySQL accounts/credentials cannot be linked automatically by a public GitHub repository.

### Project file guide

| File | Purpose |
| --- | --- |
| index.html | Full responsive UI, browser demo mode, validation, CRUD screens |
| app.py | Flask endpoints with parameterized MySQL SQL statements |
| schema.sql | Relational MySQL schema with PK, FK and constraints |
| setup_db.py | Initializes hospital_db and required tables |
| requirements.txt | Python dependencies |
| .env.example | Credential template without secrets |
| start_local.bat | Double-click setup/launch on Windows |
| .gitignore | Prevents committing .env, caches or virtual environments |
| .nojekyll | Allows simple static hosting on GitHub Pages |

### Real SQL demonstrations

The backend provides three reports at GET /api/reports:

- **JOIN:** appointments with patient, doctor and department names.
- **GROUP BY:** appointment count per doctor.
- **Correlated subquery:** patients with more than one appointment.

Backend endpoints:

    GET /api/health
    GET, POST /api/patients
    PUT, DELETE /api/patients/<id>

Equivalent CRUD routes exist for /api/doctors, /api/departments, /api/appointments and /api/medical_records.

## System architecture

**GitHub Pages / file:// demo:** Browser → HTML/CSS/JavaScript → localStorage.

**Local MySQL version:** Browser → Flask REST API on 127.0.0.1:5000 → MySQL hospital_db.

GitHub Pages cannot directly host a Flask process or connect securely to a MySQL server. Public demo edits do not change the localhost database.

## Limitations and future extensions

This mini-project does not have accounts, authorization, audit trails, encryption at rest, backups, or clinical safeguards. It is **not** suitable for handling real patient data. Future improvements can add role-based access, appointment conflict detection, pagination, secure authentication, automated tests, and safer deployment.

## How to check your GitHub activity

- **Profile contributions:** https://github.com/Bhumi1107 — scroll to the contribution calendar.
- **Commits for this project:** https://github.com/Bhumi1107/Hospital-Management-/commits/main/
- **Other repository contributions:** open any repository → Insights (or the history/Commits link).
- **All repository list:** https://github.com/Bhumi1107?tab=repositories

A commit records a saved change, not time spent. The contributions calendar is not a reliable measure of coding hours or project quality. Your personal edits and commit messages show meaningful progress better than just having many automated commits.

---

**Educational DBMS mini-project.** Designed for learning relational databases, CRUD operations, SQL reporting, and web development.
