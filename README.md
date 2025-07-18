# 🏠 Land Registry DApp

A decentralized application for land registration using Ethereum blockchain and IPFS for document storage.

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)
```bash
# Run setup to install dependencies
setup.bat

# Start the entire dapp
start-dapp.bat
```

### Option 2: Manual Setup

1. **Install Dependencies**
```bash
# Install contract dependencies
cd contracts
npm install

# Install frontend dependencies
cd ../frontend
npm install
cd ..
```

2. **Start Hardhat Network**
```bash
cd contracts
npx hardhat node
```

3. **Deploy Contract** (in new terminal)
```bash
cd contracts
npx hardhat run scripts/deploy.js --network localhost
```

4. **Start Frontend** (in new terminal)
```bash
cd frontend
npm start
```

## 🔧 Configuration

### MetaMask Setup
1. Add localhost network to MetaMask:
   - Network Name: `Localhost 8545`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Currency Symbol: `ETH`

2. Import test accounts from Hardhat node output

### IPFS Configuration
The app uses Pinata for IPFS storage. To use your own keys:
1. Create a `.env` file in the frontend directory
2. Add your Pinata credentials:
```
REACT_APP_PINATA_API_KEY=your_api_key
REACT_APP_PINATA_SECRET_API_KEY=your_secret_key
```

## 📋 Features

- **Land Registration**: Register land with owner details and location
- **Document Upload**: Upload documents to IPFS for permanent storage
- **Admin Controls**: Only admin can register new land
- **Land Transfer**: Transfer land ownership between addresses
- **Land Verification**: Admin can verify registered land

## 🏗️ Architecture

- **Smart Contract**: Solidity contract on Ethereum
- **Frontend**: React.js with ethers.js for blockchain interaction
- **Storage**: IPFS via Pinata for document storage
- **Network**: Hardhat local development network

## 🔍 Usage

1. Connect your MetaMask wallet
2. Fill in land details (ID, owner address, location)
3. Upload a document (deed, certificate, etc.)
4. Click "Upload File & Register Land"
5. Confirm the transaction in MetaMask

## 🛠️ Development

### Contract Commands
```bash
cd contracts

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to localhost
npx hardhat run scripts/deploy.js --network localhost
```

### Frontend Commands
```bash
cd frontend

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## 📁 Project Structure
```
├── contracts/          # Smart contracts
│   ├── contracts/      # Solidity files
│   ├── scripts/        # Deployment scripts
│   └── test/          # Contract tests
├── frontend/          # React frontend
│   └── src/           # Source files
├── setup.bat          # Setup script
└── start-dapp.bat     # Start script
```

## 🐛 Troubleshooting

**Contract not found**: Make sure to deploy the contract first
**MetaMask connection issues**: Check network configuration
**IPFS upload fails**: Verify Pinata API keys
**Transaction fails**: Ensure you have enough ETH and are the admin

## 📝 License

MIT License