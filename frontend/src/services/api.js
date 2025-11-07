/**
 * API Service
 * Centralized API utility for all backend communication
 * 
 * CRITICAL: Uses environment variable for backend URL
 * This allows different URLs for development/production
 */

// ============================================================
// CONFIGURATION - USE ENVIRONMENT VARIABLE
// ============================================================

// READ FROM ENVIRONMENT VARIABLE (set in .env or Vercel)
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const API_BASE_URL = 'http://localhost:5000';

console.log('🔧 API Base URL:', API_BASE_URL); // Debug log

// Token key for localStorage
const TOKEN_KEY = 'equipmentPortal_token';
const USER_KEY = 'equipmentPortal_user';

// ============================================================
// TOKEN MANAGEMENT FUNCTIONS
// ============================================================

/**
 * Store JWT token in localStorage
 * @param {string} token - JWT token from backend
 */
export const setToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

/**
 * Retrieve JWT token from localStorage
 * @returns {string|null} - JWT token or null if not found
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Remove JWT token from localStorage
 */
export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Store user data in localStorage
 * @param {object} user - User object
 */
export const setUser = (user) => {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

/**
 * Retrieve user data from localStorage
 * @returns {object|null} - User object or null if not found
 */
export const getUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

/**
 * Remove user data from localStorage
 */
export const clearUser = () => {
  localStorage.removeItem(USER_KEY);
};

/**
 * Clear all auth data (token + user)
 */
export const clearAuthData = () => {
  clearToken();
  clearUser();
};

// ============================================================
// REQUEST INTERCEPTOR FUNCTION
// ============================================================

/**
 * Build request headers with JWT token
 * @returns {object} - Headers object with Authorization
 */
const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

// ============================================================
// ERROR HANDLING
// ============================================================

/**
 * Handle API errors
 * @param {Response} response - Fetch response object
 * @throws {Error} - Throws error with message
 */
const handleError = async (response) => {
  let errorMessage = 'An error occurred';

  try {
    const data = await response.json();
    errorMessage = data.message || errorMessage;
  } catch (e) {
    errorMessage = response.statusText || errorMessage;
  }

  const error = new Error(errorMessage);
  error.status = response.status;
  throw error;
};

// ============================================================
// HTTP METHODS - GENERIC
// ============================================================

/**
 * GET request
 * @param {string} endpoint - API endpoint (without base URL)
 * @returns {Promise<object>} - Response data
 */
export const apiGet = async (endpoint) => {
  try {
    console.log(`📡 GET ${API_BASE_URL}${endpoint}`);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      await handleError(response);
    }

    return await response.json();
  } catch (error) {
    console.error(`❌ GET ${endpoint} error:`, error.message);
    throw error;
  }
};

/**
 * POST request
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {object} data - Request body data
 * @returns {Promise<object>} - Response data
 */
export const apiPost = async (endpoint, data = {}) => {
  try {
    console.log(`📡 POST ${API_BASE_URL}${endpoint}`, data);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      await handleError(response);
    }

    return await response.json();
  } catch (error) {
    console.error(`❌ POST ${endpoint} error:`, error.message);
    throw error;
  }
};

/**
 * PUT request
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {object} data - Request body data
 * @returns {Promise<object>} - Response data
 */
export const apiPut = async (endpoint, data = {}) => {
  try {
    console.log(`📡 PUT ${API_BASE_URL}${endpoint}`, data);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      await handleError(response);
    }

    return await response.json();
  } catch (error) {
    console.error(`❌ PUT ${endpoint} error:`, error.message);
    throw error;
  }
};

/**
 * DELETE request
 * @param {string} endpoint - API endpoint (without base URL)
 * @returns {Promise<object>} - Response data
 */
export const apiDelete = async (endpoint) => {
  try {
    console.log(`📡 DELETE ${API_BASE_URL}${endpoint}`);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    if (!response.ok) {
      await handleError(response);
    }

    return await response.json();
  } catch (error) {
    console.error(`❌ DELETE ${endpoint} error:`, error.message);
    throw error;
  }
};

// ============================================================
// AUTH SPECIFIC FUNCTIONS
// ============================================================

/**
 * Login user
 * POST /api/auth/login
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} role - User role (student, staff, admin)
 * @returns {Promise<object>} - {token, user}
 */
export const authLogin = async (email, password, role) => {
  try {
    const response = await apiPost('/api/auth/login', {
      email,
      password,
      role,
    });

    console.log('📥 Raw backend response:', response);

    // Backend returns { success, message, data: { token, user } }
    // Extract the actual data
    const loginData = response.data || response;

    console.log('📤 Extracted login data:', loginData);
    console.log('📤 Token:', loginData.token);
    console.log('📤 User:', loginData.user);

    // Store token and user if login successful
    if (loginData.token && loginData.user) {
      setToken(loginData.token);
      setUser(loginData.user);
      console.log('✅ Token and user stored in localStorage');
    } else {
      console.warn('⚠️ Missing token or user in response');
    }

    return loginData;
  } catch (error) {
    console.error('❌ Login error:', error);
    throw error;
  }
};

/**
 * Register user
 * POST /api/auth/register
 * @param {string} name - User name
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} role - User role
 * @returns {Promise<object>} - {token, user}
 */
export const authRegister = async (name, email, password, role) => {
  try {
    const response = await apiPost('/api/auth/register', {
      name,
      email,
      password,
      role,
    });

    // Backend returns { success, message, data: { token, user } }
    // Extract the actual data
    const registerData = response.data || response;

    // Store token and user if registration successful
    if (registerData.token) {
      setToken(registerData.token);
      setUser(registerData.user);
    }

    return registerData;
  } catch (error) {
    console.error('❌ Register error:', error);
    throw error;
  }
};

/**
 * Get current user profile
 * GET /api/auth/me
 * @returns {Promise<object>} - User data
 */
export const authGetMe = async () => {
  try {
    const response = await apiGet('/api/auth/me');
    return response;
  } catch (error) {
    console.error('❌ Get user error:', error);
    throw error;
  }
};

/**
 * Logout user (clear local storage)
 */
export const authLogout = () => {
  clearAuthData();
};

// ============================================================
// EXPORT DEFAULT
// ============================================================

export default {
  // Configuration
  API_BASE_URL,
  
  // Token management
  setToken,
  getToken,
  clearToken,
  setUser,
  getUser,
  clearUser,
  clearAuthData,
  
  // HTTP methods
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  
  // Auth specific
  authLogin,
  authRegister,
  authGetMe,
  authLogout,
};