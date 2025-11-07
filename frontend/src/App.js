import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import StudentDashboard from './pages/StudentDashboard';
import BorrowHistory from './pages/BorrowHistory';
import AdminDashboard from './pages/AdminDashboard';
import EquipmentManagement from './pages/EquipmentManagement';
import BorrowEquipment from './pages/BorrowEquipment';
import RequestsManagement from './pages/RequestsManagement';
import { getUser, clearAuthData } from './services/api';
import './App.css';

/**
 * App Component - Main Application Component
 * 
 * UPDATES (Phase 2 Integration):
 * ✅ Import { getUser, clearAuthData } from api service
 * ✅ Load user from localStorage on component mount
 * ✅ Persist user session across page refreshes
 * ✅ Handle logout properly (clear token + user)
 */

const App = () => {
  // Global user state - manage login/logout here
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state for initial check

  /**
   * Load user from localStorage on component mount
   * This allows user to stay logged in after page refresh
   */
  useEffect(() => {
    const storedUser = getUser();
    if (storedUser) {
      setUser(storedUser);
      console.log('User restored from localStorage:', storedUser);
    }
    setLoading(false);
  }, []);

  /**
   * Handle user login
   * This function will be called from LoginForm
   * It receives user data and stores it in state
   */
  const handleLogin = (userData) => {
    setUser(userData);
    console.log('User logged in:', userData);
  };

  /**
   * Handle user logout
   * Clear the user state and remove all auth data from localStorage
   */
  const handleLogout = () => {
    setUser(null);
    clearAuthData(); // Clear token and user from localStorage
    console.log('User logged out');
  };

  // Show loading screen while checking localStorage
  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app-container">
        {/* Navbar - displayed on all pages */}
        <Navbar user={user} onLogout={handleLogout} />

        {/* Main content area */}
        <main className="main-content">
          <Routes>
            {/* LOGIN ROUTE */}
            <Route 
              path="/login" 
              element={<LoginForm onLogin={handleLogin} />}
            />

            {/* SIGNUP ROUTE */}
            <Route
              path="/signup"
              element={<SignupForm onLogin={handleLogin} />}
            />

            {/* STUDENT DASHBOARD ROUTE */}
            <Route 
              path="/student-dashboard" 
              element={
                user && (user.role === 'student' || user.role === 'staff') ? (
                  <StudentDashboard user={user} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* ADMIN DASHBOARD ROUTE */}
            <Route 
              path="/admin-dashboard" 
              element={
                user && user.role === 'admin' ? (
                  <AdminDashboard user={user} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* BORROW HISTORY ROUTE */}
            <Route 
              path="/borrow-history" 
              element={
                user ? (
                  <BorrowHistory user={user} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* EQUIPMENT MANAGEMENT ROUTE - VERIFIED CONNECTED */}
            <Route 
              path="/equipment-management" 
              element={
                user && user.role === 'admin' ? (
                  <EquipmentManagement user={user} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* BORROW EQUIPMENT ROUTE - VERIFIED */}
            <Route 
              path="/borrow-equipment" 
              element={
                user ? (
                  <BorrowEquipment user={user} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* REQUESTS ROUTE */}
            <Route 
              path="/requests" 
              element={
                user && user.role === 'admin' ? (
                  <RequestsManagement user={user} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* HOME ROUTE */}
            <Route 
              path="/" 
              element={
                user ? (
                  user.role === 'admin' ? 
                    <Navigate to="/admin-dashboard" /> : 
                    <Navigate to="/student-dashboard" />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* CATCH-ALL ROUTE */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-dark text-light text-center py-4 mt-5">
          <p className="mb-0">&copy; 2025 School Equipment Lending Portal. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;