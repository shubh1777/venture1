import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import { Check, X, Clock, ChevronDown, Download } from 'lucide-react';

export default function Applications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedAppId, setExpandedAppId] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await api.get('/applications/admin/applications');
        setApplications(response.data.applications || []);
      } catch (error) {
        console.error('Error fetching applications:', error);
        toast.error('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'admin') {
      fetchApplications();
    }
  }, [user]);

  const handleAccept = async (appId, opportunityId, studentId) => {
    try {
      await api.put(`/applications/admin/accept/${appId}`);
      toast.success('Application accepted!');
      setApplications(
        applications.map((app) =>
          app._id === appId ? { ...app, status: 'accepted' } : app
        )
      );
    } catch (error) {
      console.error('Error accepting application:', error);
      toast.error('Failed to accept application');
    }
  };

  const handleRejectClick = (appId) => {
    setSelectedAppId(appId);
    setRejectionReason('');
    setShowRejectModal(true);
  };

  const handleRejectConfirm = async () => {
    const app = applications.find((a) => a._id === selectedAppId);
    if (!app) return;

    try {
      await api.put(`/applications/admin/reject/${selectedAppId}`, {
        rejectionReason,
      });
      toast.success('Application rejected!');
      setApplications(
        applications.map((application) =>
          application._id === selectedAppId
            ? { ...application, status: 'rejected', rejectionReason }
            : application
        )
      );
      setShowRejectModal(false);
    } catch (error) {
      console.error('Error rejecting application:', error);
      toast.error('Failed to reject application');
    }
  };

  const handleRowClick = (appId) => {
    if (expandedAppId === appId) {
      setExpandedAppId(null);
    } else {
      setExpandedAppId(appId);
    }
  };

  // Group applications by opportunity
  const groupedApplications = applications.reduce((acc, app) => {
    const opportunityId = app.opportunityId?._id;
    if (!acc[opportunityId]) {
      acc[opportunityId] = [];
    }
    acc[opportunityId].push(app);
    return acc;
  }, {});

  const filteredApplications = Object.entries(groupedApplications).map(([oppId, apps]) => ({
    opportunityId: oppId,
    applications: filterStatus === 'all' ? apps : apps.filter((app) => app.status === filterStatus),
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading applications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-6">Student Applications</h1>

          {/* Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterStatus === 'all'
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterStatus === 'pending'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilterStatus('accepted')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterStatus === 'accepted'
                  ? 'bg-green-500 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              Accepted
            </button>
            <button
              onClick={() => setFilterStatus('rejected')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterStatus === 'rejected'
                  ? 'bg-red-500 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              Rejected
            </button>
          </div>
        </div>

        {/* Applications List */}
        {filteredApplications.length === 0 || filteredApplications.every((g) => g.applications.length === 0) ? (
          <div className="text-center py-12 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
            <p className="text-gray-300 text-lg">No applications found</p>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredApplications.map((group) => {
              if (group.applications.length === 0) return null;
              const opportunity = group.applications[0]?.opportunityId;
              return (
                <div key={group.opportunityId} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  {/* Opportunity Header */}
                  <div className="mb-6 pb-6 border-b border-white/10">
                    <h2 className="text-2xl font-bold text-white mb-1">{opportunity?.title}</h2>
                    <p className="text-gray-400">{opportunity?.company}</p>
                  </div>

                  {/* Applications Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="px-4 py-3 text-left text-gray-300 font-semibold">Student</th>
                          <th className="px-4 py-3 text-left text-gray-300 font-semibold">Email</th>
                          <th className="px-4 py-3 text-left text-gray-300 font-semibold">Applied Date</th>
                          <th className="px-4 py-3 text-left text-gray-300 font-semibold">Status</th>
                          <th className="px-4 py-3 text-left text-gray-300 font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.applications.map((app) => (
                          <>
                          <tr key={app._id} className="border-b border-white/10 hover:bg-white/5 transition-all">
                            <td className="px-4 py-4 text-white font-medium">{app.studentId?.name}</td>
                            <td className="px-4 py-4 text-gray-300">{app.studentId?.email}</td>
                            <td className="px-4 py-4 text-gray-300">
                              {new Date(app.appliedAt).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-4">
                              {app.status === 'pending' && (
                                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 text-sm rounded-full flex items-center gap-1 w-fit">
                                  <Clock size={14} />
                                  Pending
                                </span>
                              )}
                              {app.status === 'accepted' && (
                                <span className="px-3 py-1 bg-green-500/20 text-green-300 text-sm rounded-full flex items-center gap-1 w-fit">
                                  <Check size={14} />
                                  Accepted
                                </span>
                              )}
                              {app.status === 'rejected' && (
                                <span className="px-3 py-1 bg-red-500/20 text-red-300 text-sm rounded-full flex items-center gap-1 w-fit">
                                  <X size={14} />
                                  Rejected
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-4">
                              {app.status === 'pending' && (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() =>
                                      handleAccept(app._id, app.opportunityId._id, app.studentId._id)
                                    }
                                    className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-all flex items-center gap-1"
                                  >
                                    <Check size={14} />
                                    Accept
                                  </button>
                                  <button
                                    onClick={() => handleRejectClick(app._id)}
                                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-all flex items-center gap-1"
                                  >
                                    <X size={14} />
                                    Reject
                                  </button>
                                </div>
                              )}
                              {app.status === 'rejected' && app.rejectionReason && (
                                <div className="text-xs text-red-300 bg-red-500/10 p-2 rounded">
                                  <strong>Reason:</strong> {app.rejectionReason}
                                </div>
                              )}
                              {app.status === 'accepted' && app.responseAt && (
                                <span className="text-xs text-green-300">
                                  Accepted on {new Date(app.responseAt).toLocaleDateString()}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-4">
                              <button onClick={() => handleRowClick(app._id)} className="p-2 rounded-lg text-slate-400 hover:bg-white/10">
                                <ChevronDown className={`w-5 h-5 transition-transform ${expandedAppId === app._id ? 'rotate-180' : ''}`} />
                              </button>
                            </td>
                          </tr>
                          {expandedAppId === app._id && (
                            <tr className="bg-white/5">
                              <td colSpan="6" className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                  <div>
                                    <p className="font-semibold text-gray-300 mb-1">CGPA</p>
                                    <p className="text-white">{app.cgpa || 'N/A'}</p>
                                  </div>
                                  <div className="md:col-span-2">
                                    <p className="font-semibold text-gray-300 mb-1">Skills</p>
                                    <p className="text-white whitespace-pre-wrap">{app.skills || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <p className="font-semibold text-gray-300 mb-1">Resume</p>
                                    <a
                                      href={`${api.defaults.baseURL}/applications/resume/${app._id}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
                                    >
                                      <Download size={16} />
                                      Download Resume
                                    </a>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                          </>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Rejection Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-xl p-6 max-w-md w-full mx-4 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Reject Application</h3>
              <p className="text-gray-300 mb-4">
                Provide a reason for rejection (optional):
              </p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="E.g., Does not meet the required skills..."
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 mb-4"
                rows="3"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleRejectConfirm}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all"
                >
                  Reject
                </button>
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-500/20 hover:bg-gray-500/30 text-white rounded-lg font-medium transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
