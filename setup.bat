@echo off
REM NLP2SQL React Setup Script for Windows

echo 🚀 Setting up NLP2SQL React Application...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ first.
    pause
    exit /b 1
)

echo ✅ Node.js found
node --version

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ npm found
npm --version

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd frontend
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)
echo ✅ Frontend dependencies installed successfully

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd ..\backend
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)
echo ✅ Backend dependencies installed successfully

REM Copy environment files
echo ⚙️ Setting up environment files...
if not exist .env (
    copy .env.example .env
    echo ✅ Backend .env file created from example
    echo ⚠️  Please edit backend\.env with your API keys and configuration
) else (
    echo ℹ️  Backend .env file already exists
)

cd ..\frontend
if not exist .env (
    echo REACT_APP_API_URL=http://localhost:5000/api > .env
    echo ✅ Frontend .env file created
) else (
    echo ℹ️  Frontend .env file already exists
)

cd ..

echo.
echo 🎉 Setup completed successfully!
echo.
echo 📋 Next steps:
echo 1. Configure your API keys in backend\.env
echo 2. Start the backend: cd backend ^&^& npm run dev
echo 3. Start the frontend: cd frontend ^&^& npm start
echo.
echo 🌐 The application will be available at:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:5000
echo.
echo 📚 For more information, see README-React.md

pause
