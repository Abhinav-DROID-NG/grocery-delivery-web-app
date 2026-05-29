@echo off
setlocal enabledelayedexpansion

set ROOT_DIR=%~dp0
set BACKEND_DIR=%ROOT_DIR%Backend
set FRONTEND_FILE=%ROOT_DIR%Frontend\groceryhub.html

echo ==========================================
echo Starting GroceryHub
echo ==========================================

:: Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

:: Verify backend exists
if not exist "%BACKEND_DIR%\server.js" (
    echo [ERROR] Backend\server.js not found.
    pause
    exit /b 1
)

:: Verify frontend exists
if not exist "%FRONTEND_FILE%" (
    echo [ERROR] Frontend\groceryhub.html not found.
    pause
    exit /b 1
)

:: Install backend dependencies if node_modules missing
if not exist "%BACKEND_DIR%\node_modules" (
    echo.
    echo Installing backend dependencies...
    cd /d "%BACKEND_DIR%"
    npm install

    if %errorlevel% neq 0 (
        echo [ERROR] npm install failed.
        pause
        exit /b 1
    )
)

:: Start backend server
echo.
echo Starting backend server on port 5000...

cd /d "%BACKEND_DIR%"

start "GroceryHub Backend" cmd /k "node server.js"

:: Wait for server startup
timeout /t 3 /nobreak >nul

:: Open frontend
echo.
echo Opening GroceryHub frontend...

start "" "%FRONTEND_FILE%"

echo.
echo ==========================================
echo GroceryHub is now running.
echo Backend: http://localhost:5000
echo ==========================================

pause

