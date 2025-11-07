import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authRegister } from '../services/api';

/**
 * SignupForm Component
 *
 * Provides a user registration form and calls the backend
 * POST /api/auth/register via authRegister in services/api.js
 */
const SignupForm = ({ onLogin }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const validate = () => {
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError('');

    try {
      const data = await authRegister(
        formData.name,
        formData.email,
        formData.password,
        formData.role
      );

      // If backend returned user and token, call onLogin and redirect
      if (data && data.user) {
        onLogin(data.user);
        if (data.user.role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/student-dashboard');
        }
      } else {
        // If no automatic login, redirect to login page
        navigate('/login');
      }
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-6">
            <div className="card shadow-lg border-0 rounded-3">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h1 className="h3 fw-bold text-dark mb-2">
                    <i className="fa fa-user-plus me-2"></i>Create Account
                  </h1>
                  <p className="text-muted small">Register a new account</p>
                </div>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    <strong>Error: </strong> {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label fw-600 text-dark">Full Name</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      className="form-control form-control-lg"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-600 text-dark">Email Address</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className="form-control form-control-lg"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="student@example.com"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label fw-600 text-dark">Password</label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      className="form-control form-control-lg"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="Enter password"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="role" className="form-label fw-600 text-dark">Role</label>
                    <select
                      id="role"
                      name="role"
                      className="form-select form-select-lg"
                      value={formData.role}
                      onChange={handleChange}
                      disabled={loading}
                    >
                      <option value="student">Student</option>
                      <option value="staff">Staff</option>
                    </select>
                  </div>

                  <button type="submit" className="btn btn-success btn-lg w-100 fw-bold" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                        Creating account...
                      </>
                    ) : (
                      <>
                        <i className="fa fa-user-plus me-2"></i>Create Account
                      </>
                    )}
                  </button>
                </form>

                <hr className="my-4" />

                <div className="text-center">
                  <small className="text-muted">Already have an account?</small>
                  <div className="mt-2">
                    <button className="btn btn-link" onClick={() => navigate('/login')}>Sign in</button>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-center text-muted small mt-4">&copy; 2025 School Equipment Lending Portal</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
