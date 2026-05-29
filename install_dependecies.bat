@echo off
setlocal enabledelayedexpansion

:: Colors are limited in standard cmd, so using plain output

set ROOT_DIR=%~dp0
set BACKEND_DIR=%ROOT_DIR%Backend

echo Installing GroceryHub npm dependencies...

:: Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed.
    echo Install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

:: Check npm
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: npm is not installed.
    pause
    exit /b 1
)

:: Check package.json
if not exist "%BACKEND_DIR%\package.json" (
    echo Error: Backend\package.json not found.
    pause
    exit /b 1
)

cd /d "%BACKEND_DIR%"

echo Node version:
node --version

echo npm version:
npm --version

:: Install dependencies
if exist "package-lock.json" (
    echo Using package-lock.json for exact dependency versions...
    npm ci
) else (
    echo No package-lock.json found; installing from package.json...
    npm install
)

if %errorlevel% neq 0 (
    echo Dependency installation failed.
    pause
    exit /b 1
)

echo All npm dependencies installed successfully.

pause
