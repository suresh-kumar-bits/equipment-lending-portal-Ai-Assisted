import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGet, apiPost } from '../services/api';

/**
 * BorrowEquipment Page
 * 
 * UPDATES (Phase 2 Integration):
 * ✅ Removed mockEquipmentData
 * ✅ Fetch equipment from: GET /api/equipment
 * ✅ Submit request to: POST /api/requests/create
 * ✅ Custom date range selection
 * ✅ Loading and error states
 * 
 * This page allows students to borrow equipment with:
 * - Equipment selection from backend
 * - Date range selection (from and to dates)
 * - Purpose/notes for request
 * - Confirmation before submission
 */

const BorrowEquipment = ({ user }) => {
  const navigate = useNavigate();

  // Equipment state
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    equipmentId: '',
    equipmentName: '',
    quantity: '1',
    borrowFromDate: '',
    borrowToDate: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Fetch available equipment on component mount
   */
  useEffect(() => {
    fetchEquipment();
  }, []);

  /**
   * Fetch equipment from backend
   */
  const fetchEquipment = async () => {
    try {
      setLoading(true);
      setError('');

      // Build query parameters - get available equipment only
      const params = new URLSearchParams();
      params.append('availability', 'available');
      params.append('limit', '100');

      // Call: GET /api/equipment
      const response = await apiGet(`/api/equipment?${params.toString()}`);

      if (response.success) {
        setEquipment(response.data.equipment);
        console.log('Available equipment loaded:', response.data.equipment);
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
   * Handle equipment selection
   */
  const handleEquipmentChange = (e) => {
    const selectedId = e.target.value;
    const selectedEquipmentItem = equipment.find(
      (item) => item._id === selectedId
    );

    setFormData({
      ...formData,
      equipmentId: selectedId,
      equipmentName: selectedEquipmentItem ? selectedEquipmentItem.name : '',
    });

    setErrors({ ...errors, equipmentId: '' });
  };

  /**
   * Handle input change
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({ ...errors, [name]: '' });
  };

  /**
   * Validate form
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.equipmentId) {
      newErrors.equipmentId = 'Please select equipment';
    }

    if (!formData.borrowFromDate) {
      newErrors.borrowFromDate = 'Please select a borrow date';
    }

    if (!formData.borrowToDate) {
      newErrors.borrowToDate = 'Please select a return date';
    }

    if (formData.borrowFromDate && formData.borrowToDate) {
      const fromDate = new Date(formData.borrowFromDate);
      const toDate = new Date(formData.borrowToDate);

      if (fromDate >= toDate) {
        newErrors.borrowToDate = 'Return date must be after borrow date';
      }

      // Check if borrow date is not in the past
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (fromDate < today) {
        newErrors.borrowFromDate = 'Borrow date cannot be in the past';
      }
    }

    if (!formData.notes || formData.notes.trim() === '') {
      newErrors.notes = 'Please enter purpose/notes';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setShowConfirmation(true);
  };

  /**
   * Confirm and submit borrow request to backend
   */
  const handleConfirmSubmit = async () => {
    try {
      setIsSubmitting(true);

      // ============================================================
      // CREATE BORROW REQUEST - SEND TO BACKEND
      // ============================================================

      const borrowRequest = {
        studentId: user._id || user.id,
        studentName: user.name,
        studentEmail: user.email,
        equipmentId: formData.equipmentId,
        equipmentName: formData.equipmentName,
        quantity: parseInt(formData.quantity, 10),
        borrowFromDate: formData.borrowFromDate,
        borrowToDate: formData.borrowToDate,
        notes: formData.notes,
      };

      // Call: POST /api/requests/create
      const response = await apiPost('/api/requests/create', borrowRequest);

      if (response.success) {
        console.log('Borrow request created:', response.data);
        alert(
          `✅ Borrow request submitted successfully!\n\nEquipment: ${formData.equipmentName}\nBorrow Period: ${new Date(formData.borrowFromDate).toLocaleDateString()} to ${new Date(formData.borrowToDate).toLocaleDateString()}\n\nStatus: Pending\nAn administrator will review your request.`
        );

        // Reset form
        setFormData({
          equipmentId: '',
          equipmentName: '',
          quantity: '1',
          borrowFromDate: '',
          borrowToDate: '',
          notes: '',
        });

        setShowConfirmation(false);

        // Redirect to borrow history after 2 seconds
        setTimeout(() => {
          navigate('/borrow-history');
        }, 2000);
      } else {
        alert('❌ ' + (response.message || 'Failed to submit borrow request'));
        setShowConfirmation(false);
      }
    } catch (err) {
      console.error('Error submitting borrow request:', err);
      alert('❌ Error: ' + err.message);
      setShowConfirmation(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Get today's date in YYYY-MM-DD format
   */
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const selectedEquipmentItem = equipment.find(
    (item) => item._id === formData.equipmentId
  );

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-7">
          {/* Header */}
          <div className="mb-4">
            <h1 className="h3 fw-bold text-dark">
              <i className="fa fa-plus-circle me-2 text-primary"></i>Borrow Equipment
            </h1>
            <p className="text-muted">Submit a request to borrow equipment with custom dates</p>
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

          {/* Form Card */}
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3 text-muted">Loading available equipment...</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {/* Equipment Selection */}
                  <div className="mb-4">
                    <label htmlFor="equipment" className="form-label fw-600 text-dark">
                      <i className="fa fa-box me-2"></i>Select Equipment *
                    </label>
                    <select
                      id="equipment"
                      className={`form-select form-select-lg ${
                        errors.equipmentId ? 'is-invalid' : ''
                      }`}
                      value={formData.equipmentId}
                      onChange={handleEquipmentChange}
                      disabled={loading}
                    >
                      <option value="">-- Choose Equipment --</option>
                      {equipment.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.name} (Available: {item.available})
                        </option>
                      ))}
                    </select>
                    {errors.equipmentId && (
                      <div className="invalid-feedback d-block">{errors.equipmentId}</div>
                    )}
                  </div>

                  {/* Quantity Selection */}
                  {selectedEquipmentItem && (
                    <div className="mb-4">
                      <label htmlFor="quantity" className="form-label fw-600 text-dark">
                        <i className="fa fa-hashtag me-2"></i>Quantity to Borrow *
                      </label>
                      <div className="input-group">
                        <select
                          id="quantity"
                          className={`form-select form-select-lg ${
                            errors.quantity ? 'is-invalid' : ''
                          }`}
                          name="quantity"
                          value={formData.quantity || '1'}
                          onChange={handleInputChange}
                        >
                          {[...Array(selectedEquipmentItem.available)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1} {i === 0 ? 'unit' : 'units'}
                            </option>
                          ))}
                        </select>
                        <span className="input-group-text bg-light">
                          <small className="text-muted">
                            Available: {selectedEquipmentItem.available}
                          </small>
                        </span>
                      </div>
                      {errors.quantity && (
                        <div className="invalid-feedback d-block">{errors.quantity}</div>
                      )}
                    </div>
                  )}

                  {/* Equipment Details */}
                  {selectedEquipmentItem && (
                    <div className="alert alert-info alert-sm mb-4">
                      <div className="row">
                        <div className="col-md-6">
                          <p className="mb-1">
                            <strong>Category:</strong> {selectedEquipmentItem.category}
                          </p>
                        </div>
                        <div className="col-md-6">
                          <p className="mb-1">
                            <strong>Condition:</strong> {selectedEquipmentItem.condition}
                          </p>
                        </div>
                      </div>
                      <p className="mb-0 small text-muted mt-2">
                        {selectedEquipmentItem.description}
                      </p>
                    </div>
                  )}

                  {/* Borrow From Date */}
                  <div className="mb-4">
                    <label htmlFor="borrowFromDate" className="form-label fw-600 text-dark">
                      <i className="fa fa-calendar me-2"></i>Borrow From Date *
                    </label>
                    <input
                      type="date"
                      id="borrowFromDate"
                      className={`form-control form-control-lg ${
                        errors.borrowFromDate ? 'is-invalid' : ''
                      }`}
                      name="borrowFromDate"
                      value={formData.borrowFromDate}
                      onChange={handleInputChange}
                      min={getTodayDate()}
                    />
                    {errors.borrowFromDate && (
                      <div className="invalid-feedback d-block">{errors.borrowFromDate}</div>
                    )}
                  </div>

                  {/* Return To Date */}
                  <div className="mb-4">
                    <label htmlFor="borrowToDate" className="form-label fw-600 text-dark">
                      <i className="fa fa-calendar me-2"></i>Return By Date *
                    </label>
                    <input
                      type="date"
                      id="borrowToDate"
                      className={`form-control form-control-lg ${
                        errors.borrowToDate ? 'is-invalid' : ''
                      }`}
                      name="borrowToDate"
                      value={formData.borrowToDate}
                      onChange={handleInputChange}
                      min={formData.borrowFromDate || getTodayDate()}
                    />
                    {errors.borrowToDate && (
                      <div className="invalid-feedback d-block">{errors.borrowToDate}</div>
                    )}
                  </div>

                  {/* Purpose/Notes */}
                  <div className="mb-4">
                    <label htmlFor="notes" className="form-label fw-600 text-dark">
                      <i className="fa fa-sticky-note me-2"></i>Purpose/Notes *
                    </label>
                    <textarea
                      id="notes"
                      className={`form-control ${errors.notes ? 'is-invalid' : ''}`}
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Explain why you need this equipment"
                      rows="4"
                    ></textarea>
                    <small className="text-muted d-block mt-1">
                      This helps admins understand your request
                    </small>
                    {errors.notes && (
                      <div className="invalid-feedback d-block">{errors.notes}</div>
                    )}
                  </div>

                  {/* Important Notice */}
                  <div className="alert alert-warning alert-sm mb-4">
                    <i className="fa fa-info-circle me-2"></i>
                    <strong>Important:</strong> This is a request. An administrator will review
                    and approve or reject your request. You will be notified of the decision.
                  </div>

                  {/* Submit Button */}
                  <button type="submit" className="btn btn-primary btn-lg w-100 fw-bold">
                    <i className="fa fa-paper-plane me-2"></i>Submit Request
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-light border-bottom">
                <h5 className="modal-title fw-bold">
                  <i className="fa fa-check-circle me-2 text-success"></i>Confirm Request
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowConfirmation(false)}
                  disabled={isSubmitting}
                ></button>
              </div>
              <div className="modal-body">
                <p className="mb-3">Please review your request details:</p>

                <div className="bg-light p-3 rounded mb-3">
                  <div className="mb-2">
                    <p className="text-muted small mb-1">Equipment:</p>
                    <p className="fw-600 text-dark mb-0">{formData.equipmentName}</p>
                  </div>

                  <hr className="my-2" />

                  <div className="mb-2">
                    <p className="text-muted small mb-1">Quantity:</p>
                    <p className="fw-600 text-dark mb-0">
                      {formData.quantity} {parseInt(formData.quantity) === 1 ? 'unit' : 'units'}
                    </p>
                  </div>

                  <hr className="my-2" />

                  <div className="mb-2">
                    <p className="text-muted small mb-1">Borrow Period:</p>
                    <p className="fw-600 text-dark mb-0">
                      {new Date(formData.borrowFromDate).toLocaleDateString()} to{' '}
                      {new Date(formData.borrowToDate).toLocaleDateString()}
                    </p>
                  </div>

                  <hr className="my-2" />

                  <div className="mb-0">
                    <p className="text-muted small mb-1">Purpose:</p>
                    <p className="text-dark mb-0">{formData.notes}</p>
                  </div>
                </div>

                <p className="text-muted small">
                  Once submitted, your request will be reviewed by an administrator.
                </p>
              </div>
              <div className="modal-footer border-top">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowConfirmation(false)}
                  disabled={isSubmitting}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleConfirmSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <i className="fa fa-check me-1"></i>Confirm & Submit
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

export default BorrowEquipment;