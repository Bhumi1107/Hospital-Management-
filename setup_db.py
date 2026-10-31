"""Create the five database tables locally; safe to re-run. No sample patient data."""
import os
from pathlib import Path

import mysql.connector
from dotenv import load_dotenv

load_dotenv(Path(__file__).with_name(".env"))
password = os.getenv("MYSQL_PASSWORD", "")
if password == "YOUR_MYSQL_PASSWORD":
    raise SystemExit("Set MYSQL_PASSWORD in .env to your local MySQL password first.")

config = {
    "host": os.getenv("MYSQL_HOST", "127.0.0.1"),
    "port": int(os.getenv("MYSQL_PORT", "3306")),
    "user": os.getenv("MYSQL_USER", "root"),
    "password": password,
}
sql = Path(__file__).with_name("schema.sql").read_text(encoding="utf-8")
try:
    conn = mysql.connector.connect(**config)
    cursor = conn.cursor()
    for statement in sql.split(";"):
        # Drop full-line comments before executing each statement.
        clean = "\n".join(
            line for line in statement.splitlines()
            if line.strip() and not line.lstrip().startswith("--")
        ).strip()
        if clean:
            cursor.execute(clean)
    conn.commit()
    cursor.close()
    conn.close()
    print("Success! MySQL database hospital_db and all five tables are ready.")
except mysql.connector.Error as exc:
    raise SystemExit("MySQL setup failed: " + str(exc))
