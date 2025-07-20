import React, { useState, useEffect } from 'react';
import { useWallet } from '../../hooks/useWallet';
import BlockchainService from '../../services/blockchain';

const BuyerDashboard = () => {
  const { account, signer, isConnected } = useWallet();
  const [availableLands, setAvailableLands] = useState([]);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBuyerData = async () => {
      if (!isConnected || !signer) return;

      try {
        const blockchainService = new BlockchainService(signer);
        
        // Load available lands for purchase
        const allLands = await blockchainService.getAllLands();
        const available = allLands.filter(land => land.isVerified && land.owner !== account);
        setAvailableLands(available);

        // Load purchase history (lands owned by this buyer)
        const ownedLands = await blockchainService.getUserLands(account);
        setPurchaseHistory(ownedLands);

      } catch (error) {
        console.error('Error loading buyer data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBuyerData();
  }, [account, signer, isConnected]);

  const handlePurchaseRequest = async (landId) => {
    try {
      console.log('Purchase request for land:', landId);
      alert('Purchase request sent! (This would be implemented with smart contract)');
    } catch (error) {
      console.error('Error requesting purchase:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-red-600 text-white p-6">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold">Buyer Dashboard</h1>
          <p className="opacity-90">Browse and purchase verified land properties</p>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Available Properties</h3>
            <p className="text-3xl font-bold text-red-600">{availableLands.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Owned Properties</h3>
            <p className="text-3xl font-bold text-green-600">{purchaseHistory.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Pending Purchases</h3>
            <p className="text-3xl font-bold text-yellow-600">0</p>
          </div>
        </div>

        {/* Available Properties */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Available Properties</h2>
          </div>
          
          {availableLands.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <p>No properties available for purchase</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {availableLands.map((land) => (
                <div key={land.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Land #{land.id.toString()}</h3>
                    <p className="text-gray-600">{land.location}</p>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Area:</span>
                      <span className="font-semibold">{land.area} sq ft</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Owner:</span>
                      <span className="font-mono text-sm">{land.owner.slice(0, 10)}...</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        Verified
                      </span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handlePurchaseRequest(land.id)}
                    className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition-colors"
                  >
                    Request Purchase
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Owned Properties */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Your Properties</h2>
          </div>
          
          {purchaseHistory.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <p>You don't own any properties yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Land ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Area</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {purchaseHistory.map((land) => (
                    <tr key={land.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{land.id.toString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {land.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {land.area} sq ft
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          Owned
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          View Certificate
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          Transfer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
