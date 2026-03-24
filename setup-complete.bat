@echo off
REM CareTaker - One-Click Setup and Validation

echo ================================================
echo    CareTaker App - Setup & Validation
echo ================================================
echo.

REM Check if .env files exist
if not exist backend\.env (
    echo [1/5] Creating backend .env from template...
    copy backend\.env.example backend\.env
    echo.
    echo IMPORTANT: Edit backend\.env and add your Supabase credentials!
    echo.
) else (
    echo [1/5] Backend .env already exists
)

if not exist frontend\.env (
    echo [2/5] Creating frontend .env from template...
    copy frontend\.env.example frontend\.env
) else (
    echo [2/5] Frontend .env already exists
)

REM Validate backend environment
echo [3/5] Validating backend configuration...
cd backend
if exist .env (
    node config\validate.js
) else (
    echo Please configure backend\.env first!
)
cd ..

echo.
echo [4/5] Checking npm packages...
cd backend
if not exist node_modules (
    echo Installing backend dependencies...
    call npm install
) else (
    echo Backend dependencies already installed
)
cd ..\frontend
if not exist node_modules (
    echo Installing frontend dependencies...
    call npm install
) else (
    echo Frontend dependencies already installed
)
cd ..

echo.
echo [5/5] Setup complete!
echo.

echo ================================================
echo    NEXT STEPS
echo ================================================
echo.
echo 1. Open backend\.env and add your Supabase credentials
echo 2. Run database migration in Supabase SQL Editor
echo    (File: backend\src\db\migrations\001_initial_schema.sql)
echo.
echo 3. Start Backend:
echo    cd backend
echo    npm run dev
echo.
echo 4. Start Frontend (new terminal):
echo    cd frontend
echo    npm run dev
echo.
echo 5. Open: http://localhost:5173
echo.

pause
