import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import { Plus, Trash2, Users, DollarSign } from 'lucide-react';

export default function AdminCourses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'web development',
    level: 'beginner',
    totalHours: '',
    instructorName: '',
    commission: '',
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await api.get('/courses/admin/courses');
        setCourses(response.data.courses || []);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.price) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const response = await api.post('/courses/create', formData);
      toast.success('Course created successfully!');      
      setCourses([...courses, response.data.data]);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'web development',
        level: 'beginner',
        totalHours: '',
        instructorName: '',
        commission: '',
      });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating course:', error);
      toast.error(error.response?.data?.message || 'Failed to create course');
    }
  };

  const handleEditCourse = async (e) => {
    e.preventDefault();

    try {
      const response = await api.put(`/courses/${editingCourseId}`, formData);
      toast.success('Course updated successfully!');
      setCourses(courses.map((c) => (c._id === editingCourseId ? response.data.data : c)));
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'web development',
        level: 'beginner',
        totalHours: '',
        instructorName: '',
        commission: '',
      });
      setShowEditForm(false);
      setEditingCourseId(null);
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error(error.response?.data?.message || 'Failed to update course');
    }
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await api.delete(`/courses/${id}`);
        toast.success('Course deleted successfully!');
        setCourses(courses.filter((c) => c._id !== id));
      } catch (error) {
        console.error('Error deleting course:', error);
        toast.error('Failed to delete course');
      }
    }
  };

  const handleEditClick = (course) => {
    setFormData({
      name: course.name,
      description: course.description,
      price: course.price,
      category: course.category || 'web development',
      level: course.level || 'beginner',
      totalHours: course.totalHours || '',
      instructorName: course.instructorName || '',
      commission: course.commission || '',
    });
    setEditingCourseId(course._id);
    setShowEditForm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading courses...</p>
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
            <h1 className="text-4xl font-bold text-white">Manage Courses</h1>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg font-medium transition-all"
            >
              <Plus size={20} />
              Add Course
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <p className="text-gray-400 text-sm">Total Courses</p>
              <p className="text-2xl font-bold text-white">{courses.length}</p>
            </div>
            <div className="bg-blue-500/10 backdrop-blur-md rounded-xl p-4 border border-blue-500/20">
              <p className="text-blue-300 text-sm">Total Earnings</p>
              <p className="text-2xl font-bold text-blue-300">
                ₹{courses.reduce((sum, c) => sum + (c.totalEarnings || 0), 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-green-500/10 backdrop-blur-md rounded-xl p-4 border border-green-500/20">
              <p className="text-green-300 text-sm">Total Enrollments</p>
              <p className="text-2xl font-bold text-green-300">
                {courses.reduce((sum, c) => sum + (c.enrollmentCount || 0), 0)}
              </p>
            </div>
            <div className="bg-purple-500/10 backdrop-blur-md rounded-xl p-4 border border-purple-500/20">
              <p className="text-purple-300 text-sm">Avg. Price</p>
              <p className="text-2xl font-bold text-purple-300">
                ₹{courses.length > 0 ? Math.round(courses.reduce((sum, c) => sum + c.price, 0) / courses.length) : 0}
              </p>
            </div>
          </div>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className="mb-8 bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">Create New Course</h2>
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Course Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., React.js Mastery"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Instructor Name</label>
                  <input
                    type="text"
                    name="instructorName"
                    value={formData.instructorName}
                    onChange={handleInputChange}
                    placeholder="Your name"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="e.g., 1999"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Commission (%)</label>
                  <input
                    type="number"
                    name="commission"
                    value={formData.commission}
                    onChange={handleInputChange}
                    placeholder="e.g., 20"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
                  >
                    <option value="web development">Web Development</option>
                    <option value="mobile development">Mobile Development</option>
                    <option value="data science">Data Science</option>
                    <option value="ui/ux design">UI/UX Design</option>
                    <option value="digital marketing">Digital Marketing</option>
                    <option value="cybersecurity">Cybersecurity</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Level</label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Total Hours</label>
                  <input
                    type="number"
                    name="totalHours"
                    value={formData.totalHours}
                    onChange={handleInputChange}
                    placeholder="e.g., 40"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your course..."
                  rows="3"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg font-medium transition-all"
                >
                  Create Course
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

        {/* Edit Form */}
        {showEditForm && (
          <div className="mb-8 bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">Edit Course</h2>
            <form onSubmit={handleEditCourse} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Course Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Instructor Name</label>
                  <input
                    type="text"
                    name="instructorName"
                    value={formData.instructorName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Commission (%)</label>
                  <input
                    type="number"
                    name="commission"
                    value={formData.commission}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
                  >
                    <option value="web development">Web Development</option>
                    <option value="mobile development">Mobile Development</option>
                    <option value="data science">Data Science</option>
                    <option value="ui/ux design">UI/UX Design</option>
                    <option value="digital marketing">Digital Marketing</option>
                    <option value="cybersecurity">Cybersecurity</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Level</label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Total Hours</label>
                  <input
                    type="number"
                    name="totalHours"
                    value={formData.totalHours}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg font-medium transition-all"
                >
                  Update Course
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditForm(false);
                    setEditingCourseId(null);
                  }}
                  className="flex-1 px-6 py-3 bg-gray-500/20 hover:bg-gray-500/30 text-white rounded-lg font-medium transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
              <p className="text-gray-300 text-lg">No courses created yet</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="mt-4 px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-all"
              >
                Create Your First Course
              </button>
            </div>
          ) : (
            courses.map((course) => (
              <div key={course._id} className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-white/20 hover:border-white/40 transition-all">
                {/* Course Image Placeholder */}
                <div className="w-full h-40 bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{course.name.charAt(0)}</span>
                </div>

                {/* Course Details */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-white mb-1 line-clamp-2">{course.name}</h3>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">{course.description}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {course.category && (
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                        {course.category}
                      </span>
                    )}
                    {course.level && (
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                        {course.level}
                      </span>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Price</span>
                      <span className="text-white font-bold">₹{course.price}</span>
                    </div>
                    {course.totalEarnings > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm flex items-center gap-1">
                          <DollarSign size={14} />
                          Earnings
                        </span>
                        <span className="text-green-300 font-bold">₹{course.totalEarnings}</span>
                      </div>
                    )}
                    {course.enrollmentCount > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm flex items-center gap-1">
                          <Users size={14} />
                          Enrollments
                        </span>
                        <span className="text-blue-300 font-bold">{course.enrollmentCount}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(course)}
                      className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course._id)}
                      className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all"
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
