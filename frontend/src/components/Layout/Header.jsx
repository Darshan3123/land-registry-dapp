import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWallet } from '../../hooks/useWallet';

const Header = () => {
  const { account, isConnected, connectWallet, disconnectWallet } = useWallet();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/dashboard" className="text-2xl font-bold hover:text-blue-200">
            🏠 Land Registry DApp
          </Link>
          
          {/* Navigation */}
          {isConnected && (
            <nav className="hidden md:flex space-x-6">
              <Link 
                to="/dashboard" 
                className={`px-3 py-2 rounded transition-colors ${
                  isActive('/dashboard') 
                    ? 'bg-blue-700 text-white' 
                    : 'hover:bg-blue-500'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                to="/register-land" 
                className={`px-3 py-2 rounded transition-colors ${
                  isActive('/register-land') 
                    ? 'bg-blue-700 text-white' 
                    : 'hover:bg-blue-500'
                }`}
              >
                Register Land
              </Link>
            </nav>
          )}
          
          {/* Wallet Connection */}
          <div className="flex items-center gap-4">
            {isConnected ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {account?.slice(0, 6)}...{account?.slice(-4)}
                  </div>
                  <div className="text-xs text-blue-200">Connected</div>
                </div>
                <button 
                  onClick={disconnectWallet}
                  className="bg-red-500 px-3 py-2 rounded text-sm hover:bg-red-600 transition-colors"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button 
                onClick={connectWallet}
                className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 transition-colors font-medium"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;