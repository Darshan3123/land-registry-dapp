import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useWallet } from '../hooks/useWallet';
import BlockchainService from '../services/blockchain';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { account, signer, isConnected } = useWallet();
  
  const [userLands, setUserLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferLoading, setTransferLoading] = useState(false);
  const [selectedLandForTransfer, setSelectedLandForTransfer] = useState(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    const loadUserData = async () => {
      if (!isConnected || !signer) return;

      try {
        const blockchainService = new BlockchainService(signer);
        
        // Get user's lands
        const lands = await blockchainService.getUserLands(account);
        setUserLands(lands);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [account, signer, isConnected]);

  const openTransferModal = (land = null) => {
    setSelectedLandForTransfer(land);
    setShowTransferModal(true);
    reset();
  };

  const closeTransferModal = () => {
    setShowTransferModal(false);
    setSelectedLandForTransfer(null);
    reset();
  };

  const onTransferSubmit = async (data) => {
    if (!isConnected || !signer) {
      toast.error('Please connect your wallet first');
      return;
    }

    const landId = selectedLandForTransfer ? selectedLandForTransfer.id : parseInt(data.landId);
    const selectedLand = selectedLandForTransfer || userLands.find(l => l.id.toString() === data.landId);

    if (!selectedLand) {
      toast.error('Please select a valid land property');
      return;
    }

    if (!selectedLand.isVerified) {
      toast.error('Only verified properties can be transferred');
      return;
    }

    // Validate new owner address
    if (data.newOwner.toLowerCase() === account.toLowerCase()) {
      toast.error('Cannot transfer land to yourself');
      return;
    }

    setTransferLoading(true);
    
    try {
      const blockchainService = new BlockchainService(signer);
      
      // Transfer ownership
      const tx = await blockchainService.transferLand(landId, data.newOwner);

      toast.success(`Land #${landId} transferred successfully!`);
      console.log('Transfer transaction:', tx);
      
      // Close modal and reload lands
      closeTransferModal();
      
      // Reload owned lands to reflect the transfer
      const lands = await blockchainService.getUserLands(account);
      setUserLands(lands);
      
    } catch (error) {
      console.error('Error transferring ownership:', error);
      
      // Handle specific error messages
      if (error.message.includes('Not the land owner')) {
        toast.error('You are not the owner of this land');
      } else if (error.message.includes('user rejected')) {
        toast.error('Transaction was cancelled');
      } else {
        toast.error('Failed to transfer ownership. Please try again.');
      }
    } finally {
      setTransferLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Welcome to Land Registry DApp</h2>
        <p className="text-gray-600">Please connect your wallet to continue</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4">Loading your dashboard...</p>
      </div>
    );
  }

  const verifiedLands = userLands.filter(land => land.isVerified);

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <div className="bg-blue-100 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Connected as:</p>
          <p className="font-mono text-sm">{account}</p>
          <p className="text-sm mt-1">
            Role: <span className="font-semibold text-blue-600">User</span>
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Register Land</h3>
          <p className="text-gray-600 text-sm mb-4">Add new property to the registry</p>
          <Link 
            to="/register-land"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Register New Land
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Transfer Ownership</h3>
          <p className="text-gray-600 text-sm mb-4">Transfer land to another owner</p>
          <button 
            onClick={() => openTransferModal()}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            disabled={verifiedLands.length === 0}
          >
            Transfer Land
          </button>
          {verifiedLands.length === 0 && (
            <p className="text-xs text-gray-500 mt-1">No verified properties to transfer</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">View Certificates</h3>
          <p className="text-gray-600 text-sm mb-4">Download ownership certificates</p>
          <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors">
            View Certificates
          </button>
        </div>
      </div>

      {/* User's Lands */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Your Properties</h2>
        </div>
        
        {userLands.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <p>No properties registered yet</p>
            <Link 
              to="/register-land"
              className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Register Your First Property
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Land ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Document CID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {userLands.map((land) => (
                  <tr key={land.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{land.id.toString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {land.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                      {land.documentCID ? land.documentCID.substring(0, 10) + '...' : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${land.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {land.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        View
                      </button>
                      {land.isVerified && (
                        <button 
                          onClick={() => openTransferModal(land)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Transfer
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Transfer Ownership Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b">
                <h3 className="text-lg font-medium text-gray-900">
                  Transfer Land Ownership
                </h3>
                <button
                  onClick={closeTransferModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit(onTransferSubmit)} className="mt-6 space-y-6">
                {/* Land Selection (if not pre-selected) */}
                {!selectedLandForTransfer && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Land Property *
                    </label>
                    <select
                      {...register('landId', { required: 'Please select a land property' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Choose a property to transfer</option>
                      {verifiedLands.map((land) => (
                        <option key={land.id} value={land.id.toString()}>
                          Land #{land.id.toString()} - {land.location}
                        </option>
                      ))}
                    </select>
                    {errors.landId && (
                      <p className="text-red-500 text-sm mt-1">{errors.landId.message}</p>
                    )}
                  </div>
                )}

                {/* Selected Land Details */}
                {selectedLandForTransfer && (
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <h4 className="font-medium text-gray-900 mb-3">Property Details</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Land ID:</span>
                        <span className="ml-2">#{selectedLandForTransfer.id.toString()}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Location:</span>
                        <span className="ml-2">{selectedLandForTransfer.location}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Status:</span>
                        <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          Verified
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Current Owner:</span>
                        <span className="ml-2 font-mono text-xs">{selectedLandForTransfer.owner}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* New Owner Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Owner Address *
                  </label>
                  <input
                    type="text"
                    {...register('newOwner', { 
                      required: 'New owner address is required',
                      pattern: {
                        value: /^0x[a-fA-F0-9]{40}$/,
                        message: 'Please enter a valid Ethereum address'
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    placeholder="0x..."
                  />
                  {errors.newOwner && (
                    <p className="text-red-500 text-sm mt-1">{errors.newOwner.message}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    Enter the Ethereum wallet address of the new owner
                  </p>
                </div>

                {/* Warning Notice */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">Important Notice</h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <ul className="list-disc list-inside space-y-1">
                          <li>This action is irreversible once confirmed on the blockchain</li>
                          <li>Make sure the new owner address is correct</li>
                          <li>You will lose ownership of this property permanently</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end space-x-4 pt-4 border-t">
                  <button
                    type="button"
                    onClick={closeTransferModal}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={transferLoading}
                    className={`px-4 py-2 rounded-md text-white font-medium transition-colors ${transferLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
                  >
                    {transferLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Transferring...
                      </div>
                    ) : (
                      'Transfer Ownership'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

