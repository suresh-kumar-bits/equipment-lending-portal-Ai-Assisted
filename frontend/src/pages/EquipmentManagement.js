import React, { useState, useEffect } from 'react';
import { apiGet, apiPost, apiPut, apiDelete } from '../services/api';

/**
 * EquipmentManagement Page
 * 
 * UPDATES (Phase 2 Integration):
 * ✅ Removed mockEquipmentData
 * ✅ Fetch equipment from: GET /api/equipment
 * ✅ Add equipment: POST /api/equipment
 * ✅ Update equipment: PUT /api/equipment/:id
 * ✅ Delete equipment: DELETE /api/equipment/:id
 * ✅ Loading and error states
 * ✅ Real-time data updates
 * 
 * This page allows admins to:
 * - View all equipment in a table
 * - Add new equipment
 * - Edit existing equipment
 * - Delete equipment
 * - Search and filter equipment
 */

const EquipmentManagement = ({ user }) => {
  // State management
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Sports',
    description: '',
    condition: 'Good',
    quantity: '',
    available: '',
    location: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  /**
   * Fetch equipment from backend on component mount
   */
  useEffect(() => {
    fetchEquipment();
  }, []);

  /**
   * Fetch all equipment
   */
  const fetchEquipment = async () => {
    try {
      setLoading(true);
      setError('');

      // Call: GET /api/equipment
      const response = await apiGet('/api/equipment?limit=100');

      if (response.success) {
        setEquipment(response.data.equipment);
        console.log('Equipment loaded:', response.data.equipment);
      } else {
        setError(response.message || 'Failed to load equipment');
      }
    } catch (err) {
      console.error('Error loading equipment:', err);
      setError(err.message || 'Error loading equipment from server');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get unique categories from loaded equipment
   */
  const getCategories = () => {
    const categories = [...new Set(equipment.map((item) => item.category))];
    return categories.sort();
  };

  /**
   * Filter equipment based on search and category
   */
  const getFilteredEquipment = () => {
    let filtered = equipment;

    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    return filtered;
  };

  /**
   * Open modal for adding new equipment
   */
  const handleAddEquipment = () => {
    setModalMode('add');
    setEditingId(null);
    setFormData({
      name: '',
      category: 'Sports',
      description: '',
      condition: 'Good',
      quantity: '',
      available: '',
      location: '',
    });
    setShowModal(true);
  };

  /**
   * Open modal for editing equipment
   */
  const handleEditEquipment = (item) => {
    setModalMode('edit');
    setEditingId(item._id);
    setFormData({
      name: item.name,
      category: item.category,
      description: item.description,
      condition: item.condition,
      quantity: item.quantity,
      available: item.available,
      location: item.location,
    });
    setShowModal(true);
  };

  /**
   * Handle form input change
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'quantity' || name === 'available' ? parseInt(value) || '' : value,
    });
  };

  /**
   * Validate form
   */
  const validateForm = () => {
    if (!formData.name || !formData.quantity || formData.available === '') {
      alert('Please fill in all required fields (Name, Quantity, Available)');
      return false;
    }

    if (formData.available > formData.quantity) {
      alert('Available quantity cannot exceed total quantity');
      return false;
    }

    return true;
  };

  /**
   * Handle form submission (add or edit)
   */
  const handleSubmitForm = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);

      if (modalMode === 'add') {
        // ============================================================
        // ADD NEW EQUIPMENT
        // ============================================================

        const response = await apiPost('/api/equipment', formData);

        if (response.success) {
          setEquipment([...equipment, response.data.equipment]);
          alert('✅ Equipment added successfully!');
          setShowModal(false);
        } else {
          alert('❌ ' + (response.message || 'Failed to add equipment'));
        }
      } else {
        // ============================================================
        // UPDATE EXISTING EQUIPMENT
        // ============================================================

        const response = await apiPut(`/api/equipment/${editingId}`, formData);

        if (response.success) {
          setEquipment(
            equipment.map((item) =>
              item._id === editingId ? response.data.equipment : item
            )
          );
          alert('✅ Equipment updated successfully!');
          setShowModal(false);
        } else {
          alert('❌ ' + (response.message || 'Failed to update equipment'));
        }
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      alert('❌ Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Handle delete equipment
   */
  const handleDeleteEquipment = async (id) => {
    try {
      setSubmitting(true);

      // Call: DELETE /api/equipment/:id
      const response = await apiDelete(`/api/equipment/${id}`);

      if (response.success) {
        setEquipment(equipment.filter((item) => item._id !== id));
        setDeleteConfirmId(null);
        alert('✅ Equipment deleted successfully!');
      } else {
        alert('❌ ' + (response.message || 'Failed to delete equipment'));
      }
    } catch (err) {
      console.error('Error deleting equipment:', err);
      alert('❌ Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredEquipment = getFilteredEquipment();

  return (
    <div className="container-fluid py-4">
      {/* Header Section */}
      <div className="row mb-4">
        <div className="col-md-8">
          <h1 className="h3 fw-bold text-dark">
            <i className="fa fa-toolbox me-2 text-primary"></i>Equipment Management
          </h1>
          <p className="text-muted">Add, edit, or delete equipment from inventory</p>
        </div>
        <div className="col-md-4 text-end">
          <button
            className="btn btn-primary me-2"
            onClick={handleAddEquipment}
            disabled={loading}
          >
            <i className="fa fa-plus-circle me-2"></i>Add New Equipment
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={fetchEquipment}
            disabled={loading}
          >
            <i className="fa fa-refresh me-1"></i>Refresh
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
          <i className="fa fa-exclamation-circle me-2"></i>
          <strong>Error!</strong> {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError('')}
          ></button>
        </div>
      )}

      {/* Filter Section */}
      <div className="row mb-4">
        <div className="col-md-8">
          <label className="form-label fw-600 text-dark">
            <i className="fa fa-search me-2"></i>Search Equipment
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Search by equipment name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="col-md-4">
          <label className="form-label fw-600 text-dark">
            <i className="fa fa-filter me-2"></i>Filter by Category
          </label>
          <select
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            disabled={loading}
          >
            <option value="all">All Categories</option>
            {getCategories().map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Counter and Loading */}
      <div className="row mb-3">
        <div className="col-12">
          {loading ? (
            <div className="d-flex align-items-center text-muted">
              <div className="spinner-border spinner-border-sm me-2" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <span>Loading equipment...</span>
            </div>
          ) : (
            <p className="text-muted small">
              Showing <strong>{filteredEquipment.length}</strong> of{' '}
              <strong>{equipment.length}</strong> items
            </p>
          )}
        </div>
      </div>

      {/* Equipment Table */}
      {!loading && filteredEquipment.length > 0 ? (
        <div className="row mb-4">
          <div className="col-12">
            <div className="table-responsive">
              <table className="table table-hover border">
                <thead className="table-light">
                  <tr>
                    <th className="fw-600 text-dark">
                      <i className="fa fa-box me-2"></i>Equipment Name
                    </th>
                    <th className="fw-600 text-dark">
                      <i className="fa fa-tag me-2"></i>Category
                    </th>
                    <th className="fw-600 text-dark">
                      <i className="fa fa-info-circle me-2"></i>Condition
                    </th>
                    <th className="fw-600 text-dark">
                      <i className="fa fa-list me-2"></i>Total Qty
                    </th>
                    <th className="fw-600 text-dark">
                      <i className="fa fa-check-circle me-2"></i>Available
                    </th>
                    <th className="fw-600 text-dark">
                      <i className="fa fa-map-marker me-2"></i>Location
                    </th>
                    <th className="fw-600 text-dark text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEquipment.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <strong className="text-dark">{item.name}</strong>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark">
                          {item.category}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${
                          item.condition === 'Excellent' ? 'bg-success' :
                          item.condition === 'Good' ? 'bg-info' :
                          item.condition === 'Fair' ? 'bg-warning' :
                          'bg-danger'
                        }`}>
                          {item.condition}
                        </span>
                      </td>
                      <td className="text-muted">{item.quantity}</td>
                      <td>
                        <strong className={item.available > 0 ? 'text-success' : 'text-danger'}>
                          {item.available}
                        </strong>
                      </td>
                      <td className="text-muted">{item.location}</td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => handleEditEquipment(item)}
                          title="Edit equipment"
                          disabled={submitting}
                        >
                          <i className="fa fa-edit"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => setDeleteConfirmId(item._id)}
                          title="Delete equipment"
                          disabled={submitting}
                        >
                          <i className="fa fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : !loading && filteredEquipment.length === 0 ? (
        <div className="text-center py-5">
          <i className="fa fa-inbox fa-3x text-muted mb-3 d-block"></i>
          <h5 className="text-muted">No equipment found</h5>
          <p className="text-muted small">Try adjusting your search filters or add new equipment</p>
        </div>
      ) : null}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-light border-bottom">
                <h5 className="modal-title fw-bold">
                  <i className={`fa ${modalMode === 'add' ? 'fa-plus-circle' : 'fa-edit'} me-2 text-primary`}></i>
                  {modalMode === 'add' ? 'Add New Equipment' : 'Edit Equipment'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmitForm}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-600 text-dark">Equipment Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter equipment name"
                        disabled={submitting}
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-600 text-dark">Category *</label>
                      <select
                        className="form-select"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        disabled={submitting}
                      >
                        <option value="Sports">Sports</option>
                        <option value="Lab">Lab</option>
                        <option value="Camera">Camera</option>
                        <option value="Musical">Musical</option>
                        <option value="Computing">Computing</option>
                        <option value="Tools">Tools</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="col-12 mb-3">
                      <label className="form-label fw-600 text-dark">Description</label>
                      <textarea
                        className="form-control"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Enter equipment description"
                        rows="3"
                        disabled={submitting}
                      ></textarea>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-600 text-dark">Condition</label>
                      <select
                        className="form-select"
                        name="condition"
                        value={formData.condition}
                        onChange={handleInputChange}
                        disabled={submitting}
                      >
                        <option value="Excellent">Excellent</option>
                        <option value="Good">Good</option>
                        <option value="Fair">Fair</option>
                        <option value="Poor">Poor</option>
                      </select>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-600 text-dark">Location</label>
                      <input
                        type="text"
                        className="form-control"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="e.g., Sports Room A"
                        disabled={submitting}
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-600 text-dark">Total Quantity *</label>
                      <input
                        type="number"
                        className="form-control"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        placeholder="Enter total quantity"
                        min="1"
                        disabled={submitting}
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-600 text-dark">Available Quantity *</label>
                      <input
                        type="number"
                        className="form-control"
                        name="available"
                        value={formData.available}
                        onChange={handleInputChange}
                        placeholder="Enter available quantity"
                        min="0"
                        disabled={submitting}
                      />
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer border-top">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={`btn ${modalMode === 'add' ? 'btn-success' : 'btn-warning'}`}
                  onClick={handleSubmitForm}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className={`fa ${modalMode === 'add' ? 'fa-plus' : 'fa-save'} me-1`}></i>
                      {modalMode === 'add' ? 'Add Equipment' : 'Update Equipment'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-light border-bottom">
                <h5 className="modal-title fw-bold">
                  <i className="fa fa-exclamation-circle me-2 text-danger"></i>Delete Equipment
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setDeleteConfirmId(null)}
                  disabled={submitting}
                ></button>
              </div>
              <div className="modal-body">
                <p className="text-muted">
                  Are you sure you want to delete this equipment? This action cannot be undone.
                </p>
                <div className="alert alert-danger alert-sm">
                  <i className="fa fa-warning me-2"></i>
                  <strong>Warning:</strong> All associated borrowing records will remain.
                </div>
              </div>
              <div className="modal-footer border-top">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setDeleteConfirmId(null)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleDeleteEquipment(deleteConfirmId)}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <i className="fa fa-trash me-1"></i>Delete Equipment
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentManagement;