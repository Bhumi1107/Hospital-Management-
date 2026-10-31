@echo off
cd /d "%~dp0"
echo ==========================================
echo  Hospital Management System - Local Start
echo ==========================================
where python >nul 2>nul
if errorlevel 1 (
  echo Python was not found. Install Python 3.10+ and add it to PATH.
  pause
  exit /b 1
)
if not exist .env (
  copy ".env.example" ".env" >nul
  echo.
  echo FIRST-TIME SETUP:
  echo Edit the new .env file and set MYSQL_PASSWORD to your local MySQL password.
  echo Then double-click start_local.bat again.
  pause
  exit /b 1
)
echo Installing or checking Python packages...
python -m pip install -r requirements.txt
if errorlevel 1 (echo Dependency installation failed. & pause & exit /b 1)
echo Checking MySQL tables...
python setup_db.py
if errorlevel 1 (echo Database connection failed. Check .env and whether MySQL is running. & pause & exit /b 1)
echo Starting at http://127.0.0.1:5000
python app.py
pause
