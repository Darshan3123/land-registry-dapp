import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const UserManagement = ({ usersContract, currentUser, isAdmin }) => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    address: '',
    name: '',
    email: '',
    role: 'user'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (usersContract && isAdmin) {
      loadUsers();
    }
  }, [usersContract, isAdmin]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      // This would require additional contract methods to get all users
      // For now, we'll just show the current user
      if (currentUser) {
        const userData = await usersContract.getUser(currentUser);
        setUsers([userData]);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async () => {
    if (!usersContract || !isAdmin) return;
    
    try {
      setLoading(true);
      const tx = await usersContract.registerUser(
        newUser.address,
        newUser.name,
        newUser.email,
        newUser.role
      );
      await tx.wait();
      
      setNewUser({ address: '', name: '', email: '', role: 'user' });
      loadUsers();
      alert('User registered successfully!');
    } catch (error) {
      console.error('Error registering user:', error);
      alert('Error registering user: ' + (error.reason || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h3>🔒 Admin Access Required</h3>
        <p>You need admin privileges to manage users.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>👥 User Management</h2>
      
      {/* Register New User */}
      <div style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '20px', 
        borderRadius: '10px',
        marginBottom: '20px'
      }}>
        <h3>Register New User</h3>
        <div style={{ display: 'grid', gap: '10px', gridTemplateColumns: '1fr 1fr' }}>
          <input
            type="text"
            placeholder="User Address"
            value={newUser.address}
            onChange={(e) => setNewUser({...newUser, address: e.target.value})}
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
          />
          <input
            type="text"
            placeholder="Full Name"
            value={newUser.name}
            onChange={(e) => setNewUser({...newUser, name: e.target.value})}
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({...newUser, email: e.target.value})}
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({...newUser, role: e.target.value})}
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
          >
            <option value="user">User</option>
            <option value="inspector">Inspector</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button
          onClick={registerUser}
          disabled={loading || !newUser.address || !newUser.name}
          style={{
            marginTop: '10px',
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '⏳ Registering...' : '✅ Register User'}
        </button>
      </div>

      {/* Users List */}
      <div>
        <h3>Registered Users</h3>
        {loading ? (
          <p>Loading users...</p>
        ) : (
          <div style={{ display: 'grid', gap: '10px' }}>
            {users.map((user, index) => (
              <div key={index} style={{
                padding: '15px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                backgroundColor: user.isActive ? '#e8f5e9' : '#ffebee'
              }}>
                <div><strong>Address:</strong> {user.userAddress}</div>
                <div><strong>Name:</strong> {user.name}</div>
                <div><strong>Email:</strong> {user.email}</div>
                <div><strong>Role:</strong> {user.role}</div>
                <div><strong>Status:</strong> {user.isActive ? '✅ Active' : '❌ Inactive'}</div>
                <div><strong>Registered:</strong> {new Date(user.registrationDate * 1000).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;