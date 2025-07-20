import React, { useState, useEffect } from 'react';
import { useWallet } from '../hooks/useWallet';
import BlockchainService from '../services/blockchain';

const RoleProtectedRoute = ({ children, requiredRole }) => {
  const { account, signer, isConnected } = useWallet();
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      if (!isConnected || !signer) {
        setLoading(false);
        return;
      }

      try {
        const blockchainService = new BlockchainService(signer);
        const role = await blockchainService.getUserRole(account);
        setUserRole(role);
      } catch (error) {
        console.error('Error checking user role:', error);
        setUserRole('User'); // Default role
      } finally {
        setLoading(false);
      }
    };

    checkUserRole();
  }, [account, signer, isConnected]);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">Please connect your wallet to continue</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  // Role mapping for access control
  const roleAccess = {
    'admin': ['Admin', 'admin'],
    'buyer': ['User', 'Buyer', 'buyer'],
    'landowner': ['User', 'LandOwner', 'landowner', 'owner']
  };

  const hasAccess = roleAccess[requiredRole]?.includes(userRole) || 
                   (requiredRole === 'buyer' && userRole === 'User') ||
                   (requiredRole === 'landowner' && userRole === 'User');

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You don't have permission to access this dashboard.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Your role: {userRole} | Required: {requiredRole}
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default RoleProtectedRoute;
