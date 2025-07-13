import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  AcademicCapIcon, 
  UserGroupIcon, 
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightIcon,
  SparklesIcon,
  GlobeAltIcon,
  HeartIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: <AcademicCapIcon className="h-8 w-8 text-blue-600" />,
      title: 'Student Network',
      description: 'Connect with fellow students, share academic experiences, and collaborate on projects.',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      icon: <UserGroupIcon className="h-8 w-8 text-green-600" />,
      title: 'Teacher Portal',
      description: 'Manage classes, interact with students, and share educational resources.',
      gradient: 'from-green-500 to-green-600'
    },
    {
      icon: <DocumentTextIcon className="h-8 w-8 text-purple-600" />,
      title: 'Content Sharing',
      description: 'Share posts, articles, and resources with the college community.',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      icon: <ChatBubbleLeftRightIcon className="h-8 w-8 text-orange-600" />,
      title: 'Community Discussion',
      description: 'Engage in meaningful discussions and stay updated with college events.',
      gradient: 'from-orange-500 to-orange-600'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Students Connected' },
    { number: '500+', label: 'Colleges Registered' },
    { number: '50K+', label: 'Posts Shared' },
    { number: '24/7', label: 'Community Support' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Gradient Background */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-green-200 rounded-full opacity-25 animate-pulse"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-blue-200 mb-8">
              <SparklesIcon className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-700">Welcome to the Future of Education</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                CollegeNetwork
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Connect, collaborate, and grow with your college community. 
              Whether you're a student, teacher, or alumni, find your place in our vibrant network.
            </p>
            
            {/* CTA Buttons */}
            {!user ? (
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                <Link 
                  to="/student-register" 
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center space-x-3"
                >
                  <span>Start Your Journey</span>
                  <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/college-register" 
                  className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-2xl shadow-lg hover:shadow-xl border-2 border-gray-200 hover:border-blue-300 transform hover:-translate-y-1 transition-all duration-300"
                >
                  Register Your College
                </Link>
                <Link 
                  to="/login" 
                  className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
                >
                  Already have an account? Sign in
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                <Link 
                  to="/dashboard" 
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center space-x-3"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/posts" 
                  className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-2xl shadow-lg hover:shadow-xl border-2 border-gray-200 hover:border-blue-300 transform hover:-translate-y-1 transition-all duration-300"
                >
                  Explore Posts
                </Link>
                {user.role === 'teacher' && (
                  <Link 
                    to="/admin" 
                    className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                  >
                    Admin Dashboard
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What makes{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CollegeNetwork
              </span>{' '}
              special?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the next generation of educational networking with our cutting-edge features
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group">
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Role-based CTA */}
      {!user && (
        <div className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-bold text-gray-900 mb-6">
                Join the Community
              </h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Choose your role and start connecting with your college community. 
                Each role has unique features and permissions tailored to your needs.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="group">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-blue-200">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <AcademicCapIcon className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-4">Student</h4>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Connect with peers, share experiences, and access academic resources. 
                    Build your network and grow together.
                  </p>
                  <Link 
                    to="/student-register" 
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold group-hover:translate-x-2 transition-transform duration-300"
                  >
                    Join as Student
                    <ArrowRightIcon className="h-4 w-4 ml-2" />
                  </Link>
                </div>
              </div>
              
              <div className="group">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-green-200">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <UserGroupIcon className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-4">Teacher</h4>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Manage classes, interact with students, and share educational content. 
                    Inspire the next generation.
                  </p>
                  <Link 
                    to="/register" 
                    className="inline-flex items-center text-green-600 hover:text-green-700 font-semibold group-hover:translate-x-2 transition-transform duration-300"
                  >
                    Join as Teacher
                    <ArrowRightIcon className="h-4 w-4 ml-2" />
                  </Link>
                </div>
              </div>
              
              <div className="group">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-purple-200">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <GlobeAltIcon className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-4">Alumni</h4>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Stay connected with your alma mater and mentor current students. 
                    Share your wisdom and experience.
                  </p>
                  <Link 
                    to="/register" 
                    className="inline-flex items-center text-purple-600 hover:text-purple-700 font-semibold group-hover:translate-x-2 transition-transform duration-300"
                  >
                    Join as Alumni
                    <ArrowRightIcon className="h-4 w-4 ml-2" />
                  </Link>
                </div>
              </div>
            </div>

            {/* College Registration CTA */}
            <div className="mt-16 text-center">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-8 border border-indigo-200">
                <RocketLaunchIcon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                <h4 className="text-2xl font-bold text-gray-900 mb-4">
                  Ready to Register Your College?
                </h4>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Join thousands of colleges already using CollegeNetwork to connect their students and faculty.
                </p>
                <Link 
                  to="/college-register" 
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  Register Your College
                  <ArrowRightIcon className="h-5 w-5 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer CTA */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your College Experience?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Join the revolution in educational networking and connect with your community like never before.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/student-register" 
              className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-2xl hover:bg-gray-50 transition-colors duration-300"
            >
              Get Started Today
            </Link>
            <Link 
              to="/login" 
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-2xl hover:bg-white hover:text-blue-600 transition-colors duration-300"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 