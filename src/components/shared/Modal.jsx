import React from 'react';
import './Modal.css';

const Modal = ({ message, onClose, type }) => {
  if (!message) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className={`modal-content ${type}`}>
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;