#!/bin/bash

# AI Voice Receptionist Launch Script
# This script helps you launch the application quickly

set -e

echo "🚀 AI Voice Receptionist Launch Script"
echo "========================================"
echo ""

# Check if we're in the right directory
if [ ! -f "backend/main.py" ]; then
    echo "❌ Error: Please run this script from the ai-memory-keeper-deploy directory"
    exit 1
fi

# Check for OpenAI API key
if [ ! -f "backend/.env" ]; then
    echo "⚠️  No .env file found in backend directory"
    echo ""
    read -p "Do you have an OpenAI API key? (y/n): " has_key
    
    if [ "$has_key" = "y" ] || [ "$has_key" = "Y" ]; then
        read -p "Enter your OpenAI API key: " api_key
        echo "OPENAI_API_KEY=$api_key" > backend/.env
        echo "✅ .env file created"
    else
        echo ""
        echo "❌ You need an OpenAI API key to run this application"
        echo "   Get one at: https://platform.openai.com/api-keys"
        exit 1
    fi
else
    echo "✅ Found .env file"
fi

echo ""

# Check if virtual environment exists
if [ ! -d "backend/venv" ]; then
    echo "📦 Creating virtual environment..."
    cd backend
    python3 -m venv venv
    cd ..
    echo "✅ Virtual environment created"
else
    echo "✅ Virtual environment exists"
fi

echo ""

# Activate virtual environment and install dependencies
echo "📦 Installing backend dependencies..."
cd backend
source venv/bin/activate
pip install -q -r requirements.txt
echo "✅ Backend dependencies installed"
cd ..

echo ""

# Check if frontend is built
if [ ! -d "frontend/dist" ]; then
    echo "📦 Building frontend..."
    cd frontend
    npm install
    npm run build
    cd ..
    echo "✅ Frontend built"
else
    echo "✅ Frontend already built"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "========================================"
echo "🎯 How to Launch:"
echo "========================================"
echo ""
echo "1. Start the backend server:"
echo "   cd backend"
echo "   source venv/bin/activate"
echo "   uvicorn main:app --host 0.0.0.0 --port 8000"
echo ""
echo "2. In a new terminal, serve the frontend:"
echo "   cd frontend/dist"
echo "   python3 -m http.server 5173"
echo ""
echo "3. Open your browser to:"
echo "   http://localhost:5173"
echo ""
echo "========================================"
echo ""
read -p "Would you like to start the backend now? (y/n): " start_backend

if [ "$start_backend" = "y" ] || [ "$start_backend" = "Y" ]; then
    echo ""
    echo "🚀 Starting backend server..."
    echo "   Press Ctrl+C to stop"
    echo ""
    cd backend
    source venv/bin/activate
    uvicorn main:app --host 0.0.0.0 --port 8000
else
    echo ""
    echo "👋 Run the commands above when you're ready to launch!"
fi
