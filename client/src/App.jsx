import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Posts from './pages/Posts';
import CreatePost from './pages/CreatePost';
import PostDetail from './pages/PostDetail';
import CollegeRegister from './pages/CollegeRegister';
import StudentRegister from './pages/StudentRegister';
import AdminDashboard from './pages/AdminDashboard';
// import Users from './pages/Users';
import { AuthProvider } from './contexts/AuthContext';

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:5000/api';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/posts" element={<Posts />} />
              <Route path="/posts/create" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
              <Route path="/posts/:id" element={<PostDetail />} />
              <Route path="/college-register" element={<CollegeRegister />} />
              <Route path="/student-register" element={<StudentRegister />} />
              <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              {/* <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} /> */}
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

// Protected Route Component
function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Verify token by making a request to get profile
      axios.get('/auth/profile')
        .then(() => setIsAuthenticated(true))
        .catch(() => {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        })
        .finally(() => setLoading(false));
    } else {
      setIsAuthenticated(false);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default App;
