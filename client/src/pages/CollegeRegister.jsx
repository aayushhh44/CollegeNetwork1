import { useState } from 'react';
import axios from 'axios';

const CollegeRegister = () => {
  const [formData, setFormData] = useState({
    collegeName: '',
    collegeEmail: '',
    verificationDocs: '',
    termsAgreed: false
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post('/api/college/register', formData);
      setMessage(response.data.message);
      setFormData({
        collegeName: '',
        collegeEmail: '',
        verificationDocs: '',
        termsAgreed: false
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            College Registration
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Register your college to allow students to join the network
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {message && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                {message}
              </div>
            )}

            <div>
              <label htmlFor="collegeName" className="block text-sm font-medium text-gray-700 mb-2">
                College/University Name
              </label>
              <input
                id="collegeName"
                name="collegeName"
                type="text"
                required
                value={formData.collegeName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Example University"
              />
            </div>

            <div>
              <label htmlFor="collegeEmail" className="block text-sm font-medium text-gray-700 mb-2">
                Official Email Address
              </label>
              <input
                id="collegeEmail"
                name="collegeEmail"
                type="email"
                required
                value={formData.collegeEmail}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="admin@college.edu"
              />
              <p className="text-sm text-gray-500 mt-1">
                This email will be used for official communications
              </p>
            </div>

            <div>
              <label htmlFor="verificationDocs" className="block text-sm font-medium text-gray-700 mb-2">
                Verification Documents URL
              </label>
              <input
                id="verificationDocs"
                name="verificationDocs"
                type="url"
                required
                value={formData.verificationDocs}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/verification-docs.pdf"
              />
              <p className="text-sm text-gray-500 mt-1">
                Provide a link to official documents (PDF/image) that verify your institution
              </p>
            </div>

            <div className="flex items-center">
              <input
                id="termsAgreed"
                name="termsAgreed"
                type="checkbox"
                required
                checked={formData.termsAgreed}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="termsAgreed" className="ml-2 block text-sm text-gray-700">
                I agree to the{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700">
                  Terms and Conditions
                </a>
                {' '}and{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700">
                  Privacy Policy
                </a>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !formData.termsAgreed}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Registration'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeRegister; 