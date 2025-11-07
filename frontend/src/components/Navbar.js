import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { clearAuthData } from '../services/api';
import 'font-awesome/css/font-awesome.min.css';

/**
 * Navbar Component - Mobile Responsive
 * 
 * UPDATES:
 * ✅ Manual state management for mobile menu toggle
 * ✅ No reliance on Bootstrap JavaScript
 * ✅ Works on all devices
 * ✅ Closes menu when link is clicked
 * ✅ Smooth animations
 */

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  /**
   * Handle logout functionality
   */
  const handleLogout = () => {
    clearAuthData();
    onLogout();
    setIsMenuOpen(false);
    navigate('/login');
    console.log('User logged out and auth data cleared');
  };

  /**
   * Close menu when a link is clicked
   */
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  /**
   * Toggle mobile menu
   */
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Function to render menu items based on user role
  const renderMenuItems = () => {
    if (!user) {
      return (
        <>
          <li className="nav-item">
            <Link 
              className={`nav-link ${location.pathname === '/login' ? 'text-warning' : 'text-light'}`}
              to="/login"
              onClick={handleLinkClick}
            >
              Login
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              className={`nav-link ${location.pathname === '/signup' ? 'text-warning' : 'text-light'}`}
              to="/signup"
              onClick={handleLinkClick}
            >
              Sign Up
            </Link>
          </li>
        </>
      );
    }

    if (user.role === 'admin') {
      return (
        <>
          <li className="nav-item">
            <Link 
              className="nav-link text-light" 
              to="/admin-dashboard"
              onClick={handleLinkClick}
            >
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              className="nav-link text-light" 
              to="/equipment-management"
              onClick={handleLinkClick}
            >
              Manage Equipment
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              className="nav-link text-light" 
              to="/requests"
              onClick={handleLinkClick}
            >
              Requests
            </Link>
          </li>
        </>
      );
    }

    if (user.role === 'staff') {
      return (
        <>
          <li className="nav-item">
            <Link 
              className="nav-link text-light" 
              to="/student-dashboard"
              onClick={handleLinkClick}
            >
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              className="nav-link text-light" 
              to="/borrow-equipment"
              onClick={handleLinkClick}
            >
              Borrow Equipment
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              className="nav-link text-light" 
              to="/borrow-history"
              onClick={handleLinkClick}
            >
              My Requests
            </Link>
          </li>
        </>
      );
    }

    // Default menu for student role
    return (
      <>
        <li className="nav-item">
          <Link 
            className="nav-link text-light" 
            to="/student-dashboard"
            onClick={handleLinkClick}
          >
            Dashboard
          </Link>
        </li>
        <li className="nav-item">
          <Link 
            className="nav-link text-light" 
            to="/borrow-equipment"
            onClick={handleLinkClick}
          >
            Borrow Equipment
          </Link>
        </li>
        <li className="nav-item">
          <Link 
            className="nav-link text-light" 
            to="/borrow-history"
            onClick={handleLinkClick}
          >
            My Requests
          </Link>
        </li>
      </>
    );
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container-fluid ps-4 pe-4">
        {/* Brand/Logo */}
        <Link 
          className="navbar-brand fw-bold fs-5" 
          to="/"
          onClick={handleLinkClick}
        >
          <i className="fa fa-toolbox me-2"></i>Equipment Portal
        </Link>

        {/* Hamburger Toggle Button - Manual Control */}
        <button
          className={`navbar-toggler ${isMenuOpen ? '' : 'collapsed'}`}
          type="button"
          onClick={toggleMenu}
          aria-controls="navbarNav"
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation"
          style={{
            border: 'none',
            outline: 'none',
            boxShadow: 'none',
          }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Menu Items - Controlled by State */}
        <div
          className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}
          id="navbarNav"
          style={{
            display: isMenuOpen ? 'block' : 'none',
          }}
        >
          <ul className="navbar-nav ms-auto">
            {/* Render menu items based on user role */}
            {renderMenuItems()}

            {/* Logout Button - For logged in users */}
            {user && (
              <li className="nav-item ms-3">
                <button
                  className="btn btn-outline-danger btn-sm w-100 w-lg-auto"
                  onClick={() => {
                    handleLogout();
                  }}
                  title="Logout"
                  style={{
                    marginTop: '0.5rem',
                  }}
                >
                  <i className="fa fa-sign-out me-2"></i>Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>

      <style>{`
        @media (max-width: 991px) {
          .navbar-collapse {
            transition: all 0.3s ease;
          }

          .navbar-collapse.show {
            display: block !important;
            animation: slideDown 0.3s ease;
          }

          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .nav-item {
            padding: 0.5rem 0;
          }

          .btn-lg-auto {
            width: auto;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;