# Equipment Lending Portal - Complete Testing Document

## Document Information
- **Application Name:** School Equipment Lending Portal
- **Version:** 1.0
- **Date:** November 2025
- **Environment:** Development (Localhost)
- **Frontend URL:** http://localhost:3000
- **Backend URL:** http://localhost:5000

---

## Table of Contents
1. [System Requirements](#system-requirements)
2. [Test Users](#test-users)
3. [Application Overview](#application-overview)
4. [Testing Scope](#testing-scope)
5. [Test Cases](#test-cases)
6. [Bug Reporting](#bug-reporting)

---

## System Requirements

### Browser Requirements
- Chrome/Edge (Latest version)
- Firefox (Latest version)
- Internet connection required
- JavaScript enabled

### Backend Requirements
- Node.js running on `http://localhost:5000`
- MongoDB connected and running
- All environment variables configured (.env file)

### Frontend Requirements
- React app running on `http://localhost:3000`
- All dependencies installed

---

## Test Users

### Admin User
```
Email: admin@example.com
Password: password123
Role: admin
```

### Staff User
```
Email: staff@example.com
Password: password123
Role: staff
```

### Student User
```
Email: student@example.com
Password: password123
Role: student
```

### Additional Test Accounts
```
Student 2: jane.smith@example.com / password123
Lab Assistant: assistant@example.com / password123
```

---

## Application Overview

### Key Features
1. **User Authentication** - Login/Logout with JWT tokens
2. **Equipment Management** - Add, edit, delete equipment
3. **Borrow Requests** - Students request equipment
4. **Request Approval** - Admins approve/reject requests
5. **Borrow History** - View request history
6. **Dashboard** - View statistics and summaries

### User Roles
- **Admin:** Full system access, manage equipment, approve requests
- **Staff:** Borrow equipment, view history (limited access)
- **Student:** Borrow equipment, view history

---

## Testing Scope

### In Scope (What to Test)
- ✅ User login/logout
- ✅ Equipment CRUD operations
- ✅ Borrow request creation
- ✅ Request approval/rejection
- ✅ Equipment filtering and search
- ✅ Dashboard statistics
- ✅ Request history viewing
- ✅ Token persistence on page refresh
- ✅ Role-based access control

### Out of Scope (What NOT to Test)
- ❌ Email notifications
- ❌ Payment processing
- ❌ Advanced reporting features
- ❌ Mobile app

---

## Test Cases

### 1. Authentication Tests

#### TC-1.1: User Login (Valid Credentials)
**Objective:** Verify user can login with valid credentials
**Steps:**
1. Navigate to http://localhost:3000/login
2. Enter Email: `student@example.com`
3. Enter Password: `password123`
4. Select Role: `Student`
5. Click "Sign In"

**Expected Result:**
- ✅ Login successful
- ✅ Redirected to `/student-dashboard`
- ✅ User name displayed in navbar
- ✅ JWT token stored in localStorage

**Status:** Pass/Fail

---

#### TC-1.2: User Login (Invalid Credentials)
**Objective:** Verify login fails with invalid credentials
**Steps:**
1. Navigate to http://localhost:3000/login
2. Enter Email: `student@example.com`
3. Enter Password: `wrongpassword`
4. Select Role: `Student`
5. Click "Sign In"

**Expected Result:**
- ✅ Error message displayed
- ✅ User NOT redirected
- ✅ Stays on login page

**Status:** Pass/Fail

---

#### TC-1.3: User Logout
**Objective:** Verify user can logout successfully
**Steps:**
1. Login as student (see TC-1.1)
2. Click "Logout" button in navbar
3. Confirm logout action

**Expected Result:**
- ✅ User logged out
- ✅ Redirected to login page
- ✅ Token removed from localStorage
- ✅ Cannot access protected pages

**Status:** Pass/Fail

---

#### TC-1.4: Session Persistence on Page Refresh
**Objective:** Verify user stays logged in after page refresh
**Steps:**
1. Login as student
2. Verify you're on student dashboard
3. Press F5 (Refresh page)
4. Wait for page to load

**Expected Result:**
- ✅ Page loads without redirecting to login
- ✅ User remains logged in
- ✅ Dashboard data visible
- ✅ User info in navbar still shows

**Status:** Pass/Fail

---

#### TC-1.5: Protected Route Access
**Objective:** Verify unauthenticated users cannot access protected routes
**Steps:**
1. Logout completely (clear browser storage if needed)
2. Try to access http://localhost:3000/student-dashboard directly
3. Try to access http://localhost:3000/admin-dashboard directly

**Expected Result:**
- ✅ Redirected to login page
- ✅ Cannot access protected routes without login

**Status:** Pass/Fail

---

### 2. Equipment Management Tests (Admin Only)

#### TC-2.1: Admin Add Equipment
**Objective:** Verify admin can add new equipment
**Steps:**
1. Login as admin (admin@example.com)
2. Navigate to Equipment Management
3. Click "Add New Equipment"
4. Fill form:
   - Name: `Basketball`
   - Category: `Sports`
   - Description: `Professional basketball set with 5 balls`
   - Condition: `Good`
   - Total Quantity: `5`
   - Available: `5`
   - Location: `Sports Room A`
5. Click "Add Equipment"

**Expected Result:**
- ✅ Success message displayed
- ✅ Equipment appears in table
- ✅ Can see equipment in list

**Status:** Pass/Fail

---

#### TC-2.2: Admin Edit Equipment
**Objective:** Verify admin can edit existing equipment
**Steps:**
1. Login as admin
2. Go to Equipment Management
3. Click edit (pencil icon) on any equipment
4. Change Available quantity: `4`
5. Click "Update Equipment"

**Expected Result:**
- ✅ Success message displayed
- ✅ Equipment updated in table
- ✅ New values visible in list

**Status:** Pass/Fail

---

#### TC-2.3: Admin Delete Equipment
**Objective:** Verify admin can delete equipment
**Steps:**
1. Login as admin
2. Go to Equipment Management
3. Click delete (trash icon) on any equipment
4. Confirm deletion in modal
5. Click "Delete Equipment"

**Expected Result:**
- ✅ Success message displayed
- ✅ Equipment removed from table
- ✅ No longer visible in list

**Status:** Pass/Fail

---

#### TC-2.4: Equipment Search and Filter
**Objective:** Verify search and filter functionality works
**Steps:**
1. Login as admin
2. Go to Equipment Management
3. Search for `Basketball` in search box
4. Filter by category `Sports`
5. Clear filters

**Expected Result:**
- ✅ Search results filter correctly
- ✅ Category filter works
- ✅ Clear button resets filters

**Status:** Pass/Fail

---

### 3. Student Equipment Browsing Tests

#### TC-3.1: Student View Available Equipment
**Objective:** Verify student can see available equipment
**Steps:**
1. Login as student
2. Go to Student Dashboard
3. Verify equipment list displays

**Expected Result:**
- ✅ Equipment list visible
- ✅ Shows equipment name, category, condition
- ✅ Shows available quantity

**Status:** Pass/Fail

---

#### TC-3.2: Equipment Search and Filter
**Objective:** Verify student can search and filter equipment
**Steps:**
1. Login as student
2. Go to Student Dashboard
3. Search for `Basketball`
4. Filter by `Sports` category
5. Filter by `Available Only`
6. Toggle Grid/List view

**Expected Result:**
- ✅ Search works correctly
- ✅ Category filter works
- ✅ Availability filter works
- ✅ View toggle works
- ✅ Pagination works if many items

**Status:** Pass/Fail

---

### 4. Borrow Request Tests

#### TC-4.1: Student Create Borrow Request (via Dashboard)
**Objective:** Verify student can request equipment from dashboard
**Steps:**
1. Login as student
2. Go to Student Dashboard
3. Click "Borrow" on any equipment
4. Confirm in modal
5. Click "Confirm Request"

**Expected Result:**
- ✅ Success message displayed
- ✅ Request submitted
- ✅ Redirected or modal closes
- ✅ Request appears in admin dashboard

**Status:** Pass/Fail

---

#### TC-4.2: Student Create Borrow Request (via Borrow Equipment Page)
**Objective:** Verify student can request with custom dates
**Steps:**
1. Login as student
2. Click "Borrow Equipment" in navbar
3. Select equipment from dropdown
4. Select Borrow From Date (future date)
5. Select Return By Date (after borrow date)
6. Enter Purpose/Notes
7. Click "Submit Request"
8. Review details in confirmation modal
9. Click "Confirm & Submit"

**Expected Result:**
- ✅ Equipment details display
- ✅ Date picker works
- ✅ Form validation works
- ✅ Confirmation modal shows details
- ✅ Success message displays
- ✅ Redirects to borrow history

**Status:** Pass/Fail

---

#### TC-4.3: Form Validation (Borrow Equipment)
**Objective:** Verify form validation works
**Steps:**
1. Login as student
2. Go to Borrow Equipment page
3. Try to submit without selecting equipment
4. Try dates with return before borrow
5. Try to submit without notes

**Expected Result:**
- ✅ Error messages display
- ✅ Cannot submit invalid form
- ✅ Form prevents invalid submissions

**Status:** Pass/Fail

---

### 5. Admin Request Management Tests

#### TC-5.1: Admin View Pending Requests
**Objective:** Verify admin can see pending requests
**Steps:**
1. Login as admin
2. Go to Admin Dashboard
3. View "Pending Requests" section
4. Verify requests from students are visible

**Expected Result:**
- ✅ Pending requests display
- ✅ Student name visible
- ✅ Equipment name visible
- ✅ Request date visible
- ✅ Action buttons available

**Status:** Pass/Fail

---

#### TC-5.2: Admin Approve Request
**Objective:** Verify admin can approve requests
**Steps:**
1. Login as admin
2. Go to Admin Dashboard or Requests Management page
3. Click "Approve" on pending request
4. Confirm action in modal
5. Click "Approve"

**Expected Result:**
- ✅ Success message displayed
- ✅ Request status changes to "Approved"
- ✅ Removed from pending list
- ✅ Appears in requests management page

**Status:** Pass/Fail

---

#### TC-5.3: Admin Reject Request
**Objective:** Verify admin can reject requests
**Steps:**
1. Login as admin
2. Go to Admin Dashboard or Requests Management page
3. Click "Reject" on pending request
4. Enter reason in modal
5. Click "Reject"

**Expected Result:**
- ✅ Success message displayed
- ✅ Request status changes to "Rejected"
- ✅ Removed from pending list
- ✅ Reason recorded

**Status:** Pass/Fail

---

#### TC-5.4: Admin Mark Equipment as Returned
**Objective:** Verify admin can mark equipment as returned
**Steps:**
1. Login as admin
2. Go to Requests Management page
3. Find approved request
4. Click "Mark as Returned"
5. Add return notes (optional)
6. Click "Mark Returned"

**Expected Result:**
- ✅ Success message displayed
- ✅ Request status changes to "Returned"
- ✅ Equipment availability increases

**Status:** Pass/Fail

---

#### TC-5.5: Admin Filter and Search Requests
**Objective:** Verify admin can filter/search requests
**Steps:**
1. Login as admin
2. Go to Requests Management page
3. Search by student name
4. Filter by status (pending, approved, returned, rejected)

**Expected Result:**
- ✅ Search works correctly
- ✅ Status filter works
- ✅ Results update accordingly

**Status:** Pass/Fail

---

### 6. Borrow History Tests

#### TC-6.1: Student View Borrow History
**Objective:** Verify student can see their request history
**Steps:**
1. Login as student
2. Click "My Requests" in navbar
3. View history page

**Expected Result:**
- ✅ All student's requests visible
- ✅ Status cards show counts (Pending, Approved, Returned, Rejected)
- ✅ Equipment names visible
- ✅ Dates visible
- ✅ Status badges visible

**Status:** Pass/Fail

---

#### TC-6.2: Student Filter and Search History
**Objective:** Verify student can filter history
**Steps:**
1. Login as student
2. Go to Borrow History
3. Search for equipment name
4. Filter by status

**Expected Result:**
- ✅ Search filters correctly
- ✅ Status filter works
- ✅ Results update

**Status:** Pass/Fail

---

#### TC-6.3: View Request Details
**Objective:** Verify student can see request details
**Steps:**
1. Login as student
2. Go to Borrow History
3. Click eye icon on any request
4. Review details modal

**Expected Result:**
- ✅ Modal opens
- ✅ All details visible
- ✅ Equipment name
- ✅ Status
- ✅ Dates
- ✅ Notes (if any)

**Status:** Pass/Fail

---

### 7. Admin Dashboard Tests

#### TC-7.1: Admin Dashboard Statistics
**Objective:** Verify dashboard shows correct statistics
**Steps:**
1. Login as admin
2. Go to Admin Dashboard
3. Observe statistics cards

**Expected Result:**
- ✅ Total Equipment count displays
- ✅ Available equipment count displays
- ✅ Borrowed equipment count displays
- ✅ Pending requests count displays
- ✅ Total users count displays
- ✅ Active loans count displays

**Status:** Pass/Fail

---

#### TC-7.2: Admin Quick Actions
**Objective:** Verify quick action buttons work
**Steps:**
1. Login as admin
2. On Admin Dashboard, click:
   - "Add Equipment"
   - "Manage Equipment"
   - "Refresh Data"

**Expected Result:**
- ✅ "Add Equipment" navigates to Equipment Management
- ✅ "Manage Equipment" navigates to Equipment Management
- ✅ "Refresh Data" updates statistics and requests

**Status:** Pass/Fail

---

### 8. Role-Based Access Control Tests

#### TC-8.1: Admin Access
**Objective:** Verify admin can access all admin features
**Steps:**
1. Login as admin
2. Verify access to:
   - Admin Dashboard
   - Equipment Management
   - Requests Management

**Expected Result:**
- ✅ All admin pages accessible
- ✅ Cannot access student-only pages

**Status:** Pass/Fail

---

#### TC-8.2: Student Access
**Objective:** Verify student cannot access admin features
**Steps:**
1. Login as student
2. Try to access /admin-dashboard directly
3. Try to access /equipment-management directly
4. Try to access /requests directly

**Expected Result:**
- ✅ Redirected to login or dashboard
- ✅ Cannot access admin pages

**Status:** Pass/Fail

---

#### TC-8.3: Navbar Menu Based on Role
**Objective:** Verify navbar shows appropriate menu items
**Steps:**
1. Login as admin, check navbar menu
2. Logout
3. Login as student, check navbar menu
4. Logout
5. Login as staff, check navbar menu

**Expected Result:**
- ✅ Admin sees: Dashboard, Manage Equipment, Requests
- ✅ Student sees: Dashboard, Borrow Equipment, My Requests
- ✅ Staff sees: Dashboard, Borrow Equipment, My Requests

**Status:** Pass/Fail

---

### 9. Data Validation Tests

#### TC-9.1: Equipment Form Validation
**Objective:** Verify equipment form validates data
**Steps:**
1. Login as admin
2. Go to Equipment Management
3. Click Add Equipment
4. Try to submit with empty fields
5. Try invalid quantity values

**Expected Result:**
- ✅ Required fields error shown
- ✅ Cannot submit incomplete form

**Status:** Pass/Fail

---

#### TC-9.2: Borrow Request Form Validation
**Objective:** Verify borrow request form validates
**Steps:**
1. Login as student
2. Go to Borrow Equipment
3. Try to submit with empty fields
4. Try return date before borrow date

**Expected Result:**
- ✅ Error messages displayed
- ✅ Cannot submit invalid dates
- ✅ Cannot submit without notes

**Status:** Pass/Fail

---

### 10. Integration Tests

#### TC-10.1: Complete Borrow Flow
**Objective:** Test complete borrowing workflow
**Steps:**
1. Admin adds equipment (TC-2.1)
2. Admin goes to dashboard and sees stats
3. Student requests equipment (TC-4.1)
4. Admin sees request in dashboard (TC-5.1)
5. Admin approves request (TC-5.2)
6. Admin marks as returned (TC-5.4)
7. Student views in history (TC-6.1)

**Expected Result:**
- ✅ All steps complete successfully
- ✅ Data updates reflect in all views
- ✅ Availability decreases after approval
- ✅ Availability increases after return

**Status:** Pass/Fail

---

#### TC-10.2: Request Rejection Flow
**Objective:** Test request rejection workflow
**Steps:**
1. Student requests equipment (TC-4.1)
2. Admin receives request
3. Admin rejects request (TC-5.3)
4. Student sees rejected status in history

**Expected Result:**
- ✅ Request marked as rejected
- ✅ Equipment availability unchanged
- ✅ Student can see rejection reason

**Status:** Pass/Fail

---

### 11. UI/UX Tests

#### TC-11.1: Responsive Design
**Objective:** Verify app works on different screen sizes
**Steps:**
1. Test on desktop (1920x1080)
2. Test on tablet (768x1024)
3. Test on mobile (375x667)

**Expected Result:**
- ✅ Layout responsive
- ✅ No horizontal scrolling
- ✅ All buttons clickable
- ✅ Tables readable

**Status:** Pass/Fail

---

#### TC-11.2: Navigation
**Objective:** Verify navigation works smoothly
**Steps:**
1. Navigate between all pages
2. Use browser back button
3. Use navbar links
4. Use page-internal buttons

**Expected Result:**
- ✅ All navigation works
- ✅ No broken links
- ✅ Pages load correctly

**Status:** Pass/Fail

---

#### TC-11.3: Error Messages
**Objective:** Verify error messages are clear
**Steps:**
1. Trigger various errors (wrong password, form validation, etc.)
2. Read error messages

**Expected Result:**
- ✅ Error messages clear and helpful
- ✅ Know what went wrong
- ✅ Know how to fix it

**Status:** Pass/Fail

---

### 12. Performance Tests

#### TC-12.1: Page Load Time
**Objective:** Verify pages load within acceptable time
**Steps:**
1. Navigate to main pages
2. Observe load times
3. Open DevTools → Network tab

**Expected Result:**
- ✅ Pages load in < 3 seconds
- ✅ No hanging or freezing

**Status:** Pass/Fail

---

#### TC-12.2: Large Data Handling
**Objective:** Verify app handles many requests
**Steps:**
1. Admin creates 50+ requests
2. View requests list
3. Filter and search

**Expected Result:**
- ✅ List loads without lag
- ✅ Pagination works
- ✅ Search still responsive

**Status:** Pass/Fail

---

## Bug Reporting

### Bug Report Template

**Bug ID:** [Auto-generated]
**Date Found:** [Date]
**Tester Name:** [Your Name]
**Severity:** [Critical/High/Medium/Low]
**Status:** [Open/Closed]

### Bug Details
```
Title: [Brief description]

Environment:
- OS: [Windows/Mac/Linux]
- Browser: [Chrome/Firefox/Edge]
- Backend: [Running/Stopped]

Steps to Reproduce:
1. [Step 1]
2. [Step 2]
3. [Step 3]

Expected Result:
[What should happen]

Actual Result:
[What actually happened]

Screenshots/Videos:
[Attach if possible]

Additional Notes:
[Any other relevant info]
```

### Severity Levels
- **Critical:** App crashes, cannot login, major feature broken
- **High:** Feature doesn't work as expected, data loss risk
- **Medium:** Minor feature issue, workaround exists
- **Low:** UI issue, cosmetic, no impact on functionality

---

## Test Summary

### Testing Checklist
- [ ] All authentication tests passed
- [ ] All equipment management tests passed
- [ ] All borrow request tests passed
- [ ] All admin management tests passed
- [ ] All history tests passed
- [ ] Role-based access control verified
- [ ] Form validation working
- [ ] Integration tests passed
- [ ] UI/UX tests passed
- [ ] Performance acceptable
- [ ] No critical bugs found

### Sign-off
**Tester Name:** ________________  
**Date:** ________________  
**Overall Status:** ☐ PASS ☐ FAIL

---

## Contact & Support

For any questions or issues during testing:
1. Check the test document again
2. Review the test case steps carefully
3. Check browser console for errors (F12)
4. Report bugs using the template above

---

**Document Version:** 1.0  
**Last Updated:** November 2025  
**Next Review:** After next release