"""Hospital Management System — Flask + MySQL localhost API.

The static index.html also works as an explicitly labeled in-browser DEMO.
Real MySQL CRUD is available only through this local Flask server.
"""
import os
import re
import threading
import webbrowser
from datetime import datetime
from pathlib import Path

import mysql.connector
from flask import Flask, jsonify, request, send_from_directory
from dotenv import load_dotenv

HERE = Path(__file__).resolve().parent
load_dotenv(HERE / ".env")
app = Flask(__name__, static_folder=str(HERE), static_url_path="")
DB = os.getenv("MYSQL_DATABASE", "hospital_db")

# Whitelisted table and column names; only user-provided VALUES become SQL parameters.
SCHEMA = {
    "departments": ("department_id", ("department_name", "location")),
    "doctors": ("doctor_id", ("doctor_name", "specialization", "department_id")),
    "patients": ("patient_id", ("patient_name", "age", "gender", "phone")),
    "appointments": ("appointment_id", ("patient_id", "doctor_id", "appointment_date", "status")),
    "medical_records": ("record_id", ("patient_id", "doctor_id", "diagnosis", "treatment")),
}
RELATIONS = {"patient_id", "doctor_id", "department_id"}
ALLOWED_STATUS = {"Scheduled", "Completed", "Cancelled"}
ALLOWED_GENDER = {"Female", "Male", "Other", "Prefer not to say"}


def connection():
    return mysql.connector.connect(
        host=os.getenv("MYSQL_HOST", "127.0.0.1"),
        port=int(os.getenv("MYSQL_PORT", "3306")),
        user=os.getenv("MYSQL_USER", "root"),
        password=os.getenv("MYSQL_PASSWORD", ""),
        database=DB,
        connection_timeout=6,
    )


def json_error(message, status=400):
    return jsonify({"error": str(message)}), status


def validate(entity, payload):
    if not isinstance(payload, dict):
        raise ValueError("Request body must be a JSON object.")
    columns = SCHEMA[entity][1]
    result = {}
    for col in columns:
        raw = payload.get(col)
        if raw is None or str(raw).strip() == "":
            raise ValueError(col.replace("_", " ").capitalize() + " is required.")
        if col in RELATIONS or col == "age":
            try:
                val = int(raw)
            except (TypeError, ValueError):
                raise ValueError(col + " must be a whole number.") from None
            if (col == "age" and not (0 <= val <= 120)) or (col != "age" and val < 1):
                raise ValueError(col + " is outside the permitted range.")
            result[col] = val
        elif col == "appointment_date":
            try:
                result[col] = datetime.strptime(str(raw), "%Y-%m-%dT%H:%M")
            except ValueError:
                raise ValueError("Appointment date must be YYYY-MM-DDTHH:MM.") from None
        else:
            val = str(raw).strip()
            maximum = 5000 if col in {"diagnosis", "treatment"} else 120
            if len(val) > maximum:
                raise ValueError(col + " is too long.")
            result[col] = val
    if entity == "patients":
        if result["gender"] not in ALLOWED_GENDER:
            raise ValueError("Select a valid gender option.")
        if not re.fullmatch(r"[+0-9 ()-]{7,20}", result["phone"]):
            raise ValueError("Enter a valid phone number (7–20 characters).")
    if entity == "appointments" and result["status"] not in ALLOWED_STATUS:
        raise ValueError("Invalid appointment status.")
    return result


@app.get("/")
def home():
    return send_from_directory(HERE, "index.html")


@app.get("/api/health")
def health():
    try:
        con = connection()
        con.ping(reconnect=False, attempts=1)
        con.close()
        return jsonify({"mode": "mysql", "status": "connected", "database": DB})
    except mysql.connector.Error:
        return json_error("MySQL is unavailable. Verify .env and run setup_db.py.", 503)


@app.route("/api/<entity>", methods=["GET", "POST"])
def collection(entity):
    if entity not in SCHEMA:
        return json_error("Unknown resource.", 404)
    pk, cols = SCHEMA[entity]
    try:
        if request.method == "POST":
            values = validate(entity, request.get_json(silent=True))
        conn = connection()
        cur = conn.cursor(dictionary=True)
        if request.method == "GET":
            cur.execute(f"SELECT * FROM {entity} ORDER BY {pk} DESC LIMIT 1000")
            rows = cur.fetchall()
            for row in rows:
                for k, v in row.items():
                    if isinstance(v, datetime):
                        row[k] = v.strftime("%Y-%m-%dT%H:%M")
            reply = jsonify(rows)
        else:
            placeholders = ", ".join(["%s"] * len(cols))
            columns = ", ".join(cols)
            cur.execute(f"INSERT INTO {entity} ({columns}) VALUES ({placeholders})",
                        tuple(values[c] for c in cols))
            conn.commit()
            reply = (jsonify({"id": cur.lastrowid, "message": "Created"}), 201)
        cur.close()
        conn.close()
        return reply
    except ValueError as exc:
        return json_error(exc)
    except mysql.connector.IntegrityError as exc:
        return json_error("Database relationship or uniqueness constraint violated: " + str(exc), 409)
    except mysql.connector.Error:
        app.logger.exception("Database operation failed")
        return json_error("Database operation failed. Check the local MySQL connection.", 503)


@app.route("/api/<entity>/<int:item_id>", methods=["PUT", "DELETE"])
def item(entity, item_id):
    if entity not in SCHEMA:
        return json_error("Unknown resource.", 404)
    if item_id < 1:
        return json_error("Invalid ID.")
    pk, cols = SCHEMA[entity]
    try:
        if request.method == "PUT":
            values = validate(entity, request.get_json(silent=True))
        conn = connection()
        cur = conn.cursor()
        if request.method == "DELETE":
            cur.execute(f"DELETE FROM {entity} WHERE {pk} = %s", (item_id,))
        else:
            set_sql = ", ".join(f"{col} = %s" for col in cols)
            cur.execute(f"UPDATE {entity} SET {set_sql} WHERE {pk} = %s",
                        tuple(values[c] for c in cols) + (item_id,))
        affected = cur.rowcount
        if affected:
            conn.commit()
        cur.close()
        conn.close()
        if not affected:
            return json_error("Record not found.", 404)
        return jsonify({"message": "Deleted" if request.method == "DELETE" else "Updated"})
    except ValueError as exc:
        return json_error(exc)
    except mysql.connector.IntegrityError:
        return json_error("Cannot delete or change this item: another record references it.", 409)
    except mysql.connector.Error:
        app.logger.exception("Database operation failed")
        return json_error("Database operation failed.", 503)


@app.get("/api/reports")
def reports():
    """Demonstrates JOIN, GROUP BY, and a correlated subquery."""
    try:
        conn = connection()
        cur = conn.cursor(dictionary=True)
        cur.execute("""
            SELECT a.appointment_id, a.appointment_date, a.status,
                   p.patient_name, d.doctor_name, dep.department_name
            FROM appointments a
            JOIN patients p ON p.patient_id = a.patient_id
            JOIN doctors d ON d.doctor_id = a.doctor_id
            JOIN departments dep ON dep.department_id = d.department_id
            ORDER BY a.appointment_date DESC LIMIT 100
        """)
        details = cur.fetchall()
        for row in details:
            row["appointment_date"] = row["appointment_date"].strftime("%Y-%m-%dT%H:%M")
        cur.execute("""
            SELECT d.doctor_id, d.doctor_name,
                   COUNT(a.appointment_id) AS appointment_count
            FROM doctors d LEFT JOIN appointments a ON a.doctor_id = d.doctor_id
            GROUP BY d.doctor_id, d.doctor_name
            ORDER BY appointment_count DESC, d.doctor_name
        """)
        workload = cur.fetchall()
        cur.execute("""
            SELECT p.patient_id, p.patient_name
            FROM patients p
            WHERE (SELECT COUNT(*) FROM appointments a
                   WHERE a.patient_id = p.patient_id) > 1
            ORDER BY p.patient_name LIMIT 100
        """)
        frequent = cur.fetchall()
        cur.close()
        conn.close()
        return jsonify({"appointments": details, "doctor_workload": workload, "repeat_patients": frequent})
    except mysql.connector.Error:
        app.logger.exception("Reporting query failed")
        return json_error("Unable to load SQL reports.", 503)


if __name__ == "__main__":
    threading.Timer(1.5, lambda: webbrowser.open("http://127.0.0.1:5000/")).start()
    app.run(host="127.0.0.1", port=5000, debug=False)
