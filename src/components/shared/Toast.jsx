import React, { useEffect } from 'react';
import './Toast.css';

const Toast = ({ message, onClose, type }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Auto-close after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) {
    return null;
  }

  return (
    <div className={`toast toast-${type}`}>
      <p>{message}</p>
      <button onClick={onClose}>&times;</button>
      <div className="toast-timer"></div>
    </div>
  );
};

export default Toast;