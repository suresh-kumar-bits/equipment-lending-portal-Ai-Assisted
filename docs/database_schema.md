# Database Schema Documentation

## Models Overview

### Equipment Model
```javascript
{
  _id: ObjectId,                  // Auto-generated MongoDB ID
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['sports', 'lab', 'camera', 'musical', 'tools', 'computing', 'other']
  },
  description: {
    type: String,
    required: true,
    maxLength: 500
  },
  condition: {
    type: String,
    required: true,
    enum: ['Excellent', 'Good', 'Fair', 'Poor']
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: Number.isInteger,
      message: 'Quantity must be a whole number'
    }
  },
  available: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: Number.isInteger,
      message: 'Available quantity must be a whole number'
    }
  },
  image: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

### User Model
```javascript
{
  _id: ObjectId,                  // Auto-generated MongoDB ID
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minLength: 6
  },
  role: {
    type: String,
    required: true,
    enum: ['student', 'staff', 'admin'],
    default: 'student'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

### Request Model
```javascript
{
  _id: ObjectId,                  // Auto-generated MongoDB ID
  studentId: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  studentEmail: {
    type: String,
    required: true
  },
  equipmentId: {
    type: ObjectId,
    ref: 'Equipment',
    required: true
  },
  equipmentName: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    validate: {
      validator: Number.isInteger,
      message: 'Quantity must be a whole number'
    }
  },
  borrowFromDate: {
    type: Date,
    required: true
  },
  borrowToDate: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        return value > this.borrowFromDate;
      },
      message: 'Return date must be after borrow date'
    }
  },
  requestedDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'returned'],
    default: 'pending'
  },
  notes: {
    type: String,
    required: true,
    maxLength: 500
  },
  approvedBy: {
    type: ObjectId,
    ref: 'User',
    default: null
  },
  approvedByName: {
    type: String,
    default: null
  },
  approvalDate: {
    type: Date,
    default: null
  },
  approvalNotes: {
    type: String,
    maxLength: 300,
    default: null
  },
  rejectionReason: {
    type: String,
    maxLength: 300,
    default: null
  },
  actualReturnDate: {
    type: Date,
    default: null
  },
  returnedCondition: {
    type: String,
    enum: ['Excellent', 'Good', 'Fair', 'Poor', null],
    default: null
  },
  returnNotes: {
    type: String,
    maxLength: 300,
    default: null
  }
}
```

## Indexes

### Equipment Collection
```javascript
{
  'name': 1,              // For searching equipment by name
  'category': 1,          // For filtering by category
  'available': 1          // For filtering available equipment
}
```

### User Collection
```javascript
{
  'email': 1,             // Unique index for user lookup
  'role': 1              // For filtering users by role
}
```

### Request Collection
```javascript
{
  'studentId': 1,         // For finding user's requests
  'equipmentId': 1,       // For finding equipment requests
  'status': 1,           // For filtering by status
  'borrowFromDate': 1,    // For date-based queries
  'borrowToDate': 1       // For date-based queries
}
```

## Relations

1. Request → User (studentId)
   - Each request belongs to a student/staff user
   - Used for tracking who made the request

2. Request → Equipment (equipmentId)
   - Each request is for a specific equipment
   - Used for tracking what was requested

3. Request → User (approvedBy)
   - Each approved request links to the admin who approved it
   - Used for tracking who approved the request

## Validation Rules

### Equipment
- Quantity must be a non-negative integer
- Available must be less than or equal to quantity
- Category must be from predefined list
- Condition must be from predefined list

### User
- Email must be unique and valid format
- Password must be at least 6 characters
- Role must be from predefined list

### Request
- Return date must be after borrow date
- Quantity must be positive integer
- Status transitions must follow workflow:
  - pending → approved/rejected
  - approved → returned
  - rejected (terminal state)
  - returned (terminal state)