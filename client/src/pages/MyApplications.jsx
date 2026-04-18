import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import { Check, X, Clock, Briefcase } from 'lucide-react';

export default function MyApplications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await api.get('/applications/my-applications');
        setApplications(response.data.applications || []);
      } catch (error) {
        console.error('Error fetching applications:', error);
        toast.error('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'student') {
      fetchApplications();
    }
  }, [user]);

  const filteredApplications =
    filterStatus === 'all' ? applications : applications.filter((app) => app.status === filterStatus);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock size={20} className="text-yellow-400" />;
      case 'accepted':
        return <Check size={20} className="text-green-400" />;
      case 'rejected':
        return <X size={20} className="text-red-400" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30';
      case 'accepted':
        return 'bg-green-500/20 text-green-300 border border-green-500/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-300 border border-red-500/30';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading your applications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-6">My Applications</h1>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <p className="text-gray-400 text-sm">Total Applications</p>
              <p className="text-2xl font-bold text-white">{applications.length}</p>
            </div>
            <div className="bg-yellow-500/10 backdrop-blur-md rounded-xl p-4 border border-yellow-500/20">
              <p className="text-yellow-300 text-sm">Pending</p>
              <p className="text-2xl font-bold text-yellow-300">
                {applications.filter((a) => a.status === 'pending').length}
              </p>
            </div>
            <div className="bg-green-500/10 backdrop-blur-md rounded-xl p-4 border border-green-500/20">
              <p className="text-green-300 text-sm">Accepted</p>
              <p className="text-2xl font-bold text-green-300">
                {applications.filter((a) => a.status === 'accepted').length}
              </p>
            </div>
            <div className="bg-red-500/10 backdrop-blur-md rounded-xl p-4 border border-red-500/20">
              <p className="text-red-300 text-sm">Rejected</p>
              <p className="text-2xl font-bold text-red-300">
                {applications.filter((a) => a.status === 'rejected').length}
              </p>
            </div>
          </div>

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
        {filteredApplications.length === 0 ? (
          <div className="text-center py-12 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
            <Briefcase className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-300 text-lg">
              {filterStatus === 'all'
                ? 'You haven\'t applied to any opportunities yet'
                : `No ${filterStatus} applications`}
            </p>
            <a
              href="/opportunities"
              className="mt-4 inline-block px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-all"
            >
              Explore Opportunities
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((app) => (
              <div
                key={app._id}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Application Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{app.opportunityId?.title}</h3>
                      <span className={`px-3 py-1 text-sm rounded-full ${getStatusBadge(app.status)}`}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </div>

                    <p className="text-gray-400 mb-2">{app.opportunityId?.company}</p>
                    <p className="text-gray-300 text-sm mb-4">{app.opportunityId?.description}</p>

                    <div className="flex flex-wrap gap-3 mb-4">
                      {app.opportunityId?.location && (
                        <span className="text-sm text-gray-300 bg-gray-500/10 px-3 py-1 rounded">
                          📍 {app.opportunityId.location}
                        </span>
                      )}
                      {app.opportunityId?.stipend && (
                        <span className="text-sm text-green-300 bg-green-500/10 px-3 py-1 rounded">
                          💰 {app.opportunityId.stipend}
                        </span>
                      )}
                      <span className="text-sm text-gray-300 bg-gray-500/10 px-3 py-1 rounded">
                        📅 Applied: {new Date(app.appliedAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Status-specific content */}
                    {app.status === 'accepted' && app.responseAt && (
                      <div className="mt-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <p className="text-green-300 text-sm">
                          ✓ Accepted on {new Date(app.responseAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}

                    {app.status === 'rejected' && (
                      <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <p className="text-red-300 text-sm font-medium">✗ Application Rejected</p>
                        {app.rejectionReason && (
                          <p className="text-red-300 text-sm mt-1">
                            <strong>Reason:</strong> {app.rejectionReason}
                          </p>
                        )}
                        {app.responseAt && (
                          <p className="text-red-300 text-xs mt-1">
                            On {new Date(app.responseAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    )}

                    {app.status === 'pending' && (
                      <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                        <p className="text-yellow-300 text-sm">⏳ Awaiting response from recruiter</p>
                      </div>
                    )}
                  </div>

                  {/* Status Icon */}
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10">
                    {getStatusIcon(app.status)}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 pt-4 border-t border-white/10 flex gap-2">
                  {app.opportunityId?.applyLink && (
                    <a
                      href={app.opportunityId.applyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-all"
                    >
                      View Details
                    </a>
                  )}
                  {app.status === 'accepted' && (
                    <button className="px-4 py-2 bg-green-500/20 text-green-300 rounded-lg text-sm font-medium cursor-default">
                      ✓ Selected
                    </button>
                  )}
                  {app.status === 'rejected' && (
                    <button className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg text-sm font-medium cursor-default">
                      ✗ Not Selected
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
