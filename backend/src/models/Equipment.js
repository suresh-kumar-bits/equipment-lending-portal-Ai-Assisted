const mongoose = require('mongoose');

/**
 * Equipment Schema
 * 
 * Stores information about all equipment in school inventory
 * Tracks quantity, availability, condition, and location
 */

const equipmentSchema = new mongoose.Schema(
  {
    // Equipment name
    name: {
      type: String,
      required: [true, 'Please provide equipment name'],
      trim: true,
      minlength: [3, 'Name must be at least 3 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },

    // Equipment category
    category: {
      type: String,
      enum: [
        'Sports',
        'Lab',
        'Camera',
        'Musical',
        'Computing',
        'Tools',
        'Other',
      ],
      required: [true, 'Please provide a category'],
    },

    // Detailed description of equipment
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },

    // Current condition of equipment
    condition: {
      type: String,
      enum: ['Excellent', 'Good', 'Fair', 'Poor'],
      required: [true, 'Please provide equipment condition'],
      default: 'Good',
    },

    // Total quantity of this equipment
    quantity: {
      type: Number,
      required: [true, 'Please provide total quantity'],
      min: [1, 'Quantity must be at least 1'],
    },

    // Currently available quantity
    available: {
      type: Number,
      required: [true, 'Please provide available quantity'],
      min: [0, 'Available quantity cannot be negative'],
      validate: {
        validator: function (value) {
          // Available cannot be more than total quantity
          return value <= this.quantity;
        },
        message: 'Available quantity cannot exceed total quantity',
      },
    },

    // Storage location of equipment
    location: {
      type: String,
      required: [true, 'Please provide storage location'],
      maxlength: [100, 'Location cannot exceed 100 characters'],
    },

    // Optional: Image URL for equipment
    image: {
      type: String,
      default: null,
    },

    // Track when equipment was added
    createdAt: {
      type: Date,
      default: Date.now,
    },

    // Track when equipment info was last updated
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
 * Virtual for borrowed quantity
 * Calculated as: total quantity - available quantity
 */
equipmentSchema.virtual('borrowed').get(function () {
  return this.quantity - this.available;
});

/**
 * Method to check if equipment is available
 */
equipmentSchema.methods.isAvailable = function () {
  return this.available > 0;
};

/**
 * Method to update available quantity when borrowed
 */
equipmentSchema.methods.decreaseAvailable = function (count = 1) {
  if (this.available < count) {
    throw new Error('Not enough available quantity');
  }
  this.available -= count;
  return this.save();
};

/**
 * Method to update available quantity when returned
 */
equipmentSchema.methods.increaseAvailable = function (count = 1) {
  if (this.available + count > this.quantity) {
    throw new Error('Cannot return more than total quantity');
  }
  this.available += count;
  return this.save();
};

/**
 * Ensure available is set to LF format in JSON responses
 */
equipmentSchema.set('toJSON', { virtuals: true });

// Create and export Equipment model
const Equipment = mongoose.model('Equipment', equipmentSchema);

module.exports = Equipment;