@echo off
REM Electron Desktop App - Setup & Test Guide (Windows)

echo.
echo ======================================
echo Resume Analyzer - Desktop Edition
echo ======================================
echo.

REM Check Node.js
echo Checking Node.js and npm...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    exit /b 1
)
node --version
npm --version
echo.

REM Check root dependencies
echo Checking root dependencies ^(Electron, electron-builder, etc.^)...
if not exist "node_modules" (
    echo Installing root dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install root dependencies
        exit /b 1
    )
) else (
    echo Root dependencies are installed
)
echo.

REM Check server dependencies
echo Checking server dependencies...
if not exist "server\node_modules" (
    echo Installing server dependencies...
    cd server
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install server dependencies
        cd ..
        exit /b 1
    )
    cd ..
) else (
    echo Server dependencies are installed
)
echo.

REM Check client dependencies
echo Checking client dependencies...
if not exist "client\node_modules" (
    echo Installing client dependencies...
    cd client
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install client dependencies
        cd ..
        exit /b 1
    )
    cd ..
) else (
    echo Client dependencies are installed
)
echo.

REM Verify .env
echo Checking environment configuration...
if not exist "server\.env" (
    echo WARNING: server\.env not found!
    echo Please create server\.env with the following variables:
    echo   PORT=5000
    echo   MONGODB_URI=^<your-mongodb-uri^>
    echo   JWT_SECRET=^<your-jwt-secret^>
    echo   GEMINI_API_KEY=^<your-gemini-api-key^>
) else (
    echo server\.env exists
)
echo.

echo.
echo Setup complete!
echo.
echo Available commands:
echo   npm run electron:dev      - Run development version
echo   npm run electron:build    - Build production installer
echo   npm run start             - Start Electron ^(production build^)
echo   npm run dev:server        - Run only the backend
echo   npm run dev:client        - Run only the frontend
echo.
pause
