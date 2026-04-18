import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Download, IndianRupee, CheckCircle, Clock, X } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const Withdrawal = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    accountHolder: '',
    accountNumber: '',
    ifscCode: '',
    bankName: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, withdrawalRes] = await Promise.all([
        api.get('/referrals/stats'),
        api.get('/withdrawals/history')
      ]);
      setStats(statsRes.data);
      setWithdrawals(withdrawalRes.data.data || []);
    } catch (error) {
      toast.error('Failed to load data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const amount = parseInt(formData.amount);
      
      if (amount < 100) {
        toast.error('Minimum withdrawal amount is ₹100');
        setSubmitting(false);
        return;
      }

      if (amount > (stats?.pendingEarnings || 0)) {
        toast.error('Insufficient balance');
        setSubmitting(false);
        return;
      }

      const response = await api.post('/withdrawals/request', formData);
      
      if (response.data.success) {
        toast.success('Withdrawal request submitted!');
        setFormData({
          amount: '',
          accountHolder: '',
          accountNumber: '',
          ifscCode: '',
          bankName: ''
        });
        setShowForm(false);
        fetchData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'rejected':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={18} />;
      case 'pending':
        return <Clock size={18} />;
      case 'rejected':
        return <X size={18} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black">
      <Navbar />
      
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Withdrawal Requests</h1>

        {/* Balance Card */}
        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl p-8 mb-8 max-w-2xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-300 text-sm mb-2">Total Earnings</p>
              <div className="flex items-center text-3xl font-bold text-white">
                <IndianRupee size={24} />
                <span>{stats?.totalEarnings || 0}</span>
              </div>
            </div>
            <div>
              <p className="text-gray-300 text-sm mb-2">Available to Withdraw</p>
              <div className="flex items-center text-3xl font-bold text-green-400">
                <IndianRupee size={24} />
                <span>{stats?.pendingEarnings || 0}</span>
              </div>
            </div>
            <div>
              <p className="text-gray-300 text-sm mb-2">Already Withdrawn</p>
              <div className="flex items-center text-3xl font-bold text-blue-400">
                <IndianRupee size={24} />
                <span>{stats?.withdrawnEarnings || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Withdrawal Form */}
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            disabled={(stats?.pendingEarnings || 0) < 100}
            className="block mx-auto mb-8 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all duration-300 flex items-center gap-2"
          >
            <Download size={20} />
            Request Withdrawal
          </button>
        ) : (
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 mb-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Submit Withdrawal Request</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white font-semibold mb-2">Amount (Minimum ₹100)</label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-3.5 text-gray-400" size={20} />
                  <input
                    type="number"
                    name="amount"
                    placeholder="Enter amount"
                    value={formData.amount}
                    onChange={handleChange}
                    min="100"
                    max={stats?.pendingEarnings || 0}
                    className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
                    required
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Available: ₹{stats?.pendingEarnings || 0}
                </p>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Account Holder Name</label>
                <input
                  type="text"
                  name="accountHolder"
                  placeholder="Full name as per bank"
                  value={formData.accountHolder}
                  onChange={handleChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Account Number</label>
                <input
                  type="text"
                  name="accountNumber"
                  placeholder="Enter account number"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-semibold mb-2">IFSC Code</label>
                  <input
                    type="text"
                    name="ifscCode"
                    placeholder="e.g., HDFC0001234"
                    value={formData.ifscCode}
                    onChange={handleChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Bank Name</label>
                  <input
                    type="text"
                    name="bankName"
                    placeholder="e.g., HDFC Bank"
                    value={formData.bankName}
                    onChange={handleChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 text-white font-bold py-2 rounded-lg transition-all duration-300"
                >
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-500/20 hover:bg-gray-500/30 text-white font-bold py-2 rounded-lg transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Withdrawal History */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Withdrawal History</h2>
          
          {withdrawals.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              <Download size={48} className="mx-auto mb-4 opacity-50" />
              <p>No withdrawal requests yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {withdrawals.map((withdrawal) => (
                <div
                  key={withdrawal._id}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg border ${getStatusColor(withdrawal.status)}`}>
                        {getStatusIcon(withdrawal.status)}
                      </div>
                      <div>
                        <p className="text-white font-semibold">₹{withdrawal.amount}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(withdrawal.requestedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(withdrawal.status)}`}>
                      {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                    </span>
                  </div>

                  <div className="text-sm text-gray-300 space-y-1">
                    <p><strong>Account:</strong> {withdrawal.bankDetails.accountHolder}</p>
                    <p><strong>Bank:</strong> {withdrawal.bankDetails.bankName}</p>
                    {withdrawal.rejectionReason && (
                      <p className="text-red-400"><strong>Reason:</strong> {withdrawal.rejectionReason}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Withdrawal;
