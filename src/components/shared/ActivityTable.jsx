import React from 'react';

const ActivityTable = ({
  paginatedActivities,
  selectedActivities,
  handleSelect,
  handleSelectAll,
  handleFieldChange,
  handleStatusChangeWithValidation,
  handleUpdate,
  handleDelete,
  cellErrors,
  filteredActivities // Needed for handleSelectAll
}) => {
  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={handleSelectAll(filteredActivities)}
                checked={selectedActivities.length === filteredActivities.length && filteredActivities.length > 0}
              />
            </th>
            <th>User Email</th>
            <th>Activity Name</th>
            <th>Points</th>
            <th>File</th>
            <th>Status</th>
            <th>Chi tiết</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedActivities.map(activity => (
            <tr key={activity.firestoreDocId} className={selectedActivities.includes(activity.firestoreDocId) ? 'selected' : ''}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedActivities.includes(activity.firestoreDocId)}
                  onChange={() => handleSelect(activity.firestoreDocId)}
                />
              </td>
              <td>
                <input
                  type="email"
                  value={activity.Email || ''}
                  onChange={(e) => handleFieldChange(activity.firestoreDocId, 'Email', e.target.value)}
                  className="table-input"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={activity['Tên hoạt động'] || ''}
                  onChange={(e) => handleFieldChange(activity.firestoreDocId, 'Tên hoạt động', e.target.value)}
                  className="table-input"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={activity['Điểm cộng'] || 0}
                  onChange={(e) => handleFieldChange(activity.firestoreDocId, 'Điểm cộng', Number(e.target.value))}
                  className="table-input"
                />
              </td>
              <td>
                <a href={activity['File upload']} target="_blank" rel="noopener noreferrer" className="file-link">
                  View File
                </a>
              </td>
              <td>
                <select value={activity.Status || 'Đang chờ'} onChange={(e) => handleStatusChangeWithValidation(activity.firestoreDocId, e.target.value, activity)} className="status-select">
                  <option value="Đang chờ">Đang chờ</option>
                  <option value="Phê duyệt">Phê duyệt</option>
                  <option value="Không duyệt">Không duyệt</option>
                </select>
                {cellErrors[activity.firestoreDocId]?.Status && (
                  <div className="cell-error">{cellErrors[activity.firestoreDocId].Status}</div>
                )}
              </td>
              <td>
                <textarea
                  value={activity['Chi tiết'] || ''}
                  onChange={(e) => handleFieldChange(activity.firestoreDocId, 'Chi tiết', e.target.value)}
                  className="table-textarea"
                  rows="2"
                />
              </td>
              <td className="actions-cell">
                <button onClick={() => handleUpdate(activity.firestoreDocId)} className="btn btn-primary">Update</button>
                <button onClick={() => handleDelete(activity.firestoreDocId)} className="btn btn-danger">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ActivityTable;