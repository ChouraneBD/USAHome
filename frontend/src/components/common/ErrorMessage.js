import React from 'react';
import './ErrorMessage.css';

const ErrorMessage = ({ 
  error, 
  title = 'Une erreur est survenue', 
  onRetry, 
  showRetry = true 
}) => {
  return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <h3 className="error-title">{title}</h3>
      <p className="error-message">
        {typeof error === 'string' ? error : error?.message || 'Erreur inconnue'}
      </p>
      {showRetry && onRetry && (
        <button className="retry-button" onClick={onRetry}>
          Réessayer
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
