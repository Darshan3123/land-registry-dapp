import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../../hooks/useWallet';

const CustomerRegistration = () => {
  const navigate = useNavigate();
  const { account, signer, connectWallet, isConnected } = useWallet();
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleWalletConnect = async () => {
    try {
      await connectWallet();
    } catch (error) {
      setError('Failed to connect wallet. Please try again.');
    }
  };

  const handleRegistration = async () => {
    if (!selectedRole) {
      setError('Please select a role (Buyer or Seller)');
      return;
    }

    if (!isConnected || !signer) {
      setError('Please connect your wallet first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const userData = {
        address: account,
        role: selectedRole.toLowerCase(),
        userId: Date.now(),
        registrationDate: new Date().toISOString()
      };

      localStorage.setItem('userSession', JSON.stringify(userData));
      localStorage.setItem('isAuthenticated', 'true');

      if (selectedRole === 'Buyer') {
        navigate('/dashboard/buyer');
      } else {
        navigate('/dashboard/seller');
      }

    } catch (error) {
      console.error('Registration error:', error);
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Customer Registration</h2>
          <p className="text-gray-600">Connect your wallet and choose your role</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Wallet Connection
          </label>
          {!isConnected ? (
            <button
              onClick={handleWalletConnect}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              Connect MetaMask Wallet
            </button>
          ) : (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              <div className="flex items-center">
                Wallet Connected
              </div>
              <p className="text-sm mt-1 font-mono">{account?.slice(0, 10)}...{account?.slice(-8)}</p>
            </div>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Choose Your Role
          </label>
          <div className="space-y-3">
            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="role"
                value="Buyer"
                checked={selectedRole === 'Buyer'}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="mr-3"
              />
              <div>
                <div className="font-medium text-gray-800">Buyer</div>
                <div className="text-sm text-gray-600">Purchase land properties</div>
              </div>
            </label>
            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="role"
                value="Seller"
                checked={selectedRole === 'Seller'}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="mr-3"
              />
              <div>
                <div className="font-medium text-gray-800">Seller</div>
                <div className="text-sm text-gray-600">Register and sell land properties</div>
              </div>
            </label>
          </div>
        </div>

        <button
          onClick={handleRegistration}
          disabled={loading || !isConnected || !selectedRole}
          className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Registering...' : 'Register & Continue'}
        </button>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-red-600 hover:text-red-800 transition-colors"
          >
             Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerRegistration;
