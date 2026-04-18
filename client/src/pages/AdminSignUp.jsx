import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Phone, Building2, GraduationCap, Shield } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminSignUp = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    college: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signup({
        ...formData,
        role: 'admin'
      });
      toast.success('Admin account created successfully!');
      navigate('/admin-dashboard');
    } catch (error) {
      toast.error(error.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900">
      <div className="flex items-center justify-center min-h-screen px-4 pt-20">
        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <Shield className="text-purple-400" size={40} />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Admin Sign Up</h1>
              <p className="text-gray-300">Create courses and manage students</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-3.5 text-gray-400" size={20} />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                  className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="relative">
                <Phone className="absolute left-3 top-3.5 text-gray-400" size={20} />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone (Optional)"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="relative">
                <Building2 className="absolute left-3 top-3.5 text-gray-400" size={20} />
                <input
                  type="text"
                  name="college"
                  placeholder="Organization (Optional)"
                  value={formData.college}
                  onChange={handleChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 text-white font-bold py-2 rounded-lg transition-all duration-300"
              >
                {loading ? 'Creating Account...' : 'Sign Up as Admin'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-300 mb-4">Already have an account?</p>
              <Link
                to="/login"
                className="text-purple-400 hover:text-purple-300 font-semibold"
              >
                Log In
              </Link>
            </div>

            <div className="mt-4 text-center">
              <p className="text-gray-400 text-sm">Looking to learn?</p>
              <Link
                to="/signup"
                className="text-blue-400 hover:text-blue-300 font-semibold"
              >
                Sign Up as Student
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSignUp;
