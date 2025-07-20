import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-red-800">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 text-white">
        <div className="flex items-center space-x-8">
          <div className="text-xl font-bold">LandRegistry</div>
          <div className="hidden md:flex space-x-6">
            <a href="#" className="hover:text-red-200 transition-colors">Home</a>
            <a href="#" className="hover:text-red-200 transition-colors">About</a>
            <a href="#" className="hover:text-red-200 transition-colors">Services</a>
            <a href="#" className="hover:text-red-200 transition-colors">Contact</a>
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
          <p className="text-lg mb-4 opacity-90">Blockchain Technology For</p>
          <h1 className="text-6xl font-bold leading-tight mb-6">
            Safe Land<br />
            Registration<br />
            Process
          </h1>
          <p className="text-xl mb-12 opacity-90 max-w-lg">
            We Built Blockchain Based Safe Land Related Data Exchange and Storage
          </p>
          
          {/* Role Selection Buttons */}
          <div className="flex flex-col space-y-4 max-w-md">
            <Link 
              to="/auth/customer"
              className="bg-red-700 hover:bg-red-800 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors border-2 border-red-700 hover:border-red-800 text-center"
            >
              CUSTOMER
            </Link>
            <Link 
              to="/auth/admin"
              className="bg-red-700 hover:bg-red-800 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors border-2 border-red-700 hover:border-red-800 text-center"
            >
              ADMIN
            </Link>
            <Link 
              to="/auth/land-inspector"
              className="bg-red-700 hover:bg-red-800 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors border-2 border-red-700 hover:border-red-800 text-center"
            >
              LAND INSPECTOR
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

        {/* Security Icons on the right */}
        <div className="hidden xl:flex flex-col space-y-12 items-center">
          <div className="bg-red-500 p-4 rounded-full">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18,8h-1V6c0-2.76-2.24-5-5-5S7,3.24,7,6v2H6c-1.1,0-2,0.9-2,2v10c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V10 C20,8.9,19.1,8,18,8z M12,17c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2S13.1,17,12,17z M15.1,8H8.9V6c0-1.71,1.39-3.1,3.1-3.1 s3.1,1.39,3.1,3.1V8z"/>
            </svg>
          </div>
          <div className="bg-red-500 p-4 rounded-full">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
