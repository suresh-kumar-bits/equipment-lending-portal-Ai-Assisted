# Frontend Component Hierarchy Documentation

## Component Structure

```
App.js
├── Navbar.js
├── LoginForm.js
├── SignupForm.js
├── Pages
│   ├── StudentDashboard.js
│   │   ├── EquipmentCard.js
│   │   └── EquipmentGrid.js
│   ├── AdminDashboard.js
│   │   ├── StatsCards.js
│   │   └── PendingRequests.js
│   ├── BorrowEquipment.js
│   ├── BorrowHistory.js
│   ├── EquipmentManagement.js
│   └── RequestsManagement.js
├── Components
│   ├── EquipmentCard.js
│   ├── LoginForm.js
│   ├── Navbar.js
│   ├── ProtectedRoute.js
│   └── RequestForm.js
└── Services
    └── api.js
```

## Component Details

### App.js (Root Component)
- Main application container
- Manages routing and authentication state
- Handles user session persistence
- Props: None
- State:
  - user (current logged-in user)
  - loading (authentication loading state)

### Navbar.js
- Navigation bar component
- Shows different options based on user role
- Props:
  - user: Current user object
  - onLogout: Logout handler function
- State: None

### Pages

#### StudentDashboard.js
- Dashboard for students/staff
- Shows available equipment
- Allows equipment borrowing
- Props:
  - user: Current user object
- State:
  - equipment: List of available equipment
  - filteredEquipment: Filtered equipment list
  - searchTerm: Search input value
  - selectedCategory: Filter category
  - selectedAvailability: Filter availability
  - borrowModal: Borrow modal state

#### AdminDashboard.js
- Dashboard for administrators
- Shows system statistics
- Lists pending requests
- Props:
  - user: Current user object
- State:
  - stats: System statistics
  - requests: Pending requests list
  - loading: Loading states
  - error: Error states

#### RequestsManagement.js
- Manages all equipment requests
- Shows request details and status
- Allows request approval/rejection
- Props:
  - user: Current user object
- State:
  - requests: All requests list
  - filterStatus: Current filter status
  - searchTerm: Search input value
  - actionModal: Action modal state

#### BorrowEquipment.js
- Equipment borrowing form
- Handles new borrow requests
- Props:
  - user: Current user object
- State:
  - formData: Borrow request form data
  - errors: Form validation errors
  - loading: Loading state
  - equipment: Available equipment list

### Components

#### EquipmentCard.js
- Displays single equipment item
- Shows equipment details and status
- Props:
  - equipment: Equipment item data
  - onBorrow: Borrow handler function
  - userRole: Current user role
- State: None

#### LoginForm.js
- User login form
- Handles authentication
- Props:
  - onLogin: Login success handler
- State:
  - formData: Login form data
  - errors: Validation errors
  - loading: Loading state

#### ProtectedRoute.js
- Route protection component
- Handles authentication checks
- Props:
  - user: Current user
  - allowedRoles: Array of allowed roles
  - children: Protected components
- State: None

## State Management

### Global State (App.js)
- User authentication state
- Session persistence
- Role-based access control

### Local State
- Component-specific form data
- UI state (modals, loading, errors)
- Filter/search states
- Pagination states

### API Integration (api.js)
- Centralized API calls
- Authentication token management
- Error handling
- Request/response interceptors

## Component Communication

### Parent → Child
- Props passing for data
- Event handler functions
- Configuration options

### Child → Parent
- Event callbacks
- Form submissions
- State updates

### Sibling Components
- Through parent state
- Through context (if needed)
- Through service functions

## Data Flow

1. Authentication Flow:
```
LoginForm → App.js → api.js → Backend
↳ Updates global user state
↳ Updates localStorage
```

2. Equipment Borrowing Flow:
```
EquipmentCard → StudentDashboard → api.js → Backend
↳ Updates equipment availability
↳ Updates requests list
```

3. Request Management Flow:
```
RequestsManagement → api.js → Backend
↳ Updates request status
↳ Updates equipment availability
```

## Error Handling

### Global Error Handling
- API error interceptors
- Authentication errors
- Network errors

### Component-Level Error Handling
- Form validation errors
- API request errors
- State update errors

## Loading States

### Global Loading
- Initial authentication check
- Route transitions

### Component Loading
- Data fetching
- Form submissions
- Action processing

## Responsive Design

All components are responsive using:
- Bootstrap Grid System
- Flexbox layouts
- Media queries
- Mobile-first approach