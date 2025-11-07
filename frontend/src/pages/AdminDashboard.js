import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGet, apiPost } from '../services/api';

/**
 * AdminDashboard Page
 * 
 * UPDATES (Phase 2 Integration):
 * ✅ Removed mockStats
 * ✅ Removed mockRecentRequests
 * ✅ Fetch real stats from: GET /api/admin/stats
 * ✅ Fetch real requests from: GET /api/requests
 * ✅ Approve/reject requests with real API calls
 * ✅ Loading and error states
 * ✅ Real-time updates
 */

const AdminDashboard = ({ user }) => {
  const navigate = useNavigate();

  // Stats state
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState('');

  // Requests state
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [requestsError, setRequestsError] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);

  // Action modal state
  const [actionModal, setActionModal] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  /**
   * Fetch admin statistics on component mount
   */
  useEffect(() => {
    fetchAdminStats();
  }, []);

  /**
   * Fetch pending requests
   */
  useEffect(() => {
    fetchRequests();
  }, [currentPage]);

  /**
   * Fetch admin statistics
   */
  const fetchAdminStats = async () => {
    try {
      setStatsLoading(true);
      setStatsError('');

      // Call: GET /api/requests/admin/stats
      const response = await apiGet('/api/requests/admin/stats');

      if (response.success) {
        setStats(response.data.stats);
        console.log('Admin stats loaded:', response.data.stats);
      } else {
        setStatsError(response.message || 'Failed to load statistics');
      }
    } catch (err) {
      console.error('Error loading stats:', err);
      setStatsError(err.message || 'Error loading statistics from server');
    } finally {
      setStatsLoading(false);
    }
  };

  /**
   * Fetch all pending requests
   */
  const fetchRequests = async () => {
    try {
      setRequestsLoading(true);
      setRequestsError('');

      // Build query parameters
      const params = new URLSearchParams();
      params.append('status', 'pending'); // Only show pending requests
      params.append('page', currentPage);
      params.append('limit', pageSize);

      // Call: GET /api/requests?status=pending&page=1&limit=10
      const response = await apiGet(`/api/requests?${params.toString()}`);

      if (response.success) {
        setRequests(response.data.requests);
        setTotalPages(response.data.pagination.pages);
        console.log('Requests loaded:', response.data.requests);
      } else {
        setRequestsError(response.message || 'Failed to load requests');
      }
    } catch (err) {
      console.error('Error loading requests:', err);
      setRequestsError(err.message || 'Error loading requests from server');
    } finally {
      setRequestsLoading(false);
    }
  };

  /**
   * Handle approve request
   */
  const handleApproveRequest = async () => {
    if (!actionModal?.id) return;

    try {
      setActionLoading(true);

      // Call: POST /api/requests/:requestId/approve
      const response = await apiPost(`/api/requests/${actionModal.id}/approve`, {
        approvalNotes: 'Approved by admin',
      });

      if (response.success) {
        console.log('Request approved:', response.data);
        // Refresh requests list
        fetchRequests();
        setActionModal(null);
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
  const handleRejectRequest = async () => {
    if (!actionModal?.id) return;

    try {
      setActionLoading(true);

      // Call: POST /api/requests/:requestId/reject
      const response = await apiPost(`/api/requests/${actionModal.id}/reject`, {
        reason: 'Rejected by admin',
      });

      if (response.success) {
        console.log('Request rejected:', response.data);
        // Refresh requests list
        fetchRequests();
        setActionModal(null);
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
   * Get pending requests count
   */
  const getPendingRequestsCount = () => {
    return stats?.requestBreakdown?.pending || 0;
  };

  return (
    <div className="container-fluid py-4">
      {/* Welcome Header */}
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="h3 fw-bold text-dark">
            <i className="fa fa-tachometer me-2 text-primary"></i>Admin Dashboard
          </h1>
          <p className="text-muted">Welcome, {user.name}. Manage equipment and handle requests.</p>
        </div>
      </div>

      {/* Stats Error Message */}
      {statsError && (
        <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
          <i className="fa fa-exclamation-circle me-2"></i>
          <strong>Error!</strong> {statsError}
          <button
            type="button"
            className="btn-close"
            onClick={() => setStatsError('')}
          ></button>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="row mb-4 g-3">
        {statsLoading ? (
          <div className="col-12">
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Loading statistics...</p>
            </div>
          </div>
        ) : stats ? (
          <>
            {/* Total Equipment Card */}
            <div className="col-md-4 col-lg-2">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <p className="text-muted small mb-1">
                        <i className="fa fa-box me-1"></i>Total Equipment
                      </p>
                      <h4 className="fw-bold text-primary mb-0">{stats.totalEquipment}</h4>
                    </div>
                    <i className="fa fa-cubes fa-2x text-dark"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Available Equipment Card */}
            <div className="col-md-4 col-lg-2">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <p className="text-muted small mb-1">
                        <i className="fa fa-check-circle me-1"></i>Available
                      </p>
                      <h4 className="fw-bold text-success mb-0">{stats.availableEquipment}</h4>
                    </div>
                    <i className="fa fa-check-circle fa-2x text-dark"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Borrowed Equipment Card */}
            <div className="col-md-4 col-lg-2">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <p className="text-muted small mb-1">
                        <i className="fa fa-arrow-right me-1"></i>Borrowed
                      </p>
                      <h4 className="fw-bold text-info mb-0">{stats.borrowedEquipment}</h4>
                    </div>
                    <i className="fa fa-arrow-right fa-2x text-dark"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Pending Requests Card */}
            <div className="col-md-4 col-lg-2">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <p className="text-muted small mb-1">
                        <i className="fa fa-hourglass-half me-1"></i>Pending
                      </p>
                      <h4 className="fw-bold text-warning mb-0">{getPendingRequestsCount()}</h4>
                    </div>
                    <i className="fa fa-hourglass-half fa-2x text-dark"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Users Card */}
            <div className="col-md-4 col-lg-2">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <p className="text-muted small mb-1">
                        <i className="fa fa-users me-1"></i>Total Users
                      </p>
                      <h4 className="fw-bold text-secondary mb-0">{stats.totalUsers}</h4>
                    </div>
                    <i className="fa fa-users fa-2x text-dark"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Loans Card */}
            <div className="col-md-4 col-lg-2">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <p className="text-muted small mb-1">
                        <i className="fa fa-exchange me-1"></i>Active Loans
                      </p>
                      <h4 className="fw-bold text-danger mb-0">{stats.requestBreakdown?.approved || 0}</h4>
                    </div>
                    <i className="fa fa-exchange fa-2x text-dark"></i>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>

      {/* Quick Actions */}
      <div className="row mb-4">
        <div className="col-12">
          <h5 className="fw-bold text-dark mb-3">
            <i className="fa fa-bolt me-2 text-warning"></i>Quick Actions
          </h5>
          <div className="d-flex gap-2 flex-wrap">
            <button 
              type="button"
              onClick={() => navigate('/equipment-management')} 
              className="btn btn-outline-primary"
            >
              <i className="fa fa-plus-circle me-1"></i>Add Equipment
            </button>
            <button 
              type="button"
              onClick={() => navigate('/equipment-management')} 
              className="btn btn-outline-secondary"
            >
              <i className="fa fa-edit me-1"></i>Manage Equipment
            </button>
            <button 
              type="button"
              onClick={() => {
                fetchAdminStats();
                fetchRequests();
              }}
              className="btn btn-outline-info"
            >
              <i className="fa fa-refresh me-1"></i>Refresh Data
            </button>
          </div>
        </div>
      </div>

      {/* Requests Error Message */}
      {requestsError && (
        <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
          <i className="fa fa-exclamation-circle me-2"></i>
          <strong>Error!</strong> {requestsError}
          <button
            type="button"
            className="btn-close"
            onClick={() => setRequestsError('')}
          ></button>
        </div>
      )}

      {/* Pending Requests Section */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-light border-bottom">
              <h5 className="fw-bold text-dark mb-0">
                <i className="fa fa-clock-o me-2 text-warning"></i>Pending Requests
                <span className="badge bg-warning ms-2">{getPendingRequestsCount()}</span>
              </h5>
            </div>
            <div className="card-body p-0">
              {requestsLoading ? (
                <div className="text-center py-4">
                  <div className="spinner-border spinner-border-sm text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2 text-muted small">Loading requests...</p>
                </div>
              ) : requests.length > 0 ? (
                <>
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
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
                            <i className="fa fa-calendar me-2"></i>Duration
                          </th>
                          <th className="fw-600 text-dark">
                            <i className="fa fa-clock-o me-2"></i>Requested Date
                          </th>
                          <th className="fw-600 text-dark text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {requests.map((request) => (
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
                              {new Date(request.requestedDate).toLocaleDateString()}
                            </td>
                            <td className="text-center">
                              <button
                                className="btn btn-sm btn-success me-2"
                                onClick={() => setActionModal({ id: request._id, action: 'approve' })}
                                title="Approve request"
                                disabled={actionLoading}
                              >
                                <i className="fa fa-check me-1"></i>Approve
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => setActionModal({ id: request._id, action: 'reject' })}
                                title="Reject request"
                                disabled={actionLoading}
                              >
                                <i className="fa fa-times me-1"></i>Reject
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <nav className="mt-3 ms-3 mb-3" aria-label="Page navigation">
                      <ul className="pagination pagination-sm">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(currentPage - 1)}
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
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </button>
                          </li>
                        ))}

                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                          >
                            Next
                          </button>
                        </li>
                      </ul>
                    </nav>
                  )}
                </>
              ) : (
                <div className="text-center py-4">
                  <i className="fa fa-check-circle fa-2x text-success mb-2 d-block"></i>
                  <p className="text-muted">No pending requests</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Confirmation Modal */}
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
                  ) : (
                    <>
                      <i className="fa fa-times-circle me-2 text-danger"></i>Reject Request
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
                <p className="text-muted">
                  Are you sure you want to{' '}
                  <strong>{actionModal.action === 'approve' ? 'approve' : 'reject'}</strong> this
                  request?
                </p>
                <div className="alert alert-info alert-sm">
                  <i className="fa fa-info-circle me-2"></i>
                  This action will be recorded in the system.
                </div>
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
                  className={actionModal.action === 'approve' ? 'btn btn-success' : 'btn btn-danger'}
                  onClick={() =>
                    actionModal.action === 'approve'
                      ? handleApproveRequest()
                      : handleRejectRequest()
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
                      <i className={`fa ${actionModal.action === 'approve' ? 'fa-check' : 'fa-times'} me-1`}></i>
                      {actionModal.action === 'approve' ? 'Approve' : 'Reject'}
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

export default AdminDashboard;