# 🏠 Land Registry DApp

A decentralized application for land registration using Ethereum blockchain and IPFS for document storage. Features a complete role-based authentication system with separate dashboards for different user types.

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

### 🔐 Role-Based Authentication System
- **Customer Registration**: MetaMask wallet connection with Buyer/Seller role selection
- **Admin Login**: Secure login for administrators (admin/admin123)
- **Land Inspector Login**: Dedicated access for land inspectors (inspector/insp123)
- **Session Management**: localStorage-based authentication with automatic redirects

### 👥 User Roles & Dashboards

#### 🛒 **Buyer Dashboard**
- Browse available verified properties
- View owned properties
- Request property purchases
- Property details with owner information
- Purchase history tracking

#### 🏡 **Seller Dashboard**
- Register new land properties
- Manage owned properties
- List properties for sale
- Download ownership certificates
- Track verification status

#### 👨‍💼 **Admin Dashboard**
- View all registered lands
- Manage pending verifications
- Approve/reject land registrations
- System-wide statistics
- User management capabilities

#### 🔍 **Land Inspector Dashboard**
- Review pending land inspections
- Approve/reject property verifications
- Priority-based task management
- Schedule on-site inspections
- Generate inspection reports

### 🏠 **Core Land Registry Features**
- **Land Registration**: Register land with owner details and location
- **Document Upload**: Upload documents to IPFS for permanent storage
- **Land Transfer**: Transfer land ownership between addresses
- **Land Verification**: Multi-level verification process
- **Certificate Generation**: Digital ownership certificates

## 🏗️ Architecture

- **Smart Contract**: Solidity contract on Ethereum
- **Frontend**: React.js with ethers.js for blockchain interaction
- **Storage**: IPFS via Pinata for document storage
- **Network**: Hardhat local development network

## 🔍 Usage

### 🚀 Getting Started

1. **Visit the Landing Page** at `http://localhost:3000`
2. **Choose Your Role** from the three options:

#### 👤 **For Customers (Buyers/Sellers)**
1. Click **"CUSTOMER"** button
2. Connect your MetaMask wallet
3. Select your role: **Buyer** or **Seller**
4. Click **"Register & Continue"**
5. Access your role-specific dashboard

#### 👨‍💼 **For Administrators**
1. Click **"ADMIN"** button
2. Enter credentials:
   - **ID**: `admin`
   - **Password**: `admin123`
3. Access the Admin Dashboard

#### 🔍 **For Land Inspectors**
1. Click **"LAND INSPECTOR"** button
2. Enter credentials:
   - **ID**: `inspector`
   - **Password**: `insp123`
3. Access the Land Inspector Dashboard

### 📱 Dashboard Features

#### **Seller Workflow**
1. Register new land properties
2. Upload property documents to IPFS
3. Wait for admin/inspector verification
4. List verified properties for sale

#### **Buyer Workflow**
1. Browse available verified properties
2. Request property purchases
3. View owned properties
4. Download ownership certificates

#### **Admin Workflow**
1. Review all land registrations
2. Approve/reject pending verifications
3. Monitor system statistics
4. Manage user activities

#### **Inspector Workflow**
1. Review pending inspections
2. Schedule on-site visits
3. Approve/reject property verifications
4. Generate inspection reports

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