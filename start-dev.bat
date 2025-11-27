@echo off
echo Starting ORM Management System...
echo.

REM Start backend in a new window
echo Starting backend server...
start "Backend Server" cmd /k "cd backend && start.bat"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend
echo Starting frontend development server...
echo.
echo Frontend will be available at: http://localhost:3000
echo Backend API will be available at: http://localhost:8000
echo.
echo Press Ctrl+C to stop the frontend server
echo Close the backend window to stop the backend server
echo.

npm run dev