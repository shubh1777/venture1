import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import StudentSignUp from './pages/StudentSignUp';
import AdminSignUp from './pages/AdminSignUp';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Opportunities from './pages/Opportunities';
import Referrals from './pages/Referrals';
import Courses from './pages/Courses';
import Profile from './pages/Profile';
import Withdrawal from './pages/Withdrawal';
import AdminCourses from './pages/AdminCourses';
import Applications from './pages/Applications';
import AdminOpportunities from './pages/AdminOpportunities';
import MyApplications from './pages/MyApplications';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-900">
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: '#1e293b',
                color: '#f8fafc',
                border: '1px solid rgba(255,255,255,0.1)'
              }
            }}
          />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<StudentSignUp />} />
            <Route path="/admin-signup" element={<AdminSignUp />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin-dashboard" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/courses" 
              element={
                <ProtectedRoute>
                  <Courses />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/opportunities" 
              element={
                <ProtectedRoute>
                  <Opportunities />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/referrals" 
              element={
                <ProtectedRoute>
                  <Referrals />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/withdrawal" 
              element={
                <ProtectedRoute>
                  <Withdrawal />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin-courses" 
              element={
                <ProtectedRoute>
                  <AdminCourses />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/applications" 
              element={
                <ProtectedRoute>
                  <Applications />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin-opportunities" 
              element={
                <ProtectedRoute>
                  <AdminOpportunities />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-applications" 
              element={
                <ProtectedRoute>
                  <MyApplications />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
