# 📚 School Equipment Lending Portal

A comprehensive web application for managing school equipment inventory and facilitating equipment borrowing requests. The system streamlines the process of equipment management, request approval, and borrowing history tracking.

---

## 🎯 Project Overview

The **Equipment Lending Portal** is a full-stack web application designed to help schools efficiently manage their equipment inventory and handle borrowing requests from students and staff. The system provides role-based access control for administrators, staff, and students with different capabilities for each user type.

### Key Objectives
- ✅ Centralize equipment inventory management
- ✅ Simplify equipment borrowing process
- ✅ Track equipment availability in real-time
- ✅ Maintain complete borrowing history
- ✅ Enable admin approval workflow
- ✅ Improve equipment utilization

---

## 🌟 Features

### For Students/Staff
- 🔐 Secure user authentication with JWT tokens
- 📦 Browse available equipment with filters
- 🔍 Search equipment by name or category
- 📝 Submit equipment borrow requests
- 📅 Select custom borrow date ranges
- 📋 View complete borrow history
- 📊 Track request status (Pending, Approved, Rejected, Returned)

### For Administrators
- 🛠️ Full equipment CRUD operations (Create, Read, Update, Delete)
- 📊 Real-time dashboard with statistics
- ✅ Approve/Reject borrow requests
- ↩️ Mark equipment as returned
- 🔍 View and filter all borrowing requests
- 📈 Monitor equipment availability
- 👥 Track user activities

### Core Capabilities
- 🔐 Role-based access control (Admin, Staff, Student)
- 💾 Persistent user sessions (localStorage)
- 📱 Responsive design for all devices
- ⚡ Real-time data updates
- 🎨 Clean and intuitive user interface
- 📡 RESTful API architecture

---

## 🏗️ Technology Stack

### Frontend
- **Framework:** React.js
- **Routing:** React Router v6
- **HTTP Client:** Fetch API
- **Styling:** Bootstrap 5, CSS
- **State Management:** React Hooks (useState, useEffect)
- **Icons:** Font Awesome

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Password Security:** bcryptjs
- **Environment:** dotenv

### Tools & Technologies
- Git & GitHub (Version Control)
- Postman (API Testing)
- MongoDB Compass (Database Management)

---

## 📁 Project Structure

```
equipment-lending-portal/
│
├── frontend/                          # React Frontend
│   ├── src/
│   │   ├── components/               # Reusable components
│   │   │   ├── Navbar.js
│   │   │   ├── LoginForm.js
│   │   │   └── EquipmentCard.js
│   │   │
│   │   ├── pages/                    # Page components
│   │   │   ├── StudentDashboard.js
│   │   │   ├── AdminDashboard.js
│   │   │   ├── EquipmentManagement.js
│   │   │   ├── RequestsManagement.js
│   │   │   ├── BorrowEquipment.js
│   │   │   └── BorrowHistory.js
│   │   │
│   │   ├── services/
│   │   │   └── api.js               # Centralized API service
│   │   │
│   │   ├── App.js                   # Main app component
│   │   └── index.js
│   │
│   └── package.json
│
├── backend/                           # Express Backend
│   ├── src/
│   │   ├── models/                  # Database schemas
│   │   │   ├── User.js
│   │   │   ├── Equipment.js
│   │   │   └── Request.js
│   │   │
│   │   ├── controllers/             # Business logic
│   │   │   ├── authController.js
│   │   │   ├── equipmentController.js
│   │   │   └── requestController.js
│   │   │
│   │   ├── routes/                  # API endpoints
│   │   │   ├── authRoutes.js
│   │   │   ├── equipmentRoutes.js
│   │   │   └── requestRoutes.js
│   │   │
│   │   ├── middleware/              # Custom middleware
│   │   │   └── authMiddleware.js
│   │   │
│   │   ├── scripts/
│   │   │   └── seedDatabase.js     # Database seeding
│   │   │
│   │   └── server.js               # Main server file
│   │
│   ├── .env                         # Environment variables
│   └── package.json
│
├── README.md                         # This file
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (Local or Atlas)
- Git
- Web Browser (Chrome, Firefox, Edge)

### Installation

#### 1. Clone Repository
```bash
git clone https://github.com/yourusername/equipment-lending-portal.git
cd equipment-lending-portal
```

#### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create .env file
# Add the following variables:
# MONGODB_URI=mongodb://localhost:27017/equipment-portal
# JWT_SECRET=your_secret_key_here
# PORT=5000
# CORS_ORIGIN=http://localhost:3000

# Seed database with test data
node src/scripts/seedDatabase.js

# Start backend server
npm start
# Backend runs on http://localhost:5000
```

#### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start React development server
npm start
# Frontend runs on http://localhost:3000
```

---

## 🔑 Test Credentials

### Admin User
- **Email:** admin@example.com
- **Password:** password123
- **Role:** Administrator

### Staff User
- **Email:** staff@example.com
- **Password:** password123
- **Role:** Staff Member

### Student Users
- **Email:** student@example.com
- **Password:** password123
- **Email:** jane.smith@example.com
- **Password:** password123

---

## 📚 API Documentation

### Authentication Endpoints
```
POST   /api/auth/login              Login user
POST   /api/auth/register           Register new user
GET    /api/auth/me                 Get current user profile
```

### Equipment Endpoints
```
GET    /api/equipment               Get all equipment
GET    /api/equipment/:id           Get single equipment
POST   /api/equipment               Create equipment (Admin)
PUT    /api/equipment/:id           Update equipment (Admin)
DELETE /api/equipment/:id           Delete equipment (Admin)
GET    /api/equipment/stats         Get equipment statistics (Admin)
```

### Request Endpoints
```
POST   /api/requests/create         Create borrow request
GET    /api/requests/user/:userId   Get user's requests
GET    /api/requests                Get all requests (Admin)
POST   /api/requests/:id/approve    Approve request (Admin)
POST   /api/requests/:id/reject     Reject request (Admin)
POST   /api/requests/:id/return     Mark as returned (Admin)
GET    /api/requests/admin/stats    Get admin statistics
```

---

## 🔐 Security Features

### Authentication
- JWT-based authentication
- Secure password hashing with bcryptjs
- Token stored in localStorage
- Automatic token expiration (24 hours)

### Authorization
- Role-based access control (RBAC)
- Protected API endpoints
- Protected frontend routes
- Protected database operations

### Validation
- Server-side form validation
- Email format validation
- Date range validation
- Quantity constraints validation

---

## 📊 User Roles & Permissions

### Admin
- ✅ Add, edit, delete equipment
- ✅ View all users
- ✅ View all borrow requests
- ✅ Approve/reject requests
- ✅ Mark equipment as returned
- ✅ View statistics dashboard

### Staff
- ✅ Browse equipment
- ✅ Create borrow requests
- ✅ View own borrow history
- ❌ Cannot manage equipment
- ❌ Cannot approve requests

### Student
- ✅ Browse equipment
- ✅ Create borrow requests
- ✅ View own borrow history
- ❌ Cannot manage equipment
- ❌ Cannot approve requests

---

## 🧪 Testing

A comprehensive testing document is provided with 12 test categories and 50+ test cases covering:
- Authentication and authorization
- Equipment management
- Borrow request creation and approval
- Equipment browsing and filtering
- Dashboard statistics
- Role-based access control
- Data validation
- UI/UX functionality

See `TESTING.md` for complete testing documentation.

---

## 🐛 Known Issues & Limitations

### Current Limitations
- No email notifications yet
- No advanced reporting features
- No mobile app version
- Single file uploads not supported
- No payment integration

### Future Enhancements
- [ ] Email notifications for approval/rejection
- [ ] SMS alerts for due dates
- [ ] Advanced reporting and analytics
- [ ] Mobile app (iOS/Android)
- [ ] Equipment damage reporting
- [ ] User rating system
- [ ] Equipment maintenance tracking
- [ ] Multi-language support

---

## 📖 Usage Examples

### Login as Student
1. Navigate to http://localhost:3000
2. Enter: student@example.com / password123
3. Select Role: Student
4. Click Sign In

### Browse Equipment
1. Go to Student Dashboard
2. Use search to find equipment
3. Filter by category or availability
4. View equipment details

### Request Equipment
1. Click "Borrow Equipment" in navbar
2. Select equipment from dropdown
3. Choose borrow and return dates
4. Enter purpose
5. Submit request

### Approve Request (Admin)
1. Login as admin
2. Go to Admin Dashboard
3. View pending requests
4. Click "Approve" button
5. Confirm action

---

## 🤝 Contributing

### Code Standards
- Follow existing code style
- Add comments for complex logic
- Test changes before submitting
- Update documentation

### Pull Request Process
1. Create a new branch
2. Make your changes
3. Test thoroughly
4. Submit PR with description
5. Wait for review and merge

---

## 📝 Environment Variables

### Backend (.env)
```
# MongoDB
MONGODB_URI=mongodb://localhost:27017/equipment-portal

# JWT
JWT_SECRET=your_super_secret_key_change_this

# Server
PORT=5000

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env - optional)
```
REACT_APP_API_URL=http://localhost:5000
```

---

## 📞 Support & Troubleshooting

### Common Issues

**Q: Backend not connecting to MongoDB**
- A: Ensure MongoDB is running and connection string is correct

**Q: Frontend can't connect to backend**
- A: Check CORS settings and ensure backend is running on port 5000

**Q: Can't login with test credentials**
- A: Run `node src/scripts/seedDatabase.js` to populate test users

**Q: Tokens not persisting**
- A: Check localStorage is enabled in browser

### Contact
For issues or questions:
1. Check documentation
2. Review test cases
3. Check browser console (F12)
4. Report issues with details

---

## 📄 License

This project is for educational purposes. All rights reserved.

---

## 👥 Team

**Project Lead:** Development Team  
**QA Team:** Testing Team  
**Version:** 1.0  
**Release Date:** November 2025

---

## 🙏 Acknowledgments

- Built with React and Node.js
- Database: MongoDB
- UI Framework: Bootstrap 5
- Icons: Font Awesome

---

## 📞 Contact Information

**Project Repository:**  [https://github.com/suresh-kumar-bits/equipment-lending-portal](https://github.com/suresh-kumar-bits/equipment-lending-portal)

**Documentation:** See README.md and testing_document.md  
**Issue Tracker:** GitHub Issues  

---

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Manual](https://docs.mongodb.com)
- [JWT Authentication](https://jwt.io)
- [REST API Best Practices](https://restfulapi.net)

---

**Last Updated:** November 2025  
**Status:** Production Ready  
**Maintenance:** Active