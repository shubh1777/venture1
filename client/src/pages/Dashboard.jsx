import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import StatsCard from '../components/StatsCard';
import api from '../services/api';
import { 
  Users, 
  IndianRupee, 
  TrendingUp, 
  Briefcase, 
  Copy, 
  CheckCircle,
  ArrowRight,
  Crown,
  Sparkles,
  Download,
  BookOpen
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [statsRes, coursesRes, appsRes] = await Promise.allSettled([
        api.get('/referrals/stats'),
        api.get('/courses'),
        api.get('/applications/my-applications')
      ]);

      const statsData = {
        totalReferrals: 0,
        totalEarnings: 0,
        pendingEarnings: 0,
        withdrawnEarnings: 0,
        enrolledCourses: [],
        applications: []
      };

      if (statsRes.status === 'fulfilled') {
        Object.assign(statsData, statsRes.value.data);
      }

      if (coursesRes.status === 'fulfilled') {
        const allCourses = coursesRes.value.data.data || [];
        const enrolled = user?.enrolledCourses || [];
        
        // Map enrolled course IDs to full course objects
        const enrolledCoursesData = enrolled.map(enrollment => {
          const courseData = allCourses.find(c => c._id === enrollment.courseId);
          return {
            courseId: courseData,
            enrolledAt: enrollment.enrolledAt
          };
        }).filter(c => c.courseId); // Filter out undefined courses
        
        statsData.enrolledCourses = enrolledCoursesData.slice(0, 4);
      }

      if (appsRes.status === 'fulfilled') {
        statsData.applications = appsRes.value.data.applications || [];
      }

      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    const link = `${window.location.origin}/signup?ref=${user?.referralCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success('Referral link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const referralLink = `${window.location.origin}/signup?ref=${user?.referralCode}`;

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-slate-400">
            {user?.isPremium 
              ? 'Access your exclusive opportunities and track your referrals'
              : 'Explore courses and track your referrals'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Referrals"
            value={stats?.totalReferrals || 0}
            subtitle="People joined via your link"
            icon={Users}
            gradient="from-blue-500 to-cyan-500"
          />
          <StatsCard
            title="Total Earnings"
            value={`₹${stats?.totalEarnings || 0}`}
            subtitle="Lifetime earnings"
            icon={IndianRupee}
            gradient="from-green-500 to-emerald-500"
          />
          <StatsCard
            title="Pending Earnings"
            value={`₹${stats?.pendingEarnings || 0}`}
            subtitle="Ready for withdrawal"
            icon={TrendingUp}
            gradient="from-purple-500 to-pink-500"
          />
          <StatsCard
            title="Withdrawn"
            value={`₹${stats?.withdrawnEarnings || 0}`}
            subtitle="Amount withdrawn"
            icon={Briefcase}
            gradient="from-orange-500 to-red-500"
          />
        </div>

        {/* My Courses Section */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* My Courses */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">My Courses</h3>
                <p className="text-sm text-slate-400">Courses you are enrolled in</p>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : stats?.enrolledCourses?.length > 0 ? (
              <div className="space-y-3">
                {stats.enrolledCourses.slice(0, 4).map((course, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-medium text-sm">
                        {course.courseId?.name?.charAt(0) || '?'}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium truncate">{course.courseId?.name || 'Unknown'}</p>
                        <p className="text-xs text-slate-400">
                          Enrolled {new Date(course.enrolledAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">No courses yet</p>
                <p className="text-sm text-slate-500">Enroll in courses to get started</p>
              </div>
            )}
          </div>

          {/* My Applications */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">My Applications</h3>
                  <p className="text-sm text-slate-400">Your opportunity applications</p>
                </div>
              </div>
              <Link to="/my-applications" className="text-sm text-primary-400 hover:text-primary-300">
                View all →
              </Link>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            ) : stats?.applications?.length > 0 ? (
              <div className="space-y-3">
                {stats.applications.slice(0, 4).map((application, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-medium text-sm ${
                        application.status === 'accepted' ? 'bg-green-500/20' :
                        application.status === 'rejected' ? 'bg-red-500/20' :
                        'bg-yellow-500/20'
                      }`}>
                        {application.status === 'accepted' ? '✓' : application.status === 'rejected' ? '✕' : '⏱'}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium truncate">{application.opportunityId?.title || 'Unknown'}</p>
                        <p className={`text-xs ${
                          application.status === 'accepted' ? 'text-green-400' :
                          application.status === 'rejected' ? 'text-red-400' :
                          'text-yellow-400'
                        }`}>
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">No applications yet</p>
                <p className="text-sm text-slate-500">Apply to opportunities to get started</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link 
            to="/courses"
            className="glass rounded-xl p-4 flex items-center gap-4 card-hover"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h4 className="font-medium text-white">Browse Courses</h4>
              <p className="text-sm text-slate-400">Enroll in courses</p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 ml-auto" />
          </Link>

          <Link 
            to="/opportunities"
            className="glass rounded-xl p-4 flex items-center gap-4 card-hover"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h4 className="font-medium text-white">Browse Opportunities</h4>
              <p className="text-sm text-slate-400">Find internships & hackathons</p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 ml-auto" />
          </Link>

          <Link 
            to="/referrals"
            className="glass rounded-xl p-4 flex items-center gap-4 card-hover"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h4 className="font-medium text-white">Referral History</h4>
              <p className="text-sm text-slate-400">Track your earnings</p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 ml-auto" />
          </Link>

          <Link 
            to="/withdrawal"
            className="glass rounded-xl p-4 flex items-center gap-4 card-hover"
          >
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <Download className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h4 className="font-medium text-white">Request Withdrawal</h4>
              <p className="text-sm text-slate-400">Withdraw earnings</p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 ml-auto" />
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
