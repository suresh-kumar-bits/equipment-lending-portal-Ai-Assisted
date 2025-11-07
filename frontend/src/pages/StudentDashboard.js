import React, { useState, useEffect } from 'react';
import EquipmentCard from '../components/EquipmentCard';
import { apiGet, apiPost } from '../services/api';

/**
 * StudentDashboard Page
 * 
 * UPDATES (Phase 2 Integration - v2):
 * ✅ Equipment fetched from real backend
 * ✅ Borrow requests NOW sent to backend
 * ✅ POST /api/requests/create integration added
 * ✅ Proper error handling for requests
 */

const StudentDashboard = ({ user }) => {
  // Equipment data and state
  const [equipment, setEquipment] = useState([]);
  const [filteredEquipment, setFilteredEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAvailability, setSelectedAvailability] = useState('all');
  const [viewType, setViewType] = useState('grid');

  // Borrow request state
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [selectedEquipmentForBorrow, setSelectedEquipmentForBorrow] = useState(null);
  const [borrowQuantity, setBorrowQuantity] = useState(1);
  const [borrowLoading, setBorrowLoading] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);

  /**
   * Fetch equipment from backend on component mount and when filters change
   */
  useEffect(() => {
    fetchEquipment();
  }, [searchTerm, selectedCategory, selectedAvailability, currentPage]);

  /**
   * Fetch equipment from backend API
   */
  const fetchEquipment = async () => {
    try {
      setLoading(true);
      setError('');

      // Build query parameters
      const params = new URLSearchParams();

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }

      if (selectedAvailability !== 'all') {
        params.append('availability', selectedAvailability);
      }

      params.append('page', currentPage);
      params.append('limit', pageSize);

      // Call: GET /api/equipment
      const response = await apiGet(`/api/equipment?${params.toString()}`);

      if (response.success) {
        setEquipment(response.data.equipment);
        setFilteredEquipment(response.data.equipment);
        setTotalPages(response.data.pagination.pages);
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
   * Get unique categories from equipment
   */
  const getCategories = () => {
    const categories = [...new Set(equipment.map((item) => item.category))];
    return categories.sort();
  };

  /**
   * Handle equipment borrow button click
   */
  const handleBorrowClick = (equipmentItem) => {
    setSelectedEquipmentForBorrow(equipmentItem);
    setShowBorrowModal(true);
  };

  /**
   * Submit borrow request to backend
   * NOW SENDS TO BACKEND: POST /api/requests/create
   */
  const handleSubmitBorrow = async () => {
    if (!selectedEquipmentForBorrow) return;

    try {
      setBorrowLoading(true);

      // ============================================================
      // CREATE BORROW REQUEST - SEND TO BACKEND
      // ============================================================

      console.log('User:', user);
      console.log('Selected Equipment:', selectedEquipmentForBorrow);
      
      const borrowRequest = {
        studentId: user._id || user.id,
        studentName: user.name,
        studentEmail: user.email,
        equipmentId: selectedEquipmentForBorrow._id,
        equipmentName: selectedEquipmentForBorrow.name,
        quantity: parseInt(borrowQuantity, 10),
        borrowFromDate: new Date().toISOString(), // Today
        borrowToDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        notes: `Requested ${borrowQuantity} ${borrowQuantity === 1 ? 'unit' : 'units'} by ${user.role}`,
      };
      
      console.log('Borrow Request:', borrowRequest);

      // Call: POST /api/requests/create
      const response = await apiPost('/api/requests/create', borrowRequest);

      if (response.success) {
        console.log('Borrow request created:', response.data);
        alert(
          `✅ Borrow request submitted successfully!\n\nEquipment: ${selectedEquipmentForBorrow.name}\nStatus: Pending\n\nAn administrator will review your request.`
        );

        // Close modal
        setShowBorrowModal(false);
        setSelectedEquipmentForBorrow(null);

        // Refresh equipment list to update availability
        fetchEquipment();
      } else {
        alert('❌ ' + (response.message || 'Failed to submit borrow request'));
      }
    } catch (err) {
      console.error('Error submitting borrow request:', err);
      alert('❌ Error: ' + err.message);
    } finally {
      setBorrowLoading(false);
    }
  };

  /**
   * Clear all filters and reset to first page
   */
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedAvailability('all');
    setCurrentPage(1);
  };

  /**
   * Handle page change
   */
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="container-fluid py-4">
      {/* Header Section */}
      <div className="row mb-4">
        <div className="col-md-8">
          <h1 className="h3 fw-bold text-dark">
            <i className="fa fa-box me-2 text-primary"></i>Available Equipment
          </h1>
          <p className="text-muted">Browse and borrow equipment from our inventory</p>
        </div>
        <div className="col-md-4 text-end">
          <div className="btn-group" role="group">
            <button
              type="button"
              className={`btn btn-sm ${viewType === 'grid' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setViewType('grid')}
              title="Grid view"
            >
              <i className="fa fa-th"></i> Grid
            </button>
            <button
              type="button"
              className={`btn btn-sm ${viewType === 'list' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setViewType('list')}
              title="List view"
            >
              <i className="fa fa-list"></i> List
            </button>
          </div>
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
            data-bs-dismiss="alert"
            onClick={() => setError('')}
          ></button>
        </div>
      )}

      {/* Filter Section */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <label className="form-label fw-600 text-dark">
            <i className="fa fa-search me-2"></i>Search Equipment
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Search by name or description..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            disabled={loading}
          />
        </div>

        <div className="col-md-3 mb-3">
          <label className="form-label fw-600 text-dark">
            <i className="fa fa-filter me-2"></i>Category
          </label>
          <select
            className="form-select"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
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

        <div className="col-md-3 mb-3">
          <label className="form-label fw-600 text-dark">
            <i className="fa fa-check-circle me-2"></i>Availability
          </label>
          <select
            className="form-select"
            value={selectedAvailability}
            onChange={(e) => {
              setSelectedAvailability(e.target.value);
              setCurrentPage(1);
            }}
            disabled={loading}
          >
            <option value="all">All Items</option>
            <option value="available">Available Only</option>
            <option value="unavailable">Unavailable Only</option>
          </select>
        </div>

        <div className="col-md-2 mb-3 d-flex align-items-end">
          <button
            className="btn btn-outline-secondary w-100"
            onClick={handleClearFilters}
            disabled={loading}
          >
            <i className="fa fa-times me-1"></i>Clear
          </button>
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
              Showing <strong>{filteredEquipment.length}</strong> items (Page{' '}
              <strong>{currentPage}</strong> of <strong>{totalPages}</strong>)
            </p>
          )}
        </div>
      </div>

      {/* Equipment Grid/List */}
      {!loading && filteredEquipment.length > 0 ? (
        <>
          <div
            className={
              viewType === 'grid'
                ? 'row g-4'
                : 'row'
            }
          >
            {filteredEquipment.map((item) => (
              <div
                key={item._id}
                className={viewType === 'grid' ? 'col-md-6 col-lg-4' : 'col-12'}
              >
                <EquipmentCard
                  equipment={item}
                  onBorrow={handleBorrowClick}
                  userRole={user.role}
                />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="row mt-4">
              <div className="col-12 d-flex justify-content-center">
                <nav aria-label="Page navigation">
                  <ul className="pagination">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                    </li>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <li
                        key={page}
                        className={`page-item ${currentPage === page ? 'active' : ''}`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </button>
                      </li>
                    ))}

                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          )}
        </>
      ) : !loading && filteredEquipment.length === 0 ? (
        <div className="text-center py-5">
          <i className="fa fa-inbox fa-3x text-muted mb-3 d-block"></i>
          <h5 className="text-muted">No equipment found</h5>
          <p className="text-muted small">
            Try adjusting your search filters or check back later
          </p>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleClearFilters}
          >
            <i className="fa fa-refresh me-1"></i>Clear Filters
          </button>
        </div>
      ) : null}

      {/* Borrow Modal */}
      {showBorrowModal && selectedEquipmentForBorrow && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-light border-bottom">
                <h5 className="modal-title fw-bold">
                  <i className="fa fa-plus-circle me-2 text-success"></i>Borrow Equipment
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowBorrowModal(false)}
                  disabled={borrowLoading}
                ></button>
              </div>
              <div className="modal-body">
                <div className="alert alert-info alert-sm mb-3">
                  <i className="fa fa-info-circle me-2"></i>
                  <strong>Equipment:</strong> {selectedEquipmentForBorrow.name}
                </div>
                
                <div className="bg-light p-3 rounded mb-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Available:</span>
                    <strong className="text-success">{selectedEquipmentForBorrow.available}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Total Quantity:</span>
                    <strong className="text-dark">{selectedEquipmentForBorrow.quantity}</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Condition:</span>
                    <strong className="text-dark">{selectedEquipmentForBorrow.condition}</strong>
                  </div>
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="borrowQuantity" className="form-label">
                    <i className="fa fa-hashtag me-2"></i>
                    Quantity to Borrow
                  </label>
                  <select
                    id="borrowQuantity"
                    className="form-select"
                    value={borrowQuantity}
                    onChange={(e) => setBorrowQuantity(Number(e.target.value))}
                    disabled={borrowLoading}
                  >
                    {[...Array(selectedEquipmentForBorrow.available)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  <small className="text-muted">
                    Select how many items you want to borrow (max: {selectedEquipmentForBorrow.available})
                  </small>
                </div>

                <p className="text-muted">
                  Are you sure you want to request to borrow {borrowQuantity} {borrowQuantity === 1 ? 'unit' : 'units'} of this equipment? 
                  An administrator will review your request.
                </p>
              </div>
              <div className="modal-footer border-top">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowBorrowModal(false)}
                  disabled={borrowLoading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleSubmitBorrow}
                  disabled={borrowLoading}
                >
                  {borrowLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <i className="fa fa-check me-1"></i>Confirm Request
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

export default StudentDashboard;