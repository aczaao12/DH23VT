import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import SearchableSelect from './SearchableSelect';
import './Modal.css'; // Assuming Modal CSS exists

const EditActivityModal = ({ isOpen, onClose, activity, onUpdate, activitiesList }) => {
  const [editedActivity, setEditedActivity] = useState({});
  const [newFile, setNewFile] = useState(null);

  useEffect(() => {
    if (activity && activitiesList && Object.keys(activitiesList).length > 0) {
      const initialKey = Object.keys(activitiesList).find(key => activitiesList[key] && activitiesList[key].name === activity['Tên hoạt động']);
      setEditedActivity({
        ...activity,
        selectedActivityKey: initialKey || '',
        // Convert Firebase Timestamp to local datetime string for display
        'Thời gian': activity['Thời gian']?.toDate ? new Date(activity['Thời gian'].toDate()).toLocaleString() : ''
      });
    }
  }, [activity, activitiesList]);

  const handleFileChange = (e) => {
    setNewFile(e.target.files[0]);
  };

  // Removed handleChange and handleDateTimeChange as fields are now read-only

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (onUpdate) {
      // No need to convert 'Thời gian' back to Firebase Timestamp as it's read-only
      await onUpdate(editedActivity.id, editedActivity, newFile);
      onClose();
    }
  };

  if (!activity) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Activity">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tên hoạt động:</label>
          <SearchableSelect
            options={activitiesList}
            value={
              editedActivity.selectedActivityKey && activitiesList[editedActivity.selectedActivityKey]
                ? editedActivity.selectedActivityKey
                : ''
            }
            onChange={(selectedKey) => {
              const selectedActivityData = activitiesList[selectedKey];
              setEditedActivity((prev) => {
                if (selectedActivityData) {
                  return {
                    ...prev,
                    'Tên hoạt động': selectedActivityData.name,
                    'Điểm cộng': selectedActivityData.points,
                    selectedActivityKey: selectedKey
                  };
                } else {
                  return {
                    ...prev,
                    'Tên hoạt động': '',
                    'Điểm cộng': 0,
                    selectedActivityKey: ''
                  };
                }
              });
            }}
            placeholder="Search for activity..."
          />
        </div>

        <div className="form-row"> {/* New container for side-by-side fields */}
          <div className="form-group third-width"> {/* Changed from half-width to third-width */}
            <label>Điểm cộng:</label>
            <p className="read-only-field">{editedActivity['Điểm cộng'] || 0}</p> {/* Read-only */}
          </div>
          <div className="form-group third-width"> {/* Changed from half-width to third-width */}
            <label>Status:</label>
            <p className="read-only-field">{editedActivity.Status || ''}</p> {/* Read-only */}
          </div>
          <div className="form-group third-width"> {/* New field for Thời gian */}
            <label>Thời gian:</label>
            <p className="read-only-field">{editedActivity['Thời gian'] || ''}</p> {/* Read-only */}
          </div>
        </div>

        <div className="form-group">
          <label>Chi tiết:</label>
          <p className="read-only-field">{editedActivity['Chi tiết'] || ''}</p> {/* Read-only */}
        </div>

        <div className="form-group file-upload-section">
          {editedActivity['File upload'] && (
            <a href={editedActivity['File upload']} target="_blank" rel="noopener noreferrer">
              View Current File
            </a>
          )}
          <input type="file" onChange={handleFileChange} />
        </div>
        <div className="modal-actions">
          <button type="submit" className="submit-btn">Update</button>
          <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </Modal>
  );
};

export default EditActivityModal;