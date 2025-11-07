# Frontend-Backend Integration Plan

## Current State
- ✅ LoginForm: Uses mock data (mockUsers array)
- ✅ StudentDashboard: Uses mock equipment data
- ✅ AdminDashboard: Uses mock stats and requests
- ✅ Navbar: Handles logout with onLogout prop
- ✅ App.js: Global user state management
- ❌ No API service file exists
- ❌ No token storage mechanism
- ❌ No request interceptor

---

## What Needs to be Created/Modified

### Phase 1: Foundation (Critical)
1. **Create API Service File** (`frontend/src/services/api.js`)
   - Base API configuration
   - HTTP methods (GET, POST, PUT, DELETE)
   - Token management (localStorage)
   - Request interceptor for JWT token
   - Error handling

2. **Modify App.js**
   - Add token persistence on page refresh
   - Load user from localStorage on mount
   - Pass token to children components

3. **Modify LoginForm.js**
   - Replace mockUsers with real API call
   - Send email, password, role to backend
   - Store returned JWT token in localStorage
   - Handle API errors

### Phase 2: Integration
4. **Modify StudentDashboard.js**
   - Replace mockEquipmentData with API call
   - Fetch equipment from backend

5. **Modify AdminDashboard.js**
   - Replace mockStats with API call
   - Replace mockRecentRequests with API call

6. **Modify Navbar.js**
   - Clear token from localStorage on logout

---

## Questions Before We Start

1. **Backend URL**: Is it `http://localhost:5000`?
2. **CORS**: Backend CORS is set to `process.env.CORS_ORIGIN || 'http://localhost:3000'` - correct?
3. **Token Storage**: Use localStorage (recommended) or something else?
4. **Error Messages**: Show alert() or in-form messages?

## Step-by-Step Implementation

We'll implement in this order:
1. Create `api.js` service
2. Update `App.js` for token persistence
3. Update `LoginForm.js` to use real API
4. Test login flow
5. Then move to other components

Ready to start? Confirm the backend URL and let's begin! 🚀
