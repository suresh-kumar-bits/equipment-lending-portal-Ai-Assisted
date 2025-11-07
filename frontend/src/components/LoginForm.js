import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authLogin } from '../services/api';
import "../styles/auth.css"

/**
 * LoginForm Component
 * 
 * UPDATES (Phase 2 Integration):
 * ✅ Removed mockUsers array
 * ✅ Integrated real backend API call: POST /api/auth/login
 * ✅ Sends email, password, and role to backend
 * ✅ Receives JWT token and user data from backend
 * ✅ Token automatically stored in localStorage via api.js
 * ✅ Improved error messages from backend
 * ✅ Better loading and error states
 */

const LoginForm = ({ onLogin }) => {
  const navigate = useNavigate();

  // Form state - stores user input
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student', // Default role
  });

  // Error and loading state
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Handle input change
   * Updates form state as user types
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user starts typing
    setError('');
  };

  /**
   * Handle form submission (login)
   * Calls real backend API
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate form inputs
      if (!formData.email || !formData.password) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address');
        setLoading(false);
        return;
      }

      // ============================================================
      // CALL REAL BACKEND API
      // ============================================================

      const response = await authLogin(
        formData.email,
        formData.password,
        formData.role
      );

      // response contains: { token, user }
      console.log('Login successful, received data:', response);

      // Call parent component's onLogin function
      // Pass user data from backend
      onLogin(response.user);

      // Redirect to appropriate dashboard
      if (response.user.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/student-dashboard');
      }

    } catch (err) {
      // Display error message from backend or generic error
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light auth-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            {/* Login Card */}
            <div className="card shadow-lg border-0 rounded-3">
              <div className="card-body p-4">
                {/* Header */}
                <div className="text-center mb-4">
                  <h1 className="h3 fw-bold text-dark mb-2">
                    <i className="fa fa-toolbox me-2"></i>Equipment Portal
                  </h1>
                  <p className="text-muted small">Sign in to your account</p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <i className="fa fa-exclamation-circle me-2"></i>
                    <strong>Error!</strong> {error}
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="alert"
                      aria-label="Close"
                      onClick={() => setError('')}
                    ></button>
                  </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit}>
                  {/* Email Input */}
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-600 text-dark">
                      <i className="fa fa-envelope me-2"></i>Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      id="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                    <small className="text-muted d-block mt-1">
                      Example: student@example.com
                    </small>
                  </div>

                  {/* Password Input */}
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label fw-600 text-dark">
                      <i className="fa fa-lock me-2"></i>Password
                    </label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      id="password"
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                  </div>

                  {/* Role Selection */}
                  <div className="mb-4">
                    <label htmlFor="role" className="form-label fw-600 text-dark">
                      <i className="fa fa-user-tag me-2"></i>Role
                    </label>
                    <select
                      className="form-select form-select-lg"
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      disabled={loading}
                    >
                      <option value="student">Student</option>
                      <option value="staff">Staff</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100 fw-bold"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Signing in...
                      </>
                    ) : (
                      <>
                        <i className="fa fa-sign-in me-2"></i>Sign In
                      </>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <hr className="my-4" />

                {/* Sign up link - navigate to signup page */}
                <div className="text-center">
                  <small className="text-muted">Don't have an account?</small>
                  <div className="mt-2">
                    <button className="btn btn-link" onClick={() => navigate('/signup')}>Create an account</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;