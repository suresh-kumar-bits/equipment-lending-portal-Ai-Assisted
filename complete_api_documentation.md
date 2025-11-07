# School Equipment Lending Portal - Complete API Documentation

## 📌 Document Overview

This document specifies all API endpoints required for the School Equipment Lending Portal backend. This is the complete specification for Node.js/MongoDB backend development.

**Created For:** Backend Development Team
**Technology:** Node.js, MongoDB, Express.js
**Database:** MongoDB
**Authentication:** JWT (JSON Web Token)
**API Style:** RESTful

---

## 🔧 General Information

### Base URL
```
http://localhost:5000/api
```

### Authentication
All endpoints (except `/auth/login` and `/auth/register`) require JWT token in header:
```
Authorization: Bearer <jwt_token>
```

### Response Format
All responses follow this format:
```json
{
  "success": true/false,
  "message": "Response message",
  "data": { /* response data */ }
}
```

### Status Codes
- **200 OK** - Request successful
- **201 Created** - Resource created successfully
- **400 Bad Request** - Invalid request parameters
- **401 Unauthorized** - Authentication required/failed
- **403 Forbidden** - Access denied (insufficient permissions)
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Server error

### Common Error Response
```json
{
  "success": false,
  "message": "Error message describing what went wrong"
}
```

---

## 👤 User & Authentication Endpoints

### 1. Login User
**Endpoint:** `POST /api/auth/login`
**Authentication:** Not required
**Description:** Authenticate user and receive JWT token

**Request Body:**
```json
{
  "email": "student@example.com",
  "password": "password123",
  "role": "student"
}
```

**Parameters:**
- `email` (string, required): User email address
- `password` (string, required): User password
- `role` (string, required): User role - `student`, `staff`, or `admin`

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "60d5ec49c1234567890abcde",
      "name": "John Student",
      "email": "student@example.com",
      "role": "student"
    }
  }
}
```

**Response (Error - 401):**
```json
{
  "success": false,
  "message": "Invalid email, password, or role"
}
```

**Notes:**
- Token should be stored in localStorage on frontend
- Token expires in 24 hours
- Password must be hashed using bcrypt on backend

---

### 2. Register User (Optional - for future implementation)
**Endpoint:** `POST /api/auth/register`
**Authentication:** Not required
**Description:** Create new user account

**Request Body:**
```json
{
  "name": "John Student",
  "email": "student@example.com",
  "password": "password123",
  "role": "student"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "userId": "60d5ec49c1234567890abcde",
    "email": "student@example.com"
  }
}
```

---

## 📦 Equipment Endpoints

### 3. Get All Equipment
**Endpoint:** `GET /api/equipment`
**Authentication:** Required
**Description:** Retrieve all equipment from inventory

**Query Parameters (Optional):**
- `search` (string): Search by name or description
- `category` (string): Filter by category (Sports, Lab, Camera, Musical, Computing, Tools)
- `availability` (string): Filter by availability (`available`, `unavailable`)
- `page` (number): Pagination page number (default: 1)
- `limit` (number): Items per page (default: 10)

**Example Request:**
```
GET /api/equipment?category=Sports&availability=available&page=1&limit=10
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Equipment retrieved successfully",
  "data": {
    "equipment": [
      {
        "id": "60d5ec49c1234567890abcde",
        "name": "Basketball Set",
        "category": "Sports",
        "description": "Professional basketball set with 5 balls and pump",
        "condition": "Good",
        "quantity": 5,
        "available": 3,
        "location": "Sports Room A",
        "image": null,
        "createdAt": "2025-11-01T10:30:00Z",
        "updatedAt": "2025-11-02T15:45:00Z"
      },
      {
        "id": "60d5ec49c1234567890abcdf",
        "name": "Microscope",
        "category": "Lab",
        "description": "Advanced optical microscope for laboratory work",
        "condition": "Excellent",
        "quantity": 10,
        "available": 8,
        "location": "Lab 1",
        "image": null,
        "createdAt": "2025-11-01T10:30:00Z",
        "updatedAt": "2025-11-02T15:45:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 8,
      "pages": 1
    }
  }
}
```

**Response (Error - 401):**
```json
{
  "success": false,
  "message": "Unauthorized - Please login"
}
```

---

### 4. Get Single Equipment
**Endpoint:** `GET /api/equipment/:id`
**Authentication:** Required
**Description:** Retrieve details of a single equipment item

**Path Parameters:**
- `id` (string, required): Equipment ID

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Equipment retrieved successfully",
  "data": {
    "id": "60d5ec49c1234567890abcde",
    "name": "Basketball Set",
    "category": "Sports",
    "description": "Professional basketball set with 5 balls and pump",
    "condition": "Good",
    "quantity": 5,
    "available": 3,
    "location": "Sports Room A",
    "image": null,
    "createdAt": "2025-11-01T10:30:00Z",
    "updatedAt": "2025-11-02T15:45:00Z"
  }
}
```

**Response (Error - 404):**
```json
{
  "success": false,
  "message": "Equipment not found"
}
```

---

### 5. Add New Equipment
**Endpoint:** `POST /api/equipment`
**Authentication:** Required (Admin only)
**Description:** Create new equipment item in inventory

**Request Body:**
```json
{
  "name": "Basketball Set",
  "category": "Sports",
  "description": "Professional basketball set with 5 balls and pump",
  "condition": "Good",
  "quantity": 5,
  "available": 5,
  "location": "Sports Room A"
}
```

**Parameters:**
- `name` (string, required): Equipment name
- `category` (string, required): Category (Sports, Lab, Camera, Musical, Computing, Tools)
- `description` (string, required): Equipment description
- `condition` (string, required): Condition (Excellent, Good, Fair, Poor)
- `quantity` (number, required): Total quantity
- `available` (number, required): Currently available quantity
- `location` (string, required): Storage location

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Equipment added successfully",
  "data": {
    "id": "60d5ec49c1234567890abcde",
    "name": "Basketball Set",
    "category": "Sports",
    "description": "Professional basketball set with 5 balls and pump",
    "condition": "Good",
    "quantity": 5,
    "available": 5,
    "location": "Sports Room A",
    "image": null,
    "createdAt": "2025-11-02T15:45:00Z"
  }
}
```

**Response (Error - 403):**
```json
{
  "success": false,
  "message": "Access denied - Admin only"
}
```

---

### 6. Update Equipment
**Endpoint:** `PUT /api/equipment/:id`
**Authentication:** Required (Admin only)
**Description:** Update existing equipment details

**Path Parameters:**
- `id` (string, required): Equipment ID

**Request Body:**
```json
{
  "name": "Basketball Set",
  "category": "Sports",
  "description": "Professional basketball set with 5 balls and pump",
  "condition": "Good",
  "quantity": 5,
  "available": 3,
  "location": "Sports Room A"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Equipment updated successfully",
  "data": {
    "id": "60d5ec49c1234567890abcde",
    "name": "Basketball Set",
    "category": "Sports",
    "description": "Professional basketball set with 5 balls and pump",
    "condition": "Good",
    "quantity": 5,
    "available": 3,
    "location": "Sports Room A",
    "updatedAt": "2025-11-02T16:00:00Z"
  }
}
```

**Response (Error - 404):**
```json
{
  "success": false,
  "message": "Equipment not found"
}
```

---

### 7. Delete Equipment
**Endpoint:** `DELETE /api/equipment/:id`
**Authentication:** Required (Admin only)
**Description:** Delete equipment from inventory

**Path Parameters:**
- `id` (string, required): Equipment ID

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Equipment deleted successfully",
  "data": {
    "id": "60d5ec49c1234567890abcde"
  }
}
```

**Response (Error - 403):**
```json
{
  "success": false,
  "message": "Access denied - Admin only"
}
```

---

## 📋 Borrow Request Endpoints

### 8. Create Borrow Request
**Endpoint:** `POST /api/requests/create`
**Authentication:** Required (Student/Staff)
**Description:** Submit a request to borrow equipment

**Request Body:**
```json
{
  "studentId": "60d5ec49c1234567890abcde",
  "studentName": "John Student",
  "equipmentId": "60d5ec49c1234567890abcdf",
  "equipmentName": "Basketball Set",
  "borrowFromDate": "2025-11-05",
  "borrowToDate": "2025-11-10",
  "notes": "Sports practice and tournament"
}
```

**Parameters:**
- `studentId` (string, required): ID of student requesting
- `studentName` (string, required): Name of student
- `equipmentId` (string, required): ID of equipment
- `equipmentName` (string, required): Name of equipment
- `borrowFromDate` (date, required): Borrow start date (YYYY-MM-DD)
- `borrowToDate` (date, required): Expected return date (YYYY-MM-DD)
- `notes` (string, required): Purpose/reason for borrowing

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Borrow request submitted successfully",
  "data": {
    "requestId": "60d5ec49c1234567890abce0",
    "status": "pending",
    "studentId": "60d5ec49c1234567890abcde",
    "equipmentId": "60d5ec49c1234567890abcdf",
    "borrowFromDate": "2025-11-05",
    "borrowToDate": "2025-11-10",
    "requestedDate": "2025-11-02",
    "notes": "Sports practice and tournament",
    "createdAt": "2025-11-02T15:45:00Z"
  }
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "message": "Invalid dates - Return date must be after borrow date"
}
```

---

### 9. Get User's Borrow Requests
**Endpoint:** `GET /api/requests/user/:userId`
**Authentication:** Required
**Description:** Get all borrow requests for a specific user

**Path Parameters:**
- `userId` (string, required): User ID

**Query Parameters (Optional):**
- `status` (string): Filter by status (pending, approved, rejected, returned)
- `page` (number): Pagination page number (default: 1)
- `limit` (number): Items per page (default: 10)

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Requests retrieved successfully",
  "data": {
    "requests": [
      {
        "id": "60d5ec49c1234567890abce0",
        "studentName": "John Student",
        "studentId": "60d5ec49c1234567890abcde",
        "studentEmail": "student@example.com",
        "equipmentName": "Basketball Set",
        "equipmentId": "60d5ec49c1234567890abcdf",
        "borrowFromDate": "2025-11-05",
        "borrowToDate": "2025-11-10",
        "requestedDate": "2025-11-02",
        "status": "pending",
        "approvedBy": null,
        "approvalDate": null,
        "notes": "Sports practice and tournament",
        "createdAt": "2025-11-02T15:45:00Z"
      },
      {
        "id": "60d5ec49c1234567890abce1",
        "studentName": "John Student",
        "studentId": "60d5ec49c1234567890abcde",
        "studentEmail": "student@example.com",
        "equipmentName": "Microscope",
        "equipmentId": "60d5ec49c1234567890abcdf",
        "borrowFromDate": "2025-11-01",
        "borrowToDate": "2025-11-03",
        "requestedDate": "2025-10-31",
        "status": "returned",
        "approvedBy": "Admin User",
        "approvalDate": "2025-10-31",
        "notes": "Biology lab experiment",
        "createdAt": "2025-10-31T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 2,
      "pages": 1
    }
  }
}
```

---

### 10. Get All Requests (Admin)
**Endpoint:** `GET /api/requests`
**Authentication:** Required (Admin only)
**Description:** Get all borrow requests (admin view)

**Query Parameters (Optional):**
- `status` (string): Filter by status (pending, approved, rejected, returned)
- `studentName` (string): Search by student name
- `equipmentName` (string): Search by equipment name
- `studentId` (string): Filter by student ID
- `page` (number): Pagination page number (default: 1)
- `limit` (number): Items per page (default: 10)

**Example Request:**
```
GET /api/requests?status=pending&page=1&limit=10
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "All requests retrieved successfully",
  "data": {
    "requests": [
      {
        "id": "60d5ec49c1234567890abce0",
        "studentName": "John Student",
        "studentId": "60d5ec49c1234567890abcde",
        "studentEmail": "student@example.com",
        "equipmentName": "Basketball Set",
        "equipmentId": "60d5ec49c1234567890abcdf",
        "borrowFromDate": "2025-11-05",
        "borrowToDate": "2025-11-10",
        "requestedDate": "2025-11-02",
        "status": "pending",
        "purpose": "Sports practice and tournament",
        "createdAt": "2025-11-02T15:45:00Z",
        "approvalDate": null,
        "approvedBy": null,
        "notes": null
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 7,
      "pages": 1
    }
  }
}
```

---

### 11. Approve Borrow Request
**Endpoint:** `POST /api/requests/:requestId/approve`
**Authentication:** Required (Admin only)
**Description:** Approve a pending borrow request

**Path Parameters:**
- `requestId` (string, required): Request ID

**Request Body:**
```json
{
  "approvedBy": "60d5ec49c1234567890abe00",
  "approvalDate": "2025-11-02",
  "notes": "Approved - equipment available"
}
```

**Parameters:**
- `approvedBy` (string, required): Admin user ID
- `approvalDate` (date, required): Approval date (YYYY-MM-DD)
- `notes` (string, optional): Admin notes/comments

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Request approved successfully",
  "data": {
    "id": "60d5ec49c1234567890abce0",
    "status": "approved",
    "approvedBy": "60d5ec49c1234567890abe00",
    "approvalDate": "2025-11-02",
    "notes": "Approved - equipment available"
  }
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "message": "Request is not in pending status"
}
```

---

### 12. Reject Borrow Request
**Endpoint:** `POST /api/requests/:requestId/reject`
**Authentication:** Required (Admin only)
**Description:** Reject a pending borrow request

**Path Parameters:**
- `requestId` (string, required): Request ID

**Request Body:**
```json
{
  "rejectedBy": "60d5ec49c1234567890abe00",
  "rejectionDate": "2025-11-02",
  "reason": "Equipment currently unavailable"
}
```

**Parameters:**
- `rejectedBy` (string, required): Admin user ID
- `rejectionDate` (date, required): Rejection date (YYYY-MM-DD)
- `reason` (string, required): Reason for rejection

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Request rejected successfully",
  "data": {
    "id": "60d5ec49c1234567890abce0",
    "status": "rejected",
    "rejectedBy": "60d5ec49c1234567890abe00",
    "rejectionDate": "2025-11-02",
    "reason": "Equipment currently unavailable"
  }
}
```

---

### 13. Mark Equipment as Returned
**Endpoint:** `POST /api/requests/:requestId/return`
**Authentication:** Required (Admin only)
**Description:** Mark borrowed equipment as returned

**Path Parameters:**
- `requestId` (string, required): Request ID

**Request Body:**
```json
{
  "returnDate": "2025-11-10",
  "condition": "Good",
  "notes": "Equipment returned in good condition"
}
```

**Parameters:**
- `returnDate` (date, required): Actual return date (YYYY-MM-DD)
- `condition` (string, required): Equipment condition (Excellent, Good, Fair, Poor)
- `notes` (string, optional): Return notes/comments

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Equipment marked as returned successfully",
  "data": {
    "id": "60d5ec49c1234567890abce0",
    "status": "returned",
    "returnDate": "2025-11-10",
    "condition": "Good",
    "notes": "Equipment returned in good condition"
  }
}
```

---

## 📊 Admin Dashboard Endpoints

### 14. Get Dashboard Statistics
**Endpoint:** `GET /api/admin/stats`
**Authentication:** Required (Admin only)
**Description:** Get system statistics for admin dashboard

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Statistics retrieved successfully",
  "data": {
    "stats": {
      "totalEquipment": 45,
      "availableEquipment": 32,
      "borrowedEquipment": 13,
      "pendingRequests": 7,
      "totalUsers": 156,
      "activeLoans": 13,
      "approvedThisMonth": 34,
      "returnedThisMonth": 28
    }
  }
}
```

---

### 15. Get Admin Dashboard Data
**Endpoint:** `GET /api/admin/dashboard`
**Authentication:** Required (Admin only)
**Description:** Get comprehensive dashboard data with recent requests

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Dashboard data retrieved successfully",
  "data": {
    "stats": {
      "totalEquipment": 45,
      "availableEquipment": 32,
      "borrowedEquipment": 13,
      "pendingRequests": 7,
      "totalUsers": 156,
      "activeLoans": 13
    },
    "recentRequests": [
      {
        "id": "60d5ec49c1234567890abce0",
        "studentName": "John Student",
        "studentId": "STU001",
        "equipmentName": "Basketball Set",
        "requestedDate": "2025-11-02",
        "status": "pending"
      }
    ],
    "pendingCount": 7
  }
}
```

---

## 🔄 Request Status Workflow

```
pending → approved → returned (COMPLETED)
   ↓
   rejected (REJECTED - CLOSED)
```

**Status Definitions:**
- **pending**: Request submitted, awaiting admin approval
- **approved**: Admin approved, equipment ready to be issued
- **returned**: Equipment returned by student, request closed
- **rejected**: Admin rejected the request, closed without issuing equipment

---

## 📊 Data Models

### Equipment Model
```json
{
  "_id": "ObjectId",
  "name": "String",
  "category": "String",
  "description": "String",
  "condition": "String",
  "quantity": "Number",
  "available": "Number",
  "location": "String",
  "image": "String (URL)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### User Model
```json
{
  "_id": "ObjectId",
  "name": "String",
  "email": "String",
  "password": "String (hashed)",
  "role": "String (student/staff/admin)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Request Model
```json
{
  "_id": "ObjectId",
  "studentId": "ObjectId (ref: User)",
  "studentName": "String",
  "studentEmail": "String",
  "equipmentId": "ObjectId (ref: Equipment)",
  "equipmentName": "String",
  "borrowFromDate": "Date",
  "borrowToDate": "Date",
  "requestedDate": "Date",
  "status": "String (pending/approved/rejected/returned)",
  "approvedBy": "ObjectId (ref: User)",
  "approvalDate": "Date",
  "returnDate": "Date",
  "condition": "String",
  "notes": "String",
  "reason": "String (for rejection)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

---

## 🏷️ Valid Values

### Equipment Categories
- Sports
- Lab
- Camera
- Musical
- Computing
- Tools
- Other

### Equipment Conditions
- Excellent
- Good
- Fair
- Poor

### User Roles
- student
- staff
- admin

### Request Status
- pending
- approved
- rejected
- returned

---

## 🔐 Authorization Rules

| Endpoint | Student | Staff | Admin |
|----------|---------|-------|-------|
| GET /api/equipment | ✅ | ✅ | ✅ |
| POST /api/equipment | ❌ | ❌ | ✅ |
| PUT /api/equipment/:id | ❌ | ❌ | ✅ |
| DELETE /api/equipment/:id | ❌ | ❌ | ✅ |
| POST /api/requests/create | ✅ | ✅ | ❌ |
| GET /api/requests/user/:userId | ✅ | ✅ | ✅ |
| GET /api/requests | ❌ | ❌ | ✅ |
| POST /api/requests/:id/approve | ❌ | ❌ | ✅ |
| POST /api/requests/:id/reject | ❌ | ❌ | ✅ |
| POST /api/requests/:id/return | ❌ | ❌ | ✅ |
| GET /api/admin/stats | ❌ | ❌ | ✅ |
| GET /api/admin/dashboard | ❌ | ❌ | ✅ |

---

## ⚠️ Error Handling

### Standard Error Responses

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Invalid request parameters",
  "errors": {
    "field_name": "Field is required"
  }
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Unauthorized - Please login"
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "message": "Access denied - Insufficient permissions"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## 🔑 Key Implementation Notes

1. **JWT Tokens:**
   - Implement JWT authentication
   - Token should include userId, email, role
   - Token expires in 24 hours
   - Token refresh mechanism (optional)

2. **Password Security:**
   - Hash passwords using bcrypt (salt rounds: 10)
   - Never return passwords in responses
   - Implement password validation rules

3. **Date Format:**
   - Use ISO 8601 format (YYYY-MM-DD)
   - Store all times in UTC

4. **Validation:**
   - Validate all input data
   - Check email format
   - Verify date logic (return date > borrow date)
   - Ensure quantity > 0 and available >= 0

5. **Database Indexes:**
   - Create indexes on userId, equipmentId, status
   - Create unique index on email (users)

6. **Pagination:**
   - Implement limit and page parameters
   - Return total count and page count
   - Default limit: 10, max limit: 100

7. **CORS:**
   - Enable CORS for frontend (http://localhost:3000)
   - Set appropriate headers

8. **Rate Limiting:**
   - Implement rate limiting for login endpoint
   - Limit requests per IP per minute

---

## 📝 Example Flow

### Complete Borrow Request Flow:
1. Student calls `POST /api/requests/create` → Status: pending
2. Admin views request at `GET /api/requests`
3. Admin calls `POST /api/requests/:id/approve` → Status: approved
4. Admin calls `POST /api/requests/:id/return` → Status: returned
5. Student views history at `GET /api/requests/user/:userId`

---

## 🚀 Getting Started

**Backend Team Should:**
1. Set up Node.js project with Express
2. Set up MongoDB database
3. Implement all endpoints as specified
4. Test each endpoint with Postman
5. Ensure error handling for all cases
6. Implement JWT authentication
7. Add input validation
8. Set up CORS headers

---

## 📞 Questions?

If backend team has questions:
- Refer to the Data Models section
- Check the Authorization Rules table
- Review Example Flow section
- Ensure response format matches specification