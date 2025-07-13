import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  HomeIcon, 
  UserGroupIcon, 
  DocumentTextIcon, 
  PlusCircleIcon,
  UserIcon,
  AcademicCapIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'student':
        return <AcademicCapIcon className="h-5 w-5" />;
      case 'teacher':
        return <UserIcon className="h-5 w-5" />;
      case 'alumni':
        return <UserGroupIcon className="h-5 w-5" />;
      default:
        return <UserIcon className="h-5 w-5" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'student':
        return 'bg-blue-100 text-blue-800';
      case 'teacher':
        return 'bg-green-100 text-green-800';
      case 'alumni':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
                      <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold text-gray-900">CollegeNetwork</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-1"
            >
              <HomeIcon className="h-5 w-5" />
              <span>Home</span>
            </Link>
            
            <Link 
              to="/posts" 
              className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-1"
            >
              <DocumentTextIcon className="h-5 w-5" />
              <span>Posts</span>
            </Link>

            {user && (
              <>
                <Link 
                  to="/posts/create" 
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-1"
                >
                  <PlusCircleIcon className="h-5 w-5" />
                  <span>Create Post</span>
                </Link>

                {(user.role === 'teacher' || user.role === 'alumni') && (
                  <Link 
                    to="/users" 
                    className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-1"
                  >
                    <UserGroupIcon className="h-5 w-5" />
                    <span>Users</span>
                  </Link>
                )}
              </>
            )}
            <Link 
              to="/student-register" 
              className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-1"
            >
              <AcademicCapIcon className="h-5 w-5" />
              <span>Student Register</span>
            </Link>
            <Link 
              to="/college-register" 
              className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-1"
            >
              <UserGroupIcon className="h-5 w-5" />
              <span>College Register</span>
            </Link>
            {user && user.role === 'teacher' && (
              <Link 
                to="/admin" 
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-1"
              >
                <UserIcon className="h-5 w-5" />
                <span>Admin Dashboard</span>
              </Link>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                {/* User Info */}
                <div className="hidden md:flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    {getRoleIcon(user.role)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </div>
                  <span className="text-gray-700 font-medium">
                    {user.firstName} {user.lastName}
                  </span>
                </div>

                {/* Profile Dropdown */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </span>
                    </div>
                    <span className="hidden md:block text-secondary-700">▼</span>
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-1">
                                              <Link 
                          to="/dashboard" 
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                        >
                        Dashboard
                      </Link>
                                              <Link 
                          to="/profile" 
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                        >
                        Profile
                      </Link>
                      <hr className="my-1" />
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center space-x-2"
                      >
                        <ArrowRightOnRectangleIcon className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn-primary"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 