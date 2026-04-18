import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import { Plus, Briefcase, Trash2, Edit } from 'lucide-react';

export default function AdminOpportunities() {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    type: 'internship',
    description: '',
    location: 'Remote',
    stipend: '',
    deadline: '',
    applyLink: '',
    tags: '',
  });

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setLoading(true);
        const response = await api.get('/opportunities/admin/opportunities');
        setOpportunities(response.data.opportunities || []);
      } catch (error) {
        console.error('Error fetching opportunities:', error);
        toast.error('Failed to load opportunities');
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'admin') {
      fetchOpportunities();
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateOpportunity = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.company || !formData.type || !formData.description || !formData.applyLink) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const response = await api.post('/opportunities/create', {
        ...formData,
        tags: formData.tags.split(',').map((tag) => tag.trim()),
      });

      toast.success('Opportunity created successfully!');
      setOpportunities([...opportunities, response.data.data]);
      setFormData({
        title: '',
        company: '',
        type: 'internship',
        description: '',
        location: 'Remote',
        stipend: '',
        deadline: '',
        applyLink: '',
        tags: '',
      });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating opportunity:', error);
      toast.error(error.response?.data?.message || 'Failed to create opportunity');
    }
  };

  const handleDeleteOpportunity = async (id) => {
    if (window.confirm('Are you sure you want to delete this opportunity?')) {
      try {
        await api.delete(`/opportunities/admin/${id}`);
        toast.success('Opportunity deleted successfully!');
        setOpportunities(opportunities.filter((opp) => opp._id !== id));
      } catch (error) {
        console.error('Error deleting opportunity:', error);
        toast.error('Failed to delete opportunity');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading opportunities...</p>
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
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold text-white">Manage Opportunities</h1>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg font-medium transition-all"
            >
              <Plus size={20} />
              Add Opportunity
            </button>
          </div>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className="mb-8 bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">Create New Opportunity</h2>
            <form onSubmit={handleCreateOpportunity} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Frontend Developer Intern"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Company *</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="e.g., Google"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Type *</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
                  >
                    <option value="internship">Internship</option>
                    <option value="hackathon">Hackathon</option>
                    <option value="competition">Competition</option>
                    <option value="job">Job</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., Remote"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Stipend/Salary</label>
                  <input
                    type="text"
                    name="stipend"
                    value={formData.stipend}
                    onChange={handleInputChange}
                    placeholder="e.g., ₹10,000/month"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Deadline</label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the opportunity..."
                  rows="3"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Apply Link *</label>
                <input
                  type="url"
                  name="applyLink"
                  value={formData.applyLink}
                  onChange={handleInputChange}
                  placeholder="https://..."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tags (comma separated)</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="e.g., React, JavaScript, Frontend"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg font-medium transition-all"
                >
                  Create Opportunity
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 px-6 py-3 bg-gray-500/20 hover:bg-gray-500/30 text-white rounded-lg font-medium transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Opportunities List */}
        <div className="space-y-4">
          {opportunities.length === 0 ? (
            <div className="text-center py-12 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
              <Briefcase className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-300 text-lg">No opportunities posted yet</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="mt-4 px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-all"
              >
                Post Your First Opportunity
              </button>
            </div>
          ) : (
            opportunities.map((opp) => (
              <div key={opp._id} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{opp.title}</h3>
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full">
                        {opp.type}
                      </span>
                    </div>
                    <p className="text-gray-400 mb-2">{opp.company}</p>
                    <p className="text-gray-300 mb-3">{opp.description}</p>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {opp.location && (
                        <span className="px-2 py-1 bg-gray-500/20 text-gray-300 text-xs rounded">
                          📍 {opp.location}
                        </span>
                      )}
                      {opp.stipend && (
                        <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded">
                          💰 {opp.stipend}
                        </span>
                      )}
                      {opp.deadline && (
                        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded">
                          📅 {new Date(opp.deadline).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    {opp.tags && opp.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {opp.tags.map((tag, idx) => (
                          <span key={idx} className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 ml-4">
                    <a
                      href={opp.applyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-all"
                    >
                      View
                    </a>
                    <button
                      onClick={() => handleDeleteOpportunity(opp._id)}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
