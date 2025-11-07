const mongoose = require('mongoose');

/**
 * Request Schema
 * 
 * Stores information about all equipment borrow requests
 * Tracks request status, dates, and approval information
 */

const requestSchema = new mongoose.Schema(
  {
    // Reference to the student making the request
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide student ID'],
    },

    // Student name (for quick access without joining User collection)
    studentName: {
      type: String,
      required: [true, 'Please provide student name'],
    },

    // Student email (for notifications)
    studentEmail: {
      type: String,
      required: [true, 'Please provide student email'],
    },

    // Reference to the equipment being borrowed
    equipmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Equipment',
      required: [true, 'Please provide equipment ID'],
    },

    // Equipment name (for quick access without joining Equipment collection)
    equipmentName: {
      type: String,
      required: [true, 'Please provide equipment name'],
    },

    // Quantity requested
    quantity: {
      type: Number,
      required: [true, 'Please provide quantity'],
      min: [1, 'Quantity must be at least 1'],
      validate: {
        validator: Number.isInteger,
        message: 'Quantity must be a whole number'
      }
    },

    // Date when student wants to borrow equipment
    borrowFromDate: {
      type: Date,
      required: [true, 'Please provide borrow from date'],
    },

    // Date when student plans to return equipment
    borrowToDate: {
      type: Date,
      required: [true, 'Please provide borrow to date'],
      validate: {
        validator: function (value) {
          // Return date must be after borrow date
          return value > this.borrowFromDate;
        },
        message: 'Return date must be after borrow date',
      },
    },

    // Date when request was created
    requestedDate: {
      type: Date,
      default: Date.now,
    },

    // Purpose/reason for borrowing
    notes: {
      type: String,
      required: [true, 'Please provide purpose for borrowing'],
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },

    // Current status of the request
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'returned'],
      default: 'pending',
      required: true,
    },

    // Admin who approved the request
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    // Name of admin who approved (for quick access)
    approvedByName: {
      type: String,
      default: null,
    },

    // Date when request was approved
    approvalDate: {
      type: Date,
      default: null,
    },

    // Admin notes/comments for approval
    approvalNotes: {
      type: String,
      maxlength: [300, 'Approval notes cannot exceed 300 characters'],
      default: null,
    },

    // Reason for rejection (if rejected)
    rejectionReason: {
      type: String,
      maxlength: [300, 'Rejection reason cannot exceed 300 characters'],
      default: null,
    },

    // Actual return date (when equipment was returned)
    actualReturnDate: {
      type: Date,
      default: null,
    },

    // Condition of equipment when returned
    returnedCondition: {
      type: String,
      enum: ['Excellent', 'Good', 'Fair', 'Poor', null],
      default: null,
    },

    // Notes about return (e.g., damage, missing parts)
    returnNotes: {
      type: String,
      maxlength: [300, 'Return notes cannot exceed 300 characters'],
      default: null,
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Index for efficient querying
 */
requestSchema.index({ studentId: 1, status: 1 });
requestSchema.index({ equipmentId: 1, status: 1 });
requestSchema.index({ status: 1 });
requestSchema.index({ requestedDate: -1 });

/**
 * Virtual for whether request is overdue
 */
requestSchema.virtual('isOverdue').get(function () {
  if (this.status !== 'approved') {
    return false;
  }
  return new Date() > this.borrowToDate;
});

/**
 * Virtual for days requested
 */
requestSchema.virtual('daysRequested').get(function () {
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  return Math.ceil(
    (this.borrowToDate - this.borrowFromDate) / millisecondsPerDay
  );
});

/**
 * Method to approve a request
 */
requestSchema.methods.approve = function (adminId, adminName, notes = '') {
  this.status = 'approved';
  this.approvedBy = adminId;
  this.approvedByName = adminName;
  this.approvalDate = new Date();
  this.approvalNotes = notes;
  return this.save();
};

/**
 * Method to reject a request
 */
requestSchema.methods.reject = function (reason = '') {
  this.status = 'rejected';
  this.rejectionReason = reason;
  return this.save();
};

/**
 * Method to mark as returned
 */
requestSchema.methods.markReturned = function (
  condition = 'Good',
  notes = ''
) {
  this.status = 'returned';
  this.actualReturnDate = new Date();
  this.returnedCondition = condition;
  this.returnNotes = notes;
  return this.save();
};

/**
 * Ensure virtuals are included in JSON responses
 */
requestSchema.set('toJSON', { virtuals: true });

// Create and export Request model
const Request = mongoose.model('Request', requestSchema);

module.exports = Request;