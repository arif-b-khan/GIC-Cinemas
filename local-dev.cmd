@echo off
REM Set environment variables
REM For Windows:
set DATABASE_URL=mysql://cinema_user:arifkhan@localhost/cinema_db
set FLASK_ENV=development

cd backend

REM Starting the Flask application
REM Set the default port to 5000 if not specified
REM Ensure the required environment variables are set before starting the application
REM Check if the Flask application is running successfully
flask run --host=0.0.0.0 --port=5000
if ERRORLEVEL 1 (
    echo Flask application failed to start
    exit /b 1
)