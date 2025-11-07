# Backend Authentication Analysis

## API Endpoints

### POST /api/auth/login
**Request Body:**
```json
{
  "email": "string",
  "password": "string",
  "role": "student" | "staff" | "admin"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "mongoId",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student",
      "isActive": true,
      "createdAt": "2025-01-15T10:30:00Z",
      "updatedAt": "2025-01-15T10:30:00Z"
    }
  }
}
```

**Error Responses:**
- 400: Missing email, password, or role
- 400: Invalid role (not student/staff/admin)
- 401: User not found
- 401: Wrong password
- 401: Invalid role for this user
- 500: Server error

---

### POST /api/auth/register
**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string (min 6 chars)",
  "role": "student" | "staff" | "admin"
}
```

**Success Response (201):**
Same as login response

**Error Responses:**
- 400: Missing fields
- 400: Password < 6 characters
- 400: Invalid role
- 409: Email already registered
- 500: Server error

---

### GET /api/auth/me
**Headers Required:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User profile retrieved",
  "data": {
    "user": { /* same user object as login */ }
  }
}
```

---

## Token Information

- **JWT Token Format:** Standard JWT (Header.Payload.Signature)
- **Token Expiration:** 24 hours
- **Token Payload Contains:**
  - userId: MongoDB _id
  - email: user email
  - role: user role
- **Secret Key:** Stored in `process.env.JWT_SECRET`

---

## User Data Structure After Login

```javascript
{
  _id: "mongoId",              // MongoDB ObjectId
  name: "John Doe",            // User's full name
  email: "john@example.com",   // Unique email
  role: "student",             // "student", "staff", or "admin"
  isActive: true,              // Account status
  createdAt: "ISO timestamp",  // Account creation date
  updatedAt: "ISO timestamp"   // Last update date
}
```

**Note:** Password is NOT included in response (excluded by `toJSON()` method)

---

## Authentication Flow

1. User submits: email, password, role
2. Backend finds user by email
3. Verifies role matches
4. Compares password using bcrypt
5. Generates JWT token (24h expiration)
6. Returns token + user data
7. Frontend stores token (in localStorage/sessionStorage/memory)
8. Frontend sends token in `Authorization: Bearer {token}` header for protected routes
9. Backend middleware `authenticate` verifies token and allows access

---

## Next Steps for Frontend Integration

1. Create API service/utility file for making requests
2. Modify LoginForm to call backend login endpoint
3. Store token in frontend (localStorage recommended)
4. Create request interceptor to attach token to all requests
5. Update App.js to use real user data from backend
