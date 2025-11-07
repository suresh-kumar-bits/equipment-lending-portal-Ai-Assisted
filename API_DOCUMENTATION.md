## Login API Endpoint

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "student" | "staff" | "admin"
}
```

**Response (Success):**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "student"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

## Get All Equipment API Endpoint

**Endpoint:** `GET /api/equipment`

**Response (Success):**
```json
{
  "success": true,
  "equipment": [
    {
      "id": "equip_001",
      "name": "Basketball Set",
      "category": "Sports",
      "description": "Professional basketball set with 5 balls",
      "condition": "Good",
      "quantity": 5,
      "available": 3,
      "image": "url_to_image.jpg"
    },
    ...
  ]
}
```

## Create Borrow Request API Endpoint

**Endpoint:** `POST /api/requests/create`

**Request Body:**
```json
{
  "studentId": "user_id",
  "studentName": "John Doe",
  "equipmentId": "equip_001",
  "equipmentName": "Basketball Set",
  "borrowDate": "2025-11-02",
  "requestDate": "2025-11-02",
  "status": "pending"
}
```

**Response (Success):**
```json
{
  "success": true,
  "requestId": "req_001",
  "message": "Borrow request submitted successfully"
}
```

## Get Borrow Requests API Endpoint

**Endpoint:** `GET /api/requests/user/:userId`

**Response (Success):**
```json
{
  "success": true,
  "requests": [
    {
      "id": "req_001",
      "equipmentName": "Basketball Set",
      "borrowDate": "2025-11-01",
      "returnDate": "2025-11-05",
      "requestedDate": "2025-10-31",
      "status": "approved",
      "approvedBy": "Admin User",
      "notes": "Return in good condition"
    }
  ]
}
```

## Approve/Reject Borrow Request API Endpoints

**Endpoint 1 - Approve:** `POST /api/requests/:requestId/approve`

**Request Body:**
```json
{
  "approvedBy": "admin_user_id",
  "approvalDate": "2025-11-02",
  "notes": "Equipment available"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Request approved successfully",
  "request": { "id": "req_001", "status": "approved" }
}
```

**Endpoint 2 - Reject:** `POST /api/requests/:requestId/reject`

**Request Body:**
```json
{
  "rejectedBy": "admin_user_id",
  "rejectionDate": "2025-11-02",
  "reason": "Equipment currently unavailable"
}
```

## Equipment Management API Endpoints

**Endpoint 1 - Get All Equipment:** `GET /api/equipment`

**Response:**
```json
{
  "success": true,
  "equipment": [
    {
      "id": "equip_001",
      "name": "Basketball Set",
      "category": "Sports",
      "description": "Professional basketball set",
      "condition": "Good",
      "quantity": 5,
      "available": 3,
      "location": "Sports Room A"
    }
  ]
}
```

**Endpoint 2 - Add Equipment:** `POST /api/equipment`

**Request Body:**
```json
{
  "name": "Basketball Set",
  "category": "Sports",
  "description": "Professional basketball set",
  "condition": "Good",
  "quantity": 5,
  "available": 3,
  "location": "Sports Room A"
}
```

**Endpoint 3 - Update Equipment:** `PUT /api/equipment/:id`

**Endpoint 4 - Delete Equipment:** `DELETE /api/equipment/:id`