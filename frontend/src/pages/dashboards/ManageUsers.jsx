import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  // Load users from localStorage on mount
  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    setUsers(savedUsers);
  }, []);

  // Save updated users to localStorage
  const updateLocalStorage = (updatedUsers) => {
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
  };

  const handleStatusUpdate = (index, status) => {
    const updatedUsers = [...users];
    updatedUsers[index].status = status;
    updateLocalStorage(updatedUsers);
    toast.success(`User ${updatedUsers[index].name} marked as ${status}`);
  };

  const handleAddDummyUsers = () => {
    const dummyUsers = [
      {
        name: "Darshan Patel",
        email: "darshan@example.com",
        wallet: "0x1234567890abcdef",
        role: "Buyer",
        status: "Pending",
        aadhaarFile: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        panFile: "https://via.placeholder.com/150"
      },
      {
        name: "Milan Shah",
        email: "milan@example.com",
        wallet: "0xabcdef1234567890",
        role: "Seller",
        status: "Verified",
        aadhaarFile: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        panFile: "https://via.placeholder.com/150"
      },
      {
        name: "Riya Mehta",
        email: "riya@example.com",
        wallet: "0xfedcba0987654321",
        role: "Seller",
        status: "Rejected",
        aadhaarFile: "",
        panFile: ""
      }
    ];
    updateLocalStorage(dummyUsers);
    toast.success("Dummy users added!");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Users</h2>
        <button
          onClick={handleAddDummyUsers}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Dummy Users
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Wallet</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Aadhaar</th>
              <th className="px-4 py-2">PAN</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-4">No users found.</td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={index} className="border-t text-sm text-center">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.wallet}</td>
                  <td className="px-4 py-2">{user.role}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-white ${user.status === 'Verified' ? 'bg-green-600' : user.status === 'Rejected' ? 'bg-red-600' : 'bg-yellow-500'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {user.aadhaarFile ? (
                      <a href={user.aadhaarFile} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                        View
                      </a>
                    ) : 'N/A'}
                  </td>
                  <td className="px-4 py-2">
                    {user.panFile ? (
                      <a href={user.panFile} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                        View
                      </a>
                    ) : 'N/A'}
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleStatusUpdate(index, 'Verified')}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Verify
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(index, 'Rejected')}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
