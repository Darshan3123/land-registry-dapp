import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../../hooks/useWallet';
import BlockchainService from '../../services/blockchain';

const SellerDashboard = () => {
  const { account, signer, isConnected } = useWallet();
  const [ownedLands, setOwnedLands] = useState([]);
  const [saleRequests, setSaleRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSellerData = async () => {
      if (!isConnected || !signer) return;

      try {
        const blockchainService = new BlockchainService(signer);
        
        const lands = await blockchainService.getUserLands(account);
        setOwnedLands(lands);

        setSaleRequests([]);

      } catch (error) {
        console.error('Error loading seller data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSellerData();
  }, [account, signer, isConnected]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-red-600 text-white p-6">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold">Seller Dashboard</h1>
          <p className="opacity-90">Manage your land properties and sales</p>
        </div>
      </div>

      <div className="container mx-auto p-6">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Total Properties</h3>
            <p className="text-3xl font-bold text-red-600">{ownedLands.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Verified</h3>
            <p className="text-3xl font-bold text-green-600">
              {ownedLands.filter(land => land.isVerified).length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Pending</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {ownedLands.filter(land => !land.isVerified).length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Sale Requests</h3>
            <p className="text-3xl font-bold text-blue-600">{saleRequests.length}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Register New Land</h3>
            <p className="text-gray-600 text-sm mb-4">Add a new property to the registry</p>
            <Link 
              to="/register-land"
              className="inline-block bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Register Land
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">List for Sale</h3>
            <p className="text-gray-600 text-sm mb-4">Put your verified properties on sale</p>
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors">
              List Property
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Download Certificates</h3>
            <p className="text-gray-600 text-sm mb-4">Get ownership certificates</p>
            <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors">
              Download All
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Your Properties</h2>
          </div>
          
          {ownedLands.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <p>No properties registered yet</p>
              <Link 
                to="/register-land"
                className="inline-block mt-4 bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors"
              >
                Register Your First Property
              </Link>
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
                  {ownedLands.map((land) => (
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
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          land.isVerified 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {land.isVerified ? 'Verified' : 'Pending Verification'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          View Details
                        </button>
                        {land.isVerified && (
                          <>
                            <button className="text-green-600 hover:text-green-900 mr-3">
                              List for Sale
                            </button>
                            <button className="text-purple-600 hover:text-purple-900">
                              Certificate
                            </button>
                          </>
                        )}
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

export default SellerDashboard;
