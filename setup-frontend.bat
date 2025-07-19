@echo off
echo 🚀 Setting up Land Registry DApp Frontend...
echo.

cd frontend

echo 📦 Installing dependencies...
call npm install

echo.
echo 🎨 Setting up Tailwind CSS...
call npx tailwindcss init -p

echo.
echo 📋 Creating environment file...
if not exist .env (
    copy .env.example .env
    echo ✅ Created .env file from template
    echo ⚠️  Please update .env with your API keys and contract address
) else (
    echo ℹ️  .env file already exists
)

echo.
echo ✅ Frontend setup complete!
echo.
echo 📝 Next steps:
echo 1. Update .env file with your Pinata API keys
echo 2. Deploy your smart contract and update CONTRACT_ADDRESS
echo 3. Run 'npm start' to start the development server
echo.
pause