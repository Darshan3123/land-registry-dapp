import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ id: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Test credentials
  const testCredentials = {
    admin: 'admin123',
    inspector: 'insp123'
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate API call delay
    setTimeout(() => {
      if (credentials.id === 'admin' && credentials.password === testCredentials.admin) {
        // Admin login success
        const userData = {
          id: 'admin',
          role: 'admin',
          loginTime: new Date().toISOString()
        };
        localStorage.setItem('userSession', JSON.stringify(userData));
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/dashboard/admin');
      } else {
        setError('Invalid credentials. Try admin/admin123');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Admin Login</h2>
          <p className="text-gray-600">Enter your admin credentials</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admin ID
            </label>
            <input
              type="text"
              value={credentials.id}
              onChange={(e) => setCredentials({...credentials, id: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter admin ID"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Test Credentials:</p>
          <p className="text-sm font-mono">ID: admin</p>
          <p className="text-sm font-mono">Password: admin123</p>
        </div>

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

export default AdminLogin;
