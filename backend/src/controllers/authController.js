const User = require('../models/User');
const jwt = require('jsonwebtoken');

/**
 * Auth Controller
 * Handles user authentication (login, registration)
 */

/**
 * Login User
 * POST /api/auth/login
 * 
 * Authenticates user with email, password, and role
 * Returns JWT token if credentials are valid
 */
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // ============================================================
    // 1. VALIDATION
    // ============================================================

    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email, password, and role',
      });
    }

    // Validate role
    if (!['student', 'staff', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be student, staff, or admin',
      });
    }

    // ============================================================
    // 2. FIND USER
    // ============================================================

    // Find user by email and select password field (normally excluded)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials - user not found',
      });
    }

    // Check if user's role matches requested role
    if (user.role !== role) {
      return res.status(401).json({
        success: false,
        message: 'Invalid role for this user',
      });
    }

    // ============================================================
    // 3. VERIFY PASSWORD
    // ============================================================

    const isPasswordCorrect = await user.matchPassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials - wrong password',
      });
    }

    // ============================================================
    // 4. GENERATE JWT TOKEN
    // ============================================================

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '24h', // Token expires in 24 hours
      }
    );

    // ============================================================
    // 5. RETURN RESPONSE
    // ============================================================

    // Return user data without password
    const userResponse = user.toJSON();

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: userResponse,
      },
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message,
    });
  }
};

/**
 * Register User (Optional - for future use)
 * POST /api/auth/register
 * 
 * Creates a new user account
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // ============================================================
    // 1. VALIDATION
    // ============================================================

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, password, and role',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    if (!['student', 'staff', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role',
      });
    }

    // ============================================================
    // 2. CHECK IF USER EXISTS
    // ============================================================

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // ============================================================
    // 3. CREATE NEW USER
    // ============================================================

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    // ============================================================
    // 4. GENERATE JWT TOKEN
    // ============================================================

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '24h',
      }
    );

    // ============================================================
    // 5. RETURN RESPONSE
    // ============================================================

    const userResponse = user.toJSON();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        token,
        user: userResponse,
      },
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message,
    });
  }
};

/**
 * Get Current User Profile
 * GET /api/auth/me
 * 
 * Returns the logged-in user's profile
 * Requires authentication
 */
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User profile retrieved',
      data: {
        user,
      },
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving profile',
      error: error.message,
    });
  }
};