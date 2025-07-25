import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ActiveUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Replace this with your real API call or contract function
    const fetchUsers = async () => {
      try {
        // Mocked users for now
        const response = await axios.get('/api/users'); // optional if you're using off-chain db
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Active Users</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user, index) => (
          <div key={index} className="border rounded-lg p-4 shadow-md">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Wallet:</strong> {user.wallet}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>Status:</strong> {user.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveUsers;
