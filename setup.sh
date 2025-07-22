#!/bin/bash

# NLP2SQL React Setup Script

echo "🚀 Setting up NLP2SQL React Application..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm found: $(npm --version)"

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
if npm install; then
    echo "✅ Frontend dependencies installed successfully"
else
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd ../backend
if npm install; then
    echo "✅ Backend dependencies installed successfully"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

# Copy environment files
echo "⚙️ Setting up environment files..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Backend .env file created from example"
    echo "⚠️  Please edit backend/.env with your API keys and configuration"
else
    echo "ℹ️  Backend .env file already exists"
fi

cd ../frontend
if [ ! -f .env ]; then
    echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
    echo "✅ Frontend .env file created"
else
    echo "ℹ️  Frontend .env file already exists"
fi

cd ..

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Configure your API keys in backend/.env"
echo "2. Start the backend: cd backend && npm run dev"
echo "3. Start the frontend: cd frontend && npm start"
echo ""
echo "🌐 The application will be available at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo ""
echo "📚 For more information, see README-React.md"
