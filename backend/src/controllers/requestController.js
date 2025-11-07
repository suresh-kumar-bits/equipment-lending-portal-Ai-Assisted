const Request = require('../models/Request');
const Equipment = require('../models/Equipment');
const User = require('../models/User');

/**
 * Request Controller
 * Handles all borrow request operations
 */

/**
 * Create Borrow Request
 * POST /api/requests/create
 * 
 * Student submits a request to borrow equipment
 */
exports.createRequest = async (req, res) => {
  try {
    const { studentId, studentName, studentEmail, equipmentId, equipmentName, quantity, borrowFromDate, borrowToDate, notes } = req.body;

    // ============================================================
    // 1. VALIDATION
    // ============================================================

    if (!studentId || !equipmentId || !quantity || !borrowFromDate || !borrowToDate || !notes) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Validate quantity is positive integer
    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be a positive whole number',
      });
    }

    // Validate dates
    const fromDate = new Date(borrowFromDate);
    const toDate = new Date(borrowToDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (fromDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Borrow date cannot be in the past',
      });
    }

    if (toDate <= fromDate) {
      return res.status(400).json({
        success: false,
        message: 'Return date must be after borrow date',
      });
    }

    // ============================================================
    // 2. CHECK EQUIPMENT EXISTS AND IS AVAILABLE
    // ============================================================

    const equipment = await Equipment.findById(equipmentId);

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found',
      });
    }

    if (equipment.available <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Equipment is not available for borrowing',
      });
    }

    if (quantity > equipment.available) {
      return res.status(400).json({
        success: false,
        message: `Only ${equipment.available} units available for borrowing`,
      });
    }

    // ============================================================
    // 3. CHECK FOR AVAILABLE QUANTITY CONSIDERING OVERLAPPING REQUESTS
    // ============================================================

    // Find all overlapping requests
    const overlappingRequests = await Request.find({
      equipmentId,
      status: { $in: ['approved', 'pending'] },
      $or: [
        {
          borrowFromDate: { $lte: toDate },
          borrowToDate: { $gte: fromDate },
        },
      ],
    });

    // Calculate total quantity requested in the overlapping period
    const totalRequestedQuantity = overlappingRequests.reduce((total, req) => total + req.quantity, 0);

    // Check if enough quantity is available for this period
    if (totalRequestedQuantity + quantity > equipment.quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${equipment.quantity - totalRequestedQuantity} units available for these dates`,
      });
    }

    // ============================================================
    // 4. CREATE REQUEST
    // ============================================================

    const request = await Request.create({
      studentId,
      studentName,
      studentEmail,
      equipmentId,
      equipmentName,
      quantity,
      borrowFromDate: fromDate,
      borrowToDate: toDate,
      notes,
      requestedDate: new Date(),
      status: 'pending',
    });

    // ============================================================
    // 5. RETURN RESPONSE
    // ============================================================

    res.status(201).json({
      success: true,
      message: 'Borrow request submitted successfully',
      data: {
        requestId: request._id,
        status: request.status,
      },
    });

  } catch (error) {
    console.error('Create request error:', error);
    console.error('Request body:', req.body);
    console.error('Validation errors:', error.errors);
    
    // If it's a validation error, send the specific validation message
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error creating request',
      error: error.message,
      stack: error.stack
    });
  }
};

/**
 * Get User's Requests
 * GET /api/requests/user/:userId
 * 
 * Get all borrow requests for a specific user
 */
exports.getUserRequests = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

    // ============================================================
    // 1. BUILD FILTER
    // ============================================================

    let filter = { studentId: userId };

    if (status) {
      filter.status = status;
    }

    // ============================================================
    // 2. PAGINATION
    // ============================================================

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = Math.min(parseInt(limit, 10) || 10, 100);
    const skip = (pageNum - 1) * limitNum;

    // ============================================================
    // 3. QUERY DATABASE
    // ============================================================

    const requests = await Request.find(filter)
      .skip(skip)
      .limit(limitNum)
      .sort({ requestedDate: -1 });

    const total = await Request.countDocuments(filter);
    const pages = Math.ceil(total / limitNum);

    // ============================================================
    // 4. RETURN RESPONSE
    // ============================================================

    res.status(200).json({
      success: true,
      message: 'User requests retrieved successfully',
      data: {
        requests,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages,
        },
      },
    });

  } catch (error) {
    console.error('Get user requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving requests',
      error: error.message,
    });
  }
};

/**
 * Get All Requests (Admin)
 * GET /api/requests
 * 
 * Get all borrow requests with filtering and search (Admin only)
 */
exports.getAllRequests = async (req, res) => {
  try {
    const { status, studentName, equipmentName, studentId, page = 1, limit = 10 } = req.query;

    // ============================================================
    // 1. BUILD FILTER
    // ============================================================

    let filter = {};

    if (status) {
      filter.status = status;
    }

    if (studentName) {
      filter.studentName = { $regex: studentName, $options: 'i' };
    }

    if (equipmentName) {
      filter.equipmentName = { $regex: equipmentName, $options: 'i' };
    }

    if (studentId) {
      filter.studentId = studentId;
    }

    // ============================================================
    // 2. PAGINATION
    // ============================================================

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = Math.min(parseInt(limit, 10) || 10, 100);
    const skip = (pageNum - 1) * limitNum;

    // ============================================================
    // 3. QUERY DATABASE
    // ============================================================

    const requests = await Request.find(filter)
      .skip(skip)
      .limit(limitNum)
      .sort({ requestedDate: -1 });

    const total = await Request.countDocuments(filter);
    const pages = Math.ceil(total / limitNum);

    // ============================================================
    // 4. RETURN RESPONSE
    // ============================================================

    res.status(200).json({
      success: true,
      message: 'All requests retrieved successfully',
      data: {
        requests,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages,
        },
      },
    });

  } catch (error) {
    console.error('Get all requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving requests',
      error: error.message,
    });
  }
};

/**
 * Approve Request
 * POST /api/requests/:requestId/approve
 * 
 * Admin approves a pending request (Admin only)
 */
exports.approveRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { approvalNotes = '' } = req.body;
    const adminId = req.user.userId;

    // ============================================================
    // 1. FIND REQUEST
    // ============================================================

    let request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot approve a ${request.status} request`,
      });
    }

    // ============================================================
    // 2. GET ADMIN INFO
    // ============================================================

    const admin = await User.findById(adminId);
    const adminName = admin?.name || 'Admin';

    // ============================================================
    // 3. CHECK IF QUANTITY STILL AVAILABLE
    // ============================================================

    const equipment = await Equipment.findById(request.equipmentId);
    if (!equipment || equipment.available < request.quantity) {
      return res.status(400).json({
        success: false,
        message: 'Requested quantity no longer available',
      });
    }

    // ============================================================
    // 4. UPDATE EQUIPMENT AVAILABILITY AND APPROVE REQUEST
    // ============================================================

    // Decrease available quantity
    await equipment.updateOne({
      $inc: { available: -request.quantity }
    });

    request = await request.approve(adminId, adminName, approvalNotes);

    // ============================================================
    // 4. RETURN RESPONSE
    // ============================================================

    res.status(200).json({
      success: true,
      message: 'Request approved successfully',
      data: {
        request,
      },
    });

  } catch (error) {
    console.error('Approve request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error approving request',
      error: error.message,
    });
  }
};

/**
 * Reject Request
 * POST /api/requests/:requestId/reject
 * 
 * Admin rejects a pending request (Admin only)
 */
exports.rejectRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { reason = '' } = req.body;

    // ============================================================
    // 1. FIND REQUEST
    // ============================================================

    let request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot reject a ${request.status} request`,
      });
    }

    // ============================================================
    // 2. REJECT REQUEST
    // ============================================================

    request = await request.reject(reason);

    // ============================================================
    // 3. RETURN RESPONSE
    // ============================================================

    res.status(200).json({
      success: true,
      message: 'Request rejected successfully',
      data: {
        request,
      },
    });

  } catch (error) {
    console.error('Reject request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error rejecting request',
      error: error.message,
    });
  }
};

/**
 * Mark Equipment as Returned
 * POST /api/requests/:requestId/return
 * 
 * Admin marks borrowed equipment as returned (Admin only)
 */
exports.markReturned = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { condition = 'Good', returnNotes = '' } = req.body;

    // ============================================================
    // 1. FIND REQUEST
    // ============================================================

    let request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    if (request.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Only approved requests can be marked as returned',
      });
    }

    // ============================================================
    // 2. UPDATE EQUIPMENT AVAILABILITY
    // ============================================================

    const equipment = await Equipment.findById(request.equipmentId);
    if (equipment) {
      await equipment.updateOne({
        $inc: { available: request.quantity }
      });
    }

    // ============================================================
    // 3. MARK AS RETURNED
    // ============================================================

    request = await request.markReturned(condition, returnNotes);

    // ============================================================
    // 4. RETURN RESPONSE
    // ============================================================

    res.status(200).json({
      success: true,
      message: 'Equipment marked as returned successfully',
      data: {
        request,
      },
    });

  } catch (error) {
    console.error('Mark returned error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error marking equipment as returned',
      error: error.message,
    });
  }
};

/**
 * Get Admin Dashboard Stats
 * GET /api/admin/stats
 * 
 * Get statistics for admin dashboard (Admin only)
 */
exports.getAdminStats = async (req, res) => {
  try {
    // ============================================================
    // 1. GATHER STATISTICS
    // ============================================================

    const totalEquipment = await Equipment.countDocuments();
    
    const equipmentStats = await Equipment.aggregate([
      {
        $group: {
          _id: null,
          available: { $sum: '$available' },
          borrowed: {
            $sum: {
              $subtract: ['$quantity', '$available'],
            },
          },
        },
      },
    ]);

    const requestStats = await Request.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const totalUsers = await User.countDocuments();
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const studentUsers = await User.countDocuments({ role: 'student' });
    const staffUsers = await User.countDocuments({ role: 'staff' });

    // ============================================================
    // 2. FORMAT RESPONSE
    // ============================================================

    const requestCounts = {
      pending: 0,
      approved: 0,
      rejected: 0,
      returned: 0,
    };

    requestStats.forEach((stat) => {
      requestCounts[stat._id] = stat.count;
    });

    // ============================================================
    // 3. RETURN RESPONSE
    // ============================================================

    res.status(200).json({
      success: true,
      message: 'Admin statistics retrieved',
      data: {
        stats: {
          totalEquipment,
          availableEquipment: equipmentStats[0]?.available || 0,
          borrowedEquipment: equipmentStats[0]?.borrowed || 0,
          pendingRequests: requestCounts.pending,
          totalUsers,
          userBreakdown: {
            admin: adminUsers,
            student: studentUsers,
            staff: staffUsers,
          },
          requestBreakdown: requestCounts,
        },
      },
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving statistics',
      error: error.message,
    });
  }
};