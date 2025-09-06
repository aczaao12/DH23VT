import React from 'react';
import './Modal.css';

const Modal = ({ isOpen, title, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {title && <h2>{title}</h2>}
        {children}
      </div>
    </div>
  );
};

export default Modal;