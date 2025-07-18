@echo off
echo 🏠 Starting Land Registry DApp...
echo.

echo 📦 Installing dependencies...
cd contracts
call npm install
cd ../frontend  
call npm install
cd ..

echo.
echo 🔧 Starting Hardhat local network...
start "Hardhat Node" cmd /k "cd contracts && npx hardhat node"

echo ⏳ Waiting for network to start...
timeout /t 5 /nobreak > nul

echo 🚀 Deploying contracts...
cd contracts
call npx hardhat run scripts/deploy.js --network localhost
cd ..

echo.
echo 🌐 Starting React frontend...
start "React App" cmd /k "cd frontend && npm start"

echo.
echo ✅ DApp is starting up!
echo 📋 Check the opened terminal windows for details
echo 🌐 Frontend will be available at http://localhost:3000
echo 🔗 Make sure to connect MetaMask to localhost:8545
pause