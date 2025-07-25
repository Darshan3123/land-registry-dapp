import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { WalletProvider } from './hooks/useWallet';
import Header from './components/Layout/Header';
import LandingPage from './pages/LandingPage';
import CustomerRegistration from './components/auth/CustomerRegistration';
import AdminLogin from './components/auth/AdminLogin';
import LandInspectorLogin from './components/auth/LandInspectorLogin';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import BuyerDashboard from './pages/dashboards/BuyerDashboard';
import SellerDashboard from './pages/dashboards/SellerDashboard';
import LandInspectorDashboard from './pages/dashboards/LandInspectorDashboard';
import ActiveUsers from './pages/dashboards/ActiveUsers';
import ManageUsers from './pages/dashboards/ManageUsers';
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

            {/* Auth routes without header */}
            <Route path="/auth/customer" element={<CustomerRegistration />} />
            <Route path="/auth/admin" element={<AdminLogin />} />
            <Route path="/auth/land-inspector" element={<LandInspectorLogin />} />
            <Route path="/buyer" element={<BuyerDashboard />} />

            {/* Dashboard routes with header */}
            <Route
              path="/dashboard"
              element={
                <>
                  <Header />
                  <Dashboard />
                </>
              }
            />
            <Route
              path="/dashboard/admin/user"
              element={
                <>
                  <Header />
                  <AdminDashboard />
                </>
              }
            />
            <Route
              path="/dashboard/seller"
              element={
                <>
                  <Header />
                  <SellerDashboard />
                </>
              }
            />
            <Route
              path="/dashboard/land-inspector"
              element={
                <>
                  <Header />
                  <LandInspectorDashboard />
                </>
              }
            />
            <Route
  path="/dashboard/admin/users"
  element={
    <>
      <Header />
      <ManageUsers />
    </>
  }
/>
            <Route
              path="/dashboard/admin/active"
              element={
                <>
                  <Header />
                  <ActiveUsers />
                </>
              }
            />

            {/* Other routes with header */}
            <Route
              path="/register-land"
              element={
                <>
                  <Header />
                  <RegisterLand />
                </>
              }
            />
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
