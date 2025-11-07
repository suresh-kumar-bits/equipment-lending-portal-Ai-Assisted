import React, { useState, useEffect } from 'react';
import { apiGet, apiPost } from '../services/api';

/**
 * RequestsManagement Page
 * 
 * UPDATES (Phase 2 Integration):
 * ✅ Removed mockRequestsData
 * ✅ Fetch requests from: GET /api/requests
 * ✅ Approve requests: POST /api/requests/:id/approve
 * ✅ Reject requests: POST /api/requests/:id/reject
 * ✅ Mark as returned: POST /api/requests/:id/return
 * ✅ Loading and error states
 * ✅ Real-time data updates
 * 
 * This page allows admins to:
 * - View all borrowing requests
 * - Filter by status (pending, approved, rejected, returned)
 * - Search by student name or equipment name
 * - Approve/Reject requests with notes
 * - Mark equipment as returned
 */

const RequestsManagement = ({ user }) => {
  // State management
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [actionModal, setActionModal] = useState(null);
  const [actionNotes, setActionNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [viewDetails, setViewDetails] = useState(null);

  /**
   * Fetch all requests on component mount
   */
  useEffect(() => {
    fetchRequests();
  }, []);

  /**
   * Fetch all requests from backend
   */
  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError('');

      // Build query parameters
      const params = new URLSearchParams();
      params.append('limit', '100'); // Get all requests

      // Call: GET /api/requests
      const response = await apiGet(`/api/requests?${params.toString()}`);

      if (response.success) {
        setRequests(response.data.requests);
        console.log('Requests loaded:', response.data.requests);
      } else {
        setError(response.message || 'Failed to load requests');
      }
    } catch (err) {
      console.error('Error loading requests:', err);
      setError(err.message || 'Error loading requests from server');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Filter requests based on search and status
   */
  const getFilteredRequests = () => {
    let filtered = requests;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (req) =>
          req.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.studentId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter((req) => req.status === filterStatus);
    }

    return filtered;
  };

  /**
   * Get status badge styling
   */
  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: { bg: 'bg-warning', icon: 'fa-hourglass-half', text: 'Pending' },
      approved: { bg: 'bg-success', icon: 'fa-check-circle', text: 'Approved' },
      returned: { bg: 'bg-info', icon: 'fa-check-double', text: 'Returned' },
      rejected: { bg: 'bg-danger', icon: 'fa-times-circle', text: 'Rejected' },
    };
    return statusStyles[status] || statusStyles.pending;
  };

  /**
   * Handle approve request
   */
  const handleApprove = async () => {
    if (!actionModal?.id) return;

    try {
      setActionLoading(true);

      // Call: POST /api/requests/:requestId/approve
      const response = await apiPost(`/api/requests/${actionModal.id}/approve`, {
        approvalNotes: actionNotes,
      });

      if (response.success) {
        console.log('Request approved:', response.data);
        // Refresh requests list
        fetchRequests();
        setActionModal(null);
        setActionNotes('');
        alert('✅ Request approved successfully!');
      } else {
        alert('❌ ' + (response.message || 'Failed to approve request'));
      }
    } catch (err) {
      console.error('Error approving request:', err);
      alert('❌ Error approving request: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Handle reject request
   */
  const handleReject = async () => {
    if (!actionModal?.id) return;

    try {
      setActionLoading(true);

      // Call: POST /api/requests/:requestId/reject
      const response = await apiPost(`/api/requests/${actionModal.id}/reject`, {
        reason: actionNotes,
      });

      if (response.success) {
        console.log('Request rejected:', response.data);
        // Refresh requests list
        fetchRequests();
        setActionModal(null);
        setActionNotes('');
        alert('✅ Request rejected successfully!');
      } else {
        alert('❌ ' + (response.message || 'Failed to reject request'));
      }
    } catch (err) {
      console.error('Error rejecting request:', err);
      alert('❌ Error rejecting request: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Handle mark as returned
   */
  const handleMarkReturned = async () => {
    if (!actionModal?.id) return;

    try {
      setActionLoading(true);

      // Call: POST /api/requests/:requestId/return
      const response = await apiPost(`/api/requests/${actionModal.id}/return`, {
        condition: 'Good', // Could be dynamic in future
        returnNotes: actionNotes,
      });

      if (response.success) {
        console.log('Equipment marked as returned:', response.data);
        // Refresh requests list
        fetchRequests();
        setActionModal(null);
        setActionNotes('');
        alert('✅ Equipment marked as returned successfully!');
      } else {
        alert('❌ ' + (response.message || 'Failed to mark as returned'));
      }
    } catch (err) {
      console.error('Error marking as returned:', err);
      alert('❌ Error marking as returned: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Get request count by status
   */
  const getStatusCount = (status) => {
    return requests.filter((req) => req.status === status).length;
  };

  const filteredRequests = getFilteredRequests();

  return (
    <div className="container-fluid py-4">
      {/* Header Section */}
      <div className="row mb-4">
        <div className="col-md-8">
          <h1 className="h3 fw-bold text-dark">
            <i className="fa fa-list me-2 text-primary"></i>Manage Requests
          </h1>
          <p className="text-muted">Review and manage all borrowing requests</p>
        </div>
        <div className="col-md-4 text-end">
          <button
            className="btn btn-outline-secondary"
            onClick={fetchRequests}
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

      {/* Status Summary */}
      <div className="row mb-4 g-3">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm bg-light">
            <div className="card-body">
              <p className="text-muted small mb-1">
                <i className="fa fa-hourglass-half me-1 text-warning"></i>Pending
              </p>
              <h4 className="fw-bold text-warning mb-0">{getStatusCount('pending')}</h4>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm bg-light">
            <div className="card-body">
              <p className="text-muted small mb-1">
                <i className="fa fa-check-circle me-1 text-success"></i>Approved
              </p>
              <h4 className="fw-bold text-success mb-0">{getStatusCount('approved')}</h4>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm bg-light">
            <div className="card-body">
              <p className="text-muted small mb-1">
                <i className="fa fa-check-double me-1 text-info"></i>Returned
              </p>
              <h4 className="fw-bold text-info mb-0">{getStatusCount('returned')}</h4>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm bg-light">
            <div className="card-body">
              <p className="text-muted small mb-1">
                <i className="fa fa-times-circle me-1 text-danger"></i>Rejected
              </p>
              <h4 className="fw-bold text-danger mb-0">{getStatusCount('rejected')}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="row mb-4">
        <div className="col-md-8">
          <label className="form-label fw-600 text-dark">
            <i className="fa fa-search me-2"></i>Search
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Search by student name, student ID, or equipment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="col-md-4">
          <label className="form-label fw-600 text-dark">
            <i className="fa fa-filter me-2"></i>Filter by Status
          </label>
          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            disabled={loading}
          >
            <option value="all">All Requests</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="returned">Returned</option>
            <option value="rejected">Rejected</option>
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
              <span>Loading requests...</span>
            </div>
          ) : (
            <p className="text-muted small">
              Showing <strong>{filteredRequests.length}</strong> of{' '}
              <strong>{requests.length}</strong> requests
            </p>
          )}
        </div>
      </div>

      {/* Requests Table */}
      {!loading && filteredRequests.length > 0 ? (
        <div className="row mb-4">
          <div className="col-12">
            <div className="table-responsive">
              <table className="table table-hover border">
                <thead className="table-light">
                  <tr>
                    <th className="fw-600 text-dark">
                      <i className="fa fa-user me-2"></i>Student
                    </th>
                    <th className="fw-600 text-dark">
                      <i className="fa fa-box me-2"></i>Equipment
                    </th>
                    <th className="fw-600 text-dark">
                      <i className="fa fa-hashtag me-2"></i>Quantity
                    </th>
                    <th className="fw-600 text-dark">
                      <i className="fa fa-calendar me-2"></i>Borrow Period
                    </th>
                    <th className="fw-600 text-dark">
                      <i className="fa fa-clock-o me-2"></i>Requested
                    </th>
                    <th className="fw-600 text-dark">
                      <i className="fa fa-info-circle me-2"></i>Status
                    </th>
                    <th className="fw-600 text-dark text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((request) => {
                    const status = getStatusBadge(request.status);
                    return (
                      <tr key={request._id}>
                        <td>
                          <div>
                            <p className="fw-600 text-dark mb-1">{request.studentName}</p>
                            <small className="text-muted">{request.studentEmail}</small>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-light text-dark">
                            <i className="fa fa-box me-1"></i>
                            {request.equipmentName}
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-info">
                            <i className="fa fa-hashtag me-1"></i>
                            {request.quantity} {request.quantity === 1 ? 'unit' : 'units'}
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-light text-dark">
                            <i className="fa fa-calendar me-1"></i>
                            {new Date(request.borrowFromDate).toLocaleDateString()}
                            <i className="fa fa-arrow-right mx-1"></i>
                            {new Date(request.borrowToDate).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="text-muted">
                          <small>
                            {new Date(request.requestedDate).toLocaleDateString()}
                          </small>
                        </td>
                        <td>
                          <span className={`badge ${status.bg}`}>
                            <i className={`fa ${status.icon} me-1`}></i>
                            {status.text}
                          </span>
                        </td>
                        <td className="text-center">
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => setViewDetails(request)}
                            title="View details"
                            disabled={actionLoading}
                          >
                            <i className="fa fa-eye"></i>
                          </button>

                          {request.status === 'pending' && (
                            <>
                              <button
                                className="btn btn-sm btn-success me-2"
                                onClick={() =>
                                  setActionModal({ id: request._id, action: 'approve' })
                                }
                                title="Approve"
                                disabled={actionLoading}
                              >
                                <i className="fa fa-check"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() =>
                                  setActionModal({ id: request._id, action: 'reject' })
                                }
                                title="Reject"
                                disabled={actionLoading}
                              >
                                <i className="fa fa-times"></i>
                              </button>
                            </>
                          )}

                          {request.status === 'approved' && (
                            <button
                              className="btn btn-sm btn-info"
                              onClick={() =>
                                setActionModal({ id: request._id, action: 'return' })
                              }
                              title="Mark as returned"
                              disabled={actionLoading}
                            >
                              <i className="fa fa-arrow-left me-1"></i>Returned
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : !loading && filteredRequests.length === 0 ? (
        <div className="text-center py-5">
          <i className="fa fa-inbox fa-3x text-muted mb-3 d-block"></i>
          <h5 className="text-muted">No requests found</h5>
          <p className="text-muted small">Try adjusting your search or filters</p>
        </div>
      ) : null}

      {/* Details Modal */}
      {viewDetails && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-light border-bottom">
                <h5 className="modal-title fw-bold">
                  <i className="fa fa-info-circle me-2 text-primary"></i>Request Details
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setViewDetails(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <h6 className="fw-600 text-dark mb-2">Student Information</h6>
                  <p className="mb-1">
                    <strong>{viewDetails.studentName}</strong>
                  </p>
                  <p className="mb-1 small text-muted">Email: {viewDetails.studentEmail}</p>
                </div>

                <hr />

                <div className="mb-3">
                  <h6 className="fw-600 text-dark mb-2">Equipment Details</h6>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Name:</span>
                    <strong>{viewDetails.equipmentName}</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Quantity Requested:</span>
                    <strong className="text-primary">
                      {viewDetails.quantity} {viewDetails.quantity === 1 ? 'unit' : 'units'}
                    </strong>
                  </div>
                </div>

                <hr />

                <div className="mb-3">
                  <h6 className="fw-600 text-dark mb-2">Dates</h6>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted">Requested:</span>
                    <strong>{new Date(viewDetails.requestedDate).toLocaleDateString()}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted">From:</span>
                    <strong>{new Date(viewDetails.borrowFromDate).toLocaleDateString()}</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">To:</span>
                    <strong>{new Date(viewDetails.borrowToDate).toLocaleDateString()}</strong>
                  </div>
                </div>

                <hr />

                {viewDetails.notes && (
                  <div className="mb-3">
                    <h6 className="fw-600 text-dark mb-2">Notes</h6>
                    <p className="text-muted mb-0">{viewDetails.notes}</p>
                  </div>
                )}

                <div className="mb-0">
                  <h6 className="fw-600 text-dark mb-2">Status</h6>
                  <span className={`badge ${getStatusBadge(viewDetails.status).bg}`}>
                    {getStatusBadge(viewDetails.status).text}
                  </span>
                </div>
              </div>
              <div className="modal-footer border-top">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setViewDetails(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Modal */}
      {actionModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-light border-bottom">
                <h5 className="modal-title fw-bold">
                  {actionModal.action === 'approve' ? (
                    <>
                      <i className="fa fa-check-circle me-2 text-success"></i>Approve Request
                    </>
                  ) : actionModal.action === 'reject' ? (
                    <>
                      <i className="fa fa-times-circle me-2 text-danger"></i>Reject Request
                    </>
                  ) : (
                    <>
                      <i className="fa fa-arrow-left me-2 text-info"></i>Mark as Returned
                    </>
                  )}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setActionModal(null)}
                  disabled={actionLoading}
                ></button>
              </div>
              <div className="modal-body">
                <label className="form-label fw-600 text-dark">
                  {actionModal.action === 'approve'
                    ? 'Approval Notes'
                    : actionModal.action === 'reject'
                    ? 'Rejection Reason'
                    : 'Return Notes'}
                </label>
                <textarea
                  className="form-control"
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  placeholder={
                    actionModal.action === 'approve'
                      ? 'Add approval notes...'
                      : actionModal.action === 'reject'
                      ? 'Explain why you are rejecting this request...'
                      : 'Add return notes (condition, etc.)...'
                  }
                  rows="4"
                  disabled={actionLoading}
                ></textarea>
              </div>
              <div className="modal-footer border-top">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setActionModal(null)}
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={`btn ${
                    actionModal.action === 'approve'
                      ? 'btn-success'
                      : actionModal.action === 'reject'
                      ? 'btn-danger'
                      : 'btn-info'
                  }`}
                  onClick={() =>
                    actionModal.action === 'approve'
                      ? handleApprove()
                      : actionModal.action === 'reject'
                      ? handleReject()
                      : handleMarkReturned()
                  }
                  disabled={actionLoading}
                >
                  {actionLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Processing...
                    </>
                  ) : (
                    <>
                      {actionModal.action === 'approve'
                        ? 'Approve'
                        : actionModal.action === 'reject'
                        ? 'Reject'
                        : 'Mark Returned'}
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

export default RequestsManagement;