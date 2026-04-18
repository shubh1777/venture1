import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { X, Upload, Send } from 'lucide-react';

const ApplicationModal = ({ opportunity, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    cgpa: '',
    skills: '',
  });
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 2 * 1024 * 1024) { // 2MB limit
      toast.error('File size should not exceed 2MB');
      e.target.value = null;
      return;
    }
    setResume(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resume) {
      toast.error('Please upload your resume');
      return;
    }
    setLoading(true);

    const submissionData = new FormData();
    submissionData.append('opportunityId', opportunity._id);
    submissionData.append('cgpa', formData.cgpa);
    submissionData.append('skills', formData.skills);
    submissionData.append('resume', resume);

    try {
      await api.post(`/applications/apply/${opportunity._id}`, submissionData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success(`Successfully applied for ${opportunity.title}`);
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 max-w-lg w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Apply Now</h2>
            <p className="text-gray-300">{opportunity.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
              <input
                type="text"
                value={user?.name || ''}
                disabled
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-slate-400 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">College</label>
              <input
                type="text"
                value={user?.college || ''}
                disabled
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">CGPA</label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="10"
              name="cgpa"
              placeholder="e.g., 8.5"
              value={formData.cgpa}
              onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Skills</label>
            <textarea
              name="skills"
              placeholder="Enter your relevant skills, separated by commas (e.g., React, Node.js, MongoDB)"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              rows="3"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Upload Resume (PDF, max 2MB)</label>
            <div className="relative flex items-center justify-center w-full">
              <label
                htmlFor="resume-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-lg cursor-pointer bg-white/5 hover:bg-white/10"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-3 text-gray-400" />
                  {resume ? (
                    <p className="text-sm text-green-400">{resume.name}</p>
                  ) : (
                    <p className="text-sm text-gray-400">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                  )}
                </div>
                <input
                  id="resume-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf"
                  required
                />
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-all duration-300"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send size={18} />
                Submit Application
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplicationModal;