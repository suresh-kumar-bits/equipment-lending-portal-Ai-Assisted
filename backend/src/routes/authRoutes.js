const express = require('express');
const router = express.Router();
const { login, register, getMe } = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');

/**
 * Auth Routes
 * POST   /api/auth/login     - User login
 * POST   /api/auth/register  - User registration
 * GET    /api/auth/me        - Get current user profile
 */

// ============================================================
// PUBLIC ROUTES
// ============================================================

/**
 * POST /api/auth/login
 * Login user and get JWT token
 * 
 * Body: { email, password, role }
 * Response: { token, user }
 */
router.post('/login', login);

/**
 * POST /api/auth/register
 * Register new user
 * 
 * Body: { name, email, password, role }
 * Response: { token, user }
 */
router.post('/register', register);

// ============================================================
// PROTECTED ROUTES
// ============================================================

/**
 * GET /api/auth/me
 * Get current user profile (requires authentication)
 * 
 * Response: { user }
 */
router.get('/me', authenticate, getMe);

module.exports = router;