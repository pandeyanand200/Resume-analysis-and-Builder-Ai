#!/bin/bash
# Electron Desktop App - Setup & Test Guide

echo "📋 Resume Analyzer - Desktop Edition Setup"
echo "=========================================="
echo ""

# Check Node.js and npm
echo "✓ Checking Node.js and npm..."
node --version
npm --version
echo ""

# Check root dependencies
echo "✓ Checking root dependencies (Electron, electron-builder, etc.)..."
if [ ! -d "node_modules" ]; then
    echo "  ❌ Root dependencies not installed. Running: npm install"
    npm install
else
    echo "  ✓ Root dependencies already installed"
fi
echo ""

# Check server dependencies
echo "✓ Checking server dependencies..."
if [ ! -d "server/node_modules" ]; then
    echo "  ❌ Server dependencies not installed. Running: npm install in server/"
    cd server
    npm install
    cd ..
else
    echo "  ✓ Server dependencies already installed"
fi
echo ""

# Check client dependencies
echo "✓ Checking client dependencies..."
if [ ! -d "client/node_modules" ]; then
    echo "  ❌ Client dependencies not installed. Running: npm install in client/"
    cd client
    npm install
    cd ..
else
    echo "  ✓ Client dependencies already installed"
fi
echo ""

# Verify .env exists
echo "✓ Checking environment configuration..."
if [ ! -f "server/.env" ]; then
    echo "  ⚠️  server/.env not found! Create it with:"
    echo "     PORT=5000"
    echo "     MONGODB_URI=<your-mongodb-uri>"
    echo "     JWT_SECRET=<your-jwt-secret>"
    echo "     GEMINI_API_KEY=<your-gemini-api-key>"
else
    echo "  ✓ server/.env exists"
fi
echo ""

echo "✅ Setup check complete!"
echo ""
echo "Available commands:"
echo "  npm run electron:dev      - Run development version"
echo "  npm run electron:build    - Build production installer"
echo "  npm run start             - Start Electron (for production build)"
echo "  npm run dev:server        - Run only the backend"
echo "  npm run dev:client        - Run only the frontend"
