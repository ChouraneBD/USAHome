import React, { useState, useEffect } from 'react';
import './NetworkDiagnostics.css';

const NetworkDiagnostics = ({ onClose }) => {
  const [diagnostics, setDiagnostics] = useState({
    networkStatus: 'checking',
    serverReachable: 'checking',
    corsEnabled: 'checking',
    apiEndpoints: 'checking',
    authToken: 'checking'
  });

  const [results, setResults] = useState({});
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    // Small delay to show loading state
    const timer = setTimeout(() => {
      runDiagnostics();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const runDiagnostics = async () => {
    if (isRunning) return; // Prevent multiple simultaneous runs

    try {
      setIsRunning(true);
      const newResults = {};

      // Reset all diagnostics to checking state
      setDiagnostics({
        networkStatus: 'checking',
        serverReachable: 'checking',
        corsEnabled: 'checking',
        apiEndpoints: 'checking',
        authToken: 'checking'
      });

      // 1. Check network connectivity
      newResults.networkStatus = navigator.onLine ? 'Online' : 'Offline';
      setDiagnostics(prev => ({ ...prev, networkStatus: navigator.onLine ? 'success' : 'error' }));

      if (!navigator.onLine) {
        setResults(newResults);
        setIsRunning(false);
        return;
      }

      // 2. Check if server is reachable
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const serverResponse = await fetch('http://127.0.0.1:8000/api/test', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (serverResponse.ok) {
          newResults.serverReachable = 'Reachable';
          setDiagnostics(prev => ({ ...prev, serverReachable: 'success' }));
        } else {
          newResults.serverReachable = `HTTP ${serverResponse.status}`;
          setDiagnostics(prev => ({ ...prev, serverReachable: 'error' }));
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          newResults.serverReachable = 'Timeout (5s)';
        } else {
          newResults.serverReachable = 'Not reachable';
        }
        setDiagnostics(prev => ({ ...prev, serverReachable: 'error' }));
      }

      // 3. Check CORS
      try {
        const corsController = new AbortController();
        const corsTimeoutId = setTimeout(() => corsController.abort(), 3000);

        const corsResponse = await fetch('http://127.0.0.1:8000/api/test', {
          method: 'OPTIONS',
          headers: {
            'Content-Type': 'application/json',
            'Origin': window.location.origin
          },
          signal: corsController.signal
        });

        clearTimeout(corsTimeoutId);

        // Check for CORS headers
        const corsHeaders = corsResponse.headers.get('access-control-allow-origin');
        const allowMethods = corsResponse.headers.get('access-control-allow-methods');

        if (corsResponse.ok && (corsHeaders || corsResponse.type === 'cors')) {
          newResults.corsEnabled = 'Enabled';
          setDiagnostics(prev => ({ ...prev, corsEnabled: 'success' }));
        } else if (corsResponse.status === 0) {
          // CORS preflight might be blocked
          newResults.corsEnabled = 'Blocked';
          setDiagnostics(prev => ({ ...prev, corsEnabled: 'error' }));
        } else {
          newResults.corsEnabled = 'Not configured';
          setDiagnostics(prev => ({ ...prev, corsEnabled: 'error' }));
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          newResults.corsEnabled = 'Timeout';
        } else {
          newResults.corsEnabled = 'Error checking';
        }
        setDiagnostics(prev => ({ ...prev, corsEnabled: 'error' }));
      }

      // 4. Check API endpoints
      const endpoints = ['/register', '/login'];
      const endpointResults = [];

      for (const endpoint of endpoints) {
        try {
          const endpointController = new AbortController();
          const endpointTimeoutId = setTimeout(() => endpointController.abort(), 3000);

          const response = await fetch(`http://127.0.0.1:8000/api${endpoint}`, {
            method: 'OPTIONS',
            headers: {
              'Content-Type': 'application/json',
              'Origin': window.location.origin
            },
            signal: endpointController.signal
          });

          clearTimeout(endpointTimeoutId);

          if (response.ok) {
            endpointResults.push(`${endpoint}: OK`);
          } else if (response.status === 405) {
            // Method not allowed is actually OK for OPTIONS check
            endpointResults.push(`${endpoint}: OK`);
          } else {
            endpointResults.push(`${endpoint}: HTTP ${response.status}`);
          }
        } catch (error) {
          if (error.name === 'AbortError') {
            endpointResults.push(`${endpoint}: Timeout`);
          } else {
            endpointResults.push(`${endpoint}: Error`);
          }
        }
      }

      newResults.apiEndpoints = endpointResults.join(', ');
      setDiagnostics(prev => ({
        ...prev,
        apiEndpoints: endpointResults.some(r => r.includes('OK')) ? 'success' : 'error'
      }));

      // 5. Check auth token
      const token = localStorage.getItem('auth_token');
      if (token) {
        newResults.authToken = `Present (${token.substring(0, 20)}...)`;
        setDiagnostics(prev => ({ ...prev, authToken: 'success' }));
      } else {
        newResults.authToken = 'Not found';
        setDiagnostics(prev => ({ ...prev, authToken: 'warning' }));
      }

      setResults(newResults);
    } catch (error) {
      console.error('Diagnostics error:', error);
      setDiagnostics(prev => ({
        ...prev,
        networkStatus: 'error',
        serverReachable: 'error',
        corsEnabled: 'error',
        apiEndpoints: 'error',
        authToken: 'error'
      }));
      setResults({
        networkStatus: 'Error running diagnostics',
        serverReachable: 'Error running diagnostics',
        corsEnabled: 'Error running diagnostics',
        apiEndpoints: 'Error running diagnostics',
        authToken: 'Error running diagnostics'
      });
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      default: return '⏳';
    }
  };

  const getRecommendations = () => {
    const recommendations = [];

    if (diagnostics.networkStatus === 'error') {
      recommendations.push('Check your internet connection');
    }

    if (diagnostics.serverReachable === 'error') {
      recommendations.push('Start the Laravel backend server: php artisan serve');
    }

    if (diagnostics.corsEnabled === 'error') {
      recommendations.push('Configure CORS in Laravel config/cors.php');
    }

    if (diagnostics.apiEndpoints === 'error') {
      recommendations.push('Check API routes in routes/api.php');
    }

    if (recommendations.length === 0) {
      recommendations.push('All systems appear to be working correctly');
    }

    return recommendations;
  };

  return (
    <div className="network-diagnostics-overlay">
      <div className="network-diagnostics-modal">
        <div className="diagnostics-header">
          <h2>Network Diagnostics</h2>
          <button onClick={onClose} className="close-button">×</button>
        </div>

        <div className="diagnostics-content">
          <div className="diagnostics-section">
            <h3>Connection Status</h3>
            <div className="diagnostic-item">
              <span>Network Status:</span>
              <span>{getStatusIcon(diagnostics.networkStatus)} {results.networkStatus}</span>
            </div>
            <div className="diagnostic-item">
              <span>Server Reachable:</span>
              <span>{getStatusIcon(diagnostics.serverReachable)} {results.serverReachable}</span>
            </div>
            <div className="diagnostic-item">
              <span>CORS Enabled:</span>
              <span>{getStatusIcon(diagnostics.corsEnabled)} {results.corsEnabled}</span>
            </div>
            <div className="diagnostic-item">
              <span>API Endpoints:</span>
              <span>{getStatusIcon(diagnostics.apiEndpoints)} {results.apiEndpoints}</span>
            </div>
            <div className="diagnostic-item">
              <span>Auth Token:</span>
              <span>{getStatusIcon(diagnostics.authToken)} {results.authToken}</span>
            </div>
          </div>

          <div className="diagnostics-section">
            <h3>Recommendations</h3>
            <ul className="recommendations-list">
              {getRecommendations().map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="diagnostics-actions">
          <button
            onClick={runDiagnostics}
            className="retry-button"
            disabled={isRunning}
          >
            {isRunning ? 'Running Diagnostics...' : 'Run Diagnostics Again'}
          </button>
          <button
            onClick={onClose}
            className="close-button-secondary"
            disabled={isRunning}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NetworkDiagnostics;