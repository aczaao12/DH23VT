import React from 'react';
import './UserActivitiesTable.css';
import { useResponsive } from '../../hooks/useResponsive'; // Import useResponsive

const UserActivitiesTable = ({ activities, onEdit }) => {
  const { isMobile } = useResponsive(); // Use the hook

  if (!activities || activities.length === 0) {
    return <p>No activities uploaded yet.</p>;
  }

  return (
    <div className="user-activities-table-container">
      <h2>Your Uploaded Activities</h2>

      {isMobile ? (
        // Card Layout for Mobile
        <div className="user-activities-cards">
          {activities.map((activity) => (
            <div key={activity.id} className="activity-card">
              <div className="card-field">
                <strong>Activity Name:</strong> {activity['Tên hoạt động']}
              </div>
              <div className="card-field">
                <strong>Points:</strong> {activity['Điểm cộng']}
              </div>
              <div className="card-field">
                <strong>Status:</strong> {activity.Status}
              </div>
              <div className="card-field">
                <strong>Uploaded On:</strong> {new Date(activity['Thời gian']?.toDate()).toLocaleString()}
              </div>
              <div className="card-field">
                <strong>File:</strong>{' '}
                <a href={activity['File upload']} target="_blank" rel="noopener noreferrer">
                  View File
                </a>
              </div>
              <div className="card-actions">
                <button onClick={() => onEdit(activity)}>Edit</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Table Layout for Desktop
        <table className="user-activities-table">
          <thead>
            <tr>
              <th>Activity Name</th>
              <th>Points</th>
              <th>Status</th>
              <th>Uploaded On</th>
              <th>File</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity.id}>
                <td>{activity['Tên hoạt động']}</td>
                <td>{activity['Điểm cộng']}</td>
                <td>{activity.Status}</td>
                <td>{new Date(activity['Thời gian']?.toDate()).toLocaleString()}</td>
                <td>
                  <a href={activity['File upload']} target="_blank" rel="noopener noreferrer">
                    View File
                  </a>
                </td>
                <td>
                  <button onClick={() => onEdit(activity)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserActivitiesTable;
