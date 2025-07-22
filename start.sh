#!/bin/bash

# Start both frontend and backend in development mode

echo "🚀 Starting NLP2SQL React Application..."

# Check if dependencies are installed
if [ ! -d "frontend/node_modules" ] || [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing dependencies first..."
    npm run install:all
fi

# Start both services
echo "🌟 Starting backend and frontend..."
npm run dev
