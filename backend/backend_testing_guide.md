# Backend Testing Guide - School Equipment Lending Portal

## 🎯 Overview

This guide will help you test all backend API endpoints using **Postman** or **Thunder Client**.

**Base URL:** `http://localhost:5000/api`

---

## 🚀 **Start Your Backend Server**

Before testing, make sure your server is running:

```bash
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on http://localhost:5000
```

---

## 🧪 **Testing Tools**

### **Option 1: Thunder Client (In VS Code)**
1. Open VS Code
2. Click Thunder Client icon (left sidebar)
3. Click "New Request"
4. Ready to test!

### **Option 2: Postman**
1. Download from https://www.postman.com/downloads/
2. Open Postman
3. Click "New Request"
4. Ready to test!

---

## 📋 **Test Cases - Step by Step**

### ⚠️ **IMPORTANT NOTES:**

1. **Save the JWT token** from login response - you'll need it for other requests
2. **In Thunder Client/Postman headers**, add:
   ```
   Authorization: Bearer <your_jwt_token>
   ```
3. Replace `<token>` with actual token from login response

---

## 🔐 **1. Authentication Endpoints**

### **1.1 Login User**

**Endpoint:** `POST http://localhost:5000/api/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body (Raw JSON):**
```json
{
  "email": "admin@example.com",
  "password": "password123",
  "role": "admin"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "xxx",
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "admin"
    }
  }
}
```

**⚠️ ACTION:** Copy the token and save it for other requests!

---

### **1.2 Register New User**

**Endpoint:** `POST http://localhost:5000/api/auth/register`

**Headers:**
```
Content-Type: application/json
```

**Body (Raw JSON):**
```json
{
  "name": "John Student",
  "email": "newstudent@example.com",
  "password": "password123",
  "role": "student"
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "xxx",
      "name": "John Student",
      "email": "newstudent@example.com",
      "role": "student"
    }
  }
}
```

---

### **1.3 Get Current User Profile**

**Endpoint:** `GET http://localhost:5000/api/auth/me`

**Headers:**
```
Authorization: Bearer <your_token_from_login>
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "User profile retrieved",
  "data": {
    "user": {
      "_id": "xxx",
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "admin"
    }
  }
}
```

---

## 📦 **2. Equipment Endpoints**

### **2.1 Get All Equipment**

**Endpoint:** `GET http://localhost:5000/api/equipment`

**Headers:**
```
Authorization: Bearer <your_token>
```

**Query Parameters (Optional):**
```
?search=basketball&category=Sports&availability=available&page=1&limit=10
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Equipment retrieved successfully",
  "data": {
    "equipment": [
      {
        "_id": "xxx",
        "name": "Basketball Set",
        "category": "Sports",
        "description": "Professional basketball set with 5 balls",
        "condition": "Good",
        "quantity": 5,
        "available": 3,
        "location": "Sports Room A"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "pages": 1
    }
  }
}
```

---

### **2.2 Get Single Equipment**

**Endpoint:** `GET http://localhost:5000/api/equipment/<equipment_id>`

**Headers:**
```
Authorization: Bearer <your_token>
```

Replace `<equipment_id>` with actual equipment ID

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Equipment retrieved successfully",
  "data": {
    "equipment": {
      "_id": "xxx",
      "name": "Basketball Set",
      "category": "Sports",
      "description": "Professional basketball set",
      "condition": "Good",
      "quantity": 5,
      "available": 3,
      "location": "Sports Room A"
    }
  }
}
```

---

### **2.3 Add New Equipment (Admin)**

**Endpoint:** `POST http://localhost:5000/api/equipment`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <admin_token>
```

**Body (Raw JSON):**
```json
{
  "name": "Volleyball Set",
  "category": "Sports",
  "description": "Professional volleyball set with net",
  "condition": "Good",
  "quantity": 4,
  "available": 4,
  "location": "Sports Room B"
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Equipment added successfully",
  "data": {
    "equipment": {
      "_id": "xxx",
      "name": "Volleyball Set",
      "category": "Sports",
      "quantity": 4,
      "available": 4
    }
  }
}
```

---

### **2.4 Update Equipment (Admin)**

**Endpoint:** `PUT http://localhost:5000/api/equipment/<equipment_id>`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <admin_token>
```

**Body (Raw JSON):**
```json
{
  "name": "Volleyball Set",
  "category": "Sports",
  "description": "Professional volleyball set with net and stand",
  "condition": "Good",
  "quantity": 4,
  "available": 2,
  "location": "Sports Room B"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Equipment updated successfully",
  "data": {
    "equipment": {
      "_id": "xxx",
      "name": "Volleyball Set",
      "description": "Professional volleyball set with net and stand",
      "available": 2
    }
  }
}
```

---

### **2.5 Delete Equipment (Admin)**

**Endpoint:** `DELETE http://localhost:5000/api/equipment/<equipment_id>`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Equipment deleted successfully",
  "data": {
    "id": "xxx"
  }
}
```

---

### **2.6 Get Equipment Statistics (Admin)**

**Endpoint:** `GET http://localhost:5000/api/equipment/stats`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Equipment statistics retrieved",
  "data": {
    "stats": {
      "totalItems": 5,
      "totalQuantity": 25,
      "totalAvailable": 18,
      "totalBorrowed": 7
    },
    "byCategory": [
      {
        "_id": "Sports",
        "count": 2,
        "totalQuantity": 10,
        "available": 5
      }
    ]
  }
}
```

---

## 📋 **3. Request/Borrow Endpoints**

### **3.1 Create Borrow Request (Student)**

**Endpoint:** `POST http://localhost:5000/api/requests/create`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <student_token>
```

**Body (Raw JSON):**
```json
{
  "studentId": "xxx",
  "studentName": "John Student",
  "studentEmail": "student@example.com",
  "equipmentId": "xxx",
  "equipmentName": "Basketball Set",
  "borrowFromDate": "2025-11-10",
  "borrowToDate": "2025-11-15",
  "notes": "Sports tournament practice"
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Borrow request submitted successfully",
  "data": {
    "requestId": "xxx",
    "status": "pending"
  }
}
```

---

### **3.2 Get User's Requests**

**Endpoint:** `GET http://localhost:5000/api/requests/user/<user_id>`

**Headers:**
```
Authorization: Bearer <user_token>
```

**Query Parameters (Optional):**
```
?status=pending&page=1&limit=10
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "User requests retrieved successfully",
  "data": {
    "requests": [
      {
        "_id": "xxx",
        "studentName": "John Student",
        "equipmentName": "Basketball Set",
        "borrowFromDate": "2025-11-10",
        "borrowToDate": "2025-11-15",
        "status": "pending",
        "requestedDate": "2025-11-02"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "pages": 1
    }
  }
}
```

---

### **3.3 Get All Requests (Admin)**

**Endpoint:** `GET http://localhost:5000/api/requests`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters (Optional):**
```
?status=pending&studentName=John&equipmentName=Basketball&page=1&limit=10
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "All requests retrieved successfully",
  "data": {
    "requests": [
      {
        "_id": "xxx",
        "studentName": "John Student",
        "equipmentName": "Basketball Set",
        "status": "pending"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "pages": 1
    }
  }
}
```

---

### **3.4 Approve Request (Admin)**

**Endpoint:** `POST http://localhost:5000/api/requests/<request_id>/approve`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <admin_token>
```

**Body (Raw JSON):**
```json
{
  "approvalNotes": "Approved - equipment available"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Request approved successfully",
  "data": {
    "request": {
      "_id": "xxx",
      "status": "approved",
      "approvalDate": "2025-11-02"
    }
  }
}
```

---

### **3.5 Reject Request (Admin)**

**Endpoint:** `POST http://localhost:5000/api/requests/<request_id>/reject`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <admin_token>
```

**Body (Raw JSON):**
```json
{
  "reason": "Equipment currently unavailable"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Request rejected successfully",
  "data": {
    "request": {
      "_id": "xxx",
      "status": "rejected",
      "rejectionReason": "Equipment currently unavailable"
    }
  }
}
```

---

### **3.6 Mark Equipment as Returned (Admin)**

**Endpoint:** `POST http://localhost:5000/api/requests/<request_id>/return`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <admin_token>
```

**Body (Raw JSON):**
```json
{
  "condition": "Good",
  "returnNotes": "Equipment returned in good condition"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Equipment marked as returned successfully",
  "data": {
    "request": {
      "_id": "xxx",
      "status": "returned",
      "actualReturnDate": "2025-11-15",
      "returnedCondition": "Good"
    }
  }
}
```

---

## 📊 **4. Admin Statistics**

### **4.1 Get Admin Dashboard Statistics (Admin)**

**Endpoint:** `GET http://localhost:5000/api/admin/stats`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Admin statistics retrieved",
  "data": {
    "stats": {
      "totalEquipment": 5,
      "availableEquipment": 18,
      "borrowedEquipment": 7,
      "pendingRequests": 2,
      "totalUsers": 10,
      "userBreakdown": {
        "admin": 1,
        "student": 8,
        "staff": 1
      },
      "requestBreakdown": {
        "pending": 2,
        "approved": 1,
        "rejected": 0,
        "returned": 3
      }
    }
  }
}
```

---

## ✅ **Testing Checklist**

- [ ] **Authentication:**
  - [ ] Login works and returns token
  - [ ] Register creates new user
  - [ ] Get profile works with token

- [ ] **Equipment:**
  - [ ] Get all equipment works
  - [ ] Get single equipment works
  - [ ] Add equipment works (admin)
  - [ ] Update equipment works (admin)
  - [ ] Delete equipment works (admin)
  - [ ] Get stats works (admin)

- [ ] **Requests:**
  - [ ] Create request works (student)
  - [ ] Get user requests works
  - [ ] Get all requests works (admin)
  - [ ] Approve request works (admin)
  - [ ] Reject request works (admin)
  - [ ] Mark returned works (admin)

- [ ] **Admin:**
  - [ ] Get stats works (admin)

---

## 🔑 **Test User Credentials**

If you want to add test users to MongoDB first, here are the default ones:

**Admin:**
- Email: `admin@example.com`
- Password: `password123`
- Role: `admin`

**Student:**
- Email: `student@example.com`
- Password: `password123`
- Role: `student`

**Staff:**
- Email: `staff@example.com`
- Password: `password123`
- Role: `staff`

---

## ❌ **Common Errors & Solutions**

### **401 Unauthorized**
- **Problem:** Token missing or invalid
- **Solution:** Add correct token in Authorization header

### **403 Forbidden**
- **Problem:** User role doesn't have permission
- **Solution:** Use correct user role for endpoint

### **404 Not Found**
- **Problem:** Equipment or request not found
- **Solution:** Use correct ID from database

### **400 Bad Request**
- **Problem:** Missing or invalid fields
- **Solution:** Check request body format matches API spec

---

## 🎯 **Next Steps**

Once all tests pass:
1. ✅ Backend is complete and working
2. ✅ Ready to integrate with frontend
3. ✅ Frontend will replace mock data with real API calls

---

## 📌 **Final Verification**

Run this simple test:

```bash
curl http://localhost:5000/api/test
```

You should see:
```json
{
  "success": true,
  "message": "Backend is working!"
}
```

---

**Your backend is now complete and ready for frontend integration!** 🚀