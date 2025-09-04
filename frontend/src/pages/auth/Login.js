import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import ConnectionStatus from '../../components/common/ConnectionStatus';
import NetworkDiagnostics from '../../components/common/NetworkDiagnostics';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  const { login } = useAuth();
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

    const attemptLogin = async () => {
      try {
        const response = await login(formData);
        if (response.success) {
          navigate('/admin/dashboard');
        }
      } catch (err) {
        console.error('Login error:', err);

        // Handle specific error types
        if (err.message.includes('401')) {
          setError('Invalid email or password. Please check your credentials.');
        } else if (err.message.includes('422')) {
          setError('Please check your input data and try again.');
        } else if (err.message.includes('NetworkError') || err.message.includes('Failed to fetch')) {
          if (retryCount < maxRetries) {
            retryCount++;
            setError(`Connection failed. Retrying... (${retryCount}/${maxRetries})`);
            setTimeout(() => attemptLogin(), 2000 * retryCount); // Exponential backoff
            return;
          } else {
            setError('Unable to connect to the server. Please check your internet connection and ensure the server is running.');
          }
        } else if (err.message.includes('500')) {
          setError('Server error occurred. Please try again later.');
        } else if (err.message.includes('403') || err.message.includes('CORS')) {
          setError('Access denied. Please contact support if this persists.');
        } else {
          setError(err.message || 'Login failed. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    await attemptLogin();
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Login</h1>
          <p>Welcome back! Please sign in to your account.</p>
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
            />
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register">Sign up</Link></p>
        </div>
      </div>

      {showDiagnostics && (
        <NetworkDiagnostics onClose={() => setShowDiagnostics(false)} />
      )}
    </div>
  );
};

export default Login;