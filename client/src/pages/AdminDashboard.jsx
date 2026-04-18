import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import {
  Plus,
  DollarSign,
  Users,
  BookOpen,
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    commission: '',
  });

  // Fetch admin's courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await api.get('/courses/admin/courses');
        setCourses(response.data.courses || []);
        setTotalEarnings(response.data.totalEarnings || 0);
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast.error('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'admin') {
      fetchCourses();
    }
  }, [user]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle course creation
  const handleCreateCourse = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.price || formData.commission === '') {
      toast.error('Please fill all fields');
      return;
    }

    try {
      const response = await api.post('/courses/create', {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        commission: parseFloat(formData.commission),
      });

      toast.success('Course created successfully!');
      setCourses([...courses, response.data.course]);
      setFormData({
        name: '',
        description: '',
        price: '',
        commission: '',
      });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating course:', error);
      toast.error(error.response?.data?.message || 'Failed to create course');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading dashboard...</p>
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
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
              <p className="text-gray-300">Welcome, {user?.name}</p>
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg font-medium transition-all duration-300"
            >
              <Plus size={20} />
              Create Course
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <BookOpen className="text-purple-400" size={24} />
                </div>
                <div>
                  <p className="text-gray-300 text-sm">Total Courses</p>
                  <p className="text-3xl font-bold text-white">{courses.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <Users className="text-blue-400" size={24} />
                </div>
                <div>
                  <p className="text-gray-300 text-sm">Total Enrollments</p>
                  <p className="text-3xl font-bold text-white">
                    {courses.reduce((sum, course) => sum + course.enrolledStudents.length, 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <DollarSign className="text-green-400" size={24} />
                </div>
                <div>
                  <p className="text-gray-300 text-sm">Total Earnings</p>
                  <p className="text-3xl font-bold text-white">₹{totalEarnings.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Create Course Form */}
        {showCreateForm && (
          <div className="mb-8 bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">Create New Course</h2>
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Course Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Python Basics"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="e.g., 49"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your course..."
                  rows="3"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Referral Commission (₹)</label>
                <input
                  type="number"
                  name="commission"
                  value={formData.commission}
                  onChange={handleInputChange}
                  placeholder="e.g., 5"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg font-medium transition-all duration-300"
                >
                  Create Course
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 px-6 py-3 bg-gray-500/20 hover:bg-gray-500/30 text-white rounded-lg font-medium transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Courses List */}
        <div className="space-y-6">
          {courses.length === 0 ? (
            <div className="text-center py-12 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
              <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-300 text-lg">No courses created yet</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="mt-4 px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-all duration-300"
              >
                Create Your First Course
              </button>
            </div>
          ) : (
            courses.map((course) => (
              <div key={course._id} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-white mb-2">{course.name}</h3>
                  <p className="text-gray-300 mb-3">{course.description}</p>
                  <div className="flex gap-4 flex-wrap">
                    <div className="px-3 py-1 bg-blue-500/20 rounded-full text-blue-300 text-sm">
                      Price: ₹{course.price}
                    </div>
                    <div className="px-3 py-1 bg-green-500/20 rounded-full text-green-300 text-sm">
                      Referral Commission: ₹{course.commission}
                    </div>
                    <div className="px-3 py-1 bg-purple-500/20 rounded-full text-purple-300 text-sm">
                      {course.enrolledStudents.length} Student
                      {course.enrolledStudents.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>

                {/* Enrolled Students */}
                {course.enrolledStudents.length > 0 ? (
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-white mb-4">Enrolled Students</h4>
                    <div className="space-y-3">
                      {course.enrolledStudents.map((enrollment, index) => (
                        <div
                          key={index}
                          className="bg-white/5 rounded-lg p-4 border border-white/10 flex items-center justify-between"
                        >
                          <div className="flex-1">
                            <p className="text-white font-medium">{enrollment.studentId?.name || 'Student'}</p>
                            <p className="text-gray-400 text-sm">
                              Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString()}
                            </p>
                            {enrollment.referredBy && (
                              <p className="text-gray-400 text-sm">
                                Referred by: {enrollment.referredBy?.name || 'Referrer'}
                              </p>
                            )}
                          </div>

                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm mt-4">No students enrolled yet</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
