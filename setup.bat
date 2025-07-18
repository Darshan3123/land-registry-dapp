@echo off
echo 🔧 Setting up Land Registry DApp...
echo.

echo 📦 Installing contract dependencies...
cd contracts
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install contract dependencies
    pause
    exit /b 1
)

echo.
echo 📦 Installing frontend dependencies...
cd ../frontend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)

cd ..
echo.
echo ✅ Setup complete!
echo 🚀 Run start-dapp.bat to start the application
pause