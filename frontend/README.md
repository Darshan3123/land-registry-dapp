# Land Registry DApp - Frontend

A professional React.js frontend for the Land Registry decentralized application built with modern web technologies.

## 🚀 Tech Stack

- **React 19** - Latest React with modern features
- **Ethers.js v6** - Ethereum blockchain interaction
- **Tailwind CSS** - Utility-first CSS framework
- **React Router v6** - Client-side routing
- **React Hook Form** - Form management
- **React Toastify** - Toast notifications
- **Axios** - HTTP client for IPFS
- **IPFS/Pinata** - Decentralized file storage

## 📁 Project Structure

```
src/
├── components/
│   ├── Layout/
│   │   └── Header.jsx          # Navigation header
│   └── common/
│       ├── LoadingSpinner.jsx  # Loading component
│       └── ErrorMessage.jsx    # Error display
├── hooks/
│   └── useWallet.js           # Wallet connection hook
├── pages/
│   ├── Dashboard.jsx          # Main dashboard
│   └── RegisterLand.jsx       # Land registration form
├── services/
│   ├── blockchain.js          # Smart contract interactions
│   └── ipfs.js               # IPFS file operations
├── utils/
│   └── formatters.js         # Utility functions
├── App.js                    # Main app component
└── index.js                  # App entry point
```

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env` and configure:

```env
# IPFS Configuration (Pinata)
REACT_APP_PINATA_API_KEY=your_pinata_api_key_here
REACT_APP_PINATA_SECRET_KEY=your_pinata_secret_key_here

# Smart Contract Configuration
REACT_APP_CONTRACT_ADDRESS=your_deployed_contract_address_here
REACT_APP_NETWORK_ID=11155111
```

### 3. Get Pinata API Keys

1. Sign up at [Pinata.cloud](https://pinata.cloud)
2. Go to API Keys section
3. Create new API key with admin permissions
4. Copy API Key and Secret to your `.env` file

### 4. Deploy Smart Contract

```bash
cd ../contracts
npx hardhat run scripts/deploy.js --network sepolia
```

Copy the deployed contract address to your `.env` file.

### 5. Start Development Server

```bash
npm start
```

## 🔧 Key Features

### Wallet Integration
- MetaMask connection
- Account switching detection
- Network validation
- Persistent connection state

### Land Management
- Register new properties
- Upload documents to IPFS
- View owned properties
- Transfer ownership
- Generate certificates

### File Handling
- Multiple file uploads
- IPFS integration via Pinata
- Document metadata storage
- File size validation

### User Experience
- Responsive design
- Loading states
- Error handling
- Toast notifications
- Form validation

## 🎯 Core Components

### WalletProvider
Manages wallet connection state and provides context to all components.

### BlockchainService
Handles all smart contract interactions:
- Land registration
- Ownership transfers
- Data retrieval
- Event listening

### IPFSService
Manages file uploads and retrieval:
- File uploads to Pinata
- JSON metadata storage
- File URL generation
- Connection testing

## 🔒 Security Best Practices

- Input validation on all forms
- Error boundary implementation
- Secure environment variable handling
- Transaction confirmation flows
- Network validation

## 📱 Responsive Design

Built with mobile-first approach using Tailwind CSS:
- Mobile navigation
- Responsive tables
- Touch-friendly buttons
- Optimized layouts

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy Options

1. **Vercel** (Recommended)
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Netlify**
   - Connect GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `build`

3. **GitHub Pages**
   ```bash
   npm install --save-dev gh-pages
   npm run build
   npm run deploy
   ```

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `REACT_APP_PINATA_API_KEY` | Pinata API key for IPFS | Yes |
| `REACT_APP_PINATA_SECRET_KEY` | Pinata secret key | Yes |
| `REACT_APP_CONTRACT_ADDRESS` | Deployed contract address | Yes |
| `REACT_APP_NETWORK_ID` | Target network ID | No |
| `REACT_APP_IPFS_GATEWAY` | Custom IPFS gateway | No |

## 🐛 Troubleshooting

### Common Issues

1. **MetaMask not detected**
   - Ensure MetaMask is installed
   - Check browser compatibility

2. **Transaction failures**
   - Verify network connection
   - Check gas fees
   - Confirm contract address

3. **IPFS upload errors**
   - Validate Pinata API keys
   - Check file size limits
   - Verify network connection

### Debug Mode

Enable debug logging by adding to `.env`:
```env
REACT_APP_DEBUG=true
```

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Ethers.js Documentation](https://docs.ethers.org)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Pinata Documentation](https://docs.pinata.cloud)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Add tests
5. Submit pull request

## 📄 License

This project is licensed under the MIT License.