import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, BookOpen, Shield } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userData = await login(formData.email, formData.password);
      toast.success('Welcome back!');
      
      // Route based on role
      if (userData.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black">
      <div className="flex items-center justify-center min-h-screen px-4 pt-20">
        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Sign In</h1>
              <p className="text-gray-300">Login to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-12 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 text-white font-bold py-2 rounded-lg transition-all duration-300"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-900 text-gray-400">New here?</span>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                to="/signup"
                className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-400/30 hover:border-blue-400/50 text-white font-bold rounded-lg transition-all duration-300"
              >
                <BookOpen size={20} />
                Sign Up as Student
              </Link>

              <Link
                to="/admin-signup"
                className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-600/20 border border-purple-400/30 hover:border-purple-400/50 text-white font-bold rounded-lg transition-all duration-300"
              >
                <Shield size={20} />
                Sign Up as Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
