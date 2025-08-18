import React from 'react';
import './ErrorMessage.css';

const ErrorMessage = ({ 
  error, 
  onRetry, 
  title = 'Erro no Sistema', 
  type = 'error' 
}) => {
  if (!error) return null;

  const getIconForType = (type) => {
    switch (type) {
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '❌';
    }
  };

  return (
    <div className={`error-message ${type}`}>
      <div className="error-content">
        <div className="error-icon">
          {getIconForType(type)}
        </div>
        <div className="error-details">
          <h3 className="error-title">{title}</h3>
          <p className="error-text">
            {typeof error === 'string' ? error : error.message || 'Erro inesperado'}
          </p>
          {onRetry && (
            <button className="error-retry-btn" onClick={onRetry}>
              🔄 Tentar Novamente
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Toast notification version
export const ErrorToast = ({ error, onClose, autoClose = true, duration = 5000 }) => {
  React.useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose, duration]);

  if (!error) return null;

  return (
    <div className="error-toast">
      <div className="error-toast-content">
        <span className="error-toast-icon">❌</span>
        <span className="error-toast-message">
          {typeof error === 'string' ? error : error.message || 'Erro inesperado'}
        </span>
        {onClose && (
          <button className="error-toast-close" onClick={onClose}>
            ×
          </button>
        )}
      </div>
    </div>
  );
};

// Success toast
export const SuccessToast = ({ message, onClose, autoClose = true, duration = 3000 }) => {
  React.useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose, duration]);

  if (!message) return null;

  return (
    <div className="success-toast">
      <div className="success-toast-content">
        <span className="success-toast-icon">✅</span>
        <span className="success-toast-message">{message}</span>
        {onClose && (
          <button className="success-toast-close" onClick={onClose}>
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;