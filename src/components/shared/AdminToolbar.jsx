import React from 'react';

const AdminToolbar = ({
  selectedActivitiesCount,
  handleBulkUpdate,
  handleBulkDelete,
  activityNameFilter,
  setActivityNameFilter,
  selectedStatus, // For bulk update
  setSelectedStatus, // For bulk update
  filterStatus, // New prop for filtering
  setFilterStatus, // New prop for filtering
  setCurrentPage
}) => {
  return (
    <div className="admin-toolbar-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
      {/* Left side: Search and Filter */}
      <div className="search-filter-section" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        <div className="filter-item">
          <label htmlFor="activity-name-filter">Tìm kiếm: </label>
          <input
            type="text"
            id="activity-name-filter"
            value={activityNameFilter}
            onChange={(e) => { setActivityNameFilter(e.target.value); setCurrentPage(1); }}
            placeholder="Nhập tên hoạt động"
            className="activity-name-filter-input"
            style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>
        <div className="filter-item">
          <label htmlFor="status-filter">Lọc theo trạng thái: </label>
          <select
            id="status-filter"
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
            className="status-filter-select"
            style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          >
            <option value="">Tất cả</option>
            <option value="Phê duyệt">Phê duyệt</option>
            <option value="Không duyệt">Không duyệt</option>
            <option value="Đang chờ">Đang chờ</option>
          </select>
        </div>
      </div>

      {/* Right side: Bulk Actions */}
      <div className="bulk-actions-section" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="status-select" style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}>
          <option value="Phê duyệt">Phê duyệt</option>
          <option value="Không duyệt">Không duyệt</option>
          <option value="Đang chờ">Đang chờ</option>
        </select>
        <button onClick={() => handleBulkUpdate(selectedStatus)} className="btn btn-primary" style={{ padding: '8px 12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Update Selected</button>
        <button onClick={handleBulkDelete} className="btn btn-danger" style={{ padding: '8px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete Selected</button>
        <span className="selected-count" style={{ marginLeft: '10px', fontWeight: 'bold' }}>{selectedActivitiesCount} selected</span>
      </div>
    </div>
  );
};

export default AdminToolbar;