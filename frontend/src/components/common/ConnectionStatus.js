import React, { useState, useEffect } from 'react';
import './ConnectionStatus.css';

const ConnectionStatus = ({ showDetails = false }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [serverStatus, setServerStatus] = useState('checking');
  const [lastChecked, setLastChecked] = useState(null);

  // Check network connectivity
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Check server connectivity
  const checkServerStatus = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/test', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setServerStatus('online');
      } else {
        setServerStatus('error');
      }
    } catch (error) {
      console.error('Server status check failed:', error);
      setServerStatus('offline');
    }

    setLastChecked(new Date());
  };

  useEffect(() => {
    checkServerStatus();
    // Check server status every 30 seconds
    const interval = setInterval(checkServerStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    if (!isOnline) return '#dc3545'; // red
    if (serverStatus === 'online') return '#28a745'; // green
    if (serverStatus === 'checking') return '#ffc107'; // yellow
    return '#dc3545'; // red
  };

  const getStatusText = () => {
    if (!isOnline) return 'Offline';
    if (serverStatus === 'online') return 'Connected';
    if (serverStatus === 'checking') return 'Checking...';
    return 'Server Offline';
  };

  if (!showDetails) {
    return (
      <div
        className="connection-status-indicator"
        style={{ backgroundColor: getStatusColor() }}
        title={`Network: ${isOnline ? 'Online' : 'Offline'} | Server: ${getStatusText()}`}
      />
    );
  }

  return (
    <div className="connection-status">
      <div className="status-header">
        <div
          className="status-indicator"
          style={{ backgroundColor: getStatusColor() }}
        />
        <span className="status-text">{getStatusText()}</span>
      </div>

      {showDetails && (
        <div className="status-details">
          <div className="status-item">
            <span>Network:</span>
            <span style={{ color: isOnline ? '#28a745' : '#dc3545' }}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
          <div className="status-item">
            <span>Server:</span>
            <span style={{ color: serverStatus === 'online' ? '#28a745' : '#dc3545' }}>
              {serverStatus === 'online' ? 'Online' : 'Offline'}
            </span>
          </div>
          {lastChecked && (
            <div className="status-item">
              <span>Last checked:</span>
              <span>{lastChecked.toLocaleTimeString()}</span>
            </div>
          )}
        </div>
      )}

      <button
        className="retry-button"
        onClick={checkServerStatus}
        disabled={serverStatus === 'checking'}
      >
        {serverStatus === 'checking' ? 'Checking...' : 'Check Now'}
      </button>
    </div>
  );
};

export default ConnectionStatus;