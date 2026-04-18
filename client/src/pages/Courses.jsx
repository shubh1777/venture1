import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { IndianRupee, Lock, Loader, Share2 } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const Courses = () => {
  const { user, updateUser } = useAuth();
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [referralUserId, setReferralUserId] = useState(null);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  const enrolledCourseIds = useMemo(
    () => new Set(user?.enrolledCourses?.map((c) => c.courseId) || []),
    [user]
  );

  useEffect(() => {
    // Check for referral link
    const ref = searchParams.get('ref');
    if (ref) {
      setReferralUserId(ref);
    }
    fetchCourses();
  }, [searchParams]);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses');
      setCourses(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load courses');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    value = value.replace(/(\d{4})/g, '$1 ').trim();
    setPaymentData(prev => ({ ...prev, cardNumber: value }));
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    setPaymentData(prev => ({ ...prev, expiryDate: value }));
  };

  const handleCVVChange = (e) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 3);
    setPaymentData(prev => ({ ...prev, cvv: value }));
  };

  const handlePurchase = async (course) => {
    setSelectedCourse(course);
    setShowPaymentModal(true);
    setPaymentData({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: ''
    });
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setPaymentLoading(true);

    try {
      const paymentPayload = {
        courseId: selectedCourse._id,
        ...paymentData
      };

      // Add referral user ID if student came via referral link
      if (referralUserId) {
        paymentPayload.referredBy = referralUserId;
      }

      const response = await api.post('/payment/course-purchase', paymentPayload);

      if (response.data.success) {
        toast.success('Course purchased successfully!');

        // Optimistically update the user context
        const newEnrolledCourse = { courseId: selectedCourse._id, enrolledAt: new Date() };
        const updatedUser = {
            ...user,
            enrolledCourses: [...(user.enrolledCourses || []), newEnrolledCourse]
        };
        updateUser(updatedUser);

        setShowPaymentModal(false);
        setSelectedCourse(null);
        setActiveTab('my');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment failed');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleReferCourse = (course) => {
    const referralLink = `${window.location.origin}/courses?ref=${user?._id}`;
    const referralMessage = `Check out this amazing course "${course.name}" on InternConnect! You can earn commission when they enroll using my referral link: ${referralLink}`;
    navigator.clipboard.writeText(referralMessage);
    toast.success('Referral message copied to clipboard!');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <Loader className="animate-spin text-blue-400" size={40} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black">
      <Navbar />
      
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-white mb-4 text-center">Courses</h1>
        <p className="text-center text-slate-400 mb-12 max-w-2xl mx-auto">Browse our catalog of courses or view the ones you've already enrolled in.</p>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/10 rounded-xl p-1 flex gap-1">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                activeTab === 'all' ? 'bg-blue-500 text-white' : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              All Courses
            </button>
            <button
              onClick={() => setActiveTab('my')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                activeTab === 'my' ? 'bg-blue-500 text-white' : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              My Courses
            </button>
          </div>
        </div>

        {activeTab === 'all' && (
          courses.length === 0 ? (
          <div className="text-center text-gray-400 py-20">
            <p>No courses available yet</p>
          </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 hover:border-blue-400 transition-all duration-300 flex flex-col"
                >
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-white mb-2">{course.name}</h3>
                    <p className="text-gray-300 text-sm mb-4">{course.description}</p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-green-400 text-lg font-bold">
                        <IndianRupee size={20} />
                        <span>{course.price}</span>
                      </div>
                      <div className="text-purple-400 text-sm font-semibold">
                        +₹{course.commission} referral
                      </div>
                    </div>

                    <p className="text-gray-400 text-xs mb-4">
                      By {course.adminId?.name || 'Admin'}
                    </p>
                  </div>

                  <div className="mt-auto pt-4 space-y-2">
                    {enrolledCourseIds.has(course._id) ? (
                      <button
                        disabled
                        className="w-full bg-gray-500/50 text-white font-bold py-2 px-4 rounded-lg cursor-not-allowed"
                      >
                        Enrolled
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePurchase(course)}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300"
                      >
                        Enroll Now
                      </button>
                    )}
                     <button
                      onClick={() => handleReferCourse(course)}
                      className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300"
                    >
                      <Share2 size={16} />
                      Refer this Course
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {activeTab === 'my' && (
          courses.filter(c => enrolledCourseIds.has(c._id)).length === 0 ? (
            <div className="text-center text-gray-400 py-20">
              <p>You haven't enrolled in any courses yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.filter(c => enrolledCourseIds.has(c._id)).map((course) => (
                <div
                  key={course._id}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 hover:border-green-400 transition-all duration-300 flex flex-col"
                >
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-white mb-2">{course.name}</h3>
                    <p className="text-gray-300 text-sm mb-4">{course.description}</p>
                  </div>
                  <div className="mt-auto pt-4 space-y-2">
                    <button
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-all"
                    >
                      Start Course
                    </button>
                    <button
                      onClick={() => {
                        const referralLink = `${window.location.origin}/courses?ref=${user._id}&course=${course._id}`;
                        navigator.clipboard.writeText(referralLink);
                        toast.success('Referral link copied to clipboard!');
                      }}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
                    >
                      <Share2 size={16} />
                      Refer This Course
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedCourse && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-2">Enroll Course</h2>
            <p className="text-gray-300 mb-6">{selectedCourse.name}</p>

            <div className="bg-blue-500/10 border border-blue-400/20 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-300 mb-3">Test Card Details:</p>
              <div className="space-y-1 text-xs font-mono text-gray-400">
                <p>Card: 4111 1111 1111 1111</p>
                <p>Expiry: 12/25</p>
                <p>CVV: 123</p>
              </div>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Card Number"
                value={paymentData.cardNumber}
                onChange={handleCardNumberChange}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={paymentData.expiryDate}
                  onChange={handleExpiryChange}
                  maxLength="5"
                  className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                />
                <input
                  type="text"
                  placeholder="CVV"
                  value={paymentData.cvv}
                  onChange={handleCVVChange}
                  maxLength="3"
                  className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                />
              </div>

              <input
                type="text"
                placeholder="Cardholder Name"
                value={paymentData.cardholderName}
                onChange={(e) => setPaymentData(prev => ({ ...prev, cardholderName: e.target.value }))}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
              />

              <button
                type="submit"
                disabled={paymentLoading}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 text-white font-bold py-2 rounded-lg transition-all duration-300"
              >
                {paymentLoading ? 'Processing...' : `Pay ₹${selectedCourse.price}`}
              </button>
            </form>

            <button
              onClick={() => {
                setShowPaymentModal(false);
                setSelectedCourse(null);
              }}
              className="w-full mt-3 text-gray-300 hover:text-white font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;
