@echo off
REM CareTaker Development Setup Script for Windows
REM Run this after installing Supabase CLI and Docker Desktop

echo ========================================
echo CareTaker Development Setup
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed. Please install from https://nodejs.org
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed
    pause
    exit /b 1
)

echo [1/5] Checking Supabase CLI...
supabase --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Supabase CLI is not installed.
    echo Install from: https://github.com/supabase/supabase/releases
    pause
    exit /b 1
)
echo    OK - Supabase CLI found

echo.
echo [2/5] Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)
echo    OK - Backend dependencies installed

echo.
echo [3/5] Installing frontend dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)
echo    OK - Frontend dependencies installed

echo.
echo [4/5] Setting up environment files...
cd ..
if not exist backend\.env (
    copy backend\.env.example backend\.env
    echo    Created backend/.env - please configure with your Supabase credentials
) else (
    echo    Backend .env already exists
)

if not exist frontend\.env (
    copy frontend\.env.example frontend\.env
    echo    Created frontend/.env - please configure
) else (
    echo    Frontend .env already exists
)

echo.
echo [5/5] Initializing Supabase (optional)...
echo    Run 'supabase init' in the backend folder to set up local Supabase
echo    Or connect to your Supabase cloud project with 'supabase link --project-ref your-ref'

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Configure backend/.env with Supabase credentials
echo 2. Run 'supabase start' in backend (if using local)
echo 3. Run 'supabase db push' to apply migrations
echo 4. Start backend: cd backend ^&^& npm run dev
echo 5. Start frontend: cd frontend ^&^& npm run dev
echo.
echo Happy coding!
echo.
pause
