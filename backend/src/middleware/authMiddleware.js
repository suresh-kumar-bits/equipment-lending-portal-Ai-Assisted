const jwt = require('jsonwebtoken');

/**
 * Authentication Middleware
 * 
 * Verifies JWT token in request header
 * Extracts user information and attaches to request object
 * Used to protect routes that require authentication
 */

exports.authenticate = async (req, res, next) => {
  try {
    // ============================================================
    // 1. GET TOKEN FROM HEADER
    // ============================================================

    const token = req.headers.authorization?.split(' ')[1]; // "Bearer <token>"

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided - Authentication required',
      });
    }

    // ============================================================
    // 2. VERIFY TOKEN
    // ============================================================

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token has expired',
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }

    // ============================================================
    // 3. ATTACH USER DATA TO REQUEST
    // ============================================================

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    next();

  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during authentication',
      error: error.message,
    });
  }
};

/**
 * Authorization Middleware
 * 
 * Checks if user has required role
 * Used after authentication to control access
 * 
 * Usage: authorize(['admin']) or authorize(['admin', 'staff'])
 */
exports.authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      // ============================================================
      // 1. CHECK IF USER IS AUTHENTICATED
      // ============================================================

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      // ============================================================
      // 2. CHECK IF USER HAS REQUIRED ROLE
      // ============================================================

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: `Access denied - Required role: ${allowedRoles.join(' or ')}`,
        });
      }

      // ============================================================
      // 3. PROCEED TO NEXT MIDDLEWARE/ROUTE
      // ============================================================

      next();

    } catch (error) {
      console.error('Authorization error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error during authorization',
        error: error.message,
      });
    }
  };
};

/**
 * Optional Auth Middleware
 * 
 * Checks for token but doesn't fail if not present
 * Useful for routes that work with or without auth
 */
exports.optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
          userId: decoded.userId,
          email: decoded.email,
          role: decoded.role,
        };
      } catch (error) {
        // Token is invalid but that's okay for optional auth
        req.user = null;
      }
    } else {
      req.user = null;
    }

    next();

  } catch (error) {
    console.error('Optional auth error:', error);
    req.user = null;
    next();
  }
};

/**
 * Admin Only Middleware
 * 
 * Shortcut for authorize(['admin'])
 * Use when only admin should access the route
 */
exports.adminOnly = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied - Admin only',
      });
    }

    next();

  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error checking admin status',
      error: error.message,
    });
  }
};

/**
 * Student Only Middleware
 * 
 * Shortcut for authorize(['student', 'staff'])
 * Use when only students and staff should access the route
 */
exports.studentOnly = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    if (!['student', 'staff'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied - Student or Staff only',
      });
    }

    next();

  } catch (error) {
    console.error('Student check error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error checking student status',
      error: error.message,
    });
  }
};