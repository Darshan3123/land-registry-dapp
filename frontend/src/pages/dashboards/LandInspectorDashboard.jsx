import React, { useState, useEffect } from 'react';

const LandInspectorDashboard = () => {
  const [pendingInspections, setPendingInspections] = useState([]);
  const [completedInspections, setCompletedInspections] = useState([]);
  const [allLands, setAllLands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInspectorData = async () => {
      try {
        // Mock pending inspections
        const mockPending = [
          {
            id: 1,
            location: 'Downtown Plot A',
            area: 5000,
            owner: '0x1234...5678',
            submissionDate: '2025-01-15',
            priority: 'High'
          },
          {
            id: 2,
            location: 'Suburban Area B',
            area: 3200,
            owner: '0x9876...4321',
            submissionDate: '2025-01-14',
            priority: 'Medium'
          }
        ];

        setPendingInspections(mockPending);
        setCompletedInspections([]);
        setAllLands(mockPending);

      } catch (error) {
        console.error('Error loading inspector data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInspectorData();
  }, []);

  const handleApproveInspection = async (landId) => {
    try {
      console.log('Approving inspection for land:', landId);
      alert('Land inspection approved! (This would update the blockchain)');
      setPendingInspections(prev => prev.filter(land => land.id !== landId));
    } catch (error) {
      console.error('Error approving inspection:', error);
    }
  };

  const handleRejectInspection = async (landId) => {
    try {
      console.log('Rejecting inspection for land:', landId);
      alert('Land inspection rejected! (This would update the blockchain)');
      setPendingInspections(prev => prev.filter(land => land.id !== landId));
    } catch (error) {
      console.error('Error rejecting inspection:', error);
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
      <div className="bg-red-600 text-white p-6">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold">Land Inspector Dashboard</h1>
          <p className="opacity-90">Review and verify land registrations</p>
        </div>
      </div>

      <div className="container mx-auto p-6">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Pending Inspections</h3>
            <p className="text-3xl font-bold text-yellow-600">{pendingInspections.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Completed Today</h3>
            <p className="text-3xl font-bold text-green-600">{completedInspections.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">High Priority</h3>
            <p className="text-3xl font-bold text-red-600">
              {pendingInspections.filter(land => land.priority === 'High').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Total Lands</h3>
            <p className="text-3xl font-bold text-blue-600">{allLands.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Pending Inspections</h2>
          </div>
          
          {pendingInspections.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <p>No pending inspections</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Land ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Area</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pendingInspections.map((land) => (
                    <tr key={land.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{land.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {land.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {land.area} sq ft
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {land.owner.slice(0, 10)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {land.submissionDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          land.priority === 'High' 
                            ? 'bg-red-100 text-red-800' 
                            : land.priority === 'Medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {land.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          View Details
                        </button>
                        <button 
                          onClick={() => handleApproveInspection(land.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors mr-2"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleRejectInspection(land.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Schedule Inspection</h3>
            <p className="text-gray-600 text-sm mb-4">Schedule on-site land inspection</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
              Schedule Visit
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Generate Report</h3>
            <p className="text-gray-600 text-sm mb-4">Create inspection reports</p>
            <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors">
              Create Report
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">View History</h3>
            <p className="text-gray-600 text-sm mb-4">Review completed inspections</p>
            <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors">
              View History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandInspectorDashboard;
