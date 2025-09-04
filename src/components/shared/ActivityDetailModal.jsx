import React from 'react';
import './Modal.css'; // Reusing the existing modal CSS

const ActivityDetailModal = ({ activity, onClose, isOpen }) => {
  if (!isOpen || !activity) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Activity Details</h2>
        <div className="detail-item">
          <strong>Thời gian:</strong> {activity['Thời gian'] && activity['Thời gian'].toDate ? activity['Thời gian'].toDate().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }) : activity['Thời gian']}
        </div>
        <div className="detail-item">
          <strong>Name:</strong> {activity.Name}
        </div>
        <div className="detail-item">
          <strong>Tên hoạt động:</strong> {activity['Tên hoạt động']}
        </div>
        <div className="detail-item">
          <strong>Điểm cộng:</strong> {activity['Điểm cộng']}
        </div>
        <div className="detail-item">
          <strong>File:</strong> <a href={activity['File upload']} target="_blank" rel="noopener noreferrer">View File</a>
        </div>
        <div className="detail-item">
          <strong>Status:</strong> {activity.Status}
        </div>
        {activity['Chi tiết'] && (
          <div className="detail-item">
            <strong>Chi tiết:</strong> {activity['Chi tiết']}
          </div>
        )}
        <button onClick={onClose} className="modal-close-btn">Close</button>
      </div>
    </div>
  );
};

export default ActivityDetailModal;
