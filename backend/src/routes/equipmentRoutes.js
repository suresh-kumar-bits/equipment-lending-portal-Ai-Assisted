const express = require('express');
const router = express.Router();
const {
  getAllEquipment,
  getEquipmentById,
  addEquipment,
  updateEquipment,
  deleteEquipment,
  getEquipmentStats,
} = require('../controllers/equipmentController');
const { authenticate, adminOnly } = require('../middleware/authMiddleware');

/**
 * Equipment Routes
 * GET    /api/equipment              - Get all equipment
 * GET    /api/equipment/:id          - Get single equipment
 * POST   /api/equipment              - Add equipment (admin)
 * PUT    /api/equipment/:id          - Update equipment (admin)
 * DELETE /api/equipment/:id          - Delete equipment (admin)
 * GET    /api/equipment/stats        - Get equipment statistics (admin)
 */

// ============================================================
// PUBLIC ROUTES (Require Authentication)
// ============================================================

/**
 * GET /api/equipment
 * Get all equipment with filtering and pagination
 * 
 * Query: ?search=name&category=Sports&availability=available&page=1&limit=10
 * Response: { equipment, pagination }
 */
router.get('/', authenticate, getAllEquipment);

/**
 * GET /api/equipment/:id
 * Get single equipment by ID
 * 
 * Response: { equipment }
 */
router.get('/:id', authenticate, getEquipmentById);

// ============================================================
// ADMIN ONLY ROUTES
// ============================================================

/**
 * POST /api/equipment
 * Add new equipment (Admin only)
 * 
 * Body: { name, category, description, condition, quantity, available, location }
 * Response: { equipment }
 */
router.post('/', authenticate, adminOnly, addEquipment);

/**
 * PUT /api/equipment/:id
 * Update equipment (Admin only)
 * 
 * Body: { name, category, description, condition, quantity, available, location }
 * Response: { equipment }
 */
router.put('/:id', authenticate, adminOnly, updateEquipment);

/**
 * DELETE /api/equipment/:id
 * Delete equipment (Admin only)
 * 
 * Response: { id }
 */
router.delete('/:id', authenticate, adminOnly, deleteEquipment);

/**
 * GET /api/equipment/stats
 * Get equipment statistics (Admin only)
 * 
 * Response: { stats, byCategory }
 */
router.get('/stats', authenticate, adminOnly, getEquipmentStats);

module.exports = router;