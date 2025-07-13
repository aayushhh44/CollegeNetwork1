import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AcademicCapIcon, UserIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    department: user?.department || '',
    graduationYear: user?.graduationYear || '',
    bio: user?.bio || ''
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await updateProfile(formData);
    if (result.success) {
      setIsEditing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-secondary-900">Profile</h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn-outline"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Department
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            {user.role === 'alumni' && (
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Graduation Year
                </label>
                <input
                  type="number"
                  name="graduationYear"
                  value={formData.graduationYear}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="input-field"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div className="flex space-x-4">
              <button type="submit" className="btn-primary">
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-2xl">
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-secondary-900">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-secondary-600">{user.email}</p>
                <div className="flex items-center space-x-2 mt-2">
                  {getRoleIcon(user.role)}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Personal Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-secondary-600">Department</span>
                    <p className="text-secondary-900">{user.department}</p>
                  </div>
                  {user.graduationYear && (
                    <div>
                      <span className="text-sm font-medium text-secondary-600">Graduation Year</span>
                      <p className="text-secondary-900">{user.graduationYear}</p>
                    </div>
                  )}
                  {user.bio && (
                    <div>
                      <span className="text-sm font-medium text-secondary-600">Bio</span>
                      <p className="text-secondary-900">{user.bio}</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Account Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-secondary-600">Member Since</span>
                    <p className="text-secondary-900">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-secondary-600">Last Login</span>
                    <p className="text-secondary-900">
                      {new Date(user.lastLogin).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile; 