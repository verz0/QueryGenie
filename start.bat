@echo off
REM Start both frontend and backend in development mode

echo 🚀 Starting NLP2SQL React Application...

REM Check if dependencies are installed
if not exist "frontend\node_modules" (
    echo 📦 Installing dependencies first...
    npm run install:all
)
if not exist "backend\node_modules" (
    echo 📦 Installing dependencies first...
    npm run install:all
)

REM Start both services
echo 🌟 Starting backend and frontend...
npm run dev
