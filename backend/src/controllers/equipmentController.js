const Equipment = require("../models/Equipment");

/**
 * Equipment Controller
 * Handles all equipment CRUD operations
 */

/**
 * Get All Equipment
 * GET /api/equipment
 *
 * Retrieves all equipment with optional filtering and pagination
 */
exports.getAllEquipment = async (req, res) => {
  try {
    const { search, category, availability, page = 1, limit = 10 } = req.query;

    // ============================================================
    // 1. BUILD FILTER OBJECT
    // ============================================================

    let filter = {};

    // Search by name or description
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by category
    if (category) {
      filter.category = category;
    }

    // Filter by availability
    if (availability === "available") {
      filter.available = { $gt: 0 };
    } else if (availability === "unavailable") {
      filter.available = 0;
    }

    // ============================================================
    // 2. CALCULATE PAGINATION
    // ============================================================

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = Math.min(parseInt(limit, 10) || 10, 100); // Max 100 per page
    const skip = (pageNum - 1) * limitNum;

    // ============================================================
    // 3. QUERY DATABASE
    // ============================================================

    const equipment = await Equipment.find(filter)
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    // Get total count for pagination
    const total = await Equipment.countDocuments(filter);
    const pages = Math.ceil(total / limitNum);

    // ============================================================
    // 4. RETURN RESPONSE
    // ============================================================

    res.status(200).json({
      success: true,
      message: "Equipment retrieved successfully",
      data: {
        equipment,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages,
        },
      },
    });
  } catch (error) {
    console.error("Get equipment error:", error);
    res.status(500).json({
      success: false,
      message: "Server error retrieving equipment",
      error: error.message,
    });
  }
};

/**
 * Get Single Equipment
 * GET /api/equipment/:id
 *
 * Retrieves details of a single equipment item
 */
exports.getEquipmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const equipment = await Equipment.findById(id);

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: "Equipment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Equipment retrieved successfully",
      data: {
        equipment,
      },
    });
  } catch (error) {
    console.error("Get equipment error:", error);
    res.status(500).json({
      success: false,
      message: "Server error retrieving equipment",
      error: error.message,
    });
  }
};

/**
 * Add New Equipment
 * POST /api/equipment
 *
 * Creates new equipment (Admin only)
 */
exports.addEquipment = async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      condition,
      quantity,
      available,
      location,
    } = req.body;

    // ============================================================
    // 1. VALIDATION
    // ============================================================

    if (
      !name ||
      !category ||
      !description ||
      !condition ||
      !quantity ||
      !location
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    if (available === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please provide available quantity",
      });
    }

    if (available > quantity) {
      return res.status(400).json({
        success: false,
        message: "Available quantity cannot exceed total quantity",
      });
    }

    // ============================================================
    // 2. CREATE EQUIPMENT
    // ============================================================

    const equipment = await Equipment.create({
      name,
      category,
      description,
      condition,
      quantity,
      available,
      location,
    });

    // ============================================================
    // 3. RETURN RESPONSE
    // ============================================================

    res.status(201).json({
      success: true,
      message: "Equipment added successfully",
      data: {
        equipment,
      },
    });
  } catch (error) {
    console.error("Add equipment error:", error);
    res.status(500).json({
      success: false,
      message: "Server error adding equipment",
      error: error.message,
    });
  }
};

/**
 * Update Equipment
 * PUT /api/equipment/:id
 *
 * Updates equipment details (Admin only)
 */
exports.updateEquipment = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      category,
      description,
      condition,
      quantity,
      available,
      location,
    } = req.body;

    // ============================================================
    // 1. FIND EQUIPMENT
    // ============================================================

    let equipment = await Equipment.findById(id);

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: "Equipment not found",
      });
    }

    // ============================================================
    // 2. VALIDATION
    // ============================================================

    // Check if available exceeds quantity BEFORE updating
    const newAvailable =
      available !== undefined ? available : equipment.available;
    const newQuantity = quantity !== undefined ? quantity : equipment.quantity;

    if (newAvailable > newQuantity) {
      return res.status(400).json({
        success: false,
        message: "Available quantity cannot exceed total quantity",
      });
    }

    // ============================================================
    // 3. UPDATE EQUIPMENT
    // ============================================================

    equipment = await Equipment.findByIdAndUpdate(
      id,
      {
        ...(name && { name }),
        ...(category && { category }),
        ...(description && { description }),
        ...(condition && { condition }),
        ...(quantity !== undefined && { quantity }),
        ...(available !== undefined && { available }),
        ...(location && { location }),
      },
      {
        new: true,
        runValidators: false, // Disable validators during update
      }
    );

    // ============================================================
    // 4. RETURN RESPONSE
    // ============================================================

    res.status(200).json({
      success: true,
      message: "Equipment updated successfully",
      data: {
        equipment,
      },
    });
  } catch (error) {
    console.error("Update equipment error:", error);
    res.status(500).json({
      success: false,
      message: "Server error updating equipment",
      error: error.message,
    });
  }
};

/**
 * Delete Equipment
 * DELETE /api/equipment/:id
 *
 * Deletes equipment (Admin only)
 */
exports.deleteEquipment = async (req, res) => {
  try {
    const { id } = req.params;

    // ============================================================
    // 1. FIND AND DELETE EQUIPMENT
    // ============================================================

    const equipment = await Equipment.findByIdAndDelete(id);

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: "Equipment not found",
      });
    }

    // ============================================================
    // 2. RETURN RESPONSE
    // ============================================================

    res.status(200).json({
      success: true,
      message: "Equipment deleted successfully",
      data: {
        id: equipment._id,
      },
    });
  } catch (error) {
    console.error("Delete equipment error:", error);
    res.status(500).json({
      success: false,
      message: "Server error deleting equipment",
      error: error.message,
    });
  }
};

/**
 * Get Equipment Statistics
 * GET /api/equipment/stats
 *
 * Returns equipment statistics (total, available, borrowed, by category)
 */
exports.getEquipmentStats = async (req, res) => {
  try {
    // ============================================================
    // 1. CALCULATE STATS
    // ============================================================

    const totalEquipment = await Equipment.countDocuments();

    const stats = await Equipment.aggregate([
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: "$quantity" },
          totalAvailable: { $sum: "$available" },
          totalBorrowed: {
            $sum: {
              $subtract: ["$quantity", "$available"],
            },
          },
        },
      },
    ]);

    const byCategory = await Equipment.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          totalQuantity: { $sum: "$quantity" },
          available: { $sum: "$available" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // ============================================================
    // 2. RETURN RESPONSE
    // ============================================================

    res.status(200).json({
      success: true,
      message: "Equipment statistics retrieved",
      data: {
        stats: {
          totalItems: totalEquipment,
          totalQuantity: stats[0]?.totalQuantity || 0,
          totalAvailable: stats[0]?.totalAvailable || 0,
          totalBorrowed: stats[0]?.totalBorrowed || 0,
        },
        byCategory,
      },
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({
      success: false,
      message: "Server error retrieving statistics",
      error: error.message,
    });
  }
};
