import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { WalletProvider } from './hooks/useWallet';
import Header from './components/Layout/Header';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import BuyerDashboard from './pages/dashboards/BuyerDashboard';
import LandOwnerDashboard from './pages/dashboards/LandOwnerDashboard';
import RegisterLand from './pages/RegisterLand';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  return (
    <WalletProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Landing page without header */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Routes with header */}
            <Route path="/*" element={
              <>
                <Header />
                <main>
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/dashboard/admin" element={
                      <RoleProtectedRoute requiredRole="admin">
                        <AdminDashboard />
                      </RoleProtectedRoute>
                    } />
                    <Route path="/dashboard/buyer" element={
                      <RoleProtectedRoute requiredRole="buyer">
                        <BuyerDashboard />
                      </RoleProtectedRoute>
                    } />
                    <Route path="/dashboard/landowner" element={
                      <RoleProtectedRoute requiredRole="landowner">
                        <LandOwnerDashboard />
                      </RoleProtectedRoute>
                    } />
                    <Route path="/register-land" element={<RegisterLand />} />
                  </Routes>
                </main>
              </>
            } />
          </Routes>
          
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </Router>
    </WalletProvider>
  );
}

export default App;
