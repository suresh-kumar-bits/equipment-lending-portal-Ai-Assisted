import React, { useState, useEffect } from 'react';
import { apiGet } from '../services/api';

/**
 * BorrowHistory Page
 * 
 * UPDATES (Phase 2 Integration):
 * ✅ Removed mockBorrowHistory
 * ✅ Fetch user requests from: GET /api/requests/user/:userId
 * ✅ Filter by status and search
 * ✅ Loading and error states
 * ✅ View request details
 * 
 * This page displays:
 * - All borrowing requests made by the logged-in user
 * - Status of each request (pending, approved, rejected, returned)
 * - Request details and history
 * - Filter and search functionality
 */

const BorrowHistory = ({ user }) => {
  // State management
  const [borrowHistory, setBorrowHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewDetails, setViewDetails] = useState(null);

  /**
   * Fetch user's requests on component mount
   */
  useEffect(() => {
    fetchUserRequests();
  }, []);

  /**
   * Fetch user's borrow requests from backend
   */
  const fetchUserRequests = async () => {
    try {
      setLoading(true);
      setError('');

      // Get user ID
      const userId = user._id || user.id;

      if (!userId) {
        setError('User ID not found');
        setLoading(false);
        return;
      }

      // Build query parameters
      const params = new URLSearchParams();
      params.append('limit', '100'); // Get all user requests

      // Call: GET /api/requests/user/:userId
      const response = await apiGet(`/api/requests/user/${userId}?${params.toString()}`);

      if (response.success) {
        setBorrowHistory(response.data.requests);
        console.log('User requests loaded:', response.data.requests);
      } else {
        setError(response.message || 'Failed to load borrow history');
      }
    } catch (err) {
      console.error('Error loading borrow history:', err);
      setError(err.message || 'Error loading borrow history from server');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Filter history based on search and status
   */
  const getFilteredHistory = () => {
    let filtered = borrowHistory;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.equipmentName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter((item) => item.status === filterStatus);
    }

    return filtered;
  };

  /**
   * Get status badge styling
   */
  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: { bg: 'bg-warning', icon: 'fa-hourglass-half', text: 'Pending' },
      approved: { bg: 'bg-info', icon: 'fa-check-circle', text: 'Approved' },
      returned: { bg: 'bg-success', icon: 'fa-check-double', text: 'Returned' },
      rejected: { bg: 'bg-danger', icon: 'fa-times-circle', text: 'Rejected' },
    };
    return statusStyles[status] || statusStyles.pending;
  };

  /**
   * Count requests by status
   */
  const getStatusCount = (status) => {
    return borrowHistory.filter((item) => item.status === status).length;
  };

  const filteredHistory = getFilteredHistory();

  return (
    <div className="container-fluid py-4">
      {/* Header Section */}
      <div className="row mb-4">
        <div className="col-md-8">
          <h1 className="h3 fw-bold text-dark">
            <i className="fa fa-history me-2 text-primary"></i>Borrow History
          </h1>
          <p className="text-muted">View all your borrowing requests and history</p>
        </div>
        <div className="col-md-4 text-end">
          <button
            className="btn btn-outline-secondary"
            onClick={fetchUserRequests}
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

      {/* Status Summary Cards */}
      <div className="row mb-4 g-3">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm bg-light">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div>
                  <p className="text-muted small mb-1">
                    <i className="fa fa-hourglass-half me-1 text-warning"></i>Pending
                  </p>
                  <h4 className="fw-bold text-warning mb-0">
                    {getStatusCount('pending')}
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm bg-light">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div>
                  <p className="text-muted small mb-1">
                    <i className="fa fa-check-circle me-1 text-info"></i>Approved
                  </p>
                  <h4 className="fw-bold text-info mb-0">
                    {getStatusCount('approved')}
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm bg-light">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div>
                  <p className="text-muted small mb-1">
                    <i className="fa fa-check-double me-1 text-success"></i>Returned
                  </p>
                  <h4 className="fw-bold text-success mb-0">
                    {getStatusCount('returned')}
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm bg-light">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div>
                  <p className="text-muted small mb-1">
                    <i className="fa fa-times-circle me-1 text-danger"></i>Rejected
                  </p>
                  <h4 className="fw-bold text-danger mb-0">
                    {getStatusCount('rejected')}
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
              <span>Loading borrow history...</span>
            </div>
          ) : (
            <p className="text-muted small">
              Showing <strong>{filteredHistory.length}</strong> of{' '}
              <strong>{borrowHistory.length}</strong> requests
            </p>
          )}
        </div>
      </div>

      {/* Borrow History Table */}
      {!loading && filteredHistory.length > 0 ? (
        <div className="row mb-4">
          <div className="col-12">
            <div className="table-responsive">
              <table className="table table-hover border">
                <thead className="table-light">
                  <tr>
                    <th className="fw-600 text-dark">
                      <i className="fa fa-box me-2"></i>Equipment
                    </th>
                    <th className="fw-600 text-dark">
                      <i className="fa fa-calendar me-2"></i>Requested Date
                    </th>
                    <th className="fw-600 text-dark">
                      <i className="fa fa-calendar-check me-2"></i>Borrow Date
                    </th>
                    <th className="fw-600 text-dark">
                      <i className="fa fa-calendar-times me-2"></i>Return Date
                    </th>
                    <th className="fw-600 text-dark">
                      <i className="fa fa-info-circle me-2"></i>Status
                    </th>
                    <th className="fw-600 text-dark text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map((item) => {
                    const status = getStatusBadge(item.status);
                    return (
                      <tr key={item._id}>
                        <td>
                          <div>
                            <p className="fw-600 text-dark mb-1">{item.equipmentName}</p>
                          </div>
                        </td>
                        <td className="text-muted">
                          {new Date(item.requestedDate).toLocaleDateString()}
                        </td>
                        <td className="text-muted">
                          {item.borrowFromDate
                            ? new Date(item.borrowFromDate).toLocaleDateString()
                            : '-'}
                        </td>
                        <td className="text-muted">
                          {item.borrowToDate
                            ? new Date(item.borrowToDate).toLocaleDateString()
                            : '-'}
                        </td>
                        <td>
                          <span className={`badge ${status.bg}`}>
                            <i className={`fa ${status.icon} me-1`}></i>
                            {status.text}
                          </span>
                        </td>
                        <td className="text-center">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => setViewDetails(item)}
                            title="View details"
                          >
                            <i className="fa fa-eye"></i>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : !loading && filteredHistory.length === 0 ? (
        <div className="text-center py-5">
          <i className="fa fa-inbox fa-3x text-muted mb-3 d-block"></i>
          <h5 className="text-muted">No requests found</h5>
          <p className="text-muted small">
            Try adjusting your search or filters
          </p>
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
                  <h6 className="fw-600 text-dark mb-2">Equipment</h6>
                  <p className="mb-0">
                    <strong>{viewDetails.equipmentName}</strong>
                  </p>
                </div>

                <hr />

                <div className="mb-3">
                  <h6 className="fw-600 text-dark mb-2">Request Status</h6>
                  <div className="mb-2">
                    <span className={`badge ${getStatusBadge(viewDetails.status).bg}`}>
                      <i className={`fa ${getStatusBadge(viewDetails.status).icon} me-1`}></i>
                      {getStatusBadge(viewDetails.status).text}
                    </span>
                  </div>
                  <small className="text-muted">
                    Requested: {new Date(viewDetails.requestedDate).toLocaleDateString()}
                  </small>
                </div>

                <hr />

                <div className="mb-3">
                  <h6 className="fw-600 text-dark mb-2">Dates</h6>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted">Borrow Date:</span>
                    <strong className="text-dark">
                      {viewDetails.borrowFromDate
                        ? new Date(viewDetails.borrowFromDate).toLocaleDateString()
                        : '-'}
                    </strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Return Date:</span>
                    <strong className="text-dark">
                      {viewDetails.borrowToDate
                        ? new Date(viewDetails.borrowToDate).toLocaleDateString()
                        : '-'}
                    </strong>
                  </div>
                </div>

                <hr />

                {viewDetails.notes && (
                  <div className="mb-3">
                    <h6 className="fw-600 text-dark mb-2">Notes</h6>
                    <p className="mb-0 text-muted">{viewDetails.notes}</p>
                  </div>
                )}

                {viewDetails.approvalNotes && (
                  <div className="mb-0">
                    <h6 className="fw-600 text-dark mb-2">Approval Notes</h6>
                    <p className="mb-0 text-muted">{viewDetails.approvalNotes}</p>
                  </div>
                )}
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
    </div>
  );
};

export default BorrowHistory;