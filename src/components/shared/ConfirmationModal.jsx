import React, { useState } from 'react';
import './ConfirmationModal.css';

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  activityName,
  semester,
}) => {
  const [confirmationText, setConfirmationText] = useState('');

  if (!isOpen) {
    return null;
  }

  const isConfirmationTextCorrect = confirmationText === semester;

  const handleConfirm = () => {
    if (isConfirmationTextCorrect) {
      onConfirm();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Cảnh báo</h2>
        <p>
          Bạn có chắc chắn gửi hoạt động: <strong>{activityName}</strong> vào{' '}
          <strong>{semester}</strong>.
        </p>
        <p>Vui lòng nhập <strong>{semester}</strong> để xác nhận.</p>
        <input
          type="text"
          value={confirmationText}
          onChange={(e) => setConfirmationText(e.target.value)}
          placeholder={`Nhập ${semester} để xác nhận`}
          className="confirmation-input"
        />
        <div className="modal-actions">
          <button onClick={onClose} className="cancel-btn">
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            className="confirm-btn"
            disabled={!isConfirmationTextCorrect}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
