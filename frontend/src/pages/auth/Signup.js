import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import ConnectionStatus from '../../components/common/ConnectionStatus';
import NetworkDiagnostics from '../../components/common/NetworkDiagnostics';
import './Auth.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Check network connectivity first
    if (!navigator.onLine) {
      setError('No internet connection. Please check your network and try again.');
      setLoading(false);
      return;
    }

    let retryCount = 0;
    const maxRetries = 3;

    const attemptRegistration = async () => {
      try {
        const response = await register(formData);
        if (response.success) {
          navigate('/admin/dashboard');
        }
      } catch (err) {
        console.error('Registration error:', err);

        // Handle specific error types
        if (err.message.includes('422')) {
          setError('Please check your input data and try again.');
        } else if (err.message.includes('409') || err.message.includes('email')) {
          setError('An account with this email already exists.');
        } else if (err.message.includes('NetworkError') || err.message.includes('Failed to fetch')) {
          if (retryCount < maxRetries) {
            retryCount++;
            setError(`Connection failed. Retrying... (${retryCount}/${maxRetries})`);
            setTimeout(() => attemptRegistration(), 2000 * retryCount); // Exponential backoff
            return;
          } else {
            setError('Unable to connect to the server. Please check your internet connection and ensure the server is running.');
          }
        } else if (err.message.includes('500')) {
          setError('Server error occurred. Please try again later.');
        } else if (err.message.includes('403') || err.message.includes('CORS')) {
          setError('Access denied. Please contact support if this persists.');
        } else {
          setError(err.message || 'Registration failed. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    await attemptRegistration();
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Sign Up</h1>
          <p>Create your account to access the admin dashboard.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="connection-info">
            <ConnectionStatus showDetails={true} />
            <button
              type="button"
              onClick={() => setShowDiagnostics(true)}
              className="diagnostics-button"
            >
              🔧 Run Network Diagnostics
            </button>
          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              minLength="8"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password_confirmation">Confirm Password</label>
            <input
              type="password"
              id="password_confirmation"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
              minLength="8"
            />
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
      </div>

      {showDiagnostics && (
        <NetworkDiagnostics onClose={() => setShowDiagnostics(false)} />
      )}
    </div>
  );
};

export default Signup;