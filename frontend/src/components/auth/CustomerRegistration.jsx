import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../../hooks/useWallet';

const CustomerRegistration = () => {
  const navigate = useNavigate();
  const { account, signer, connectWallet, isConnected } = useWallet();

  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    contact: '',
    aadhaar: '',
    pan: '',
    aadhaarFile: null,
    panFile: null,
  });

  const handleWalletConnect = async () => {
    try {
      await connectWallet();
    } catch (error) {
      setError('Failed to connect wallet. Please try again.');
    }
  };

  const validateForm = () => {
    const { fullName, email, contact, aadhaar, pan, aadhaarFile, panFile } = formData;
    if (!fullName || !email || !contact || !aadhaar || !pan || !aadhaarFile || !panFile) {
      return 'All fields are required';
    }
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) return 'Invalid email format';
    if (!/^\d{10}$/.test(contact)) return 'Contact must be 10 digits';
    if (!/^\d{12}$/.test(aadhaar)) return 'Aadhaar must be 12 digits';
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan)) return 'Invalid PAN format';
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(aadhaarFile.type) || !validTypes.includes(panFile.type)) {
      return 'Files must be PDF or JPG';
    }
    return '';
  };

  const handleRegistration = async () => {
    const validationError = validateForm();
    if (!selectedRole) return setError('Please select a role (Buyer or Seller)');
    if (!isConnected || !signer) return setError('Please connect your wallet first');
    if (validationError) return setError(validationError);

    setLoading(true);
    setError('');

    try {
      const userData = {
        ...formData,
        address: account,
        role: selectedRole.toLowerCase(),
        userId: Date.now(),
        registrationDate: new Date().toISOString(),
      };

      localStorage.setItem('userSession', JSON.stringify(userData));
      localStorage.setItem('isAuthenticated', 'true');

      if (selectedRole === 'Buyer') navigate('/dashboard/buyer');
      else navigate('/dashboard/seller');
    } catch (error) {
      console.error('Registration error:', error);
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Wallet Connection</label>
          {!isConnected ? (
            <button
              onClick={handleWalletConnect}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              Connect MetaMask Wallet
            </button>
          ) : (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              <div className="flex items-center">Wallet Connected</div>
              <p className="text-sm mt-1 font-mono">{account?.slice(0, 10)}...{account?.slice(-8)}</p>
            </div>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Choose Your Role</label>
          <div className="space-y-3">
            {['Buyer', 'Seller'].map((role) => (
              <label key={role} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="role"
                  value={role}
                  checked={selectedRole === role}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium text-gray-800">{role}</div>
                  <div className="text-sm text-gray-600">
                    {role === 'Buyer' ? 'Purchase land properties' : 'Register and sell land properties'}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {selectedRole && (
          <>
            <div className="space-y-4 mb-6">
              {[
                { label: 'Full Name', name: 'fullName', type: 'text' },
                { label: 'Email', name: 'email', type: 'email' },
                { label: 'Contact Number', name: 'contact', type: 'tel' },
                { label: 'Aadhaar Number', name: 'aadhaar', type: 'text' },
                { label: 'PAN Number', name: 'pan', type: 'text' },
              ].map(({ label, name, type }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleInputChange}
                    className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Aadhaar (PDF/JPG)</label>
                <input
                  type="file"
                  name="aadhaarFile"
                  accept=".pdf,.jpg,.jpeg"
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload PAN (PDF/JPG)</label>
                <input
                  type="file"
                  name="panFile"
                  accept=".pdf,.jpg,.jpeg"
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
            </div>
          </>
        )}

        <button
          onClick={handleRegistration}
          disabled={loading || !isConnected || !selectedRole}
          className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Registering...' : 'Register & Continue'}
        </button>

        <div className="text-center mt-6">
          <button onClick={() => navigate('/')} className="text-red-600 hover:text-red-800 transition-colors">
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerRegistration;
