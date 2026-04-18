import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import StatsCard from '../components/StatsCard';
import api from '../services/api';
import { 
  Users, 
  IndianRupee, 
  TrendingUp, 
  Clock,
  Copy,
  CheckCircle,
  Share2,
  Gift
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const Referrals = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/referrals/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(user?.referralCode);
    setCopied(true);
    toast.success('Referral code copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const copyReferralLink = () => {
    const link = `${window.location.origin}/register?ref=${user?.referralCode}`;
    navigator.clipboard.writeText(link);
    toast.success('Referral link copied!');
  };

  const shareOnWhatsApp = () => {
    const text = `Hey! Join InternConnect to get exclusive internships, hackathons & competitions. Use my referral code: ${user?.referralCode}\n\n${window.location.origin}/signup?ref=${user?.referralCode}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Referral Dashboard
          </h1>
          <p className="text-slate-400">
            Track your referrals and earnings
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Referrals"
            value={stats?.totalReferrals || 0}
            icon={Users}
            gradient="from-blue-500 to-cyan-500"
          />
          <StatsCard
            title="Total Earnings"
            value={`₹${stats?.totalEarnings || 0}`}
            icon={IndianRupee}
            gradient="from-green-500 to-emerald-500"
          />
          <StatsCard
            title="Pending Payout"
            value={`₹${stats?.pendingEarnings || 0}`}
            icon={Clock}
            gradient="from-amber-500 to-orange-500"
          />
          <StatsCard
            title="Withdrawn"
            value={`₹${stats?.withdrawnEarnings || 0}`}
            icon={TrendingUp}
            gradient="from-purple-500 to-pink-500"
          />
        </div>

        {/* Referral Tools */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Share Section */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <Share2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Share & Earn</h3>
                <p className="text-sm text-slate-400">Earn ₹10-40 for every referral</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Referral Code */}
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Your Referral Code</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 p-3 bg-white/5 rounded-xl border border-white/10">
                    <code className="text-lg font-mono text-white">{user?.referralCode}</code>
                  </div>
                  <button
                    onClick={copyReferralCode}
                    className="p-3 rounded-xl bg-primary-500/20 text-primary-400 hover:bg-primary-500/30 transition-colors"
                  >
                    {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={copyReferralLink}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  Copy Link
                </button>
                <button
                  onClick={shareOnWhatsApp}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-green-500 text-white font-medium hover:bg-green-600 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  WhatsApp
                </button>
              </div>
            </div>
          </div>

          {/* Commission Structure */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Commission Structure</h3>
                <p className="text-sm text-slate-400">Earn based on referral plan</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { plan: 'Basic Plan (₹49)', commission: '₹10' },
                { plan: 'Standard Plan (₹99)', commission: '₹20' },
                { plan: 'Premium Plan (₹199)', commission: '₹40' }
              ].map((item, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-xl"
                >
                  <span className="text-slate-300">{item.plan}</span>
                  <span className="text-green-400 font-semibold">{item.commission}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Referral History */}
        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Referral History</h3>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : stats?.referrals?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-slate-400 text-sm border-b border-white/10">
                    <th className="pb-4 font-medium">User</th>
                    <th className="pb-4 font-medium">Plan</th>
                    <th className="pb-4 font-medium">Commission</th>
                    <th className="pb-4 font-medium">Status</th>
                    <th className="pb-4 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {stats.referrals.map((referral, index) => (
                    <tr key={index} className="text-slate-300">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-sm font-medium">
                            {referral.referred?.name?.charAt(0) || '?'}
                          </div>
                          <div>
                            <p className="font-medium text-white">{referral.referred?.name}</p>
                            <p className="text-xs text-slate-500">{referral.referred?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="px-2 py-1 rounded-lg bg-white/10 text-xs font-medium capitalize">
                          {referral.plan}
                        </span>
                      </td>
                      <td className="py-4 text-green-400 font-medium">₹{referral.commission}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          referral.status === 'completed' 
                            ? 'bg-green-500/20 text-green-400'
                            : referral.status === 'paid'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {referral.status}
                        </span>
                      </td>
                      <td className="py-4 text-slate-400">
                        {new Date(referral.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No referrals yet</p>
              <p className="text-sm text-slate-500">Share your referral code to start earning</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Referrals;
