import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { 
  AcademicCapIcon, 
  UserIcon, 
  UserGroupIcon,
  DocumentTextIcon,
  PlusCircleIcon,
  UserGroupIcon as UsersIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useAuth();

  const getRoleIcon = (role) => {
    switch (role) {
      case 'student':
        return <AcademicCapIcon className="h-6 w-6 text-blue-600" />;
      case 'teacher':
        return <UserIcon className="h-6 w-6 text-green-600" />;
      case 'alumni':
        return <UserGroupIcon className="h-6 w-6 text-purple-600" />;
      default:
        return <UserIcon className="h-6 w-6 text-gray-600" />;
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

  const quickActions = [
    {
      title: 'Create Post',
      description: 'Share something with the community',
      icon: <PlusCircleIcon className="h-6 w-6" />,
      link: '/posts/create',
      color: 'bg-primary-100 text-primary-800 hover:bg-primary-200'
    },
    {
      title: 'Browse Posts',
      description: 'See what others are sharing',
      icon: <DocumentTextIcon className="h-6 w-6" />,
      link: '/posts',
      color: 'bg-secondary-100 text-secondary-800 hover:bg-secondary-200'
    },
    ...(user.role === 'teacher' || user.role === 'alumni' ? [{
      title: 'Manage Users',
      description: 'View and manage community members',
      icon: <UsersIcon className="h-6 w-6" />,
      link: '/users',
      color: 'bg-green-100 text-green-800 hover:bg-green-200'
    }] : []),
    ...(user.role === 'teacher' ? [{
      title: 'Analytics',
      description: 'View community statistics',
      icon: <ChartBarIcon className="h-6 w-6" />,
      link: '/analytics',
      color: 'bg-purple-100 text-purple-800 hover:bg-purple-200'
    }] : [])
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white mb-8">
        <div className="flex items-center space-x-4 mb-4">
          {getRoleIcon(user.role)}
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, {user.firstName}!
            </h1>
            <p className="text-primary-100">
              {user.role === 'student' && 'Ready to learn and connect with your peers?'}
              {user.role === 'teacher' && 'Ready to inspire and guide your students?'}
              {user.role === 'alumni' && 'Ready to mentor and stay connected with your alma mater?'}
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div className="bg-white/20 rounded-lg px-4 py-2">
            <span className="text-sm text-primary-100">Role</span>
            <div className="font-semibold">{user.role}</div>
          </div>
          <div className="bg-white/20 rounded-lg px-4 py-2">
            <span className="text-sm text-primary-100">Department</span>
            <div className="font-semibold">{user.department}</div>
          </div>
          {user.graduationYear && (
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <span className="text-sm text-primary-100">Graduation Year</span>
              <div className="font-semibold">{user.graduationYear}</div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-secondary-900 mb-6">
          Quick Actions
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className="card p-6 hover:shadow-lg transition-shadow duration-300 group"
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${action.color}`}>
                {action.icon}
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2 group-hover:text-primary-600 transition-colors duration-200">
                {action.title}
              </h3>
              <p className="text-secondary-600 text-sm">
                {action.description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Profile Summary */}
        <div className="card p-6">
          <h3 className="text-xl font-semibold text-secondary-900 mb-4">
            Profile Summary
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </span>
              </div>
              <div>
                <div className="font-medium text-secondary-900">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-sm text-secondary-600">{user.email}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {getRoleIcon(user.role)}
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                {user.role}
              </span>
            </div>
            
            {user.bio && (
              <div>
                <div className="text-sm font-medium text-secondary-700 mb-1">Bio</div>
                <p className="text-secondary-600 text-sm">{user.bio}</p>
              </div>
            )}
            
            <Link 
              to="/profile" 
              className="btn-outline text-sm"
            >
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Community Stats */}
        <div className="card p-6">
          <h3 className="text-xl font-semibold text-secondary-900 mb-4">
            Community Overview
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">150+</div>
                <div className="text-sm text-blue-700">Active Students</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">25+</div>
                <div className="text-sm text-green-700">Faculty Members</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-600">500+</div>
                <div className="text-sm text-purple-700">Alumni Network</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-orange-600">1K+</div>
                <div className="text-sm text-orange-700">Posts Shared</div>
              </div>
            </div>
            
            <Link 
              to="/posts" 
              className="btn-primary text-sm"
            >
              Explore Community
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 