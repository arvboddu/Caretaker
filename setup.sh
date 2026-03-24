#!/bin/bash
# CareTaker Development Setup Script for macOS/Linux
# Run this after installing Supabase CLI and Docker Desktop

echo "========================================"
echo "CareTaker Development Setup"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed. Please install from https://nodejs.org"
    read -p "Press Enter to exit..."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "ERROR: npm is not installed"
    read -p "Press Enter to exit..."
    exit 1
fi

echo "[1/5] Checking Supabase CLI..."
if ! command -v supabase &> /dev/null; then
    echo "ERROR: Supabase CLI is not installed."
    echo "Install from: https://github.com/supabase/supabase/releases"
    echo "Or: brew install supabase/tap/supabase"
    read -p "Press Enter to exit..."
    exit 1
fi
echo "    OK - Supabase CLI found"

echo ""
echo "[2/5] Installing backend dependencies..."
cd backend || exit
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install backend dependencies"
    read -p "Press Enter to exit..."
    exit 1
fi
echo "    OK - Backend dependencies installed"

echo ""
echo "[3/5] Installing frontend dependencies..."
cd ../frontend || exit
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install frontend dependencies"
    read -p "Press Enter to exit..."
    exit 1
fi
echo "    OK - Frontend dependencies installed"

echo ""
echo "[4/5] Setting up environment files..."
cd ..

if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo "    Created backend/.env - please configure with your Supabase credentials"
else
    echo "    Backend .env already exists"
fi

if [ ! -f frontend/.env ]; then
    cp frontend/.env.example frontend/.env
    echo "    Created frontend/.env - please configure"
else
    echo "    Frontend .env already exists"
fi

echo ""
echo "[5/5] Supabase setup..."
echo "    Run 'supabase init' in the backend folder to set up local Supabase"
echo "    Or connect to your Supabase cloud project with 'supabase link --project-ref your-ref'"

echo ""
echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Configure backend/.env with Supabase credentials"
echo "2. Run 'supabase start' in backend (if using local)"
echo "3. Run 'supabase db push' to apply migrations"
echo "4. Start backend: cd backend && npm run dev"
echo "5. Start frontend: cd frontend && npm run dev"
echo ""
echo "Happy coding!"
echo ""
read -p "Press Enter to continue..."
