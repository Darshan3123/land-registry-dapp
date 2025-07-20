import React from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../hooks/useWallet';

const LandingPage = () => {
  const { isConnected } = useWallet();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-red-800">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 text-white">
        <div className="flex items-center space-x-8">
          <div className="text-xl font-bold">LandRegistry</div>
          <div className="hidden md:flex space-x-6">
            <a href="#" className="hover:text-red-200 transition-colors">Home</a>
            <a href="#" className="hover:text-red-200 transition-colors">About</a>
            <div className="relative group">
              <a href="#" className="hover:text-red-200 transition-colors flex items-center">
                Services <span className="ml-1"></span>
              </a>
            </div>
            <div className="relative group">
              <a href="#" className="hover:text-red-200 transition-colors flex items-center">
                Pages <span className="ml-1"></span>
              </a>
            </div>
            <div className="relative group">
              <a href="#" className="hover:text-red-200 transition-colors flex items-center">
                Blogs <span className="ml-1"></span>
              </a>
            </div>
            <a href="#" className="hover:text-red-200 transition-colors">Pricing</a>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="bg-white text-red-600 px-6 py-2 rounded-lg font-semibold hover:bg-red-50 transition-colors">
            Contact Us
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex items-center justify-between px-8 py-16">
        {/* Left Content */}
        <div className="flex-1 text-white max-w-2xl">
          <p className="text-lg mb-4 opacity-90">Block Chain Technology For</p>
          <h1 className="text-6xl font-bold leading-tight mb-6">
            Safe Land<br />
            Registration<br />
            Process
          </h1>
          <p className="text-xl mb-12 opacity-90 max-w-lg">
            We Built Block Chain Based Safe Land Related Data Exchange and Storage
          </p>
          
          {/* Role Selection Buttons */}
          <div className="flex space-x-4">
            <Link 
              to="/dashboard/admin"
              className="bg-red-700 hover:bg-red-800 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors border-2 border-red-700 hover:border-red-800"
            >
              ADMIN
            </Link>
            <Link 
              to="/dashboard/buyer"
              className="bg-red-700 hover:bg-red-800 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors border-2 border-red-700 hover:border-red-800"
            >
              BUYER
            </Link>
            <Link 
              to="/dashboard/landowner"
              className="bg-red-700 hover:bg-red-800 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors border-2 border-red-700 hover:border-red-800"
            >
              LAND OWNER
            </Link>
          </div>
        </div>

        {/* Right Side Icons */}
        <div className="hidden lg:flex flex-col space-y-8 mr-16">
          <div className="bg-red-500 p-6 rounded-full">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <div className="bg-red-500 p-6 rounded-full">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.5 7.5h-5A1.5 1.5 0 0 0 12.04 8.37L9.5 16H12v6h8z"/>
            </svg>
          </div>
          <div className="bg-red-500 p-6 rounded-full">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Wallet Connection Notice */}
      {!isConnected && (
        <div className="fixed bottom-4 right-4 bg-white text-red-600 px-6 py-3 rounded-lg shadow-lg">
          <p className="text-sm font-semibold">Please connect your wallet to access dashboards</p>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
