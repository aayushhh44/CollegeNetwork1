import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [pendingColleges, setPendingColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPendingColleges();
  }, []);

  const fetchPendingColleges = async () => {
    try {
      const response = await axios.get('/api/college/pending');
      setPendingColleges(response.data.pendingColleges);
    } catch (error) {
      console.error('Error fetching pending colleges:', error);
      setMessage('Failed to load pending colleges');
    } finally {
      setLoading(false);
    }
  };

  const handleCollegeAction = async (collegeId, action, rejectionReason = '') => {
    try {
      const response = await axios.post('/api/college/verify', {
        collegeId,
        action,
        rejectionReason
      });

      setMessage(response.data.message);
      fetchPendingColleges(); // Refresh the list
    } catch (error) {
      console.error('Error processing college action:', error);
      setMessage(error.response?.data?.message || 'Failed to process action');
    }
  };

  if (user?.role !== 'teacher') {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Access Denied</h1>
        <p className="text-gray-600">You don't have permission to access this page.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
      
      {message && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg">
          {message}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Pending College Registrations</h2>
        </div>

        {pendingColleges.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No pending college registrations
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {pendingColleges.map((college) => (
              <div key={college._id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      {college.collegeName}
                    </h3>
                    <p className="text-gray-600">{college.collegeEmail}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Submitted: {new Date(college.createdAt).toLocaleDateString()}
                    </p>
                    {college.verificationDocs && (
                      <a 
                        href={college.verificationDocs} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        View Documents
                      </a>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleCollegeAction(college._id, 'approve')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        const reason = prompt('Enter rejection reason:');
                        if (reason !== null) {
                          handleCollegeAction(college._id, 'reject', reason);
                        }
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard; 