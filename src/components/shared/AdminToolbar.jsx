import React from 'react';

const AdminToolbar = ({
  selectedActivitiesCount,
  handleBulkUpdate,
  handleBulkDelete,
  activityNameFilter,
  setActivityNameFilter, // Changed from onFilterChange to match state setter
  selectedStatus,
  setSelectedStatus, // Changed from onStatusChange to match state setter
  setCurrentPage // To reset page on filter change
}) => {
  return (
    <>
      <div className="filter-section">
        <label htmlFor="activity-name-filter">Filter by Activity Name: </label>
        <input
          type="text"
          id="activity-name-filter"
          value={activityNameFilter}
          onChange={(e) => { setActivityNameFilter(e.target.value); setCurrentPage(1); }}
          placeholder="Enter activity name"
          className="activity-name-filter-input"
        />
      </div>
      <div className="bulk-actions">
        <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="status-select">
          <option value="Phê duyệt">Phê duyệt</option>
          <option value="Không duyệt">Không duyệt</option>
          <option value="Đang chờ">Đang chờ</option>
        </select>
        <button onClick={() => handleBulkUpdate(selectedStatus)} className="btn btn-primary">Update Selected</button>
        <button onClick={handleBulkDelete} className="btn btn-danger">Delete Selected</button>
        <span className="selected-count">{selectedActivitiesCount} selected</span>
      </div>
    </>
  );
};

export default AdminToolbar;