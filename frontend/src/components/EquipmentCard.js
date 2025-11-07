import React from 'react';

/**
 * EquipmentCard Component
 * 
 * This component displays a single equipment item in a card format.
 * Shows equipment details like name, category, condition, available quantity.
 * Can be used in lists/grids to display all equipment.
 * 
 * Props:
 * - equipment: Equipment object {id, name, category, description, condition, quantity, available, image}
 * - onBorrow: Function called when user clicks "Borrow" button
 * - onEdit: Function called when admin clicks "Edit" button (optional)
 * - onDelete: Function called when admin clicks "Delete" button (optional)
 * - userRole: Current user's role ('student', 'staff', 'admin')
 * 
 * Future Integration with Backend:
 * - Equipment images will come from: GET /api/equipment/:id/image
 * - Equipment data from: GET /api/equipment
 */

const EquipmentCard = ({
  equipment,
  onBorrow,
  onEdit,
  onDelete,
  userRole,
}) => {
  /**
   * Determine availability badge color based on quantity
   */
  const getAvailabilityBadge = () => {
    if (equipment.available <= 0) {
      return (
        <span className="badge bg-danger">
          <i className="fa fa-times-circle me-1"></i>Not Available
        </span>
      );
    }
    if (equipment.available <= 2) {
      return (
        <span className="badge bg-warning">
          <i className="fa fa-exclamation-triangle me-1"></i>Limited ({equipment.available})
        </span>
      );
    }
    return (
      <span className="badge bg-success">
        <i className="fa fa-check-circle me-1"></i>Available ({equipment.available})
      </span>
    );
  };

  /**
   * Determine condition badge styling
   */
  const getConditionBadge = () => {
    const conditionStyles = {
      excellent: 'bg-success',
      good: 'bg-info',
      fair: 'bg-warning',
      poor: 'bg-danger',
    };
    return conditionStyles[equipment.condition.toLowerCase()] || 'bg-secondary';
  };

  /**
   * Get category icon
   */
  const getCategoryIcon = () => {
    const categoryIcons = {
      'sports': 'fa-futbol-o',
      'lab': 'fa-flask',
      'camera': 'fa-camera',
      'musical': 'fa-music',
      'tools': 'fa-toolbox',
      'computing': 'fa-laptop',
      'other': 'fa-cube',
    };
    return categoryIcons[equipment.category.toLowerCase()] || 'fa-cube';
  };

  return (
    <div className="card h-100 shadow-sm border-0 overflow-hidden equipment-card">
      {/* Card Image Section */}
      <div className="position-relative bg-light" style={{ height: '200px' }}>
        {equipment.image ? (
          <img
            src={equipment.image}
            alt={equipment.name}
            className="card-img-top h-100 w-100 object-fit-cover"
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div className="d-flex align-items-center justify-content-center h-100 text-muted">
            <div className="text-center">
              <i className={`fa ${getCategoryIcon()} fa-3x mb-2`}></i>
              <p className="small">No image available</p>
            </div>
          </div>
        )}
        
        {/* Availability Badge - Absolute Positioned */}
        <div className="position-absolute top-0 end-0 p-2">
          {getAvailabilityBadge()}
        </div>
      </div>

      {/* Card Body */}
      <div className="card-body d-flex flex-column">
        {/* Equipment Name */}
        <h5 className="card-title fw-bold text-dark mb-1">
          <i className={`fa ${getCategoryIcon()} me-2 text-primary`}></i>
          {equipment.name}
        </h5>

        {/* Category and Condition Row */}
        <div className="mb-2 d-flex gap-2">
          <span className="badge bg-light text-dark">
            <i className="fa fa-tag me-1"></i>{equipment.category}
          </span>
          <span className={`badge ${getConditionBadge()}`}>
            <i className="fa fa-info-circle me-1"></i>{equipment.condition}
          </span>
        </div>

        {/* Description */}
        <p className="card-text text-muted small mb-2">
          {equipment.description && equipment.description.length > 80
            ? equipment.description.substring(0, 80) + '...'
            : equipment.description}
        </p>

        {/* Equipment Details */}
        <div className="mb-3 p-2 bg-light rounded small">
          <div className="d-flex justify-content-between mb-1">
            <span className="text-muted">Total Quantity:</span>
            <strong className="text-dark">{equipment.quantity}</strong>
          </div>
          <div className="d-flex justify-content-between">
            <span className="text-muted">Available:</span>
            <strong className="text-success">{equipment.available}</strong>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-auto d-flex gap-2">
          {/* Borrow Button - For Students/Staff */}
          {(userRole === 'student' || userRole === 'staff') && (
            <button
              className="btn btn-primary btn-sm flex-grow-1"
              onClick={() => onBorrow(equipment)}
              disabled={equipment.available <= 0}
              title={equipment.available <= 0 ? 'Equipment not available' : 'Click to borrow'}
            >
              <i className="fa fa-plus me-1"></i>Borrow
            </button>
          )}

          {/* Edit Button - For Admins Only */}
          {userRole === 'admin' && (
            <button
              className="btn btn-warning btn-sm"
              onClick={() => onEdit(equipment)}
              title="Edit equipment details"
            >
              <i className="fa fa-edit"></i>
            </button>
          )}

          {/* Delete Button - For Admins Only */}
          {userRole === 'admin' && (
            <button
              className="btn btn-danger btn-sm"
              onClick={() => onDelete(equipment.id)}
              title="Delete equipment"
            >
              <i className="fa fa-trash"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EquipmentCard;